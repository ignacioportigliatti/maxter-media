'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineEdit } from "react-icons/ai";
import { UploadGroupModal } from "./";
import { Group } from "@prisma/client";
import { Pagination } from "@/components/ui/";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { TbSortAZ, TbSortAscending, TbSortDescending } from "react-icons/tb";

interface UploadGroupsTableProps {
  activeTab: string;
}

export const UploadGroupsTable = (props: UploadGroupsTableProps) => {
  const columnHeaders = [
    { key: "name", label: "Grupo/Master" },
    { key: "agencyName", label: "Empresa" },
    { key: "coordinator", label: "Coordinador" },
    { key: "school", label: "Escuela" },
    { key: "entry", label: "Entrada" },
    { key: "exit", label: "Salida" },
  ];
  const { activeTab } = props;
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAutoModal, setShowAutoModal] = useState(false);
  const itemsPerPage = 8; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]); // [

  const [draggedGroups, setDraggedGroups] = useState<Map<string, boolean>>(
    new Map()
  );
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
      const response = await fetch("/api/groups");
      const data = await response.json();
      setGroups(data);
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleModal = () => {
    if (showManualModal) {
      setShowManualModal((modal) => !modal);
    } else {
      setShowAutoModal((modal) => !modal);
    }
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

  const handleDragEnter = (
    e: React.DragEvent<HTMLTableRowElement>,
    group: Group
  ) => {
    e.preventDefault();

    setDraggedGroups((prevGroups) => new Map(prevGroups).set(group.id, true));
  };

  const handleDragLeave = (
    e: React.DragEvent<HTMLTableRowElement>,
    group: Group,
  ) => {
    e.preventDefault();
    setDraggedGroups((prevGroups) => {
      const updatedGroups = new Map(prevGroups);
      updatedGroups.set(group.id, false);
      return updatedGroups;
    });

    
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const checkFilesFormat = (files: File[]) => {
    const videoAllowedFormats = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv", "video/x-flv", "video/x-matroska", "video/webm"];
    const photoAllowedFormats = ["application/zip"];
    const allowedFormats = activeTab === "videos" ? videoAllowedFormats : photoAllowedFormats;
  
    const invalidFiles = files.filter((file) => {
      return !allowedFormats.includes(file.type);
    });
  
    if (invalidFiles.length === 0) {
      return true;
    } else {
      const invalidFileNames = invalidFiles.map((file) => file.name).join(", ");
      toast.error(`Formato de archivo no permitido: ${invalidFileNames}`);
      return false;
    }
  };
  
  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    group: Group,
  ) => {
    e.preventDefault();
   
    const filesToUpload = Array.from(e.dataTransfer.files);
    const allowed = checkFilesFormat(filesToUpload);
    if (allowed === true) {
      setFilesToUpload(filesToUpload);
    setDraggedGroups(new Map());
    setSelectedGroup(group);
    setShowAutoModal(true);
    }
    console.log("Dropped group", group, filesToUpload);
  };

  const handleEditButton = (group: any) => {
    setSelectedGroup(group);
    setEditMode(true);
    handleEditGroup(selectedGroup);
  };

  const handleEditGroup = async (selectedGroup: Group | undefined) => {
    setShowManualModal(true);
    const groups = await axios.get("/api/groups");
    const groupObj = await groups.data.find(
      (group: Group) => group.id === selectedGroup?.id
    );
    const groupToEdit = groupObj;
    return groupToEdit;
  };

  const handleAddGroup = () => {
    setEditMode(false);
    setSelectedGroup(undefined);
    setShowManualModal(true);
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
          className="mt-1 w-full py-1 px-1 border text-xs dark:bg-dark-gray border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Filtrar..."
          value={filter[column] || ""}
          onChange={(e) => handleFilterChange(column, e.target.value)}
        />
      );
    } else {
      return (
        <input
          type="text"
          className="mt-1 w-full py-1 px-1 border text-xs dark:bg-dark-gray border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <div className="md:overflow-hidden border-y border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-medium-gray">
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
                        dark:bg-dark-gray dark:hover:bg-orange-500 hover:text-white bg-gray-200 font-semibold"
                    onClick={handleAddGroup}
                  >
                    <span className="font-bold">+</span> Agregar
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#292929]">
              {sortedGroups
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((group) => (
                  <tr
                    key={group.id}
                    onDragEnter={(e) => handleDragEnter(e, group)}
                    onDragLeave={(e) => handleDragLeave(e, group)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, group)}         
                    className={`${
                      draggedGroups.get(group.id)
                        ? "bg-orange-500/50 themeTransition"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap pointer-events-none">
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
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {group.coordinator}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
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
        totalItems={sortedGroups.length}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
      />
      {showManualModal && editMode ? (
        <UploadGroupModal
          activeTab={activeTab}
          toggleModal={handleToggleModal}
          selectedGroup={selectedGroup}
          editMode={editMode}
          refresh={getGroups}
          uploadType="manual"
        />
      ) : (
        showManualModal && (
          <UploadGroupModal
          editMode={editMode}
            activeTab={activeTab}
            uploadType="manual"
            toggleModal={handleToggleModal}
          />
        )
      )}

      {showAutoModal ? (
        <UploadGroupModal
        editMode={editMode}
          activeTab={activeTab}
          toggleModal={handleToggleModal}
          refresh={getGroups}
          uploadType="auto"
          filesToUpload={filesToUpload}
          selectedGroup={selectedGroup}
        />
      ) : null}

      {showDeleteModal ? (
        <ConfirmDeleteModal
          toggleModal={handleDeleteModal}
          refresh={getGroups}
          selectedItem={selectedGroup}
          title="Eliminar Grupo"
          message={`¿Estás seguro que deseas eliminar "${selectedGroup?.name}"? Recuerda que se perderán todos los datos y archivos.`}
          apiRoute="groups"
          toastMessage={`Grupo "${selectedGroup?.name}" eliminado con éxito`}
        />
      ) : null}
    </div>
  );
};