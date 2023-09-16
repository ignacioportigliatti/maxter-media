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
import axios from "axios";

export const UserLogin = () => {
  const [codeInput, setCodeInput] = React.useState("");
  
  const router = useRouter();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeInput(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get the value of the input field
    const formElement = e.currentTarget as HTMLFormElement;
    const codeInput =
      formElement.querySelector<HTMLInputElement>("#name")?.value;
    console.log("codeinput", codeInput);
    if (!codeInput) {
      console.log("Code input is empty");
      return;
    }

    try {
      // Make a POST request to the verifyCode API endpoint
      const response = await axios.post("/api/codes/verify", {
        code: codeInput,
      }).then((res) => res.data);
      if (response.success) {
        router.push(`/client?code=${response.code.code}`);
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      // Handle errors, such as network issues or server errors
    }
  };

  return (
    <div className="w-full max-h-screen flex justify-center items-center overflow-hidden">
      <a href="/admin">
        <button className="button !border-white !text-white opacity-0 hover:opacity-100 !transition !duration-500 absolute top-4 right-4 z-20">
          Administradores
        </button>
      </a>
      <video
        src="/user-login/bg-video.mp4/"
        autoPlay
        loop
        muted
        className="scale-150 absolute z-[1] w-full max-h-[100vhj] object-cover "
      />
      <div className="z-10 bg-red-600/95 h-full w-screen absolute"></div>
      <div className="z-20 animate-in fade-in-0 transition-all duration-1000 delay-1000">
        <Card className="w-[450px] h-[450px] flex flex-col items-center justify-center shadow-2xl bg-medium-gray/90">
          <CardHeader className="flex flex-col justify-center items-center">
            <Image
              src="/sidebar/maxter-logo-dark.png"
              width={256}
              height={51}
              alt="logo"
              className="mb-5"
            />
            <CardTitle className="text-center text-white text-3xl">
              Mi Viaje de Egresados
            </CardTitle>
            <CardDescription className="text-center text-white px-12">
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
                    className="bg-white text-center text-2xl text-black py-6"
                    onChange={handleOnChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-center">
              <Button
                disabled={!codeInput}
                type="submit"
                className="border border-white text-white"
                variant={"ghost"}
              >
                Ver mi Material
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
