import { TfiClose } from "react-icons/tfi";
import { Dashboard, ProgressBar } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import Uppy, { UppyFile } from "@uppy/core";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  UploadData,
  VideoUploadContext,
  useVideoUploadContext,
} from "./VideoUploadContext";
import { PhotoUploadContext } from "./PhotoUploadContext";
import Spanish from "@uppy/locales/lib/es_ES";
import { toast } from "react-toastify";

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

  const { uploadQueue, addToUploadQueue, deleteFromUploadQueue } =
    useVideoUploadContext();
  const [uploadFinished, setUploadFinished] = useState(false);

  const getUppy = async () => {
    if (activeTab === "videos") {
      const videoUppy = new Uppy().use(AwsS3, {
        limit: 1,
        shouldUseMultipart: false, // use multipart upload for files larger than 100 MB
        async getUploadParameters(file: UppyFile) {
          const response = await axios.post("/api/sign-url", {
            bucketName: "maxter-media",
            fileName: `media/${file.meta.groupName}/videos/${file.name}`,
            isUpload: true,
            contentType: file.type,
          });
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
        shouldUseMultipart: (file: UppyFile) => file.size > 100 * 2 ** 20, // use multipart upload for files larger than 100 MB
        async getUploadParameters(file: UppyFile) {
          const response = await axios.post("/api/sign-url", {
            bucketName: "maxter-media",
            fileName: `media/photos/${file.name}`,
            isUpload: true,
            contentType: file.type,
          });
          return response.data;
        },
      });
      setUppy(photoUppy);
    }
  };

  const uploadFiles = async () => {
    if (uppy) {
      uppy
        .on("upload", (data) => {
          toast.info(`Subiendo ${data.fileIDs.length} archivo(s)`);
        })
        .on("file-removed", (file) => {
          deleteFromUploadQueue(file, file.meta as UploadData);
        })
        .on("complete", (result) => {
          console.log(
            "Upload complete! We’ve uploaded these files:",
            result.successful
          );

         
          result.successful.map((file) => {
            uppy.removeFile(file.id);
            const data: UploadData = {
              groupId: file.meta.groupId as string,
              groupName: file.meta.groupName as string,
              agencyName: file.meta.agencyName as string,
              fileName: file.meta.fileName as string,
            };
            deleteFromUploadQueue(file, data);
          });
        });
      uppy.upload();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const setUppyInstance = async () => {
      await getUppy();
    };
    setUppyInstance().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="h-full">
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
      <div className="flex  bg-medium-gray flex-col w-full h-5/6 justify-center rounded-b-lg items-center">
        {isLoading ? (
          <p>Cargando</p>
        ) : uppy ? ( // Aquí se verifica si uppy tiene un valor definido
          // <Dashboard
          // className="fixed max-w-2xl"
          //   uppy={uppy}
          //   plugins={["AwsS3"]}
          //   showProgressDetails={true}
          //   proudlyDisplayPoweredByUppy={false}
          //   metaFields={[
          //     { id: "groupId", name: "groupId", placeholder: "Id del grupo" },
          //     {
          //       id: "groupName",
          //       name: "groupName",
          //       placeholder: "Nombre del grupo",
          //     },
          //     {
          //       id: "agencyName",
          //       name: "agencyName",
          //       placeholder: "Nombre de la agencia",
          //     },
          //     {
          //       id: "fileName",
          //       name: "fileName",
          //       placeholder: "Nombre del archivo",
          //     },
          //   ]}
          // />
          <div>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Grupo</th>
                  <th>Agencia</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {uploadQueue.map(([file, data], index) => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{data.groupName}</td>
                    <td>{data.agencyName}</td>
                    <td>
                      <button
                        onClick={() => {
                          uppy.removeFile(file.id);
                          deleteFromUploadQueue(file, data);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ProgressBar id={`progressBar-${activeTab}`} uppy={uppy} />
          </div>
        ) : null}
        <div className="flex flex-row justify-center items-center w-full h-1/6 bg-dark-gray rounded-b-lg">
          <button
            onClick={uploadFiles}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
          >
            Subir
          </button>

          <button
            onClick={toggleModal}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg ml-4"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadQueue;
