import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { Agency, Group } from "@prisma/client";
import { Input, Select, MasterInput } from "@/components/ui/form";

interface GroupModalProps {
  toggleModal: () => void;
  groupToEdit?: Group | null;
  refresh?: () => void;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  toggleModal,
  groupToEdit,
  refresh,
}) => {
  const [formErrors, setFormErrors] = useState({
    name: "",
    coordinator: "",
    school: "",
    entry: "",
    exit: "",
    agency: "",
  });

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    agencyId: "",
    agencyName: "",
    coordinator: "",
    school: "",
    entry: "",
    exit: "",
  });

  const [agencies, setAgencies] = useState([] as Agency[]);
  const [selectedAgency, setSelectedAgency] = useState({} as Agency);

  useEffect(() => {
    try {
      axios
        .get("/api/agencies")
        .then((response) => {
          setAgencies(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("Error al obtener las agencias:", error);
    }
  }, []);

  const [editMode, setEditMode] = useState(false);

  const getGroups = async () => {
    try {
      const response = await axios.get("/api/groups");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const checkEditMode = async () => {
    if (!groupToEdit) {
      setFormData({
        id: "",
        name: "",
        agencyId: "",
        agencyName: "",
        coordinator: "",
        school: "",
        entry: "",
        exit: "",
      });
      return;
    }
    setEditMode(true);

    try {
      setFormData({
        id: groupToEdit.id,
        name: groupToEdit.name,
        agencyId: groupToEdit.agencyId as string,
        agencyName: groupToEdit.agencyName as string,
        coordinator: groupToEdit.coordinator,
        school: groupToEdit.school,
        entry: groupToEdit.entry,
        exit: groupToEdit.exit,
      });

      const agencies = await axios.get("/api/agencies");
      const agencyObj = await agencies.data.find(
        (agency: Agency) => agency.id === groupToEdit.agencyId
      );
      setSelectedAgency(agencyObj);
    } catch (error) {
      console.error("Error al obtener el grupo:", error);
      toast.error("Error al obtener el grupo");
    }
  };

  useEffect(() => {
    setEditMode(false);
    checkEditMode();
  }, []);

  const checkName = async () => {
    const groups = await getGroups();
    return groups.some(
      (group: any) =>
        group.name === formData.name && group.name !== groupToEdit?.name
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = {
      name:
        formData.name.trim() === ""
          ? "El campo Grupo/Master es requerido."
          : "",
      coordinator:
        formData.coordinator.trim() === ""
          ? "El campo Coordinador es requerido."
          : "",
      school:
        formData.school.trim() === "" ? "El campo Escuela es requerido." : "",
      entry:
        formData.entry.trim() === "" ? "El campo Entrada es requerido." : "",
      exit: formData.exit.trim() === "" ? "El campo Salida es requerido." : "",
      agency: selectedAgency.id === "" ? "Debes seleccionar una agencia." : "",
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    if (formData.entry > formData.exit) {
      toast.error(
        "El dia de entrada no puede ser despues que el dia de salida."
      );
      return;
    }

    try {
      const nameExists = await checkName();

      if (nameExists && formData.name !== groupToEdit?.name) {
        toast.error("Ya existe un grupo con ese nombre");
        return;
      }

      const updatedFormData = {
        ...formData,
        agencyId: selectedAgency.id,
        agencyName: selectedAgency.name,
      };

      const getResponseFromAPI = async () => {
        if (editMode) {
          const response = await axios.post(
            "/api/groups/edit",
            updatedFormData
          );
          return response;
        } else {
          await checkName();
          const response = await axios.post("/api/groups/add", updatedFormData);

          return response;
        }
      };

      const response = await getResponseFromAPI();

      if (response.data.success) {
        if (editMode) {
          toast.success(`${updatedFormData.name} editado con éxito!`);
        } else {
          toast.success(`${updatedFormData.name} agregado con éxito!`);
        }

        if (refresh) {
          refresh();
          toggleModal();
        }
      } else if (response.data.error) {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error al crear el grupo:", error);
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
        <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[50%]">
          <div className="py-4 bg-medi-gray flex flex-row w-full justify-between px-4 text-white text-center rounded-t-lg">
            <h2 className="text-lg uppercase font-light">
              {`${
                editMode
                  ? `Editar ${formData?.name} - ${
                      groupToEdit?.agencyName ? selectedAgency.name : ""
                    }`
                  : "Agregar Grupo"
              }`}
            </h2>
            <button onClick={toggleModal} className="absolute top-3 right-4">
              <TfiClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="w-full px-7 flex flex-col justify-center">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4 mx-auto">
                <div>
                  {!editMode ? (
                    <MasterInput
                      id="name"
                      label="Grupo/Master"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) => handleInputChange(event, "name")}
                      error={formErrors.name}
                    />
                  ) : (
                    <Input
                      id="name"
                      label="Grupo/Master"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) => handleInputChange(event, "name")}
                      error={formErrors.name}
                    />
                  )}
                </div>
                <div>
                  <Select
                    options={agencies.map((agency) => ({
                      ...agency,
                    }))}
                    label="Empresa"
                    id="empresa"
                    onChange={(selectedOption) => {
                      const selectedAgency = agencies.find(
                        (agency) => agency.id === selectedOption.target.value
                      );

                      if (selectedAgency) {
                        setSelectedAgency({
                          ...selectedAgency,
                          id: selectedOption.target.value,
                        });
                      }
                    }}
                    value={selectedAgency.id}
                    error={formErrors.agency}
                  />
                </div>
                <div>
                  <Input
                    id="coordinador"
                    label="Coordinador"
                    type="text"
                    value={formData.coordinator}
                    onChange={(event) =>
                      handleInputChange(event, "coordinator")
                    }
                    error={formErrors.coordinator}
                  />
                </div>
                <div>
                  <Input
                    id="escuela"
                    label="Escuela"
                    type="text"
                    value={formData.school}
                    onChange={(event) => handleInputChange(event, "school")}
                    error={formErrors.school}
                  />
                </div>
                <div>
                  <Input
                    id="entrada"
                    label="Entrada"
                    type="date"
                    value={formData.entry}
                    onChange={(event) => handleInputChange(event, "entry")}
                    error={formErrors.entry}
                  />
                </div>
                <div>
                  <Input
                    id="salida"
                    label="Salida"
                    type="date"
                    value={formData.exit}
                    onChange={(event) => handleInputChange(event, "exit")}
                    error={formErrors.exit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 pt-5 gap-4">
                <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto ">
                  <button
                    className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                    type="submit"
                  >
                    {editMode ? "Editar" : "Agregar"} Grupo
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
