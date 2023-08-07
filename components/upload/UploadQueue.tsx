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

interface UploadQueueProps {
  toggleModal: () => void;
  activeTab: string;
}

const UploadQueue: React.FC<UploadQueueProps> = ({
  toggleModal,
  activeTab,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uppy, setUppy] = useState<Uppy>();
  const [uploadFinished, setUploadFinished] = useState(false);
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

  const renderGroupedFiles = (
    groupedFiles: Record<string, [UppyFile, any][]>
  ) => {
    return uploadQueue.length === 0 ? (
      <div className="flex items-center justify-center h-full">
        <p className="flex-grow flex items-center justify-center">
          No hay archivos en la cola
        </p>
      </div>
    ) : (
      Object.entries(groupedFiles).map(([groupName, files], index) => (
        <details key={index} className="border -mb-[1px] border-slate-800">
          <summary className="px-4 py-2 cursor-pointe bg-medium-gray hover:bg-orange-600 duration-500 transition cursor-pointer">
            {groupName} ({files.length} archivo{files.length !== 1 ? "s" : ""})
          </summary>
          <div className="">
            <table className="w-full">
              <thead className="">
                <tr className="bg-slate-800">
                  <th className="px-4 py-2 font-normal uppercase text-left text-sm  text-white">
                    Archivo
                  </th>
                  <th className="px-4 py-2 font-normal uppercase text-left text-sm  text-white">
                    Grupo
                  </th>
                  <th className="px-4 py-2 font-normal uppercase text-left text-sm  text-white">
                    Agencia
                  </th>
                  <th className="px-4 py-2 font-normal uppercase text-left text-sm  text-white">
                    Progreso
                  </th>
                  <th
                    align="right"
                    className="px-4 py-2 font-normal uppercase text-left text-sm  text-white"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map(([file, data], index) => (
                  <tr key={file.id}>
                    <td className="px-4 py-2">{file.name}</td>
                    <td className="px-4 py-2">{data.groupName}</td>
                    <td className="px-4 py-2">{data.agencyName}</td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-gray-200 rounded-full">
                        <div
                          className="bg-orange-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                          style={{
                            width: `${
                              (fileUploadProgress[file.id] || 0) * 100
                            }%`,
                          }}
                        >
                          {(fileUploadProgress[file.id] || 0) * 100}%
                        </div>
                      </div>
                    </td>
                    <td align="right" className="px-4 py-2">
                      <button
                        onClick={() => {
                          uppy?.removeFile(file.id);
                          deleteFromUploadQueue(file, data);
                        }}
                        className=""
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))
    );
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
    if (activeTab === "videos") {
      if (uppy) {
        try {
          uppy
            .on("upload", (data) => {
              toast.info(`Subiendo ${data.fileIDs.length} archivo(s)`);
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
            });

          uppy.upload();
        } catch (error) {
          console.error(error);
        }
      }
    } else if (activeTab === "photos") {
      if (uppy) {
        try {
          uppy
            .on("upload", (data) => {
              toast.info(`Subiendo ${data.fileIDs.length} archivo(s)`);
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
            });

          uppy.upload();
        } catch (error) {
          console.error(error);
        }
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
    const setUppyInstance = async () => {
      await getUppy();
    };
    setUppyInstance().then(() => {
      setIsLoading(false);
    });
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

  return (
    <div className="h-full flex flex-col">
      <div className="py-4 bg-dark-gray flex flex-row w-full justify-between px-4 text-white text-center rounded-t-lg">
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
          <p className="flex-grow flex items-center justify-center">Cargando</p>
        ) : uppy ? (
          <div className="flex-grow h-full flex flex-col">
            <div className="overflow-auto h-full ">
              {renderGroupedFiles(groupFilesByGroupName(uploadQueue))}
            </div>

            <StatusBar
              id={`statusBar-${activeTab}`}
              uppy={uppy}
              hideUploadButton
              showProgressDetails={true}
              hideCancelButton
              locale={{ strings: uppyLocale }}
            />
          </div>
        ) : null}
      </div>
      <div className="flex flex-row gap-2 justify-center items-center w-full h-1/6 bg-dark-gray rounded-b-lg">
        <button onClick={uploadFiles} className="button">
          Subir
        </button>
        <button onClick={clearCompletedFiles} className="button">
          Limpiar Completados
        </button>
        <button onClick={toggleModal} className="button">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default UploadQueue;
