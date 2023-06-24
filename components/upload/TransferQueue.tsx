import React, { useContext } from "react";
import { VideoTransferContext } from "./VideoTransferContext";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import { PhotoTransferContext } from "./PhotoTransferContext";
import Queue from "queue";
import { uploadGoogleStorageFile } from "@/utils";

interface TransferQueueProps {
  toggleModal: () => void;
  activeTab: string;
  queueArray?: any[];
}

const TransferQueue = (props: TransferQueueProps) => {
  const { toggleModal } = props;

  const transferQueueContext = props.activeTab === "videos" ? useContext(VideoTransferContext) : useContext(PhotoTransferContext);
  const { transferQueue, addToTransferQueue } = transferQueueContext;
  const uploadQueue = new Queue({ concurrency: 1 }); // Ajusta el número de concurrencia según tus necesidades
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const uploadFiles = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isSubmitting) {
        return; // Evitar envío de solicitudes múltiples
      }
  
      if (transferQueue.length === 0) {
        toast.info("Cola Vacia, no hay archivos para subir");
        return;
      }
      
      console.log("transferQueue", transferQueue);
      setIsSubmitting(true); // Marcar la solicitud en progreso
  
      const uploadedFileJobs = transferQueue.map(([file, transferData]) => async () => {
        try {
          const uploadedFile = await uploadGoogleStorageFile(
            file,
            `media/${transferData.groupName}/videos`,
            "maxter-media"
          );
          console.log("uploadedFile", uploadedFile);
          const videoId = uploadedFile.id;
  
          const formData = new FormData();
          formData.append("videoId", videoId);
          formData.append("groupId", transferData.groupId as string);
  
          const response = await fetch("/api/upload/videos", {
            method: "POST",
            body: formData,
          });
  
          // Manejar la respuesta de la API según tus necesidades
          if (response.ok) {
            console.log("response", response.json());
            
          } else {
            throw new Error("Error al subir el archivo");
          }
        } catch (error) {
          console.error(error);
         
        }
      });
  
      // Agregar los trabajos a la cola
      uploadedFileJobs.forEach((job: any) => uploadQueue.push(job));
  
      // Iniciar el procesamiento de la cola
      uploadQueue.start((err: any) => {
        if (err) {
          console.error(err);
          toast.error("Error al agregar el(s) video(s) a la cola de reproducción");
        } else {
          console.log("Todos los archivos se han subido correctamente");
          toggleModal();
        }
        setIsSubmitting(false); // Marcar la solicitud como finalizada
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar el(s) video(s) a la cola de reproducción");
      setIsSubmitting(false); // Marcar la solicitud como finalizada en caso de error
    }
  };

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
              </thead>
              <tbody className="bg-light-gray text-left">
                {transferQueue.map(([file, transferData]) => (
                  <tr key={file.name}>
                    <td>
                      <p className="text-sm font-semibold p-4">
                        {transferData.groupName}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm font-semibold p-4">
                        {transferData.agencyName}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm font-semibold p-4">{file.name}</p>
                    </td>
                    <td>
                      <p className="text-sm font-semibold p-4">Progreso</p>
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

export default TransferQueue;
