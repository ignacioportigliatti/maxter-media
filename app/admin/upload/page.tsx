"use client";

import { UploadTabs } from "@/components/upload";
import { UploadProvider } from "@/components/upload/UploadContext";

export default function UploadPage() {
  return (
    <UploadProvider>
      <div className="w-full mx-auto justify-center items-start">
        <div className="w-full bg-dark-gray themeTransition py-[26px] px-7 text-white drop-shadow-sm">
          <h2>Subir Material</h2>
        </div>
        <div className="mx-auto p-7">
          <UploadTabs />
        </div>
      </div>
    </UploadProvider>
  );
}
