"use client";

import { Steps } from "@/components/home/Steps";
import { formattedDate } from "@/utils/formattedDate";
import { Codes, Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function ClientHome() {

  const selectedGroup: Group = useSelector((state: any) => state.group);
  const code: Codes = useSelector((state: any) => state.code);

  return (

      <div className="flex flex-col text-center justify-center w-full items-center mx-auto my-auto h-full p-7">
        <div className="text-center max-w-xl">
          <h1>Bienvenido/a</h1>
          <p>{`Tu codigo es ${code.code}, expira el ${formattedDate(code.expires)}.`}</p>
          <p>{`Acceso permitido: ${code.type === 'full' ? "Fotos y Videos" : code.type === 'photo' ? "Fotos" : "Videos"}`}</p>
          <p className="font-bold">{selectedGroup.name} - {selectedGroup.agencyName}</p>
        </div>
        <Steps />
        <div>
          <h6 className="pt-10">Recordá descargar el material antes del <span className="font-bold">{formattedDate(code.expires)}</span></h6>
          <h2 className="pt-2 md:hidden inline-block text-red-600 text-sm">{`IMPORTANTE: Recordá que la visualización de videos puede gastar los datos de tu móvil. Te recomendamos usar Wi-Fi o mirarlos desde tu PC.`}</h2>
        </div>
      </div>

  );
}
