'use client'

import { FileUpload, FolderUpload, Select, TextArea } from "@/app/components/ui/form";
import axios from "axios";
import { Agency, Group } from "@prisma/client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export const PhotoForm = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [formErrors, setFormErrors] = useState({
    agency: "",
    group: "",
    observations: "",
    folderPath: "",
  });

  const [formData, setFormData] = useState({
    agency: "",
    group: "",
    observations: "",
    folderPath: "",
  });

  const maxSize = 1 * 1024 * 1024;
  const maxWidth = 11280;
  const maxHeight = 11128;
  const requiredFile = true; 

  useEffect(() => {
    getAgencies();
  }, []);

  useEffect(() => {
    if (selectedAgency) {
      getGroups(selectedAgency);
    }
  }, [selectedAgency]);

  const getAgencies = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/agencies");
      setAgencies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGroups = async (agency: Agency) => {
    try {
      const groups = await axios.get("http://localhost:3000/api/groups");
      const filteredGroups = groups.data.filter((group: Group) =>
        agency.groupIds.includes(group.id)
      );
      setGroups(filteredGroups);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFolderChange = async (
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

  const folderName = selectedFile?.name || "";

  const handleFileUpload = async (file: File) => {
    const timestamp = new Date().getTime();
    const folderName = `${timestamp}_${selectedGroup?.name}`;

    try {
      const fileFormData = new FormData();
      fileFormData.append("file", file, folderName);
      fileFormData.append("folder", `photos/${formData.agency}/${formData.group}`);

      const response = await axios.post("/api/upload", fileFormData);
      console.log(response.data);

      if (response.data.success) {
        const folderPath = await response.data.folderPath;
        console.log(`Archivo subido con éxito! folderPath: ${folderPath}`);
        setFormData({ ...formData, folderPath: folderPath });
        return folderPath;
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

  const handleAgencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAgencyId = event.target.value;
    const agency =
      agencies.find((agency) => agency.id === selectedAgencyId) || null;
    setSelectedAgency(agency);
    setFormData({ ...formData, agency: selectedAgencyId });
    setFormErrors({ ...formErrors, agency: "" });
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check for errors
    const errors = {
      group: formData.group.trim() === "" ? "Debes seleccionar un grupo" : "",
      folderPath: folderName.trim() === "" ? "Debes cargar el material" : "",
      agency: formData.agency.trim() === "" ? "Debes seleccionar una empresa" : "",
      observations: ""
    };

    setFormErrors(errors);
    console.log(formData)
    
    
  }

  return (
    <div className="fade-in animate-in duration-700">
      <section className="p-6 shadow-md">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Select
              id="empresas"
              label="Empresa"
              options={agencies}
              value={selectedAgency?.id || ""}
              onChange={handleAgencyChange}
              error={formErrors.agency}
            />
            <Select 
            id="grupo" 
            label="Grupo/Master" 
            options={groups} 
            value={formData.group}
            onChange={(event) => handleInputChange(event, "group")}
            error={formErrors.group}
            />
          </div>
          <div className="grid grid-cols-1 mt-2 gap-2">
            <TextArea id="observaciones" label="Observaciones" />
            <FolderUpload
                  label="Fotos"
                  id="logo"
                  description="Arrastra o sube la carpeta del grupo con las fotos de las actividades"
                  buttonText="Subir carpeta"
                  handleFolderChange={handleFolderChange}
                  folderName={folderName}
                  error={formErrors.folderPath}
                  required={requiredFile}
                />
          </div>

          <div className="flex justify-end mt-6">
            <button id="submit" className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 focus:outline-none focus:bg-gray-600">
              Subir Archivos
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </div>
  );
};
