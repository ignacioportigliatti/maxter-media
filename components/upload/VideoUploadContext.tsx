import AwsS3 from "@uppy/aws-s3";
import Uppy, { UppyFile } from "@uppy/core";
import axios from "axios";
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

type VideoUploadContextProps = {
  uppy: Uppy;
  uploadQueue: [UppyFile, UploadData][];
  addToUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
  deleteFromUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
};

export const VideoUploadContext = createContext<VideoUploadContextProps>({
  uppy: new Uppy(),
  uploadQueue: [],
  addToUploadQueue: () => {},
  deleteFromUploadQueue: () => {},
});

type UploadProviderProps = {
  children: React.ReactNode;
};

export const useVideoUploadContext = () => useContext(VideoUploadContext);

export const VideoUploadProvider: React.FC<UploadProviderProps> = ({
  children,
}) => {
  const [uploadQueue, setUploadQueue] = useState<[UppyFile, UploadData][]>([]);
  const uppy = useRef<Uppy>(new Uppy());

  useEffect(() => {
    uppy.current.use(AwsS3, {
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
    })

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

  const addToUploadQueue = (item: UppyFile, uploadData: UploadData) => {
    uppy.current.addFile({
      name: item.name,
      type: item.type,
      data: item.data,
      meta: {
        groupId: uploadData.groupId,
        groupName: uploadData.groupName,
        agencyName: uploadData.agencyName,
        fileName: uploadData.fileName,
      },
    });
  };

  const deleteFromUploadQueue = (item: UppyFile, uploadData: UploadData) => {
    uppy.current.removeFile(item.id);
  };

  return (
    <VideoUploadContext.Provider
      value={{ uppy: uppy.current, uploadQueue, addToUploadQueue, deleteFromUploadQueue }}
    >
      {children}
    </VideoUploadContext.Provider>
  );
};
