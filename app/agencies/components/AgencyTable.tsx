import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import NewAgencyModal from "./NewAgencyModal";
import Pagination from "@/app/components/Pagination";


interface Agency {
  name: string;
  location: string;
  group: number;
  phone: string;
  email: string;
  logoSrc: string;
  id: string;
}

interface AgencyTableProps {
  agencies: Agency[];
}

export const AgencyTable = ({ agencies }: AgencyTableProps) => {
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 8; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleModal = () => {
    setShowModal((modal) => !modal);
  };

  const handleDeleteAgency = async (id: string) => {
    try {
      const response = await axios.delete(`/api/agencies?id=${id}`);
      console.log(response);

      if (response.data.success) {
        // La eliminación fue exitosa
        toast.success("La empresa fue eliminada exitosamente", {
          theme: "dark",
          autoClose: 3000,
        });
        console.log("La empresa fue eliminada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 3000);

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

  const handleDeleteButton = async (id: string) => {
    await handleDeleteAgency(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col">
        <div className="overflow-hidden border border-gray-200 dark:border-medium-gray">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-gray">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Nombre
                </th>
                <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Grupos
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Teléfono
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Email
                </th>
                <th className="flex justify-end px-4 items-center text-sm whitespace-nowrap relative py-3.5">
                  <button
                    className="dark:text-white text-black text-[12px] p-2 hover:bg-orange-500 transition duration-300
                        dark:bg-medium-gray dark:hover:bg-orange-500 hover:text-white bg-gray-200 font-semibold"
                    onClick={handleToggleModal}
                  >
                    <span className="font-bold">+</span> Agregar
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#292929]">
              {agencies
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((agency) => (
                  <tr key={agency.id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div className="inline-flex items-center gap-x-3">
                        <div className="flex items-center gap-x-2">
                          <img
                            className="object-cover w-10 h-10 rounded-full bg-medium-gray"
                            src={agency.logoSrc}
                            alt={`${agency.name} logo`}
                          />
                          <div>
                            <h2 className="font-medium text-gray-800 dark:text-white">
                              {agency.name}
                            </h2>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                              {agency.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-orange-100/60 dark:bg-medium-gray">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                        <h2 className="text-sm font-normal text-orange-500">
                          {agency.group} {agency.group > 1 ? "Grupos" : "Grupo"}
                        </h2>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {agency.phone}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {agency.email}
                    </td>
                    <td className="flex justify-end px-4 items-center my-3 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-x-2 pr-4">
                        <button
                          className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 
                            hover:text-red-500 focus:outline-none"
                          onClick={() => handleDeleteButton(agency.id)}
                        >
                          <AiOutlineDelete className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                          <AiOutlineEdit className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        totalItems={agencies.length}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
      />
      {showModal && <NewAgencyModal toggleModal={handleToggleModal} />}
    </div>
  );
};

export default AgencyTable;
