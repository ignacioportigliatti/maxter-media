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

      <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-full min-h-screen w-full absolute top-0 left-0 bg-black bg-opacity-70">
        <div className="flex flex-col gap-4 pb-7  justify-center items-center rounded-t-lg bg-medium-gray w-[80%]">
        <div className="!z-50 py-4 bg-dark-gray flex flex-row w-full justify-between px-4 text-white text-center rounded-t-lg">
          <h2 className="text-lg uppercase font-light">
            {`${
              activeTab === "photos" ? "Fotos" : "Videos"
            } - Añadir Material - ${selectedGroup?.name}`}
          </h2>
          <button onClick={toggleModal}>
            <TfiClose />
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
