import AwsS3 from "@uppy/aws-s3";
import Uppy, { UppyFile } from "@uppy/core";
import axios from "axios";
import JSZip from "jszip";
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";

export type UploadData = {
  groupId?: string;
  groupName?: string;
  agencyName?: string;
  fileName?: string;
};

type PhotoUploadContextProps = {
  uppy: Uppy;
  uploadQueue: [UppyFile, UploadData][];
  addToUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
  deleteFromUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
};

export const PhotoUploadContext = createContext<PhotoUploadContextProps>({
  uppy: new Uppy(),
  uploadQueue: [],
  addToUploadQueue: () => {},
  deleteFromUploadQueue: () => {},
});

type UploadProviderProps = {
  children: React.ReactNode;
};

export const usePhotoUploadContext = () => useContext(PhotoUploadContext);

export const PhotoUploadProvider: React.FC<UploadProviderProps> = ({
  children,
}) => {
  const [uploadQueue, setUploadQueue] = useState<[UppyFile, UploadData][]>([]);
  const uppy = useRef<Uppy>(new Uppy());

  useEffect(() => {
    uppy.current.use(AwsS3, {
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

    uppy.current.on("file-added", (file) => {
      setUploadQueue((prevQueue) => [...prevQueue, [file, {}]]);
    });

    uppy.current.on("file-removed", (file) => {
      setUploadQueue((prevQueue) =>
        prevQueue.filter(
          ([uploadedFile]) => uploadedFile.meta.id !== file.meta.id
        )
      );
    });

    return () => {
      uppy.current.close();
    };
  }, []);

  const addToUploadQueue = async (file: UppyFile, uploadData: UploadData) => {
    if (
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed"
    ) {
      // Descomprimir el archivo ZIP
      console.log("ZIP file detected");
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file.data);

      // Iterar sobre los archivos extraídos y agregarlos a photoUppy
      zipData.forEach(async (relativePath: string, fileEntry: any) => {
        if (!fileEntry.dir) {
          const extractedFileData = await fileEntry.async("arraybuffer");
          const extractedFile = new File([extractedFileData], fileEntry.name, {
            type: fileEntry.comment || "application/octet-stream",
          });

          uppy.current.addFile({
            name: extractedFile.name,
            type: extractedFile.type,
            data: extractedFile,
            meta: {
              groupId: uploadData.groupId,
              groupName: uploadData.groupName,
              agencyName: uploadData.agencyName,
              fileName: uploadData.fileName,
            },
          });
        }
      });
    } else {
      // Si no es un archivo ZIP, agregar normalmente
      uppy.current.addFile({
        name: file.name,
        type: file.type,
        data: file.data,
        meta: {
          groupId: uploadData.groupId,
          groupName: uploadData.groupName,
          agencyName: uploadData.agencyName,
          fileName: uploadData.fileName,
        },
      });
    }
  };

  const deleteFromUploadQueue = (item: UppyFile, uploadData: UploadData) => {
    uppy.current.removeFile(item.id);
  };

  return (
    <PhotoUploadContext.Provider
      value={{
        uppy: uppy.current,
        uploadQueue,
        addToUploadQueue,
        deleteFromUploadQueue,
      }}
    >
      {children}
    </PhotoUploadContext.Provider>
  );
};
