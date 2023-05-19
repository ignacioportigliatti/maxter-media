"use client";

import { useState } from "react";
import { PhotoForm, VideoForm } from "./";
import { TfiCamera, TfiVideoCamera } from "react-icons/tfi";

export const UploadTabs = () => {
  const [activeTab, setActiveTab] = useState("photos");

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full mx-auto justify-center items-start border dark:border-gray-500 border-gray-200">
      <div className="border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 border-b dark:border-gray-500 border-gray-200">
          <li>
            <a
              onClick={() => handleTabChange("photos")}
              className={`tabButton
              ${activeTab === "photos"
                ? "bg-orange-500 text-white"
                : "bg-transparent"}
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
              ${activeTab === "videos"
                ? "bg-orange-500 text-white"
                : "bg-transparent"}
              `}
            >
                <TfiVideoCamera className="w-5 h-5 mr-2" />
              Videos
            </a>
          </li>
        </ul>
      </div>
      <div className="mx-auto mt-4">
        {activeTab === "photos" && <PhotoForm />}
        {activeTab === "videos" && <VideoForm />}
      </div>
    </div>
  );
};
