import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { FileUpload, Input } from "@/app/components/ui";

interface NewAgencyModalProps {
  toggleModal: () => void;
}

const NewAgencyModal: React.FC<NewAgencyModalProps> = ({ toggleModal }) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    logoSrc: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación de campos requeridos
    const errors = {
      name: formData.name.trim() === "" ? "El campo Empresa es requerido." : "",
      phone:
        formData.phone.trim() === "" ? "El campo Teléfono es requerido." : "",
      email: formData.email.trim() === "" ? "El campo Email es requerido." : "",
      location:
        formData.location.trim() === ""
          ? "El campo Provincia es requerido."
          : "",
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    const agenciesList = await axios.get("/api/agencies");
    const agencies = agenciesList.data;

    if (agencies.some((agency: any) => agency.name === formData.name)) {
      toast.error("Ya existe una agencia con ese nombre", {
        position: "top-right",
        theme: "dark",
        containerId: "toast-container",
        autoClose: 3000,
      });
      return;
    }

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
      const response = await axios.post("/api/new-agency", {
        ...formData,
        logoSrc: filePath,
      });

      // Maneja la respuesta del backend según corresponda
      console.log(response.data);

      if (response.data.success) {
        await toast.success(`${formData.name} agregada con éxito!`, {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });

        setTimeout(() => {
          window.location.reload();
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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedFile = event.target.files?.[0];
    if (updatedFile) {
      const allowedFormats = ["image/jpeg", "image/png"]; // Lista de formatos admitidos
      if (allowedFormats.includes(updatedFile.type)) {
        setSelectedFile(updatedFile);
      } else {
        toast.error("Formato de archivo no admitido", {
          position: "top-right",
          theme: "dark",
          containerId: "toast-container",
          autoClose: 3000,
        });
      }
    }
  };
  

  const fileName = selectedFile?.name || "";

  const handleFileUpload = async (file: File) => {
    // Generar el nombre de archivo único utilizando la fecha y hora actual
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;

    // Subir el archivo a la carpeta public/uploads
    try {
      const fileFormData = new FormData();
      fileFormData.append("file", file, fileName);

      const response = await axios.post("/api/upload", fileFormData);
      // Manejar la respuesta del API de carga según sea necesario
      console.log(response.data);

      if (response.data.success) {
        const filePath = await response.data.filePath;
        console.log(`Archivo subido con éxito! filePath: ${filePath}`);
        setFormData({ ...formData, logoSrc: filePath });
        return filePath;
        console.log(`Archivo subido con éxito! filePath: ${formData.logoSrc}`);
        console.log(`Archivo subido con éxito! filePath: ${formData.logoSrc}`);
      }
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
            <h2 className="text-white">Añadir nueva empresa</h2>
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
                />

                <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto ">
                  <button
                    className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                    type="submit"
                  >
                    Agregar Empresa
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

export default NewAgencyModal;
