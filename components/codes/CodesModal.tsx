"use client";

import { Group } from "@prisma/client";
import { TfiClose } from "react-icons/tfi";
import GeneratedCodes from "./GeneratedCodes";
import CodesGenerator from "./CodesGenerator";

type CodesModalProps = {
  selectedGroup: Group;
  handleToggleModal: () => void;
};

const CodesModal = (props: CodesModalProps) => {
  const { selectedGroup, handleToggleModal } = props;
  return (
    <div className="absolute top-0 left-0 bg-black/80 w-full h-full p-64">
          <div className="py-2 bg-orange-500 w-full text-center relative">
            <h2 className="text-white">{`Gestion de codigos - ${selectedGroup?.name} - ${selectedGroup?.agencyName}`}</h2>
            <button
              onClick={handleToggleModal}
              className="absolute top-3 right-4"
            >
              <TfiClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex w-full h-full bg-white dark:bg-medium-gray flex-col">
            <div className="flex flex-row items-start justify-center px-6 h-full w-full">
              {/* Left Side */}
              <div className="w-3/5 p-6 flex flex-col justify-start gap-4 items-start">
               <GeneratedCodes selectedGroup={selectedGroup as Group} />
              </div>
              {/* Center */}
              <div className="w-1/5 p-6 flex flex-col h-full bg-dark-gray justify-center items-center">
                <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                  <button className="button w-full">Exportar PDF</button>
                  <button className="button w-full">Exportar JPG</button>
                  <button className="button w-full">Enviar a Empresa</button>
                </div>
              </div>
              {/* Right Side */}
              <div className="w-1/5 p-6 flex flex-col justify-start items-start">
                <CodesGenerator selectedGroup={selectedGroup as Group} />
              </div>
            </div>
          </div>
        </div>
  )
};

export default CodesModal;
