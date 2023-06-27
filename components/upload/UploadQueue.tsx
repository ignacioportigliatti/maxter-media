import React, { useContext, useEffect, useState } from "react";
import { VideoUploadContext } from "./VideoUploadContext";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import { PhotoUploadContext } from "./PhotoUploadContext";
import Queue from "queue";
import { uploadGoogleStorageFile } from "@/utils";

interface UploadQueueProps {
  toggleModal: () => void;
  activeTab: string;
}

const UploadQueue = (props: UploadQueueProps) => {
  const { toggleModal } = props;

  const uploadQueueContext = props.activeTab === "videos" ? useContext(VideoUploadContext) : useContext(PhotoUploadContext);
  const { uploadQueue, addToUploadQueue, deleteFromUploadQueue } = uploadQueueContext;
  const uploadingQueue = new Queue({ concurrency: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadQueueState, setUploadQueueState] = useState<[File, any][]>(uploadQueue);

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
        return;
      }

      setIsSubmitting(true);

      const uploadedFileJobs = uploadQueue.map(([file, uploadData]) => async () => {
        try {
          const uploadedFile = await uploadGoogleStorageFile(
            file,
            `media/${uploadData.groupName}/videos`,
            "maxter-media"
          );
          const videoId = uploadedFile.id;
          
          const formData = new FormData();
          formData.append("videoId", videoId);
          formData.append("groupId", uploadData.groupId as string);

          const response = await fetch("/api/upload/videos", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            console.log("response", response.json());
            console.log("Eliminando de la cola de subida");
            await handleDelete(file, uploadData);
          } else {
            throw new Error("Error al subir el archivo");
          }
        } catch (error) {
          console.error(error);
        }
      });

      uploadedFileJobs.forEach((job: any) => uploadingQueue.push(job));

      uploadingQueue.start((err: any) => {
        if (err) {
          console.error(err);
          toast.error("Error al agregar el(s) video(s) a la cola de reproducción");
        } else {
          toast.success("Todos los archivos se han subido correctamente");
        }
        setIsSubmitting(false);
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar el(s) video(s) a la cola de reproducción");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (file: File, uploadData: any) => {
    try {
      await deleteFromUploadQueue(file, uploadData);
      toast.success("Archivo eliminado de la cola de subida");
      
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el archivo de la cola de subida");
    }
  }
  

  return (
    <div>
      <ToastContainer />
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
                {uploadQueueState.map(([file, uploadData]) => (
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
                      <p className="text-sm font-semibold p-4">Progreso</p>
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
            <button type="submit">
              Subir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadQueue;
