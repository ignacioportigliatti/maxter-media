"use client";


import { AgencyTable } from "@/components/agencies";



export default function EnterprisesPage() {
  return (
    <div className="w-full mx-auto justify-center items-start">
      <div
        className=" bg-dark-gray themeTransition py-[26px] px-7 
      text-white items-center"
      >
        <h2>Empresas</h2>
      </div>
      <div className="mx-auto p-7">
        <AgencyTable />
      </div>
    </div>
  );
}
