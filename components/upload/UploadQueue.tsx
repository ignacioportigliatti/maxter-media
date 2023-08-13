import React, { useEffect, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { StatusBar } from "@uppy/react";

import { UppyFile } from "@uppy/core";
import axios from "axios";

import { toast } from "react-toastify";
import * as uppyLocale from "./locale/uploadQueue_es.json";
import { renderGroupedFiles } from "./utils/renderGroupedFiles";
import { UploadData, useUploadContext } from "./UploadContext";
import { generateVideoThumbnail } from "./utils/generateVideoThumbnail";

interface UploadQueueProps {
  toggleModal: () => void;
  showModal: boolean;
  activeTab: string;
}

const UploadQueue: React.FC<UploadQueueProps> = ({
  toggleModal,
  activeTab,
  showModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [completedFiles, setCompletedFiles] = useState<string[]>([]);
  const [fileUploadProgress, setFileUploadProgress] = useState<
    Record<string, number>
  >({});
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
  const uppy = activeTab === "photos" ? photoUppy : videoUppy;
  const uploadQueue =
    activeTab === "photos" ? photoUploadQueue : videoUploadQueue;

  // Now you can use the `uploadContext` object throughout your component

  const groupFilesByGroupName = (files: [UppyFile, any][]) => {
    const groupedFiles: Record<string, [UppyFile, any][]> = {};

    files.forEach(([file]) => {
      const groupName = file.meta.groupName as string;
      if (!groupedFiles[groupName]) {
        groupedFiles[groupName] = [];
      }
      groupedFiles[groupName].push([file, file.meta]);
    });
    return groupedFiles;
  };

  const uploadFiles = async () => {
    if (uppy) {
      try {
        uppy
          .on("upload", (data) => {
            console.log('uploadQueue', uploadQueue)
            if (data.fileIDs.length > 0) {
              toast.info(`Subiendo ${data.fileIDs.length} archivo(s)`);
            } else {
              toast.error("No hay archivos nuevos para subir en la cola");
            }
            setIsUploading(true);
          })
          .on("upload-progress", (file, progress) => {
            setFileUploadProgress((prevProgress) => ({
              ...prevProgress,
              [file?.id as string]:
                progress.bytesUploaded / progress.bytesTotal,
            }));
          })
          .on("upload-success", async (file, data) => {
            if (file) {
              setCompletedFiles((prevFiles) => [...prevFiles, file.name]);
              const { groupId, groupName, agencyName, fileName } = file.meta;
              const uploadData: UploadData = {
                groupId: groupId as string,
                groupName: groupName as string,
                agencyName: agencyName as string,
                fileName: fileName as string,
              };
              console.log('file', file, 'data', data)
              const uppyFiles = uppy.getFiles();

              try {
                if (activeTab === 'videos') {
                  deleteFromVideoUploadQueue(file, uploadData);
                } else if (activeTab === 'photos') {
                  deleteFromPhotoUploadQueue(file, uploadData);
                }
                console.log('uppyFiles', uppyFiles);
                console.log(uploadQueue)
                toast.success(`Archivo ${file?.name} subido correctamente`);
              } catch (error) {
                toast.error(`Error al subir ${file?.name}`);
              }
            }
            
          })
          .on("upload-error", (file, error) => {
            toast.error(`Error al subir ${file?.name}`);
            console.error(error);
          })
          .on("cancel-all", () => {
            toast.info("Subida cancelada");
            setIsUploading(false);
          })
          .on("complete", (result) => {
            if (result.successful.length > 0) {
              toast.success(
                `Subida completada de ${result.successful.length} archivo(s)`
              );
              setIsUploading(false);
            } else {
              toast.error("No se pudo completar la subida de los archivos");
              setIsUploading(false);
            }
            setIsUploading(false);
          });

        uppy.upload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const clearCompletedFiles = () => {
    completedFiles.map((fileName:string) => {
      setCompletedFiles([]);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    if (uppy) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div
      className="fixed top-0 left-0 min-w-full px-56 py-24 h-screen bg-black bg-opacity-90 !z-[9999999999999]"
      style={{
        display: showModal ? "block" : "none",
      }}
    >
      <div className="h-full flex flex-col !z-50">
        <div className="!z-50 py-4 bg-dark-gray flex flex-row w-full justify-between px-4 text-white text-center rounded-t-lg">
          <h2 className="text-lg uppercase font-light">
            {`${
              activeTab === "photos" ? "Fotos" : "Videos"
            } - Subida de Archivos`}
          </h2>
          <button onClick={toggleModal}>
            <TfiClose />
          </button>
        </div>
        <div
          className="flex-grow bg-medium-gray flex flex-col justify-between overflow-hidden"
          style={{
            // Add a maximum height for the content
            maxHeight: "70vh", // You can adjust this value as needed
            overflowY: "auto", // Enable vertical scrolling for the content
          }}
        >
          {isLoading ? (
            <p className="flex-grow flex items-center justify-center">
              Cargando
            </p>
          ) : uppy ? (
            <div className="flex-grow h-full flex flex-col">
              <div className="overflow-auto h-full ">
                {renderGroupedFiles(
                  activeTab,
                  uploadQueue,
                  uppy,
                  fileUploadProgress,
                  deleteFromVideoUploadQueue,
                  deleteFromPhotoUploadQueue,
                  groupFilesByGroupName(uploadQueue)
                )}
              </div>
              <div>
                {completedFiles.length > 0 ? (
                  <div className="flex flex-row justify-center items-center gap-2">
                    <p className="text-white text-center">
                      {`Completados (${completedFiles.length})`}
                    </p>
                    <ul>
                      {completedFiles.map((file) => (
                        <li key={file}>
                          <p className="text-white text-center">{file}</p>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={clearCompletedFiles}
                      className="button button--small"
                    >
                      Limpiar
                    </button>
                  </div>
                ) : null}
              </div>
              <StatusBar
                id={`statusBar-${activeTab}`}
                uppy={uppy}
                hideUploadButton
                showProgressDetails={true}
                locale={{ strings: uppyLocale }}
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-row gap-2 justify-center items-center w-full h-1/6 bg-dark-gray rounded-b-lg">
          <button
            
            onClick={uploadFiles}
            className="button"
          >
            Subir
          </button>
          <button onClick={clearCompletedFiles} className="button">
            {`Limpiar Completados (${completedFiles.length})`}
          </button>
          <button onClick={toggleModal} className="button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadQueue;
