"use client";

import { Steps } from "@/components/home/Steps";
import { useSelector } from "react-redux";
import { Agency, Group } from "@prisma/client";

export default function ClientHome() {
  const group: Group = useSelector((state: any) => state.group);
  const agency: Agency = useSelector((state: any) => state.agency);

  return (
    <div className="w-full">
      <div style={{background: agency.primaryColor as string}} className=" flex flex-row items-center justify-between themeTransition py-[20px] px-6 text-black dark:text-white drop-shadow-sm">
        <div>
          <h2 className="font-light">{`Inicio`}</h2>
        </div>
        {group && (
          <div className="flex flex-col justify-end items-end">
            <h4>{`Escuela ${group.school} `}</h4>
            <h5 className="text-xs">{`${group.name} - ${group.agencyName}`}</h5>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-start items-center mx-auto p-7">
        <div className="text-center">
          <h4 className="-mb-[5px]">PROMO 2023</h4>
          <h1>Tu Viaje de Egresados</h1>
          <h2>Bienvenido/a al portal de recuerdos de tu viaje de egresados</h2>
          <p className="mt-2">
            Aquí podras ver y descargar las fotos y/o videos de tu viaje.
          </p>
        </div>
        <Steps />
      </div>
    </div>
  );
}
