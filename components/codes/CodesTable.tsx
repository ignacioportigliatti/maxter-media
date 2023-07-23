"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineFileAdd,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
// import { UploadGroupModal } from "./";
import { Group } from "@prisma/client";
import { Pagination } from "@/components/ui/";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { TbSortAZ, TbSortAscending, TbSortDescending } from "react-icons/tb";
import { getGroups } from "@/utils";
import { QRCodeSVG } from "qrcode.react";
import { TfiClose } from "react-icons/tfi";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import GeneratedCodes from "./GeneratedCodes";
import CodesGenerator from "./CodesGenerator";

type CodesTableProps = {};

const CodesTable = (props: CodesTableProps) => {
  const columnHeaders = [
    { key: "name", label: "Grupo/Master" },
    { key: "agencyName", label: "Empresa" },
    { key: "coordinator", label: "Coordinador" },
    { key: "school", label: "Escuela" },
    { key: "entry", label: "Entrada" },
    { key: "exit", label: "Salida" },
  ];

  const codesTableContent = [
    {
      code: "AST-0488-001",
      type: "Fotos",
      optional: "Si",
    },
    {
      code: "AST-0488-002",
      type: "Fotos + Videos",
      optional: "No",
    },
    {
      code: "AST-0488-003",
      type: "Videos",
      optional: "Si",
    },
  ];
  const [showAutoModal, setShowAutoModal] = useState(false);
  const itemsPerPage = 8; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(
    undefined
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
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const groups: Group[] = await getGroups();
      setGroups(groups);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleModal = () => {
    setShowAutoModal((modal) => !modal);
  };

  const handleDeleteModal = () => {
    setShowDeleteModal((modal) => !modal);
  };

  const confirmDeleteModal = async () => {
    await setShowDeleteModal(true);
  };

  const handleAddMedia = (group: Group) => {
    setSelectedGroup(group);
    setShowAutoModal(true);
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

                <th className="px-4 items-center text-sm whitespace-nowrap relative py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#292929]">
              {sortedGroups
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((group) => (
                  <tr key={group.id}>
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
                          <AiOutlineVideoCameraAdd
                            className="w-5 h-5"
                            onClick={() => handleAddMedia(group)}
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
      {showAutoModal && (
        <div className="absolute top-0 left-0 bg-black/80 w-full h-full p-64">
          <div className="py-2 bg-orange-500 w-full text-center relative">
            <h2 className="text-white">{`Gestion de codigos - ${selectedGroup?.name} - ${selectedGroup?.agencyName}`}</h2>
            <button
              onClick={handleToggleModal}
              className="absolute top-3 right-4"
            >
              <TfiClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex w-full h-full bg-white dark:bg-medium-gray flex-col">
            <div className="flex flex-row items-start justify-center px-6 h-full w-full">
              {/* Left Side */}
              <div className="w-2/5 p-6 flex flex-col justify-start gap-4 items-start">
               <GeneratedCodes codesTableContent={codesTableContent} />
              </div>
              {/* Center */}
              <div className="w-1/5 p-6 flex flex-col h-full bg-dark-gray justify-center items-center">
                <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                  <button className="button w-full">Exportar PDF</button>
                  <button className="button w-full">Exportar JPG</button>
                  <button className="button w-full">Enviar a Empresa</button>
                </div>
              </div>
              {/* Right Side */}
              <div className="w-2/5 p-6 flex flex-col justify-start items-start">
                <CodesGenerator selectedGroup={selectedGroup as Group} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal ? (
        <ConfirmDeleteModal
          toggleModal={handleDeleteModal}
          refresh={getGroups}
          selectedItem={selectedGroup}
          title="Eliminar Codigo"
          message={`¿Estás seguro que deseas eliminar ""? Recuerda que se perderán todos los datos y archivos.`}
          apiRoute="groups"
          toastMessage={`Grupo "" eliminado con éxito`}
        />
      ) : null}
    </div>
  );
};

export default CodesTable;
