import { FileUpload, Input, Select } from "@/app/components/ui";
import React from "react";
import { TfiClose } from "react-icons/tfi";

interface NewGroupModalProps {
  toggleModal: () => void;
}

const NewGroupModal = (props: NewGroupModalProps) => {
  const { toggleModal } = props;

  const handleAddSubmit = () => {};
  return (
    <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
      <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[50%]">
        <div className="py-2 bg-orange-500 w-full text-center relative">
          <h2 className="text-white">Añadir nuevo grupo</h2>
          <button onClick={toggleModal} className="absolute top-3 right-4">
            <TfiClose className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="w-full px-7 flex flex-col justify-center">
          <form action="">
            <div className="grid grid-cols-2 gap-4 mx-auto">
            <Input id="master" label="Grupo/Master" type="text" />
              <Select
                options={["Astros", "Pretti"]}
                label="Empresa"
                id="empresa"
              />
              <Input id="coordinador" label="Coordinador" type="text" />
              <Input id="escuela" label="Escuela" type="text" />
              <Input id="entrada" label="Entrada" type="date" />
              <Input id="salida" label="Salida" type="date" />
            </div>
            <div className="grid grid-cols-1 pt-5 gap-4">
              
              <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto ">
                <button
                  className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                  onSubmit={handleAddSubmit}
                >
                  Agregar Grupo
                </button>
                <button
                  className="p-1 button !text-white text-center !bg-red-700 hover:!bg-red-500"
                  onClick={toggleModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;
