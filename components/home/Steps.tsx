'use client'

import { Step } from "@/components/ui";
import { Agency } from "@prisma/client";
import { AiOutlineCloudDownload, AiOutlinePlayCircle, AiOutlineSearch } from "react-icons/ai"
import { useSelector } from "react-redux";


export const Steps = () => {
  
  return (
    <div className="flex flex-row flex-wrap">
      <Step
        title="Buscá"
        description="El material que adquiriste con tu código de compra, podes encontrarlos en el menú de la izquierda."
        stepNumber={1}
        icon={<AiOutlineSearch className="w-8 h-8" />}
      />
      <Step
        title="Mirá"
        description="Las fotos y/o videos de tu viaje. Elegí la excursión que quieras ver y disfrutá de todos esos hermosos recuerdos."
        stepNumber={2}
        icon={<AiOutlinePlayCircle className="w-8 h-8" />}
      />
      <Step
        title="Descargá"
        description="Si querés descargar el material que adquiriste, podes hacerlo desde los botones de descarga."
        stepNumber={3}
        icon={<AiOutlineCloudDownload className="w-8 h-8" />}
      />
    </div>
  );
};
