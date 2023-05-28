import axios from "axios";
import { Agency } from "@prisma/client";
import {toast, ToastContainer} from "react-toastify";
import { TfiClose } from "react-icons/tfi";


interface confirmDeleteModalProps {
    getAgencies: () => void;
    toggleModal: () => void;
    selectedAgency: any;
}

export const ConfirmDeleteModal = (props: confirmDeleteModalProps) => {
    const {getAgencies, toggleModal, selectedAgency} = props;
    console.log(selectedAgency);
    const handleDeleteAgency = async (id: string, name: string) => {
        try {
          const response = await axios.delete(`/api/agencies?id=${id}`);
          console.log(response);
    
          if (response.data.success) {
            // La eliminación fue exitosa
            toast.success(`La empresa ${name} fue eliminada exitosamente`, {
              theme: "dark",
              autoClose: 3000,
            });
            console.log("La empresa fue eliminada exitosamente");
            setTimeout(() => {
              getAgencies();
                toggleModal();
            }, 1000);
    
            // Realiza alguna acción adicional, como actualizar la lista de empresas
          } else if (response.data.error) {
            // Ocurrió un error al eliminar la empresa
            toast.error(response.data.error); // Muestra el mensaje de error enviado desde el servidor
            console.error("Error al eliminar la empresa:", response.status);
            // Realiza alguna acción adicional para manejar el error
          }
        } catch (error) {
          console.error("Error al eliminar la empresa:", error);
          toast.error("Ocurrió un error al eliminar la empresa");
          // Realiza alguna acción adicional para manejar el error
        }
      };

    return (
        <div>
        <ToastContainer />
        <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
          <div className="flex flex-col gap-4 pb-7 justify-center items-center bg-white dark:bg-dark-gray w-[50%]">
            <div className="py-2 bg-orange-500 w-full text-center relative">
              <h2 className="text-white">Añadir nuevo grupo</h2>
              <button onClick={toggleModal} className="absolute top-3 right-4">
                <TfiClose className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="w-full px-7 flex flex-col justify-center">
              <div>
                <p className="text-center text-gray-500">
                    ¿Estás seguro que deseas eliminar esta empresa?
                </p>
                <div className="flex justify-center gap-4 mt-4">
                    <button onClick={toggleModal} className="px-4 py-2 bg-gray-500 text-white">
                        Cancelar
                    </button>
                    <button onClick={() => handleDeleteAgency(selectedAgency.id, selectedAgency.name)} className="px-4 py-2 bg-orange-500 text-white">
                        Eliminar
                    </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}
