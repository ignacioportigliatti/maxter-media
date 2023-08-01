"use client";

import { ToastContainer } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import { PhotoUpload, VideoUpload} from "./";
import { Group } from "@prisma/client";
import Uppy from "@uppy/core";

interface UploadGroupModalProps {
  toggleModal: () => void;
  selectedGroup?: Group | undefined;
  refresh?: () => void;
  activeTab: string;
  filesToUpload?: Blob[];
  isDragging?: boolean;

}

export const UploadGroupModal = (props: UploadGroupModalProps) => {
  const { toggleModal, selectedGroup, activeTab, filesToUpload, isDragging } = props;

  const dataToUpload = filesToUpload
    ? { group: selectedGroup, files: filesToUpload }
    : {};

  const renderUploadType = () => {
    if (activeTab === "videos") {
      return (
        <VideoUpload
          toggleModal={toggleModal}
          dataToUpload={dataToUpload as any}
          isDragging={isDragging}

        />
      );
    } else if (activeTab === "photos") {
      return <PhotoUpload
      toggleModal={toggleModal}
      dataToUpload={dataToUpload as any}
      isDragging={isDragging}
    />;
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-full min-h-screen w-full absolute top-0 left-0 bg-black bg-opacity-70">
        <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[80%]">
          <div className="py-2 bg-orange-500 w-full text-center relative">
            <h2 className="text-white">Añadir material</h2>
            <button onClick={toggleModal} className="absolute top-3 right-4">
              <TfiClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="w-full px-7 flex flex-col justify-center">
            <div>{renderUploadType()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
