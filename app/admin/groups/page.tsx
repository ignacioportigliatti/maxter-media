"use client";

import { GroupsTable } from "@/components/groups";

export default function GroupsPage() {

  return (
    <div className="w-full mx-auto justify-center items-start">
      <div className=" bg-dark-gray themeTransition py-[26px] px-7 text-white items-center">
        <h2>Grupos</h2>
      </div>
      <div className="mx-auto p-7">
        <GroupsTable/>
      </div>
    </div>
  );
}
