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
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80">
      <div className="dark:bg-medium-gray w-full max-w-2xl mx-4 rounded-lg shadow-lg">
        <div className="py-4 bg-dark-gray  text-white text-center rounded-t-lg">
          <h2 className="text-xl font-semibold">{`Gestión de códigos - ${selectedGroup?.name} - ${selectedGroup?.agencyName}`}</h2>
          <button
            onClick={handleToggleModal}
            className="absolute top-3 right-4"
          >
            <TfiClose className="w-5 h-5" />
          </button>
        </div>
        <div className="flex w-full">
          {/* Left Side */}
          <div className="w-2/3 p-6 flex flex-col gap-4">
            <GeneratedCodes selectedGroup={selectedGroup as Group} />
          </div>
          {/* Right Side */}
          <div className="w-1/3 p-6 flex flex-col gap-4 bg-orange-700">
            <CodesGenerator selectedGroup={selectedGroup as Group} />
          </div>
        </div>
        {/* Bottom Actions */}
        <div className="px-6 py-4 bg-dark-gray flex justify-center">
          <button className="button mr-2">Exportar PDF</button>
          <button className="button mr-2">Exportar JPG</button>
          <button className="button">Enviar a Empresa</button>
        </div>
      </div>
    </div>
  );
};

export default CodesModal;
