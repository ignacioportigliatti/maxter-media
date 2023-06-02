"use client";

import {
  FileUpload,
  FolderUpload,
  Select,
  TextArea,
} from "@/app/components/ui/form";
import axios from "axios";
import { Agency, Group } from "@prisma/client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface UploadFormProps {
  editMode: boolean;
  groupToEdit?: Group | null;
  getGroups?: () => void;
  uploadFormat?: string;
}

export const UploadForm = (props: UploadFormProps) => {
  const { editMode, groupToEdit, uploadFormat } = props;
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | undefined>(
    undefined
  );
  const [editableAgency, setEditableAgency] = useState<Agency | undefined>(
    undefined
  ); //
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(true);

  const [formErrors, setFormErrors] = useState({
    agency: "",
    group: "",
    observations: "",
    folderPath: "",
  });

  const [formData, setFormData] = useState({
    agencyName: "",
    agencyId: "",
    group: "",
    observations: "",
    folderPath: "",
  });

  const requiredFile = true;

  const getEditData = async () => {
    if (editMode === true) {
      try {
        const agency = agencies.find(
          (agency) => agency.id === groupToEdit?.agencyId
        );

        setSelectedAgency(agency);

        setSelectedGroup(groupToEdit || undefined);

        setFormData({
          agencyName: agency?.name || "",
          agencyId: agency?.id || "",
          group: groupToEdit?.id || "",
          observations: formData.observations || "",
          folderPath: formData.folderPath || "",
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setSelectedAgency(agencies[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agencies = await axios.get("/api/agencies");
        setAgencies(agencies.data);
        const groups = await axios.get("/api/groups");
        setGroups(groups.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingAgencies(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoadingAgencies && editMode) {
      getEditData();
    }
  }, [isLoadingAgencies]);

  useEffect(() => {
    if (selectedAgency) {
      getGroups(selectedAgency);
    }
  }, [selectedAgency]);

  const getGroups = async (agency: Agency) => {
    try {
      const groups = await axios.get("/api/groups");
      const filteredGroups = groups.data.filter((group: Group) =>
        agency.groupIds.includes(group.id)
      );
      setGroups(filteredGroups);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = async () => {};

  const fileName = selectedFile?.name || "";

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  const handleAgencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAgencyId = event.target.value;
    const agency = agencies.find((agency) => agency.id === selectedAgencyId);
    setSelectedAgency(agency);
    setFormData({ ...formData, agencyId: selectedAgencyId });
    setFormErrors({ ...formErrors, agency: "" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check for errors
    const errors = {
      group: formData.group.trim() === "" ? "Debes seleccionar un grupo" : "",
      folderPath: fileName.trim() === "" ? "Debes cargar el material" : "",
      agency:
        formData.agencyId.trim() === "" ? "Debes seleccionar una empresa" : "",
      observations: "",
    };

    setFormErrors(errors);
  };

  return (
    <div className="fade-in animate-in duration-700">
      <section className="p-6 ">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Select
              id="empresas"
              label="Empresa"
              options={agencies}
              value={selectedAgency?.id || ""}
              onChange={handleAgencyChange}
              error={formErrors.agency}
              selectedItem={editMode ? selectedAgency : undefined}
              defaultOption="Selecciona una empresa"
              disabled={editMode ? true : false}
            />

            <Select
              id="grupo"
              label="Grupo/Master"
              options={groups}
              value={formData.group}
              onChange={(event) => handleInputChange(event, "group")}
              error={formErrors.group}
              disabled={editMode ? true : false}
              selectedItem={editMode ? selectedGroup : undefined}
            />
          </div>
          <div className="grid grid-cols-1 mt-2 gap-2">
            <TextArea id="observaciones" label="Observaciones" />
            {uploadFormat === "video" ? (
              <FileUpload
                label="Videos"
                id="videos"
                description="Arrastra o sube los videos de las actividades del grupo"
                buttonText="Subir archivos"
                handleFileChange={handleFileChange}
                fileName={fileName}
                error={formErrors.folderPath}
                required={requiredFile}
              />
            ) : (
              <FolderUpload
                label="Fotos"
                id="logo"
                description="Arrastra o sube la carpeta del grupo con las fotos de las actividades"
                buttonText="Subir carpeta"
                handleFolderChange={handleFileChange}
                folderName={fileName}
                error={formErrors.folderPath}
                required={requiredFile}
              />
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              id="submit"
              className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 focus:outline-none focus:bg-gray-600"
            >
              {editMode ? "Editar" : "Añadir"}
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </div>
  );
};
