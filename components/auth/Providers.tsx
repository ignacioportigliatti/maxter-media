"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = (props: ProvidersProps) => {
  return (
    <SessionProvider>
      <Provider store={store}>
       {props.children}
      </Provider>
    </SessionProvider>
  );
};
