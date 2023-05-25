'use client'

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { Agency } from "@prisma/client";
import { Input, Select } from "@/app/components/ui";

interface NewGroupModalProps {
  toggleModal: () => void;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({ toggleModal }) => {
  const [formErrors, setFormErrors] = useState({
    master: "",
    coordinator: "",
    school: "",
    entry: "",
    exit: "",
  });

  const [formData, setFormData] = useState({
    master: "",
    agencyId: "",
    agencyName: "",
    coordinator: "",
    school: "",
    entry: "",
    exit: "",
  });

  const [agencies, setAgencies] = useState([] as Agency[]);
  const [selectedAgency, setSelectedAgency] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    try {
      axios
        .get("/api/agencies")
        .then((response) => {
          setAgencies(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("Error al obtener las agencias:", error);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = {
      master: formData.master.trim() === "" ? "El campo Grupo/Master es requerido." : "",
      coordinator: formData.coordinator.trim() === "" ? "El campo Coordinador es requerido." : "",
      school: formData.school.trim() === "" ? "El campo Escuela es requerido." : "",
      entry: formData.entry.trim() === "" ? "El campo Entrada es requerido." : "",
      exit: formData.exit.trim() === "" ? "El campo Salida es requerido." : "",
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    try {
      if (!selectedAgency.id) {
        console.error("Debes seleccionar una agencia");
        return;
      }

      const updatedFormData = {
        ...formData,
        agencyId: selectedAgency.id,
        agencyName: selectedAgency.name,
      };

      const response = await axios.post("/api/new-group", updatedFormData);

      console.log(response.data.success);

      if (response.data.success) {
        toast.success(`${updatedFormData.master} agregado con éxito!`, {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (response.data.error) {
        toast.error(response.data.error, {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error al crear el grupo:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  return (
    <div>


      <ToastContainer />


      <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
        <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[50%]">
          <div className="py-2 bg-orange-500 w-full text-center relative">
            <h2 className="text-white">Añadir nuevo grupo</h2>
            <button onClick={toggleModal} className="absolute top-3 right-4">
              <TfiClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="w-full px-7 flex flex-col justify-center">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4 mx-auto">
                <div>
                  <Input
                    id="name"
                    label="Grupo/Master"
                    type="text"
                    required
                    value={formData.master}
                    onChange={(event) => handleInputChange(event, "master")}
                    error={formErrors.master}
                  />
                </div>

                <div>
                  <Select
                    options={agencies.map((agency) => ({
                      name: agency.name,
                      value: agency.id,
                    }))}
                    label="Empresa"
                    id="empresa"
                    onChange={(selectedOption) => {
                      const selectedAgency = agencies.find(
                        (agency) => agency.id === selectedOption.target.value
                      );

                      if (selectedAgency) {
                        setSelectedAgency({
                          id: selectedOption.target.value,
                          name: selectedAgency.name,
                        });
                        setFormData({
                          ...formData,
                          agencyId: selectedAgency.id,
                          agencyName: selectedAgency.name,
                        });
                      }
                    }}
                    value={selectedAgency.id}
                  />
                </div>

                <div>
                  <Input
                    id="coordinador"
                    label="Coordinador"
                    type="text"
                    value={formData.coordinator}
                    onChange={(event) => handleInputChange(event, "coordinator")}
                    error={formErrors.coordinator}
                  />
                </div>

                <div>
                  <Input
                    id="escuela"
                    label="Escuela"
                    type="text"
                    value={formData.school}
                    onChange={(event) => handleInputChange(event, "school")}
                    error={formErrors.school}
                  />
                </div>

                <div>
                  <Input
                    id="entrada"
                    label="Entrada"
                    type="date"
                    value={formData.entry}
                    onChange={(event) => handleInputChange(event, "entry")}
                    error={formErrors.entry}
                  />
                </div>

                <div>
                  <Input
                    id="salida"
                    label="Salida"
                    type="date"
                    value={formData.exit}
                    onChange={(event) => handleInputChange(event, "exit")}
                    error={formErrors.exit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 pt-5 gap-4">
                <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto ">
                  <button
                    className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                    type="submit"
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
    </div>
  );
};

export default NewGroupModal;
