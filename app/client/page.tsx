"use client";

import { Steps } from "@/components/home/Steps";
import VideosCarousel from "@/components/home/VideosCarousel";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function ClientHome() {

  const selectedGroup: Group = useSelector((state: any) => state.group);

  return (

      <div className="flex flex-col justify-center items-center mx-auto my-auto h-full p-7">
        <div className="text-center">
          <h4 className="-mb-[5px]">{`PROMO 2023 - ${selectedGroup.school}`}</h4>
          <h1>Mi Viaje de Egresados</h1>
          <h2>Bienvenido/a al portal de recuerdos de tu viaje de egresados</h2>
          <p className="mt-4">
            Aquí podras ver y descargar las fotos y/o videos de tu viaje.
          </p>
        </div>
        <Steps />
       
      </div>

  );
}
