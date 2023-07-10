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
  deleteFromUploadQueue: (item: File, data: UploadData) => [File, UploadData][];
};

export const PhotoUploadContext = createContext<PhotoUploadContextProps>({
  uploadQueue: [],
  addToUploadQueue: () => {},
  deleteFromUploadQueue: () => [],
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
    const newQueue: [File, UploadData][] = uploadQueue.concat([[item, uploadData || {}]]);
    setUploadQueue(newQueue);
  };

  const deleteFromUploadQueue = (item: File, data: UploadData) => {
    const newQueue: [File, UploadData][] = uploadQueue.filter(([file, uploadData]) => file.name !== item.name && uploadData.groupName !== data.groupName);
    setUploadQueue(newQueue);
    return newQueue;
  };

  return (
    <PhotoUploadContext.Provider value={{ uploadQueue, addToUploadQueue, deleteFromUploadQueue }}>
      {children}
    </PhotoUploadContext.Provider>
  );
};

