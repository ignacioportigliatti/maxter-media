import React, { useContext } from "react";
import { TransferContext } from "./TransferContext";
import { ToastContainer } from "react-toastify";
import { TfiClose } from "react-icons/tfi";

interface TransferQueueProps {
    toggleModal: () => void;
}

const TransferQueue = (props: TransferQueueProps) => {
const { toggleModal } = props;
const { transferQueue } = useContext(TransferContext);

  return (
    <div>
    <ToastContainer />
    <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-full min-h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
      <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[60%]">
        <div className="py-2 bg-orange-500 w-full text-center relative">
          <h2 className="text-white">Cola de Subida</h2>
          <button onClick={toggleModal} className="absolute top-3 right-4">
            <TfiClose className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="w-full px-7 flex flex-col justify-center">
        <ul>
        {transferQueue.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
        </div>
      </div>
    </div>
  </div>
  );
};

export default TransferQueue;
