"use client";

import React, { useState } from "react";
import { formatBytes } from "@/utils";
import { AiOutlineDelete, AiOutlineFileAdd } from "react-icons/ai";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";

interface UploadAutoVideoProps {
  dataToUpload: any;
  editMode?: boolean;
  toggleModal: any;
}

export const UploadAutoVideo: React.FC<UploadAutoVideoProps> = ({
  dataToUpload,
  editMode,
  toggleModal,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<any>(dataToUpload.group);
  const [filesToUpload, setFilesToUpload] = useState<File[]>(
    dataToUpload.files
  );

  const [formData, setFormData] = useState<any>({
    group: "",
    files: [],
    uploadType: "",
  }); // Inicializar el objeto FormData
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const filesArray = Array.from(fileList);
      const filteredFiles = filesArray.filter(
        (file: File) => file.type === "video/mp4"
      );
      console.log("filteredFiles", filteredFiles);
      setFilesToUpload(filteredFiles);
      if (filesArray.length !== filteredFiles.length) {
        toast.error("Solo se permiten archivos de video mp4");
      }
    }
  };

  const uploadFile = async () => {
    const file = filesToUpload[0];
    const formData = new FormData();
    formData.append("archivo", file);
    const accessToken = process.env.GCLOUD_API_ACCESS_TOKEN;
    console.log("accessToken", accessToken);
    const uploadOptions = {
      autoClose: false as false, // No cerrar automáticamente el toast
    };
  
    const uploadToastId = toast.info("Subiendo archivo...", uploadOptions); // Obtener el ID del toast
  
    try {
      const response: AxiosResponse = await axios.post(
        `https://www.googleapis.com/upload/storage/v1/b/maxter-media/o?uploadType=media&name=${selectedGroup.name}/${file.name}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${process.env.NEXT_PUBLIC_GCLOUD_API_ACCESS_TOKEN}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / file.size) * 100
            );
            toast.update(uploadToastId, {
              render: `Subiendo archivo (${progress}%)...`, // Actualizar el contenido del toast con el porcentaje de carga
            });
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Archivo subido exitosamente", response);
        toast.success("Archivo subido exitosamente"); // Mostrar toast de éxito
      } else {
        console.error("Error al subir el archivo:", response.data);
        toast.error("Error al subir el archivo"); // Mostrar toast de error
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al subir el archivo"); // Mostrar toast de error
    } finally {
      toast.dismiss(uploadToastId); // Cerrar el toast de carga una vez que la carga se complete o ocurra un error
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isSubmitting) {
        return; // Evitar envío de solicitudes múltiples
      }

      if (filesToUpload.length === 0) {
        toast.error("Selecciona al menos un archivo de video");
        return;
      }

      setIsSubmitting(true); // Marcar la solicitud en progreso
      await uploadFile();

      const formData = new FormData();

      {
        /* Generate Upload File function */
      }

      const response = await fetch("/api/upload/", {
        method: "POST",
        body: formData,
      });

      // Manejar la respuesta de la API según tus necesidades
      if (response.ok) {
        toast.success("Archivo subido exitosamente");
        console.log("response", response.json());
        toggleModal();
      } else {
        throw new Error("Error al subir el archivo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar el(s) video(s) a la cola de reproducción");
    } finally {
      setIsSubmitting(false); // Marcar la solicitud como finalizada
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row items-center justify-center p-6 w-full">
          <h2 className="text-sm font-semibold p-5">
            ¿Deseas agregar en cola los siguientes videos en el grupo{" "}
            {selectedGroup.name} de la empresa {selectedGroup.agencyName}?
          </h2>
          <div className="w-full border-2 p-5 flex flex-col justify-center items-center">
            <div>
              {filesToUpload.map((file: File) => (
                <div
                  key={file.name}
                  className="flex justify-between items-center w-full"
                >
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-sm font-semibold">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  <div>
                    <button
                      className="text-light-gray hover:text-orange-500 ml-1 mt-[6px] themeTransition font-semibold text-sm"
                      onClick={() =>
                        setFilesToUpload((prevFiles) =>
                          prevFiles.filter((f: File) => f.name !== file.name)
                        )
                      }
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {/* Add File Button */}
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="fileInput">
                <AiOutlineFileAdd className="w-8 h-8 mt-2 p-[6px] text-light-gray border border-light-gray hover:border-white hover:bg-orange-500 hover:text-white cursor-pointer rounded-full themeTransition" />
              </label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto">
          <button
            className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
            type="submit"
            disabled={isSubmitting} // Deshabilitar el botón mientras la solicitud está en progreso
          >
            {isSubmitting ? "Agregando..." : "Añadir material"}
          </button>
          <button
            className="p-1 button !text-white text-center !bg-red-700 hover:!bg-red-500"
            onClick={toggleModal}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadAutoVideo;