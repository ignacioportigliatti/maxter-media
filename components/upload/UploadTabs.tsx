import { useState } from "react";
import { TfiCamera, TfiVideoCamera } from "react-icons/tfi";
import { UploadGroupsTable } from "./";
import { AiOutlineCloudUpload } from "react-icons/ai";
import UploadQueue from "./UploadQueue";

export const UploadTabs = () => {
  const [activeTab, setActiveTab] = useState("photos");

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  const [showModal, setShowModal] = useState(false);

  const showUploadQueue = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div className="w-full mx-auto justify-center items-start border dark:border-gray-500 border-gray-200">
      <div className="border-gray-200 dark:border-gray-700 dark:bg-[#292929]">
        <ul className="flex flex-wrap  -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 border-b dark:border-gray-500 border-gray-200">
          <li>
            <a
              onClick={() => handleTabChange("photos")}
              className={`tabButton
              ${
                activeTab === "photos"
                  ? "bg-orange-500 text-white"
                  : "bg-transparent"
              }
              `}
            >
              <TfiCamera className="w-5 h-5 mr-2" />
              Fotos
            </a>
          </li>
          <li>
            <a
              onClick={() => handleTabChange("videos")}
              className={`tabButton
              ${
                activeTab === "videos"
                  ? "bg-orange-500 text-white"
                  : "bg-transparent"
              }
              `}
            >
              <TfiVideoCamera className="w-5 h-5 mr-2" />
              Videos
            </a>
          </li>
        </ul>
      </div>
      <div className="fixed bottom-2 right-2">
        <button
          className="bg-light-gray hover:bg-medium-gray themeTransition p-2"
          onClick={showUploadQueue}
        >
          <AiOutlineCloudUpload className="text-white w-5 h-5" />
        </button>
      </div>
      <div className="">
        {activeTab === "photos" && showModal && (
          <UploadQueue
            toggleModal={showUploadQueue}
            activeTab={activeTab}
          />
        )}
        {activeTab === "videos" && showModal && (
          <UploadQueue
            toggleModal={showUploadQueue}
            activeTab={activeTab}
          />
        )}
      </div>
      <div className="mx-auto">
        {activeTab === "photos" && <UploadGroupsTable activeTab={activeTab} />}
        {activeTab === "videos" && <UploadGroupsTable activeTab={activeTab} />}
      </div>
    </div>
  );
};
