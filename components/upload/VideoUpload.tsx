"use client";

import React, { useState, useContext, useEffect } from "react";
import { AiOutlineDelete, AiOutlineFileAdd } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  formatBytes,
  getGoogleStorageFiles,
  uploadGoogleStorageFile,
  deleteGoogleStorageFile,
} from "@/utils";
import { Group } from "@prisma/client";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import {
  VideoUploadContext,
  useVideoUploadContext,
} from "./VideoUploadContext";
import Uppy, { UppyFile } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Spanish from "@uppy/locales/lib/es_ES";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadQueue, addToUploadQueue, deleteFromUploadQueue } =
    useVideoUploadContext();

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

  const uppy = new Uppy({
    locale: Spanish
  });

  useEffect(() => {
    checkFiles().then(() => setIsLoading(false));

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

      if (uppyFiles.length === 0) {
        toast.error("Selecciona al menos un archivo de video");
        setIsSubmitting(false);
        return;
      }

      const uploadPromises = uppyFiles.map((file) =>
        addToUploadQueue(file, {
          groupId: selectedGroup.id,
          groupName: selectedGroup.name,
          agencyName: selectedGroup.agencyName as string,
          fileName: file.name,
        })
      );

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
    <VideoUploadContext.Provider
      value={{ uploadQueue, addToUploadQueue, deleteFromUploadQueue }}
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
              className="p-1 button !text-white text-center !bg-red-700 hover:!bg-red-500"
              onClick={toggleModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </VideoUploadContext.Provider>
  );
};
