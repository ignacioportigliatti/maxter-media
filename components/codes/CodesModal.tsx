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
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center py-4 sm:py-0 bg-black bg-opacity-90">
      <div className="bg-medium-gray w-full max-w-7xl mx-4 rounded-lg shadow-lg">
        <div className="py-4 bg-dark-gray flex flex-col sm:flex-row sm:justify-between px-4 text-white text-center rounded-t-lg">
          <h2 className="text-lg uppercase font-light">
            {`Gestión de códigos - ${selectedGroup?.name} - ${selectedGroup?.agencyName}`}
          </h2>
          <button onClick={handleToggleModal}>
            <TfiClose className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row w-full h-full">
          {/* Left Side */}
          <div className="w-full sm:w-3/4 p-4 sm:p-6 flex flex-col gap-4">
            <GeneratedCodes selectedGroup={selectedGroup as Group} />
          </div>
          {/* Right Side */}
          <div className="w-full sm:w-1/4 p-4 sm:p-6 bg-red-700">
            <CodesGenerator selectedGroup={selectedGroup as Group} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodesModal;