import React, { createContext, useState, useEffect } from "react";
import { uploadFile } from "@/utils/uploadFile";

type TransferContextProps = {
  transferQueue: [File, TransferData][];
  addToTransferQueue: (item: File, transferData?: TransferData) => void;
};

type TransferData = {
  groupName?: string;
  groupId?: string;
  fileName?: string;
  filePath?: string;
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

  const addToTransferQueue = (item: File, transferData?: TransferData) => {
    setTransferQueue((prevQueue) => [
      ...prevQueue,
      [item, transferData || {}],
    ]);
  };
  

  useEffect(() => {
    const uploadNextFile = async () => {
      if (transferQueue.length > 0) {
        const [fileToUpload, transferData] = transferQueue[0];

        try {
          const { groupName, groupId, fileName, filePath } = transferData;
          const uploadedFilePath = await uploadFile(fileToUpload, `media/${groupName}/videos`);

          const formData = new FormData();
          formData.append("groupName", groupName as string);
          formData.append("groupId", groupId as string);
          formData.append("fileName", fileName as string);
          formData.append("filePath", uploadedFilePath);
          formData.append("file", fileToUpload);

          // Rest of the code to handle file upload and API response
        } catch (error) {
          // Handle file upload errors
        }

        setTransferQueue((prevQueue) => prevQueue.slice(1)); // Remove the uploaded file from the queue
      }
    };

    uploadNextFile();
  }, [transferQueue]);

  return (
    <TransferContext.Provider value={{ transferQueue, addToTransferQueue }}>
      {children}
    </TransferContext.Provider>
  );
};
