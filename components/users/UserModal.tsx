'use client'

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { User } from "@prisma/client";
import { Input } from "@/components/ui/form";


interface UserModalProps {
  toggleModal: () => void;
  userToEdit?: User | null;
  refresh?: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  toggleModal,
  userToEdit,
  refresh,
}) => {
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [editMode, setEditMode] = useState(false);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const checkEditMode = async () => {
    if (!userToEdit) {
      setFormData({
        email: "",
        password: "",
      });
      return;
    }
    setEditMode(true);

    try {
      setFormData({
        email: userToEdit.email,
        password: userToEdit.password,
      });
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      toast.error("Error al obtener el usuario");
    }
  };

  useEffect(() => {
    setEditMode(false);
    checkEditMode();
  }, []);

  const checkName = async () => {
    const users = await getUsers();
    return users.some(
      (user: any) =>
        user.email === formData.email && user.email !== userToEdit?.email
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = {
      email: formData.email.trim() === "" ? "El campo email es requerido." : "",
      password:
        formData.password.trim() === ""
          ? "El campo password es requerido."
          : "",
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    try {
      const nameExists = await checkName();

      if (nameExists && formData.email !== userToEdit?.email) {
        toast.error("Ya existe un usuario con ese nombre");
        return;
      }

      const getResponseFromAPI = async () => {
        if (editMode) {
          const response = await axios.post("/api/users/edit", formData);
          return response;
        } else {
          await checkName();
          const response = await axios.post("/api/users/add", formData);
          return response;
        }
      };

      const response = await getResponseFromAPI();

      if (response.data.success) {
        if (editMode) {
          toast.success(`${formData.email} editado con éxito!`);
        } else {
          toast.success(`${formData.email} agregado con éxito!`);
        }

        setTimeout(async () => {
          toggleModal();
          if (refresh) {
            await refresh();
          }
        }, 3000);
      } else if (response.data.error) {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  return (
    <div>
    
      <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
        <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-dark-gray w-[50%]">
          <div className="py-2 bg-red-600 w-full text-center relative">
            <h2 className="text-white">
              {editMode ? "Editar Grupo" : "Añadir Grupo"}
            </h2>
            <button onClick={toggleModal} className="absolute top-3 right-4">
              <TfiClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="w-full px-7 flex flex-col justify-center">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4 mx-auto">
                <div>
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => handleInputChange(event, "email")}
                    error={formErrors.email}
                  />
                </div>

                <div>
                  <Input
                    id="password"
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={(event) => handleInputChange(event, "password")}
                    error={formErrors.password}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 pt-5 gap-4">
                <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto ">
                  <button
                    className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                    type="submit"
                  >
                    {editMode ? "Editar" : "Agregar"} Usuario
                  </button>
                  <button
                    className="p-1 button !text-white text-center !bg-red-700 hover:!bg-red-600"
                    onClick={toggleModal}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
