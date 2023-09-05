import { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { AgencyModal } from "./";
import { Pagination } from "@/components/ui/Pagination";
import { Agency } from "@prisma/client";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setAgencies } from "@/redux/agenciesSlice";
import { getAgencies } from "@/utils";
import axios from "axios";
import { AgencyWithGroups } from "@/types/prisma";

export const AgencyTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const itemsPerPage = 8; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const agencies: AgencyWithGroups[] = useSelector((state: any) => state.agencies);


  const handleToggleModal = () => {
    setShowModal((modal) => !modal);
  };
  const handleDeleteModal = () => {
    setShowDeleteModal((modal) => !modal);
  };

  const confirmDeleteModal = async (agency: any) => {
    await setShowDeleteModal(true);
  };

  const handleDeleteButton = async (agency: any) => {
    await confirmDeleteModal(agency);
    await setSelectedAgency(agency);
  };

  const handleEditButton = (agency: any) => {
    setSelectedAgency(agency);
    setEditMode(true);
    handleEditAgency(selectedAgency);
  };

  const handleEditAgency = async (selectedAgency: Agency | null) => {
    setShowModal(true);
    const agencies = await getAgencies();
    console.log(agencies.data);
    const agencyObj = await agencies.find(
      (agency: Agency) => agency.id === selectedAgency?.id
    );

    return agencyObj;
  };

  const handleAddGroup = () => {
    setEditMode(false);
    setSelectedAgency(null);
    setShowModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
    
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
                <th className="flex justify-end px-4 items-center text-sm whitespace-nowrap  py-3.5">
                  <button
                    className="dark:text-white text-black text-[12px] p-2 hover:bg-red-600 transition duration-300
                        dark:bg-medium-gray dark:hover:bg-red-600 hover:text-white bg-gray-200 font-semibold"
                    onClick={handleAddGroup}
                  >
                    <span className="font-bold">+</span> Agregar
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#292929]">
              {agencies
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((agency) => (
                  <tr key={agency.id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div className="inline-flex items-center gap-x-3">
                        <div className="flex items-center gap-x-2">
                          <Image
                            className="object-contain p-1 w-10 h-10 rounded-full bg-medium-gray"
                            src={agency.logoSrc as string}
                            alt={`${agency.name} logo`}
                            width={40}
                            height={40}
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
                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-red-100/60 dark:bg-medium-gray">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                        <h2 className="text-sm font-normal text-red-600">
                          {agency.groups.length}{" "}
                          {agency.groups.length !== 1 ? "Grupos" : "Grupo"}
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
                          className="text-gray-500 transition-colors duration-200 dark:hover:text-red-600 dark:text-gray-300 
                            hover:text-red-600 focus:outline-none"
                          onClick={() => handleDeleteButton(agency)}
                        >
                          <AiOutlineDelete className="w-5 h-5" />
                        </button>
                        <button
                          className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 
                          dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                          onClick={() => handleEditButton(agency)}
                        >
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
      {showModal && (
        <AgencyModal
          handleEditAgency={
            editMode ? () => handleEditAgency(selectedAgency) : undefined
          }
          toggleModal={handleToggleModal}
          buttonText={editMode ? "Editar Empresa" : "Agregar Empresa"}
          refresh={() =>
            dispatch(setAgencies(agencies as Agency[]))
          }
        />
      )}
      {showDeleteModal ? (
        <ConfirmDeleteModal
          toggleModal={handleDeleteModal}
          refresh={() =>
            dispatch(
              setAgencies(
                agencies.filter((agency: Agency) => agency.id !== selectedAgency?.id)
              )
            )
          }
          selectedItem={selectedAgency}
          title="Eliminar Empresa"
          message={`¿Estás seguro que deseas eliminar "${selectedAgency?.name}"? Recuerda que se perderan los grupos.`}
          apiRoute="agencies"
          toastMessage={`La empresa ${selectedAgency?.name} fue eliminada exitosamente`}
        />
      ) : null}
    </div>
  );
};
