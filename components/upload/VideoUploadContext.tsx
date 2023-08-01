import { UppyFile } from "@uppy/core";
import React, { createContext, useState, useEffect, useRef, useContext } from "react";

export type UploadData = {
  groupId?: string;
  groupName?: string;
  agencyName?: string;
  fileName?: string;
};

type VideoUploadContextProps = {
  uploadQueue: [UppyFile, UploadData][];
  addToUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
  deleteFromUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
};


export const VideoUploadContext = createContext<VideoUploadContextProps>({
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
  const isInitialRender = useRef(true); // Ref to track initial render

  const addToUploadQueue = (item: UppyFile, uploadData: UploadData) => {
    setUploadQueue((prevQueue) => [...prevQueue, [item, uploadData || {}]]);
  };

  const deleteFromUploadQueue = (item: UppyFile, uploadData: UploadData) => {
    setUploadQueue((prevQueue) =>
      prevQueue.filter(([file, data]) => file !== item || data.groupName !== uploadData.groupName)
    );
  };
  
  

  return (
    <VideoUploadContext.Provider
      value={{ uploadQueue, addToUploadQueue, deleteFromUploadQueue }}
    >
      {children}
    </VideoUploadContext.Provider>
  );
};
