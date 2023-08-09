import React, { useEffect, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { StatusBar } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import Uppy, { UppyFile } from "@uppy/core";
import axios from "axios";
import Spanish from "@uppy/locales/lib/es_ES";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import * as uppyLocale from "./locale/uploadQueue_es.json";
import JSZip from "jszip";
import { renderGroupedFiles } from "./utils/renderGroupedFiles";
import { UploadData, useUploadContext } from "./UploadContext";

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
  const [completedFiles, setCompletedFiles] = useState<UppyFile[]>([]);
  const [fileUploadProgress, setFileUploadProgress] = useState<
    Record<string, number>
  >({});
  const { photoUppy, photoUploadQueue, addToPhotoUploadQueue, deleteFromUploadQueue, videoUploadQueue, videoUppy, addToVideoUploadQueue } = useUploadContext();
  const uppy = activeTab === "photos" ? photoUppy : videoUppy;
  const uploadQueue = activeTab === "photos" ? photoUploadQueue : videoUploadQueue;

// Now you can use the `uploadContext` object throughout your component
  console.log('uploadQueue', uploadQueue);

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
          .on("upload-success", (file, data) => {
            toast.success(`Archivo ${file?.name} subido correctamente`);
            setCompletedFiles((prevFiles) => [...prevFiles, file as UppyFile]);
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
            toast.success(
              `Subida completada de ${result.successful.length} archivo(s)`
            );
            setIsUploading(false);
          });

        uppy.upload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const clearCompletedFiles = () => {
    completedFiles.forEach((file) => {
      const data: UploadData = {
        groupId: file.meta.groupId as string,
        groupName: file.meta.groupName as string,
        agencyName: file.meta.agencyName as string,
        fileName: file.meta.fileName as string,
      };
      deleteFromUploadQueue(file, data);
      setCompletedFiles((prevFiles) =>
        prevFiles.filter((prevFile) => prevFile.id !== file.id)
      );
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
                  uploadQueue,
                  uppy,
                  fileUploadProgress,
                  deleteFromUploadQueue,
                  groupFilesByGroupName(uploadQueue)
                )}
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
            disabled={isUploading}
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
