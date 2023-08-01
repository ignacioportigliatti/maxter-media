"use client";

import {
  PhotoUploadProvider,
  UploadTabs,
  VideoUploadProvider,
} from "@/components/upload";

export default function UploadPage() {
  return (
    <PhotoUploadProvider>
      <VideoUploadProvider>
        <div className="w-full mx-auto justify-center items-start">
          <div className="w-full dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 text-black dark:text-white drop-shadow-sm">
            <h2>Subir Material</h2>
          </div>
          <div className="mx-auto p-7">
            <UploadTabs />
          </div>
        </div>
      </VideoUploadProvider>
    </PhotoUploadProvider>
  );
}
