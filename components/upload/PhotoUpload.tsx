"use client";

import {
  deleteGoogleStorageFile,
  formatBytes,
  getGoogleStorageFiles,
} from "@/utils";
import { Group } from "@prisma/client";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

import Uppy, { UppyFile } from "@uppy/core";
import Spanish from "@uppy/locales/lib/es_ES";
import { Dashboard } from "@uppy/react";
import { UploadContext, useUploadContext } from "./UploadContext";
import axios from "axios";

interface PhotoUploadProps {
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

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  dataToUpload,
  toggleModal,
  isDragging,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const selectedGroup = dataToUpload.group;
  const [uploadedFiles, setUploadedFiles] = useState<fileData[]>([
    { name: "", size: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { photoUploadQueue, addToPhotoUploadQueue, photoUppy, deleteFromPhotoUploadQueue, deleteFromVideoUploadQueue, videoUploadQueue, videoUppy, addToVideoUploadQueue } =
    useUploadContext();

  const checkFiles = async () => {
    const photos = await axios.post("/api/photos/", {
      bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
      folderPath: `media/fotos/${selectedGroup.name}/`,
    }).then((res) => res.data.photos);
    if (photos !== undefined && photos.length > 0) {
      setUploadedFiles(photos);
    }
    return photos;
  };

  const uppy = new Uppy({
    locale: Spanish
  });

  useEffect(() => {
    checkFiles().finally(() => setIsLoading(false));

    if (isDragging === true) {
      for (const file of dataToUpload.files) {
        uppy.addFile({
          name: file.name,
          type: file.type,
          data: file,
        });
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isSubmitting) {
        return; // Avoid multiple requests
      }
      setIsSubmitting(true);

      const uppyFiles: UppyFile[] = await uppy.getFiles();
      console.log(uppyFiles);
      if (uppyFiles.length === 0) {
        toast.error("Selecciona al menos un archivo de photo");
        setIsSubmitting(false);
        return;
      }

      const uploadPromises = uppyFiles.map((file) => {
        try {
          addToPhotoUploadQueue(file, {
            groupId: selectedGroup.id,
            groupName: selectedGroup.name,
            agencyName: selectedGroup.agencyName as string,
            fileName: file.name,
          })
        } catch (error) {
          console.error(error);
        }}
      );

      await Promise.all(uploadPromises).then(() => {
        toast.success("Photo(s) agregado(s) a la cola de reproducción");
        toggleModal();
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar el(s) photo(s) a la cola de reproducción");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (fileName: string, photoId: string) => {
    try {
      
      const response = await fetch(
        `/api/upload/photos?groupId=${selectedGroup.id}&photoId=${photoId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedFiles = await checkFiles();
        if (!updatedFiles) {
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
    <UploadContext.Provider
      value={{ photoUppy, photoUploadQueue, addToPhotoUploadQueue, deleteFromPhotoUploadQueue, deleteFromVideoUploadQueue, videoUploadQueue, videoUppy, addToVideoUploadQueue }}
    >
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row items-start justify-center p-3 border w-full">
            <div className="w-1/2 p-1 flex flex-col justify-center">
              <div>
                <h4 className="text-sm">Archivos Subidos:</h4>
                {isLoading ? (
                  <p className="text-xs">Cargando...</p>
                ) : uploadedFiles[0].name === "" ? (
                  <p className="text-xs">No hay photos subidos en el grupo</p>
                ) : (
                  uploadedFiles.map((file: any) => {
                    return (
                      <div key={file.Key} className="flex items-center w-full">
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-xs font-semibold">
                            {file.Key.replace(
                              `media/${selectedGroup.name}/photos/`,
                              ""
                            )}
                          </p>
                        </div>

                        <div className="flex flex-row ml-2 justify-center items-center">
                          <p className="text-[10px] text-gray-500">
                            {formatBytes(file.Size)}
                          </p>
                          <button
                            className="text-light-gray hover:text-red-600 ml-1 themeTransition font-semibold text-sm"
                            onClick={() =>
                              handleDelete(
                                file.Key.replace(
                                  `media/${selectedGroup.name}/photos/`,
                                  ""
                                ),
                                file.Key
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
              <Dashboard
                className="w-full bg-black"
                uppy={uppy}
                showProgressDetails={false}
                proudlyDisplayPoweredByUppy={false}
                hideUploadButton={true}
              />
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
              className="p-1 button !text-white text-center !bg-red-700 hover:!bg-red-600"
              onClick={toggleModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </UploadContext.Provider>
  );
};
