import { useState, useEffect } from "react";
import axios from "axios";
import {ToastContainer } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import GroupModal from "./GroupModal";
import Pagination from "@/app/components/Pagination";
import { ConfirmDeleteModal } from "@/app/components/ConfirmDeleteModal";

interface Group {
  id: string;
  name: string;
  coordinator: string;
  school: string;
  entry: string;
  exit: string;
  agency: {
    id: string;
    name: string;
  };
  agencyName: string;
}



export const GroupsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 8; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const response = await axios.get("/api/groups");
      setGroups(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleModal = () => {
    setShowModal((modal) => !modal);
  };

  
  const handleDeleteModal = () => {
    setShowDeleteModal((modal) => !modal);
  };

  const confirmDeleteModal = async () => {
    await setShowDeleteModal(true);
  };

  const handleDeleteButton = async (agency: any) => {
    await confirmDeleteModal();
    await setSelectedGroup(agency);
  };


 const handleEditButton = (group: any) => {
  setSelectedGroup(group);
  setEditMode(true);
  handleEditGroup(selectedGroup);
 }

  const handleEditGroup = async (selectedGroup: Group | null ) => {
    setShowModal(true);
    const groups = await axios.get('/api/groups');
    
    const groupObj = await groups.data.find((group: Group) => group.id === selectedGroup?.id);
 
    const groupToEdit: string = groupObj.id;
    return groupToEdit;
  };

  const handleAddGroup = () => {
    setEditMode(false);
    setSelectedGroup(null);
    setShowModal(true);
  };
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col">
        <div className="md:overflow-hidden border border-gray-200 dark:border-medium-gray">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-gray">
              <tr className="">
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Grupo/Master
                </th>
                <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Empresa
                </th>
                <th className="py-3.5 w-[20%] text-sm font-normal text-center rtl:text-right text-gray-500 dark:text-gray-400">
                  Coordinador
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Escuela
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Entrada
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Salida
                </th>
                <th className="flex justify-end px-4 items-center text-sm whitespace-nowrap relative py-3.5">
                  <button
                    className="dark:text-white text-black text-[12px] p-2 hover:bg-orange-500 transition duration-300
                        dark:bg-medium-gray dark:hover:bg-orange-500 hover:text-white bg-gray-200 font-semibold"
                    onClick={handleAddGroup}
                  >
                    <span className="font-bold">+</span> Agregar
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#292929]">
              {groups
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((group) => (
                  <tr key={group.id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div className="inline-flex items-center gap-x-3">
                        <div className="flex items-center gap-x-2">
                          <div>
                            <h2 className="font-medium text-gray-800 dark:text-white">
                              {group.name}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                      <h2 className="text-sm">{group.agencyName}</h2>
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.coordinator}
                    </td>
                    <td className="px-4 py-4 text-sm  text-center text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.school}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.entry}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.exit}
                    </td>
                    <td className="flex justify-end px-4 items-center my-3 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-x-2 pr-4">
                        <button
                          className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 
                            hover:text-red-500 focus:outline-none"
                          onClick={() =>
                            handleDeleteButton(group)
                          }
                        >
                          <AiOutlineDelete className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                          <AiOutlineEdit className="w-5 h-5"
                            onClick={() => handleEditButton(group)}
                          />
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
        totalItems={groups.length}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
      />
      {(showModal && editMode) ?
        <GroupModal
          handleEditGroup={() => handleEditGroup(selectedGroup)}
          toggleModal={handleToggleModal}
          getGroups={getGroups}
         
        />
        : showModal &&
        <GroupModal
          toggleModal={handleToggleModal}
          getGroups={getGroups}
        />
      }
      {showDeleteModal ? 
      <ConfirmDeleteModal
          toggleModal={handleDeleteModal}
          refresh={getGroups}
          selectedItem={selectedGroup}
          title="Eliminar Grupo"
          message={`¿Estás seguro que deseas eliminar "${selectedGroup?.name}"? Recuerda que se perderan todos los datos y archivos.`}
          apiRoute="groups"
          toastMessage={`Grupo "${selectedGroup?.name}" eliminado con éxito`}
      /> : null

    }
    </div>
  );
};

export default GroupsTable;
