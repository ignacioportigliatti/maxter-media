import React, { useContext, useEffect, useState } from "react";
import { VideoUploadContext } from "./VideoUploadContext";
import { toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import { PhotoUploadContext } from "./PhotoUploadContext";
import { uploadGoogleStorageFile } from "@/utils/googleStorage/";
import { generateVideoThumbnail } from "@/utils/generateVideoThumbnail";
import JSZip from "jszip";
import FastQ from "fastq";

interface UploadQueueProps {
  toggleModal: () => void;
  activeTab: string;
}

interface UploadTask {
  file: File;
  uploadData: any;
}

const UploadQueue = (props: UploadQueueProps) => {
  const { toggleModal, activeTab } = props;

  const uploadQueueContext =
    props.activeTab === "videos"
      ? useContext(VideoUploadContext)
      : useContext(PhotoUploadContext);
  const { uploadQueue, deleteFromUploadQueue } = uploadQueueContext;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadQueueState, setUploadQueueState] = useState<[File, any][]>(uploadQueue);
  const [uploadingProgress, setUploadingProgress] = useState<number[]>([]);

  useEffect(() => {
    console.log("uploadQueue", uploadQueue);
    setUploadQueueState(uploadQueue);
  }, [uploadQueue]);

  const uploadFiles = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isSubmitting) {
        return;
      }

      if (uploadQueue.length === 0) {
        toast.info("Cola Vacia, no hay archivos para subir");
        toggleModal();
        return;
      }

      setIsSubmitting(true);

      const uploadQueueTasks: UploadTask[] = uploadQueue.map(([file, uploadData]) => ({
        file,
        uploadData,
      }));

      const uploadingQueue = FastQ(async (task: UploadTask, cb) => {
        try {
          
          const bucketName = "maxter-media";
          const filePath = `media/${task.uploadData.groupName}/${activeTab}`;

          if (activeTab === "videos") {
            console.log("Generating thumbnail");
            const thumbnail = await generateVideoThumbnail(task.file);
            console.log("thumbnail", thumbnail);
            const thumbnailPath = `media/${task.uploadData.groupName}/videos/thumbs`;
            const thumbnailFile = await uploadGoogleStorageFile(thumbnail as File, thumbnailPath, bucketName);
            console.log("thumbnailFile uploaded", thumbnailFile);

            const uploadedFile = await uploadGoogleStorageFile(task.file, filePath, bucketName);
            const fileId = uploadedFile.id;

            const formData = new FormData();
            formData.append("fileId", fileId);
            formData.append("groupId", task.uploadData.groupId as string);

            const response = await fetch(`/api/upload/${activeTab}`, {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              console.log("response", response.json());

              toast.success("Video subido correctamente");
            } else {
              throw new Error("Error al subir el video");
            }
          } else if (activeTab === "photos") {
            const unzipFile = async (file: File) => {
              return new Promise<File[]>((resolve, reject) => {
                const unzip = new JSZip();
                unzip.loadAsync(file).then((zip) => {
                  const fileEntries = Object.entries(zip.files);
                  const filteredEntries = fileEntries.filter(([fileName, file]) => {
                    return !file.dir;
                  });
                  const groups = [];
                  const groupSize = 10; // Número de archivos a subir simultáneamente

                  for (let i = 0; i < filteredEntries.length; i += groupSize) {
                    groups.push(filteredEntries.slice(i, i + groupSize));
                  }

                  const promises = groups.map((group) => {
                    const groupPromises = group.map(([fileName, file]) => {
                      return file.async("blob").then((blob) => {
                        const fileType = "image/jpg";
                        const convertedFile = new File([blob], fileName, { type: fileType });
                        return convertedFile;
                      });
                    });
                    return Promise.all(groupPromises);
                  });

                  Promise.all(promises)
                    .then((groupedFiles) => {
                      const files = groupedFiles.flat();
                      resolve(files);
                    })
                    .catch((error) => {
                      reject(error);
                    });
                });
              });
            };

            const files: any = await unzipFile(task.file);
            console.log("blobs", files);

            const uploadPromises = files.map((file: File) => {
              return uploadGoogleStorageFile(file, filePath, bucketName);
            });

            const uploadedFiles = await Promise.all(uploadPromises);
            console.log("uploadedFiles", uploadedFiles);
            const fileIds = uploadedFiles.map((file) => file.id);
            const formData = new FormData();
            formData.append("fileIds", JSON.stringify(fileIds));
            formData.append("groupId", task.uploadData.groupId as string);

            const response = await fetch(`/api/upload/${activeTab}`, {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              console.log("response", response.json());

              toast.success(`Archivo ${task.file.name} subido correctamente`);
            } else {
              throw new Error(`Error al subir el archivo ${task.file.name}`);
            }
          } else {
            toast.error(`Error al subir el archivo ${task.file.name}`);
            throw new Error(`Error al subir el archivo ${task.file.name}`);
          }

          // Llama a `cb` para notificar que el trabajo ha finalizado correctamente
          cb(null);
        } catch (error) {
          console.error(error);
          toast.error(`Error al subir el archivo ${task.file.name}`);

          // Llama a `cb` con el error para notificar que el trabajo ha fallado
          cb(error as Error);
        }
      }, 1); // Establece la concurrencia en 1

      uploadingQueue.drain();

      uploadQueueTasks.forEach((task) => {

      uploadingQueue.push(task, (err: any) => {
        if (err) {
          console.error(err);
          toast.error(
            "Error al subir los archivos, por favor intenta de nuevo"
          );
        }
      });
    });
    
    } catch (error) {
      console.error(error);
      toast.error("Error al subir los archivos, por favor intenta de nuevo");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (file: File, uploadData: any) => {
    try {
      await deleteFromUploadQueue(file, uploadData);
      const updatedQueue = uploadQueue.filter(
        ([uploadedFile, uploadedData]) =>
          uploadedFile !== file || uploadedData !== uploadData
      );
      setUploadQueueState(updatedQueue);
      toast.success("Archivo eliminado de la cola de subida");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el archivo de la cola de subida");
    }
  };

  return (
    <div>
      <div className="animate-in animate-out z-50 duration-500 fade-in flex justify-center items-center h-full min-h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
        <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[60%]">
          <div className="py-2 bg-orange-500 w-full text-center relative">
            <h2 className="text-white">Cola de Subida</h2>
            <button onClick={toggleModal} className="absolute top-3 right-4">
              <TfiClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="w-full px-7 flex flex-col justify-center">
            <table>
              <thead className="dark:bg-medium-gray bg-gray-200">
                <tr>
                  <th>
                    <p className="text-sm font-semibold p-4">Grupo</p>
                  </th>
                  <th>
                    <p className="text-sm font-semibold p-4">Empresa</p>
                  </th>
                  <th>
                    <p className="text-sm font-semibold p-4">Archivo</p>
                  </th>
                  <th>
                    <p className="text-sm font-semibold p-4">Progreso</p>
                  </th>
                  <th>
                    <p className="text-sm font-semibold p-4">Acciones</p>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-light-gray text-left">
                {uploadQueueState.map(([file, uploadData], index) => (
                  <tr key={file.name}>
                    <td>
                      <p className="text-sm font-semibold p-4">
                        {uploadData.groupName}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm font-semibold p-4">
                        {uploadData.agencyName}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm font-semibold p-4">{file.name}</p>
                    </td>
                    <td>
                      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div
                          className="bg-orange-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                          style={{
                            width: `${
                              uploadingProgress[index] ? uploadingProgress[index] * 100 : 0
                            }%`,
                          }}
                        >
                          {uploadingProgress[index]
                            ? Math.round(uploadingProgress[index] * 100)
                            : 0}
                          %
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(file, uploadData)}
                        className="text-sm font-semibold p-4"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form onSubmit={uploadFiles}>
            <button type="submit">Subir</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadQueue;
