"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const UserLogin = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/client/");
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <a href="/admin">
        <button className="button !border-white !text-white opacity-0 hover:opacity-100 !transition !duration-500 absolute top-4 right-4 z-20">
          Administradores
        </button>
      </a>
      <video
        src="http://localhost:3000/user-login/bg-video.mp4"
        autoPlay
        loop
        muted
        className="absolute z-[1] w-full max-h-screen object-cover "
      />
      <div className="z-10 bg-orange-500/95 h-full w-screen absolute"></div>
      <div className="z-20 animate-in fade-in-0 transition-all duration-1000 delay-1000">
        <Card className="w-[450px] h-[450px] flex flex-col items-center justify-center shadow-2xl bg-gray-200 dark:bg-medium-gray/90">
          <CardHeader className="flex flex-col justify-center items-center">
            <Image
              src="/sidebar/maxter-logo-dark.png"
              width={256}
              height={51}
              alt="logo"
              className="mb-5"
            />
            <CardTitle className="text-center dark:text-white text-medium-gray text-3xl">
              Mi Viaje de Egresados
            </CardTitle>
            <CardDescription className="text-center dark:text-white text-medium-gray px-12">
              Buscá el codigo en tu tarjeta digital e ingresalo aquí o escanea
              el codigo QR de la misma.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="w-full px-14">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="name"
                    placeholder="Ingresa tu codigo"
                    className="dark:bg-white text-center text-2xl text-black py-6"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-center">
              <Link href="/client/">
                <Button
                  type="submit"
                  className="border border-white dark:text-white text-medium-gray"
                  variant={"ghost"}
                >
                  Ver mi Material
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
