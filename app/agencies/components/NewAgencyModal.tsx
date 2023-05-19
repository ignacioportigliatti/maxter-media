import { FileUpload, Input } from "@/app/components/ui";
import { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";

interface NewAgencyModalProps {
  toggleModal: () => void;
}

const NewAgencyModal = (props: NewAgencyModalProps) => {
  const { toggleModal } = props;

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (event: any) => {
    

    try {
      event.preventDefault();

      axios
        .post("/api/new-agency", formData)
        .then((response) => {
          // Maneja la respuesta del backend según corresponda
          console.log(response.data); // Por ejemplo, muestra un mensaje de éxito
        })
        .catch((error) => {
          // Maneja los errores de la solicitud al backend
          console.error(error); // Por ejemplo, muestra un mensaje de error
        });

      console.log("Nueva empresa creada:", formData.name);
      // Realiza cualquier acción adicional o muestra un mensaje de éxito
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      // Maneja el error de manera adecuada, muestra un mensaje de error, etc.
    }
  };
  return (
    <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
      <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[50%]">
        <div className="py-2 bg-orange-500 w-full text-center relative">
          <h2 className="text-white">Añadir nueva empresa</h2>
          <button onClick={toggleModal} className="absolute top-3 right-4">
            <TfiClose className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="w-full px-7 flex flex-col justify-center">
          <form action="">
            <div className="grid grid-cols-2 gap-4 mx-auto">
              <Input
                id="empresa"
                label="Empresa"
                type="input"
                required
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
              />
              <Input
                id="telefono"
                label="Telefono"
                type="input"
                value={formData.phone}
                onChange={(event) =>
                  setFormData({ ...formData, phone: event.target.value })
                }
              />

              <Input
                id="email"
                label="Email"
                type="input"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
              <Input
                id="provincia"
                label="Provincia"
                type="input"
                value={formData.location}
                onChange={(event) =>
                  setFormData({ ...formData, location: event.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 pt-5 gap-4">
              <FileUpload
                label="Logo"
                id="logo"
                buttonText="Subir logo"
                description="Sube el logo de la empresa."
              />
              <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto ">
                <button
                  className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                  onSubmit={handleSubmit}
                >
                  Agregar Empresa
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

export default NewAgencyModal;
