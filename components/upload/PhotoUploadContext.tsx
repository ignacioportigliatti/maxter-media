import React, { createContext, useState, useEffect, useRef } from "react";

type UploadData = {
  groupId?: string;
  groupName?: string;
  agencyName?: string;
  fileName?: string;
};

type PhotoUploadContextProps = {
  uploadQueue: [File, UploadData][];
  addToUploadQueue: (item: File, uploadData?: UploadData) => void;
  deleteFromUploadQueue: (item: File) => void;
};

export const PhotoUploadContext = createContext<PhotoUploadContextProps>({
  uploadQueue: [],
  addToUploadQueue: () => {},
  deleteFromUploadQueue: () => {},
});

type UploadProviderProps = {
  children: React.ReactNode;
};

export const PhotoUploadProvider: React.FC<UploadProviderProps> = ({
  children,
}) => {
  const [uploadQueue, setUploadQueue] = useState<[File, UploadData][]>([]);
  const isInitialRender = useRef(true); // Ref to track initial render

  const addToUploadQueue = (item: File, uploadData?: UploadData) => {
    setUploadQueue((prevQueue) => {
      const newQueue: [File, UploadData][] = prevQueue.concat([[item, uploadData || {}]]);
      console.log("uploadQueue", newQueue);
      return newQueue;
    });
  };

  const deleteFromUploadQueue = (item: File) => {
    const newQueue: [File, UploadData][] = uploadQueue.filter(([file, uploadData]) => file.name !== item.name);
    setUploadQueue(newQueue);
    return newQueue;
  };

  return (
    <PhotoUploadContext.Provider value={{ uploadQueue, addToUploadQueue, deleteFromUploadQueue }}>
      {children}
    </PhotoUploadContext.Provider>
  );
};

