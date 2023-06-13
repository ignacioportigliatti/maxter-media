import React, { createContext, useState, useEffect, useRef } from "react";
import { uploadGoogleStorageFile } from "@/utils/uploadGoogleStorageFile";

type TransferContextProps = {
  transferQueue: [File, TransferData][];
  addToTransferQueue: (item: File, transferData?: TransferData) => void;
};

type TransferData = {
  groupName?: string;
  groupId?: string;
  fileName?: string;
};

export const TransferContext = createContext<TransferContextProps>({
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
  };

  

  return (
    <TransferContext.Provider value={{ transferQueue, addToTransferQueue }}>
      {children}
    </TransferContext.Provider>
  );
};

