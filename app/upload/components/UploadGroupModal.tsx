import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import {
  UploadAutoPhoto,
  UploadAutoVideo,
  UploadFormPhoto,
  UploadFormVideo,
} from "./";
import axios from "axios";
import { Group } from "@prisma/client";

interface UploadGroupModalProps {
  toggleModal: () => void;
  groupToEdit?: Group | null;
  refresh?: () => void;
  activeTab: string;
  uploadType: string;
}

export const UploadGroupModal = (props: UploadGroupModalProps) => {
  const { toggleModal, groupToEdit, refresh, activeTab, uploadType } =
    props;

  const [editMode, setEditMode] = useState(false);
 

  const checkEditMode = async () => {
    if (groupToEdit) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  };

  useEffect(() => {

    checkEditMode();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {};

  const renderUploadType = () => {
    if (uploadType === "auto") {
      if (activeTab === "video") {
        return <UploadAutoVideo />;
      } else {
        return <UploadAutoPhoto />;
      }
    } else {
      if (activeTab === "video") {
        if (editMode) {
          return <UploadFormVideo editMode={editMode} />;
        } else {
          return <UploadFormVideo />;
        }
      } else {
        if (editMode) {
          return (
            <UploadFormPhoto editMode={editMode} groupToEdit={groupToEdit} />
          );
        } else {
          return <UploadFormPhoto />;
        }
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-full min-h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
        <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[50%]">
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
