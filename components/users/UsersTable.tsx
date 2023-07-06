import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { UserModal } from "./";
import { User } from "@prisma/client";
import {Pagination } from "@/components/ui/Pagination";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";

export const UsersTable = () => {
  const columnHeaders = [
    { key: "email", label: "Email" },
    { key: "password", label: "Contraseña" },
    { key: "name", label: "Nombre" },

  ];

  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 8; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
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

  const handleDeleteButton = async (user: any) => {
    await confirmDeleteModal();
    await setSelectedUser(user);
  };

  const handleEditButton = (user: any) => {
    setSelectedUser(user);
    setEditMode(true);
    handleEditUser(selectedUser);
  };

  const handleEditUser = async (selectedUser: User | null) => {
    setShowModal(true);
    const users = await axios.get("/api/users");

    const userObj = await users.data.find(
      (user: User) => user.id === selectedUser?.id
    );

    const userToEdit: User = userObj;
    return userToEdit;
  };

  const handleAddUser = () => {
    setEditMode(false);
    setSelectedUser(null);
    setShowModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilter({});
  };

 


  return (
    <div>
      <div className="flex flex-col">
        <div className="md:overflow-hidden border border-gray-200 dark:border-medium-gray">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-gray w-full">
              <tr className="">
                {columnHeaders.map(({ key, label }) => (
                  <th
                    key={key}
                    className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    {label}

                  </th>
                ))}

                <th className="px-4 items-center text-sm whitespace-nowrap py-3.5">
                  <button
                    className="dark:text-white text-black text-[12px] p-2 hover:bg-orange-500 transition duration-300
                        dark:bg-medium-gray dark:hover:bg-orange-500 hover:text-white bg-gray-200 font-semibold"
                    onClick={handleAddUser}
                  >
                    <span className="font-bold">+</span> Agregar
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#292929]">
              {users
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((user) => (
                  <tr
                    key={user.id}
                    draggable
                  
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap pointer-events-none">
                      <div className="inline-flex gap-x-3 pointer-events-none">
                        <div className="flex gap-x-2 pointer-events-none">
                          <div>
                            <h2 className="font-medium text-gray-800 dark:text-white pointer-events-none">
                              {user.email}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                      <h2 className="text-sm">*********</h2>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {user.name}
                    </td>
                    
                    <td className="flex justify-end px-4 items-center my-3 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-x-2 pr-4">
                        <button
                          className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 
                            hover:text-red-500 focus:outline-none"
                          onClick={() => handleDeleteButton(user)}
                        >
                          <AiOutlineDelete className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                          <AiOutlineEdit
                            className="w-5 h-5"
                            onClick={() => handleEditButton(user)}
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
      <div className="flex items-center justify-center w-full">
      <Pagination
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
      />
      </div>
      {showModal && 
        <UserModal
          userToEdit={editMode ? selectedUser : undefined}
          toggleModal={handleToggleModal}
          refresh={getUsers}
          
        />
}
      {showDeleteModal ? (
        <ConfirmDeleteModal
          toggleModal={handleDeleteModal}
          refresh={getUsers}
          selectedItem={selectedUser}
          title="Eliminar Grupo"
          message={`¿Estás seguro que deseas eliminar "${selectedUser?.email}"? Recuerda que se perderan todos los datos y archivos.`}
          apiRoute="users"
          toastMessage={`Grupo "${selectedUser?.email}" eliminado con éxito`}
        />
      ) : null}
    </div>
  );
};
