import React, { createContext, useState } from "react";

type TransferContextProps = {
  transferQueue: string[];
  addToTransferQueue: (item: File) => void;
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
  const [transferQueue, setTransferQueue] = useState<string[]>([]);

  const addToTransferQueue = (item: string) => {
    setTransferQueue((prevQueue) => [...prevQueue, item]);
  };

  return (
    <TransferContext.Provider value={{ transferQueue, addToTransferQueue }}>
      {children}
    </TransferContext.Provider>
  );
};
