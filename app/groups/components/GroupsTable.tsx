import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import NewGroupModal from "./NewGroupModal";
import Pagination from "@/app/components/Pagination";

interface GroupsTableProps {
  groups: string[];
  agencies: string[];
  coordinators: string[];
  schools: string[];
  entries: string[];
  exits: string[];
  ids: string[];
}

export const GroupsTable = ({
  groups,
  agencies,
  coordinators,
  schools,
  entries,
  exits,
  ids,
}: GroupsTableProps) => {
  const [showModal, setShowModal] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 6; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleModal = () => {
    setShowModal((modal) => !modal);
    setSortColumn("");
    setSortOrder("asc");
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      const response = await axios.delete(`/api/groups?id=${id}`);
      console.log(response);

      if (response.data.success) {
        toast.success("El grupo fue eliminado exitosamente", {
          theme: "dark",
          autoClose: 3000,
        });
        console.log("El grupo fue eliminado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (response.data.error) {
        toast.error(response.data.error);
        console.error("Error al eliminar el grupo:", response.status);
      }
    } catch (error) {
      console.error("Error al eliminar el grupo:", error);
      toast.error("Ocurrió un error al eliminar el grupo");
    }
  };

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sortedGroups = [...groups];

  if (sortColumn === "group") {
    sortedGroups.sort((a, b) => (sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)));
  } else if (sortColumn === "agency") {
    sortedGroups.sort((a, b) => {
      const indexA = groups.indexOf(a);
      const indexB = groups.indexOf(b);
      const agencyA = agencies[indexA];
      const agencyB = agencies[indexB];
      return sortOrder === "asc"
        ? agencyA.localeCompare(agencyB)
        : agencyB.localeCompare(agencyA);
    });
  }

  const displayedGroups = sortedGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center gap-x-3"></div>

      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-medium-gray">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-dark-gray">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer"
                      onClick={() => handleSort("group")}
                    >
                      <div className="flex items-center gap-x-3">
                        <span>Grupo/Master</span>
                        {sortColumn === "group" && (
                          <span className="text-xs">{sortOrder === "asc" ? "▲" : "▼"}</span>
                        )}
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer"
                      onClick={() => handleSort("agency")}
                    >
                      <button className="flex items-center gap-x-2">
                        <span>Empresa</span>
                        {sortColumn === "agency" && (
                          <span className="text-xs">{sortOrder === "asc" ? "▲" : "▼"}</span>
                        )}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Coordinador
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Escuela
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Entrada
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Salida
                    </th>

                    <th className="flex justify-end px-4 items-center text-sm whitespace-nowrap relative py-3.5">
                      <button
                        onClick={handleToggleModal}
                        className="dark:text-white text-black text-[12px] p-2 hover:bg-orange-500 transition duration-300 dark:bg-medium-gray dark:hover:bg-orange-500 bg-gray-200 font-semibold"
                      >
                        + Agregar nuevo
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#292929]">
                  {displayedGroups.map((group, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <div className="flex items-center gap-x-2">
                            <div>
                              <h2 className="font-medium text-gray-800 dark:text-white">{group}</h2>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                        <h2 className="text-sm">{agencies[index]}</h2>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {coordinators[index]}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {schools[index]}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {entries[index]}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {exits[index]}
                      </td>
                      <td className="flex justify-end px-4 items-center my-3 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-2 pr-4">
                          <button
                            className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                            onClick={() => handleDeleteGroup(ids[index])}
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

      <Pagination
        totalItems={groups.length}
        itemsPerPage={itemsPerPage}
        
        handlePageChange={handlePageChange}
      />



      {/* Add Modal */}
      {showModal && <NewGroupModal toggleModal={handleToggleModal} />}
    </div>
  );
};

export default GroupsTable;
