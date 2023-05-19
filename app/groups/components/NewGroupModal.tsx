"use client";

import { Input, Select } from "@/app/components/ui";
import { useEffect, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { Agency } from "@prisma/client";

interface NewGroupModalProps {
  toggleModal: () => void;
}

const NewGroupModal = (props: NewGroupModalProps) => {
  const { toggleModal } = props;

  const [formData, setFormData] = useState({
    master: "",
    agency: "",
    coordinator: "",
    school: "",
    entry: "",
    exit: "",
  });

  const [agencies, setAgencies] = useState([] as Agency[]);
  const [selectedAgency, setSelectedAgency] = useState("");

  useEffect(() => {
    try {
      axios
        .get("/api/agencies")
        .then((response) => {
          // Maneja la respuesta del backend según corresponda
          console.log(response.data); // Por ejemplo, muestra un mensaje de éxito
          setAgencies(response.data);
        })
        .catch((error) => {
          // Maneja los errores de la solicitud al backend
          console.error(error); // Por ejemplo, muestra un mensaje de error
        });
    } catch (error) {
      console.error("Error al obtener las agencias:", error);
    }
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const updatedFormData = { ...formData, agency: selectedAgency };
  
      // Realizar la solicitud al backend para guardar el grupo en la base de datos
      await axios.post("/api/new-group", updatedFormData);
  
      console.log("Nuevo grupo creado:", updatedFormData.master);
      // Restablecer el estado y limpiar el formulario si es necesario
      // Realizar acciones adicionales o mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      // Manejar el error adecuadamente, mostrar un mensaje de error, etc.
    }
  };

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
              <Input
                id="name"
                label="Grupo/Master"
                type="text"
                value={formData.master}
                onChange={(event) =>
                  setFormData({ ...formData, master: event.target.value })
                }
              />

              <Select
                options={agencies.map((agency) => ({
                  name: agency.name,
                  value: agency.id,
                }))}
                label="Empresa"
                id="empresa"
                onChange={(selectedOption) =>
                  setSelectedAgency(selectedOption.target.value)
                }
                value={selectedAgency}
              />

              <Input
                id="coordinador"
                label="Coordinador"
                type="text"
                value={formData.coordinator}
                onChange={(event) =>
                  setFormData({ ...formData, coordinator: event.target.value })
                }
              />

              <Input
                id="escuela"
                label="Escuela"
                type="text"
                value={formData.school}
                onChange={(event) =>
                  setFormData({ ...formData, school: event.target.value })
                }
              />

              <Input
                id="entrada"
                label="Entrada"
                type="date"
                value={formData.entry}
                onChange={(event) =>
                  setFormData({ ...formData, entry: event.target.value })
                }
              />

              <Input
                id="salida"
                label="Salida"
                type="date"
                value={formData.exit}
                onChange={(event) =>
                  setFormData({ ...formData, exit: event.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 pt-5 gap-4">
              <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto ">
                <button
                  className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                  onClick={handleSubmit}
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
