"use client";

import { useState } from "react";
import { TfiArrowLeft, TfiArrowRight, TfiClose } from "react-icons/tfi";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import NewAgencyModal from "./NewAgencyModal";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


interface AgencyTableProps {
  names: string[];
  locations: string[];
  groups: number[];
  phones: string[];
  emails: string[];
  logoSrc: string[];
  ids: string[];
}

export const AgencyTable = (props: AgencyTableProps) => {
  const { names, locations, groups, phones, emails, logoSrc, ids } = props;
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => {
    setShowModal((modal) => !modal);
  };

  const handleDeleteAgency = async (id: string) => {
    try {
      const response = await axios.delete(`/api/agencies?id=${id}`);
      console.log(response);
      
  
      if (response.data.success) {
        // La eliminación fue exitosa
        toast.success("La empresa fue eliminada exitosamente", {theme: "dark", autoClose: 3000});
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

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center gap-x-3"></div>
      <div className="flex flex-col ">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-medium-gray">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-dark-gray">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex items-center gap-x-3">
                        <span>Nombre</span>
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <button className="flex items-center gap-x-2">
                        <span>Grupos</span>
                      </button>
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Teléfono
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
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
                  {names.map((name, index) => (
                    <tr key={name[index]}>
                      <td
                        key={name[index]}
                        className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
                      >
                        <div className="inline-flex items-center gap-x-3">
                          <div className="flex items-center gap-x-2">
                            <img
                              className="object-cover w-10 h-10 rounded-full bg-medium-gray"
                              src={logoSrc[index]}
                              alt={`${name} logo`}
                            />
                            <div>
                              <h2 className="font-medium text-gray-800 dark:text-white ">
                                {name}
                              </h2>
                              <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                {locations[index]}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        key={"groups"}
                        className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
                      >
                        <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-orange-100/60 dark:bg-medium-gray">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>

                          <h2 className="text-sm font-normal text-orange-500">
                            {groups[index]}{" "}
                            {groups[index] > 1 ? "Grupos" : "Grupo"}
                          </h2>
                        </div>
                      </td>

                      <td
                        key={"phones"}
                        className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                      >
                        {phones[index]}
                      </td>
                      <td
                        key={"emails"}
                        className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                      >
                        {emails[index]}
                      </td>

                      <td className="flex justify-end px-4 items-center my-3 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-2 pr-4">
                          <button 
                            className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 
                            hover:text-red-500 focus:outline-none"
                            onClick={() => handleDeleteButton(ids[index])}
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
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        <a href="#" className="buttonWithIcon">
          <TfiArrowLeft />

          <span>Anterior</span>
        </a>

        <div className="items-center hidden lg:flex gap-x-3">
          <a href="#" className="px-2 py-1 text-sm text-white bg-orange-500/60">
            1
          </a>
          <a
            href="#"
            className="px-2 py-1 text-sm text-gray-500 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            2
          </a>
        </div>

        <a href="#" className="buttonWithIcon">
          <span>Siguiente</span>

          <TfiArrowRight />
        </a>
      </div>

      {/* Add Modal */}
      <div>
        {showModal === true ? (
          <NewAgencyModal toggleModal={handleToggleModal} />
        ) : null}
      </div>
    </div>
  );
};
