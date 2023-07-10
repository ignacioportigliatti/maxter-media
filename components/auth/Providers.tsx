"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = (props: ProvidersProps) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">{props.children}</ThemeProvider>
    </SessionProvider>
  );
};
