import React, { createContext, useState, useEffect, useRef } from "react";
import { uploadGoogleStorageFile } from "@/utils/uploadGoogleStorageFile";

type TransferData = {
  groupId?: string;
  groupName?: string;
  agencyName?: string;
  fileName?: string;
};

type PhotoTransferContextProps = {
  transferQueue: [File, TransferData][];
  addToTransferQueue: (item: File, transferData?: TransferData) => void;
};

export const PhotoTransferContext = createContext<PhotoTransferContextProps>({
  transferQueue: [],
  addToTransferQueue: () => {},
});

type TransferProviderProps = {
  children: React.ReactNode;
};

export const TransferProvider: React.FC<TransferProviderProps> = ({
  children,
}) => {
  const [transferQueue, setTransferQueue] = useState<[File, TransferData][]>([]);
  const isInitialRender = useRef(true); // Ref to track initial render

  const addToTransferQueue = (item: File, transferData?: TransferData) => {
    setTransferQueue((prevQueue) => [...prevQueue, [item, transferData || {}]]);
    console.log("transferQueue", transferQueue);
  };

  

  return (
    <PhotoTransferContext.Provider value={{ transferQueue, addToTransferQueue }}>
      {children}
    </PhotoTransferContext.Provider>
  );
};

