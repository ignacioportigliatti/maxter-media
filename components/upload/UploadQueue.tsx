import React, { useEffect, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { StatusBar } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import Uppy, { UppyFile } from "@uppy/core";
import axios from "axios";
import { useVideoUploadContext } from "./VideoUploadContext";
import { UploadData, usePhotoUploadContext } from "./PhotoUploadContext";
import Spanish from "@uppy/locales/lib/es_ES";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import * as uppyLocale from "./locale/uploadQueue_es.json";
import JSZip from "jszip";
import { renderGroupedFiles } from "./utils/renderGroupedFiles";

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
  const [uppy, setUppy] = useState<Uppy>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [hasInitializedUppy, setHasInitializedUppy] = useState(false);
  const [completedFiles, setCompletedFiles] = useState<UppyFile[]>([]);
  const [fileUploadProgress, setFileUploadProgress] = useState<
    Record<string, number>
  >({});
  const { uploadQueue, addToUploadQueue, deleteFromUploadQueue } =
    activeTab === "videos" ? useVideoUploadContext() : usePhotoUploadContext();

  const groupFilesByGroupName = (files: [UppyFile, any][]) => {
    const groupedFiles: Record<string, [UppyFile, any][]> = {};

    files.forEach(([file, data]) => {
      const groupName = data.groupName as string;
      if (!groupedFiles[groupName]) {
        groupedFiles[groupName] = [];
      }
      groupedFiles[groupName].push([file, data]);
    });

    return groupedFiles;
  };

  

  const getUppy = async () => {
    if (activeTab === "videos") {
      const videoUppy = new Uppy().use(AwsS3, {
        limit: 1,
        // shouldUseMultipart: (file: UppyFile) => file.size > 100 * 2 ** 20,
        async getUploadParameters(file: UppyFile) {
          const response = await axios.post("/api/sign-url", {
            bucketName: "maxter-media",
            fileName: `media/${file.meta.groupName}/videos/${file.name}`,
            isUpload: true,
            contentType: file.type,
          });
          console.log(response.data);
          return response.data;
        },
      });

      uploadQueue.map(([file, data]: [file: UppyFile, data: any]) => {
        videoUppy.addFile({
          name: file.name,
          type: file.type,
          data: file.data,
          meta: {
            groupId: data.groupId,
            groupName: data.groupName,
            agencyName: data.agencyName,
            fileName: data.fileName,
          },
        });
      });
      setUppy(videoUppy);
    } else if (activeTab === "photos") {
      const photoUppy = new Uppy({ locale: Spanish }).use(AwsS3, {
        limit: 1,

        async getUploadParameters(file: UppyFile) {
          const response = await axios.post("/api/sign-url", {
            bucketName: "maxter-media",
            fileName: `media/${file.meta.groupName}/photos/${file.name}`,
            isUpload: true,
            contentType: file.type,
          });
          return response.data;
        },
      });
      console.log(uploadQueue);
      uploadQueue.map(async ([file, data]) => {
        if (
          file.type === "application/zip" ||
          file.type === "application/x-zip-compressed"
        ) {
          // Descomprimir el archivo ZIP
          console.log("ZIP file detected");
          const zip = new JSZip();
          const zipData = await zip.loadAsync(file.data);

          // Iterar sobre los archivos extraídos y agregarlos a photoUppy
          zipData.forEach(async (relativePath, fileEntry) => {
            if (!fileEntry.dir) {
              const extractedFileData = await fileEntry.async("arraybuffer");
              const extractedFile = new File(
                [extractedFileData],
                fileEntry.name,
                {
                  type: fileEntry.comment || "application/octet-stream",
                }
              );

              photoUppy.addFile({
                name: extractedFile.name,
                type: extractedFile.type,
                data: extractedFile,
                meta: {
                  groupId: data.groupId,
                  groupName: data.groupName,
                  agencyName: data.agencyName,
                  fileName: data.fileName,
                },
              });
            }
          });
        } else {
          // Si no es un archivo ZIP, agregar normalmente
          photoUppy.addFile({
            name: file.name,
            type: file.type,
            data: file.data,
            meta: {
              groupId: data.groupId,
              groupName: data.groupName,
              agencyName: data.agencyName,
              fileName: data.fileName,
            },
          });
        }
      });

      setUppy(photoUppy);
    }
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
              setCompletedFiles((prevFiles) => [
                ...prevFiles,
                file as UppyFile,
              ]);
            })
            .on("file-removed", (file) => {
              deleteFromUploadQueue(file, file.meta as UploadData);
            })
            .on("complete", (result) => {
              setUploadFinished(true);
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
      uppy?.removeFile(file.id);
      // Eliminar el archivo del contexto (implementa la función deleteFromUploadQueue si es necesario)
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

    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };
    const enableScroll = () => {
      document.body.style.overflow = "auto";
    };

    disableScroll();
    return () => {
      enableScroll();
    };
  }, []);

  useEffect(() => {
    if (uploadQueue.length > 0 && !hasInitializedUppy) {
      // Call getUppy when uploadQueue is not empty and has not been initialized yet
      getUppy().finally(() => {
        setIsLoading(false);
        setHasInitializedUppy(true);
      });
    }
  }, [uploadQueue, hasInitializedUppy]);

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
                {renderGroupedFiles(uploadQueue, uppy, fileUploadProgress, deleteFromUploadQueue, groupFilesByGroupName(uploadQueue))}
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
          <button disabled={isUploading} onClick={uploadFiles} className="button">
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
