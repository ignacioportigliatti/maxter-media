"use client";

import { Group } from "@prisma/client";
import { TfiClose } from "react-icons/tfi";
import GeneratedCodes from "./GeneratedCodes";
import CodesGenerator from "./CodesGenerator";
import { useState } from "react";

type CodesModalProps = {
  selectedGroup: Group;
  handleToggleModal: () => void;
};

const CodesModal = (props: CodesModalProps) => {
  const { selectedGroup, handleToggleModal } = props;
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const handlePDFExport = () => {}
  const handleSendToAgency = () => {}

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90">
      <div className="dark:bg-medium-gray w-full max-w-2xl mx-4 rounded-lg shadow-lg">
        <div className="py-4 bg-dark-gray flex flex-row w-full justify-between px-4 text-white text-center rounded-t-lg">
          <h2 className="text-lg uppercase font-light">{`Gestión de códigos - ${selectedGroup?.name} - ${selectedGroup?.agencyName}`}</h2>
          <button
            onClick={handleToggleModal}
            
          >
            <TfiClose className="w-4 h-4" />
          </button>
        </div>
        <div className="flex w-full">
          {/* Left Side */}
          <div className="w-2/3 p-6 flex flex-col gap-4">
            <GeneratedCodes selectedGroup={selectedGroup as Group} />
          </div>
          {/* Right Side */}
          <div className="w-1/3 p-6 flex flex-col gap-4 bg-red-700">
            <CodesGenerator selectedGroup={selectedGroup as Group} />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CodesModal;
