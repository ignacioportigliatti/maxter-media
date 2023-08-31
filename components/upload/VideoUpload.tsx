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
import axios from "axios";
import { UploadContext, useUploadContext } from "./UploadContext";

interface VideoUploadProps {
  dataToUpload: {
    group: Group;
    files: File[];
  };
  isDragging?: boolean;
  toggleModal: any;
}

type fileData = {
  key: string;
  size: number;
};

export const VideoUpload: React.FC<VideoUploadProps> = ({
  dataToUpload,
  toggleModal,
  isDragging,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const selectedGroup = dataToUpload.group;
  const [uploadedFiles, setUploadedFiles] = useState<fileData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    photoUppy,
    photoUploadQueue,
    addToPhotoUploadQueue,
    deleteFromPhotoUploadQueue,
    deleteFromVideoUploadQueue,
    videoUploadQueue,
    videoUppy,
    addToVideoUploadQueue,
  } = useUploadContext();

  const checkFiles = async () => {
    try {
      const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
      const folderPath = `media/${selectedGroup.name}/videos`;
      const videos = await axios
        .post("/api/videos/", {
          bucketName,
          folderPath,
          needThumbs: false,
        })
        .then((res) => {
          if (res.data.success) {
            return res.data.videos;
          }
        });
      if (videos !== undefined && videos.length > 0) {
        setUploadedFiles(videos);
      }
      console.log("videos", videos);
      return videos;
    } catch (error) {
      console.error("Error al obtener los videos", error);
    }
  };

  const uploadUppy = new Uppy({
    locale: Spanish,
  });

  useEffect(() => {
    checkFiles().finally(() => setIsLoading(false));

    if (isDragging === true) {
      for (const file of dataToUpload.files) {
        uploadUppy.addFile({
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

      const uppyFiles: UppyFile[] = await uploadUppy.getFiles();

      if (uppyFiles.length === 0) {
        toast.error("Selecciona al menos un archivo de video");
        setIsSubmitting(false);
        return;
      }

      const uploadPromises = uppyFiles.map((file) => {
        try {
          addToVideoUploadQueue(file, {
            groupId: selectedGroup.id,
            groupName: selectedGroup.name,
            agencyName: selectedGroup.agencyName as string,
            fileName: file.name,
          });
        } catch (error) {
          console.error(error);
        }
      });

      await Promise.all(uploadPromises).then(() => {
        toast.success("Video(s) agregado(s) a la cola de reproducción");
        toggleModal();
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar el(s) video(s) a la cola de reproducción");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (fileKey: string) => {
    try {
      const response = await axios
        .post("/api/videos/delete", {
          bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
          fileKey: fileKey,
        })
        .then((res) => res.data);

      if (response.success !== false) {
        const updatedFiles = await checkFiles();
       if (updatedFiles) {
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
      value={{
        photoUppy,
        photoUploadQueue,
        addToPhotoUploadQueue,
        deleteFromPhotoUploadQueue,
        deleteFromVideoUploadQueue,
        videoUploadQueue,
        videoUppy,
        addToVideoUploadQueue,
      }}
    >
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row items-start justify-center p-3 border w-full">
            <div className="w-1/2 p-1 flex flex-col justify-center">
              <div>
                <h4 className="text-sm">Archivos Subidos:</h4>
                {isLoading ? (
                  <p className="text-xs">Cargando...</p>
                ) : uploadedFiles.length === 0 ? (
                  <p className="text-xs">No hay videos subidos en el grupo</p>
                ) : (
                  uploadedFiles.map((file: any) => {
                    return (
                      <div key={file.Key} className="flex items-center w-full">
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-xs font-semibold">
                            {file.Key.replace(
                              `media/${selectedGroup.name}/videos/`,
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
                            onClick={() => handleDelete(file.Key)}
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
                uppy={uploadUppy}
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
              disabled={false} // Deshabilitar el botón mientras la solicitud está en progreso
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
