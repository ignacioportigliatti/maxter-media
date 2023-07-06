"use client";

import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "../layout/Sidebar";

type LoginProps = {
  children: React.ReactNode;
};

export const Login = (props: LoginProps) => {
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (!session) {
      signIn();
    }
  }, []);

  const renderChildren = () => {
    if (sessionStatus === "loading") {
      return <div>Cargando...</div>;
    } else if (sessionStatus === "authenticated") {
      return (
        <div className="flex">
          <ToastContainer />
          <div className="hidden lg:flex">
            <Sidebar />
          </div>
          <div className="lg:h-full flex mx-auto w-full">{props.children}</div>
        </div>
      );
    } else {
      return <div>Not authenticated</div>;
    }
  };

  return <div>{renderChildren()}</div>;
};
