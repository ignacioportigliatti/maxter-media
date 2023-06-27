"use client";

import React, { useState, useContext, useEffect } from "react";
import { AiOutlineDelete, AiOutlineFileAdd } from "react-icons/ai";
import { toast } from "react-toastify";
import { formatBytes, getGoogleStorageFiles, uploadGoogleStorageFile, deleteGoogleStorageFile } from "@/utils";
import { Group } from "@prisma/client";


import { VideoUploadContext } from "./VideoUploadContext";


interface VideoUploadProps {
  dataToUpload: {
    group: Group;
    files: File[];
  };
  isDragging?: boolean;
  toggleModal: any;
}

type fileData = {
  name: string;
  size: number;
};

export const VideoUpload: React.FC<VideoUploadProps> = ({
  dataToUpload,
  toggleModal,
  isDragging,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const selectedGroup = dataToUpload.group;
  const [uploadedFiles, setUploadedFiles] = useState<fileData[]>([
    { name: "", size: 0 },
  ]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>(dataToUpload.files);
  const { uploadQueue, addToUploadQueue, deleteFromUploadQueue } = useContext(VideoUploadContext);

  const checkFiles = async () => {
    const files = await getGoogleStorageFiles(
      "maxter-media",
      `media/${dataToUpload.group.name}/videos`
    );
    if (files !== undefined && files.length > 0) {
      setUploadedFiles(files);
    }
    return files;
  };

  useEffect(() => {
    setIsLoading(true);
    const uploadedFiles = checkFiles()
      .then (() => setIsLoading(false));
    
    if (isDragging === true) {
      setFilesToUpload(dataToUpload.files);
    } else {
      setFilesToUpload([]);
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    try {
      if (fileList && fileList.length > 0) {
        const filesArray = Array.from(fileList);
        const filteredFiles = filesArray.filter(
          (file: File) => file.type === "video/mp4"
        );
  
        filteredFiles.forEach((file) => {
          const fileNameExists = filesToUpload.some(
            (uploadedFile) => uploadedFile.name === file.name
          );
          if (fileNameExists) {
            toast.error(`El archivo "${file.name}" ya está en la lista.`);
          } else {
            setFilesToUpload((prevFiles) => [...prevFiles, file]);
          }
        });
  
        if (filesArray.length !== filteredFiles.length) {
          toast.error("Solo se permiten archivos de video .mp4");
        }
      }
    } catch (error) {
      toast.error("Error al cargar los archivos");
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
      console.log("uploadQueue", uploadQueue);
  
      const updatedTransferQueue = filesToUpload.map((file: File) => {
        uploadQueue.push([
          file,
          {
            groupId: selectedGroup.id,
            groupName: selectedGroup.name,
            agencyName: selectedGroup.agencyName as string,
            fileName: file.name,
          },
        ]);
  
        return uploadQueue;
      });
  
      if (updatedTransferQueue.length > 0) {
        toggleModal();
        toast.success("Archivo(s) agregado(s) a la cola de reproducción");
        setIsSubmitting(false); // Marcar la solicitud como finalizada
      }
  
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar el(s) video(s) a la cola de reproducción");
      setIsSubmitting(false); // Marcar la solicitud como finalizada en caso de error
    }
  };
  

  const handleDelete = async (fileName: string, videoId: string) => {
    try {
      await deleteGoogleStorageFile(
        fileName,
        `media%2F${selectedGroup.name}%2Fvideos`,
        "maxter-media"
      );

      const response = await fetch(
        `/api/upload/videos?groupId=${selectedGroup.id}&videoId=${videoId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success("Archivo eliminado");
        const updatedFiles = await checkFiles();
        if ( !updatedFiles) {
          setUploadedFiles([{ name: "", size: 0 }]);
        } else {
          setIsLoading(true);
          setUploadedFiles(updatedFiles);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VideoUploadContext.Provider value={{uploadQueue, addToUploadQueue, deleteFromUploadQueue}}>
    <div className="flex flex-col">
      <div className="flex justify-end">
        {/* Add File Button */}
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileInput"
          className="flex py-1 cursor-pointer hover:text-orange-500 flex-row items-center justify-center gap-1"
        >
          <p className="text-xs ">{`Añadir Videos a ${dataToUpload.group.name}`}</p>
          <span>
            <AiOutlineFileAdd className="w-7 h-7 p-1 text-right  text-light-gray hover:border-white hover:bg-orange-500 hover:text-white cursor-pointer themeTransition" />
          </span>
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row items-start justify-center p-3 border w-full">
          <div className="w-1/2 p-1 flex flex-col justify-center">
            <div>
              <h4 className="text-sm">Archivos Subidos:</h4>
              {isLoading ? <p className="text-xs">Cargando...</p> 
              : 
              uploadedFiles[0].name === '' ? (
                <p className="text-xs">No hay videos subidos en el grupo</p>
                
              ) : (
                uploadedFiles.map((file: any) => {
                  return (
                    <div key={file.name} className="flex items-center w-full">
                      <div className="flex flex-row items-center gap-2">
                        <p className="text-xs font-semibold">
                          {file.name.replace(
                            `media/${selectedGroup.name}/videos/`,
                            ""
                          )}
                        </p>
                      </div>

                      <div className="flex flex-row ml-2 justify-center items-center">
                        <p className="text-[10px] text-gray-500">
                          {formatBytes(file.size)}
                        </p>
                        <button
                          className="text-light-gray hover:text-orange-500 ml-1 themeTransition font-semibold text-sm"
                          onClick={() =>
                            handleDelete(
                              file.name.replace(
                                `media/${selectedGroup.name}/videos/`,
                                ""
                              ),
                              file.id
                            )
                          }
                          type="button"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="w-1/2 p-1 flex flex-col justify-start items-start">
            <div>
              <h4 className="text-sm">Archivos a Subir:</h4>
              {filesToUpload.length === 0 ? (
                <p className="text-xs">Agregá videos .mp4 para subir</p>
              ) : (
                filesToUpload.map((file: File) => (
                  <div key={file.name} className="flex items-center w-full">
                    <div className="flex flex-row items-center gap-3">
                      <p className="text-xs font-semibold">{file.name}</p>
                      <p className="text-[10px] text-gray-500">
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
                ))
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 w-[50%] mx-auto">
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
    </ VideoUploadContext.Provider>
  );
};

