import { UppyFile } from "@uppy/core";
import React, { createContext, useState, useEffect, useRef } from "react";

export type UploadData = {
  groupId?: string;
  groupName?: string;
  agencyName?: string;
  fileName?: string;
};

type PhotoUploadContextProps = {
  uploadQueue: [UppyFile, UploadData][];
  addToUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
  deleteFromUploadQueue: (item: UppyFile, uploadData: UploadData) => void;
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
  const [uploadQueue, setUploadQueue] = useState<[UppyFile, UploadData][]>([]);
  const isInitialRender = useRef(true); // Ref to track initial render

  const addToUploadQueue = (item: UppyFile, uploadData?: UploadData) => {
    const newQueue: [UppyFile, UploadData][] = uploadQueue.concat([[item, uploadData || {}]]);
    setUploadQueue(newQueue);
  };

  const deleteFromUploadQueue = (item: UppyFile, data: UploadData) => {
    const newQueue: [UppyFile, UploadData][] = uploadQueue.filter(([file, uploadData]) => file.name !== item.name && uploadData.groupName !== data.groupName);
    setUploadQueue(newQueue);
    return newQueue;
  };

  return (
    <PhotoUploadContext.Provider value={{ uploadQueue, addToUploadQueue, deleteFromUploadQueue }}>
      {children}
    </PhotoUploadContext.Provider>
  );
};

