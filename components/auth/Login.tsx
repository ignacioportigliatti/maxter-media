"use client";

import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "../admin/Sidebar";
import { Providers } from "./Providers";

type LoginProps = {
  children: React.ReactNode;
};

export const Login = (props: LoginProps) => {
  const { data: session, status: sessionStatus } = useSession();
  console.log(JSON.stringify(session));


  const renderChildren = () => {
  if (session !== null && session !== undefined) {
      return (

        <div>
          
        </div>

      );
    } else if (session === null || session === undefined) {
      return <div>
        <p>Not Authenticated</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>;
    }
  };

  return <div>{renderChildren()}</div>;
};
