"use client";

import { Steps } from "@/components/home/Steps";
import { useSelector } from "react-redux";
import { Group } from "@prisma/client";

export default function ClientHome() {


  const group: Group = useSelector((state: any) => state.group);

  return (
    <div className="flex flex-col justify-start items-center mx-auto p-7">
      <div className="text-center">
        <h4 className="-mb-[5px]">PROMO 2023</h4>
        <h1>Tu Viaje de Egresados</h1>
        <p>Grupoputo{group.name}</p>
        <p>Grupoputo{group.videoIds}</p>
        <h2>Bienvenido/a al portal de recuerdos de tu viaje de egresados</h2>
        <p className="mt-2">
          Aquí podras ver y descargar las fotos y/o videos de tu viaje.
        </p>
      </div>
      <Steps />
    </div>
  );
}
