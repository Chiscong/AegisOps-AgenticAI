import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisOps AI — Autonomous DevSecOps & Security Assessment Dashboard",
  description: "Hệ thống AI Agent tự hành đánh giá an ninh mạng và tư vấn DevSecOps theo kiến trúc Microservices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body
        className="antialiased selection:bg-crimson selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
