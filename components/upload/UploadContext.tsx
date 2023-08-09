import { createContext, useContext, useRef, useEffect, useState } from "react";
import AwsS3 from "@uppy/aws-s3";
import Uppy, { UppyFile } from "@uppy/core";
import axios from "axios";
import JSZip from "jszip";

export type UploadData = {
  groupId?: string;
  groupName?: string;
  agencyName?: string;
  fileName?: string;
};

type UploadContextProps = {
  photoUppy: Uppy;
  videoUppy: Uppy;
  photoUploadQueue: [UppyFile, UploadData][];
  videoUploadQueue: [UppyFile, UploadData][];
  addToPhotoUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
  addToVideoUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
  deleteFromUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
};

export const UploadContext = createContext<UploadContextProps>({
  photoUppy: new Uppy(),
  videoUppy: new Uppy(),
  photoUploadQueue: [],
  videoUploadQueue: [],
  addToPhotoUploadQueue: () => {},
  addToVideoUploadQueue: () => {},
  deleteFromUploadQueue: () => {},
});

export const useUploadContext = () => useContext(UploadContext);

type UploadProviderProps = {
  children: React.ReactNode;
};

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const [photoUploadQueue, setPhotoUploadQueue] = useState<
    [UppyFile, UploadData][]
  >([]);
  const [videoUploadQueue, setVideoUploadQueue] = useState<
    [UppyFile, UploadData][]
  >([]);
  const photoUppy = useRef<Uppy>(new Uppy());
  const videoUppy = useRef<Uppy>(new Uppy());

  useEffect(() => {
    photoUppy.current.use(AwsS3, {
      limit: 1,
      async getUploadParameters(file: UppyFile) {
        const response = await axios.post("/api/sign-url", {
          bucketName: "maxter-media",
          fileName: `media/${file.meta.groupName}/uploads/${file.name}`,
          isUpload: true,
          contentType: file.type,
        });
        return response.data;
      },
    });

    videoUppy.current.use(AwsS3, {
      limit: 1,
      async getUploadParameters(file: UppyFile) {
        const response = await axios.post("/api/sign-url", {
          bucketName: "maxter-media",
          fileName: `media/${file.meta.groupName}/uploads/${file.name}`,
          isUpload: true,
          contentType: file.type,
        });
        return response.data;
      },
    });

    photoUppy.current.on("file-added", (file) => {
      setPhotoUploadQueue((prevQueue) => [...prevQueue, [file, {}]]);
    });

    videoUppy.current.on("file-added", (file) => {
      setVideoUploadQueue((prevQueue) => [...prevQueue, [file, {}]]);
    });

    photoUppy.current.on("file-removed", (file) => {
      setPhotoUploadQueue((prevQueue) =>
        prevQueue.filter(
          ([uploadedFile]) => uploadedFile.meta.id !== file.meta.id
        )
      );
    });

    videoUppy.current.on("file-removed", (file) => {
      setVideoUploadQueue((prevQueue) =>
        prevQueue.filter(
          ([uploadedFile]) => uploadedFile.meta.id !== file.meta.id
        )
      );
    });

    return () => {
      photoUppy.current.close();
      videoUppy.current.close();
    };
  }, []);

  const addToPhotoUploadQueue = async (
    file: UppyFile,
    uploadData: UploadData
  ) => {
    if (
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed"
    ) {
      // Handle ZIP extraction for photos
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file.data);

      zipData.forEach(async (relativePath: string, fileEntry: any) => {
        if (!fileEntry.dir) {
          const extractedFileData = await fileEntry.async("arraybuffer");
          const extractedFile = new File([extractedFileData], fileEntry.name, {
            type: fileEntry.comment || "application/octet-stream",
          });

          photoUppy.current.addFile({
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
      // Add the file to the photoUppy queue
      photoUppy.current.addFile({
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

  const addToVideoUploadQueue = (file: UppyFile, uploadData: UploadData) => {
    // Add the file to the videoUppy queue
    videoUppy.current.addFile({
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
  };

  const deleteFromUploadQueue = (item: UppyFile, uploadData: UploadData) => {
    photoUppy.current.removeFile(item.id);
    videoUppy.current.removeFile(item.id);
  };

  return (
    <UploadContext.Provider
      value={{
        photoUppy: photoUppy.current,
        videoUppy: videoUppy.current,
        photoUploadQueue,
        videoUploadQueue,
        addToPhotoUploadQueue,
        addToVideoUploadQueue,
        deleteFromUploadQueue,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
