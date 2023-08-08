"use client";

import { Provider } from "react-redux";
import "./globals.css";
import { Providers } from "@/components/auth/Providers";
import store from "@/redux/store";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Provider store={store}>
          <Providers>{children}</Providers>
        </Provider>
      </body>
    </html>
  );
}
