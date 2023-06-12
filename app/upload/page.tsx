"use client";

import { useState } from "react";
import { TransferQueue, TransferProvider } from "@/components/upload";
import { UploadTabs } from "@/components/upload";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";

export default function UploadPage() {
  const [showModal, setShowModal] = useState(false);

  const showTransferQueue = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <TransferProvider>
      <div className="w-full mx-auto justify-center items-start">
        <div className="w-full dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 text-black dark:text-white drop-shadow-sm">
          <h2>Subir Material</h2>
        </div>
        <div className="mx-auto p-7">
          <UploadTabs />
        </div>
        <div className="fixed bottom-2 right-2">
          <button
            className="bg-light-gray hover:bg-medium-gray themeTransition p-2"
            onClick={showTransferQueue}
          >
            <AiOutlineCloudUpload className="text-white w-5 h-5" />
          </button>
        </div>
        <div className="">
          {showModal && <TransferQueue toggleModal={showTransferQueue} />}
        </div>
      </div>
    </TransferProvider>
  );
}
