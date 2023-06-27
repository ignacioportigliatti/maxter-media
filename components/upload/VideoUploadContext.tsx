import React, { createContext, useState, useEffect, useRef } from "react";

type UploadData = {
  groupId?: string;
  groupName?: string;
  agencyName?: string;
  fileName?: string;
};

type VideoUploadContextProps = {
  uploadQueue: [File, UploadData][];
  addToUploadQueue: (item: File, uploadData: UploadData) => void;
  deleteFromUploadQueue: (item: File, uploadData: UploadData) => void;
};


export const VideoUploadContext = createContext<VideoUploadContextProps>({
  uploadQueue: [],
  addToUploadQueue: () => {},
  deleteFromUploadQueue: () => {},
});

type UploadProviderProps = {
  children: React.ReactNode;
};

export const VideoUploadProvider: React.FC<UploadProviderProps> = ({
  children,
}) => {
  const [uploadQueue, setUploadQueue] = useState<[File, UploadData][]>([]);
  const isInitialRender = useRef(true); // Ref to track initial render

  const addToUploadQueue = (item: File, uploadData: UploadData) => {
    setUploadQueue((prevQueue) => [...prevQueue, [item, uploadData || {}]]);
  };

  const deleteFromUploadQueue = (item: File, uploadData: UploadData) => {
    setUploadQueue((prevQueue) =>
      prevQueue.filter(([file, data]) => file !== item || data.groupName !== uploadData?.groupName)
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
