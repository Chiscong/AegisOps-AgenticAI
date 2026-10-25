import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = request.nextUrl.origin;

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`);
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  try {
    if (clientId && clientSecret) {
      // 1. Đổi Authorization Code lấy Google Access Token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokens = await tokenResponse.json();

      if (tokens.access_token) {
        // 2. Lấy thông tin tài khoản người dùng từ Google
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const googleUser = await userRes.json();

        // 3. Đặt cookie session và chuyển hướng về Dashboard
        const response = NextResponse.redirect(`${baseUrl}/`);
        response.cookies.set("aegisops_session", JSON.stringify({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          provider: "google",
        }), {
          path: "/",
          httpOnly: false,
          maxAge: 60 * 60 * 24 * 7, // 7 ngày
        });
        return response;
      }
    }

    // Chuyển hướng an toàn về Dashboard
    return NextResponse.redirect(`${baseUrl}/`);
  } catch (err) {
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
  }
}
