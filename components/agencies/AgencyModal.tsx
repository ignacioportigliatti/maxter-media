import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { FileUpload, Input } from "@/components/ui/form";
import { uploadGoogleStorageFile } from "@/utils";
import { Agency } from "@prisma/client";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface AgencyModalProps {
  toggleModal: () => void;
  handleEditAgency?: () => Promise<Agency>;
  refresh?: () => void;
  buttonText: string;
}

export const AgencyModal: React.FC<AgencyModalProps> = ({
  toggleModal,
  handleEditAgency,
  refresh,
  buttonText,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    logoSrc: "",
  });

  const [primaryColor, setPrimaryColor] = useState<string>("#000000");
  const [secondaryColor, setSecondaryColor] = useState<string>("#000000");
  const [accentColor, setAccentColor] = useState<string>("#000000");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    logoSrc: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
  });

  const [editMode, setEditMode] = useState(false);

  const checkEditMode = async () => {
    if (!handleEditAgency) {
      setEditMode(false);
      setFormData({
        name: "",
        location: "",
        phone: "",
        email: "",
        logoSrc: "",
        primaryColor: "",
        secondaryColor: "",
        accentColor: "",
      });
      return;
    }

    setEditMode(true);

    const agency: Agency = await handleEditAgency();

    if (agency) {
      try {
        setFormData({
          name: agency.name,
          location: agency.location,
          phone: agency.phone,
          email: agency.email,
          logoSrc: agency.logoSrc as string,
          primaryColor: agency.primaryColor as string,
          secondaryColor: agency.secondaryColor as string,
          accentColor: agency.accentColor as string,
        });
        setPrimaryColor(agency.primaryColor as string);
        setSecondaryColor(agency.secondaryColor as string);
        setAccentColor(agency.accentColor as string);
      } catch (error) {
        console.error("Error al obtener el grupo:", error);
        toast.error("Error al obtener el grupo");
      }
    } else {
      console.log("No se activó el modo edición");
      return;
    }
  };

  useEffect(() => {
    setEditMode(false);
    checkEditMode();
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = {
      name: formData.name.trim() === "" ? "El campo Empresa es requerido." : "",
      phone:
        formData.phone.trim() === "" ? "El campo Teléfono es requerido." : "",
      email:
        formData.email.trim() === ""
          ? "El campo Email es requerido."
          : !isValidEmail(formData.email.trim())
          ? "El campo Email debe tener un formato válido."
          : "",
      location:
        formData.location.trim() === ""
          ? "El campo Provincia es requerido."
          : "",
      logoSrc: !editMode && !selectedFile ? "El campo Logo es requerido." : "",
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    const agenciesList = await axios.get("/api/agencies");
    const agencies = agenciesList.data;

    const checkName = () => {
      if (agencies.some((agency: any) => agency.name === formData.name)) {
        toast.error("Ya existe una agencia con ese nombre", {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });
        return;
      }
    };

    try {
      const fileUpload = async () => {
        if (selectedFile) {
          try {
            console.log("Subiendo archivo...");
            const fileUpload = await handleFileUpload(selectedFile);
            return fileUpload;
          } catch (error) {
            console.error("Error al subir el archivo:", error);
          }
        } else {
          console.log("No se seleccionó ningún archivo");
        }
      };

      const filePath = await fileUpload();

      const getAPI = async () => {
        const updatedFormData = {
          ...formData,
          logoSrc: filePath,
          primaryColor,
          secondaryColor,
          accentColor,
        };
        if (editMode) {
          const response = await axios.post(
            "/api/edit-agency",
            updatedFormData
          );
          return response;
        } else {
          await checkName();
          const response = await axios.post("/api/new-agency", updatedFormData);

          return response;
        }
      };

      const response = await getAPI();

      console.log(response.data);
      const message = editMode ? `editada` : "agregada";
      if (response.data.success) {
        await toast.success(`Empresa ${message} con éxito!`, {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });

        setTimeout(() => {
          toggleModal();
          if (refresh) {
            refresh();
          }
        }, 3000);
      } else if (response.data.error) {
        toast.error(response.data.error, {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error al crear el grupo:", error);
    }
  };

  const maxSize = 0.2 * 1024 * 1024;
  const maxWidth = 128;
  const maxHeight = 128;

  const requiredFile = editMode ? true : false;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedFile = event.target.files?.[0];
    if (updatedFile) {
      const allowedFormats = ["image/jpeg", "image/png"];
      const fileSize = updatedFile.size;

      if (fileSize > maxSize) {
        toast.error("El archivo excede el tamaño máximo permitido", {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });
        return;
      }

      const image = new Image();
      image.src = URL.createObjectURL(updatedFile);

      image.onload = () => {
        URL.revokeObjectURL(image.src);

        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;

        if (imageWidth > maxWidth || imageHeight > maxHeight) {
          toast.error(
            "La resolución de la imagen excede los límites permitidos",
            {
              position: "top-right",
              theme: "dark",
              containerId: "toast-container",
              autoClose: 3000,
            }
          );
          return;
        }

        setSelectedFile(updatedFile);
      };

      if (!allowedFormats.includes(updatedFile.type)) {
        toast.error("Formato de archivo no admitido", {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });
        return;
      }
    }
  };

  const fileName = selectedFile?.name || "";

  const handleFileUpload = async (file: File) => {
    try {
      const filePath = await uploadGoogleStorageFile(
        file,
        "agency-logos",
        "maxter-app",
        true
      );

      return filePath;
    } catch (error) {
      console.error("Error al subir el archivo:", error);
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
          <div className="py-2 bg-orange-500 w-full text-center relative">
            <h2 className="text-white">
              {editMode ? "Editar empresa" : "Agregar nueva empresa"}
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
                    id="empresa"
                    label="Empresa"
                    type="input"
                    required
                    value={formData.name}
                    onChange={(event) => handleInputChange(event, "name")}
                    error={formErrors.name}
                  />
                </div>

                <div>
                  <Input
                    id="telefono"
                    label="Telefono"
                    type="input"
                    value={formData.phone}
                    onChange={(event) => handleInputChange(event, "phone")}
                    error={formErrors.phone}
                  />
                </div>

                <div>
                  <Input
                    id="email"
                    label="Email"
                    type="input"
                    value={formData.email}
                    onChange={(event) => handleInputChange(event, "email")}
                    required
                    error={formErrors.email}
                  />
                </div>

                <div>
                  <Input
                    id="provincia"
                    label="Provincia"
                    type="input"
                    value={formData.location}
                    onChange={(event) => handleInputChange(event, "location")}
                    required
                    error={formErrors.location}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 pt-5 gap-4">
                <FileUpload
                  label="Logo"
                  id="logo"
                  description="Sube el logo de la empresa."
                  buttonText="Subir logo"
                  handleFileChange={handleFileChange}
                  fileName={fileName}
                  error={formErrors.logoSrc}
                  required={requiredFile}
                />
                <div className="grid grid-cols-3">
                  <div className="flex flex-col justify-center items-center">
                    <label
                      className="text-left text-sm w-full pl-4 pb-1"
                      key="primary-color"
                    >
                      Color primario
                    </label>
                    <HexColorPicker
                      className="!max-w-[150px] !rounded-b-none max-h-32"
                      color={primaryColor}
                      onChange={setPrimaryColor}
                    />
                    <HexColorInput
                      className="w-[150px] text-center"
                      color={primaryColor}
                      onChange={setPrimaryColor}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <label
                      className="text-left text-sm w-full pl-4 pb-1"
                      key="primary-color"
                    >
                      Color secundario
                    </label>
                    <HexColorPicker
                      className="!max-w-[150px] !rounded-b-none max-h-32"
                      color={secondaryColor}
                      onChange={setSecondaryColor}
                    />
                    <HexColorInput
                      className="w-[150px] text-center"
                      color={secondaryColor}
                      onChange={setSecondaryColor}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <label
                      className="text-left text-sm w-full pl-4 pb-1"
                      key="primary-color"
                    >
                      Color de acento
                    </label>
                    <HexColorPicker
                      className="!max-w-[150px] !rounded-b-none max-h-32"
                      color={accentColor}
                      onChange={setAccentColor}
                    />
                    <HexColorInput
                      className="w-[150px] text-center"
                      color={accentColor}
                      onChange={setAccentColor}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto">
                  <button
                    className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                    type="submit"
                  >
                    {buttonText}
                  </button>
                  <button
                    className="p-1 button !text-white text-center !bg-red-700 hover:!bg-red-500"
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

      <ToastContainer />
    </div>
  );
};
