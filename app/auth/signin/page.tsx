'use client'

import { signIn } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FormEventHandler, useState } from "react";

interface LoginPageProps {}

const LoginPage = (props: LoginPageProps) => {

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleLogin:FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        email: userInfo.email,
        password: userInfo.password,
        callbackUrl: "http://localhost:3000/admin",
        redirect: true,
      });
      console.log(result);

    } catch (error) {
      console.error(error, 'Error al iniciar sesion');
    }
    
  }
  
  return (
    <div className="bg-orange-500 w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

          <Image
             width={256}
             height={51}
            className="mb-4"
            src="/sidebar/maxter-logo.png"
            alt="logo"
          />

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Iniciar Sesion
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tu email
                </label>
                <input
                onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="email@empresa.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Recordar mis datos
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full button"
              >
                Iniciar Sesion
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
