"use client";

import CodesTable from "@/components/codes/CodesTable";

export default function UploadPage() {
  return (
    <div className="w-full mx-auto justify-center items-start">
      <div className="w-full dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 text-black dark:text-white drop-shadow-sm">
        <h2>Generación de Codigos</h2>
      </div>
      <div className="mx-auto p-7">
        <CodesTable />
      </div>
    </div>
  );
}
