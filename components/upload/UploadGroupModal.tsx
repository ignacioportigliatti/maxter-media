"use client";

import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import { UploadAutoPhoto, UploadAutoVideo, UploadForm } from "./";
import { Group } from "@prisma/client";

interface UploadGroupModalProps {
  toggleModal: () => void;
  selectedGroup?: Group | undefined;
  refresh?: () => void;
  activeTab: string;
  uploadType: string;
  editMode: boolean;
  filesToUpload?: Blob[];
}

export const UploadGroupModal = (props: UploadGroupModalProps) => {
  const {
    toggleModal,
    selectedGroup,
    refresh,
    editMode,
    activeTab,
    uploadType,
    filesToUpload,
  } = props;

  const dataToUpload = filesToUpload
    ? { group: selectedGroup, files: filesToUpload }
    : {};

  const renderUploadType = () => {
    if (uploadType === "auto") {
      if (activeTab === "videos") {
        return (
          <UploadAutoVideo
            toggleModal={toggleModal}
            editMode={editMode}
            dataToUpload={dataToUpload}
          />
        );
      } else {
        return <UploadAutoPhoto />;
      }
    } else {
      if (activeTab === "videos") {
        if (editMode) {
          return (
            <UploadForm
              editMode={editMode}
              groupToEdit={selectedGroup}
              uploadFormat="video"
            />
          );
        } else {
          return <UploadForm editMode={editMode} uploadFormat="video" />;
        }
      } else {
        if (editMode) {
          return (
            <UploadForm
              editMode={editMode}
              groupToEdit={selectedGroup}
              uploadFormat="photo"
            />
          );
        } else {
          return <UploadForm editMode={editMode} uploadFormat="photo" />;
        }
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-full min-h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
        <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[60%]">
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
