import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GroupModal } from "./";
import { Group } from "@prisma/client";
import {Pagination } from "@/components/ui/Pagination";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { TbSortAZ, TbSortAscending, TbSortDescending } from "react-icons/tb";



export const GroupsTable = () => {
  const columnHeaders = [
    { key: "name", label: "Grupo/Master" },
    { key: "agencyName", label: "Empresa" },
    { key: "coordinator", label: "Coordinador" },
    { key: "school", label: "Escuela" },
    { key: "entry", label: "Entrada" },
    { key: "exit", label: "Salida" },
  ];

  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 8; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState<Record<string, string>>({});

  const [sortOrder, setSortOrder] = useState<{
    column: string | null;
    ascending: boolean;
  }>({
    column: null,
    ascending: true,
  });

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

  const handleDeleteButton = async (group: any) => {
    await confirmDeleteModal();
    await setSelectedGroup(group);
  };

  const handleEditButton = (group: any) => {
    setSelectedGroup(group);
    setEditMode(true);
    handleEditGroup(selectedGroup);
  };

  const handleEditGroup = async (selectedGroup: Group | null) => {
    setShowModal(true);
    const groups = await axios.get("/api/groups");

    const groupObj = await groups.data.find(
      (group: Group) => group.id === selectedGroup?.id
    );

    const groupToEdit: Group = groupObj;
    return groupToEdit;
  };

  const handleAddGroup = () => {
    setEditMode(false);
    setSelectedGroup(null);
    setShowModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilter({});
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [column]: value,
    }));
  };

  const handleSortColumn = (column: string) => {
    if (sortOrder.column === column) {
      setSortOrder((prevSortOrder) => ({
        column,
        ascending: !prevSortOrder.ascending,
      }));
    } else {
      setSortOrder({ column, ascending: true });
    }
  };

  const sortedGroups = groups
    .filter((group) =>
      Object.entries(filter).every(([column, value]) => {
        const columnValue = group[column as keyof Group];
        if (typeof value === "string" && typeof columnValue === "string") {
          return columnValue.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      })
    )
    .sort((a, b) => {
      if (sortOrder.column) {
        const columnA = a[sortOrder.column as keyof Group];
        const columnB = b[sortOrder.column as keyof Group];
        if (typeof columnA === "string" && typeof columnB === "string") {
          return sortOrder.ascending
            ? columnA.localeCompare(columnB)
            : columnB.localeCompare(columnA);
        }
      }
      return 0;
    });

  const renderSortIcon = (column: string) => {
    if (sortOrder.column === column) {
      return sortOrder.ascending ? (
        <TbSortAscending size={18} />
      ) : (
        <TbSortDescending size={18} />
      );
    } else {
      return <TbSortAZ size={18} />;
    }
  };

  const renderFilterInput = (column: string) => {
    if (column === "entry" || column === "exit") {
      return (
        <input
          type="date"
          className="mt-1 w-full py-1 px-1 border dark:bg-medium-gray text-xs border-gray-300 dark:border-medium-gray focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Filtrar..."
          value={filter[column] || ""}
          onChange={(e) => handleFilterChange(column, e.target.value)}
        />
      );
    } else {
      return (
        <input
          type="text"
          className="mt-1 w-full py-1 px-1 border dark:bg-medium-gray text-xs border-gray-300 dark:border-medium-gray focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Filtrar..."
          value={filter[column] || ""}
          onChange={(e) => handleFilterChange(column, e.target.value)}
        />
      );
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col">
        <div className="md:overflow-hidden border border-gray-200 dark:border-medium-gray">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-gray">
              <tr className="">
                {columnHeaders.map(({ key, label }) => (
                  <th
                    key={key}
                    className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer"
                  >
                    <div
                      onClick={() => handleSortColumn(key)}
                      className="flex flex-row items-center gap-2 justify-between"
                    >
                      <div className="text-left w-full">{label}</div>
                      <span>{renderSortIcon(key)}</span>
                    </div>
                    {renderFilterInput(key)}
                  </th>
                ))}

                <th className="px-4 items-center text-sm whitespace-nowrap relative py-3.5">
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
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 dark:bg-[#292929]">
              {sortedGroups
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((group) => (
                  <tr
                    key={group.id}
                    draggable
                  
                  >
                    <td className="px-4 text-sm font-medium text-gray-700 whitespace-nowrap pointer-events-none">
                      <div className="inline-flex gap-x-3 pointer-events-none">
                        <div className="flex gap-x-2 pointer-events-none">
                          <div>
                            <h2 className="font-medium text-gray-800 dark:text-white pointer-events-none">
                              {group.name}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                      <h2 className="text-sm">{group.agencyName}</h2>
                    </td>
                    <td className="px-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.coordinator}
                    </td>
                    <td className="px-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.school}
                    </td>
                    <td className="px-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.entry}
                    </td>
                    <td className="px-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.exit}
                    </td>
                    <td className="flex justify-end px-4 items-center my-3 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-x-2 pr-4">
                        <button
                          className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 
                            hover:text-red-500 focus:outline-none"
                          onClick={() => handleDeleteButton(group)}
                        >
                          <AiOutlineDelete className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                          <AiOutlineEdit
                            className="w-5 h-5"
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
      {showModal && 
        <GroupModal
          groupToEdit={editMode ? selectedGroup : undefined}
          toggleModal={handleToggleModal}
          refresh={getGroups}
          
        />
}
      {showDeleteModal ? (
        <ConfirmDeleteModal
          toggleModal={handleDeleteModal}
          refresh={getGroups}
          selectedItem={selectedGroup}
          title="Eliminar Grupo"
          message={`¿Estás seguro que deseas eliminar "${selectedGroup?.name}"? Recuerda que se perderan todos los datos y archivos.`}
          apiRoute="groups"
          toastMessage={`Grupo "${selectedGroup?.name}" eliminado con éxito`}
        />
      ) : null}
    </div>
  );
};
