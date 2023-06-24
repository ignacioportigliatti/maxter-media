import React, { createContext, useState, useEffect, useRef } from "react";
import { uploadGoogleStorageFile } from "@/utils/uploadGoogleStorageFile";

type TransferData = {
  groupId?: string;
  groupName?: string;
  agencyName?: string;
  fileName?: string;
};

type VideoTransferContextProps = {
  transferQueue: [File, TransferData][];
  addToTransferQueue: (item: File, transferData?: TransferData) => void;
  deleteFromTransferQueue?: (item: File) => void;
};

export const VideoTransferContext = createContext<VideoTransferContextProps>({
  transferQueue: [],
  addToTransferQueue: () => {},
  deleteFromTransferQueue: () => {},
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
    setTransferQueue((prevQueue) => {
      const newQueue: [File, TransferData][] = prevQueue.concat([[item, transferData || {}]]);
      console.log("transferQueue", newQueue);
      return newQueue;
    });
  };

  const deleteFromTransferQueue = (item: File) => {
    setTransferQueue((prevQueue) => {
      const newQueue: [File, TransferData][] = prevQueue.filter(([file, transferData]) => file.name !== item.name);
      console.log("transferQueue", newQueue);
      return newQueue;
    });
  };

  return (
    <VideoTransferContext.Provider value={{ transferQueue, addToTransferQueue, deleteFromTransferQueue }}>
      {children}
    </VideoTransferContext.Provider>
  );
};

