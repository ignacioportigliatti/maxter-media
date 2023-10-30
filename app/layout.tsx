

import { Provider } from "react-redux";
import "./globals.css";
import { Providers } from "@/components/auth/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
