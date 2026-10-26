import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "AegisOps AI — Autonomous DevSecOps & Security Assessment Dashboard",
  description:
    "Hệ thống AI Agent tự hành đánh giá an ninh mạng và tư vấn DevSecOps theo kiến trúc Microservices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        {/* Anti-Hydration Mismatch Script: Khử triệt để các thuộc tính tiêm bởi extension trình duyệt (Bitdefender, Urban VPN, Grammarly, etc.) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function stripExtAttrs(el) {
                  if (!el || !el.attributes) return;
                  for (var i = el.attributes.length - 1; i >= 0; i--) {
                    var name = el.attributes[i].name;
                    if (
                      name === 'bis_skin_checked' ||
                      name === 'bis_register' ||
                      name.indexOf('__processed_') === 0 ||
                      name.indexOf('data-gr-') === 0 ||
                      name.indexOf('cz-') === 0
                    ) {
                      el.removeAttribute(name);
                    }
                  }
                }

                // Chạy MutationObserver chặn mọi hành vi chèn thuộc tính lạ vào DOM trước khi React Hydrate
                var observer = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.type === 'attributes') {
                      stripExtAttrs(m.target);
                    } else if (m.type === 'childList') {
                      for (var j = 0; j < m.addedNodes.length; j++) {
                        var node = m.addedNodes[j];
                        if (node.nodeType === 1) {
                          stripExtAttrs(node);
                          var children = node.getElementsByTagName('*');
                          for (var k = 0; k < children.length; k++) {
                            stripExtAttrs(children[k]);
                          }
                        }
                      }
                    }
                  }
                });

                if (document.documentElement) {
                  stripExtAttrs(document.documentElement);
                  observer.observe(document.documentElement, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased selection:bg-crimson selection:text-white"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
