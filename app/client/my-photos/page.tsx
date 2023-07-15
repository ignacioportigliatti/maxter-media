"use client";


import { PhotoGrid } from "@/components/my-photos/PhotoGrid";
import { getGroups } from "@/utils";
import { Group } from "@prisma/client";
import { useEffect, useState } from "react";

export default function MyPhotosPage() {
  const [group, setGroup] = useState<Group>();

  const getGroupsList = async () => {
    const groups: Group[] = await getGroups();
    setGroup(groups[5]);
    console.log("groups", groups);
    return groups;
  };

  useEffect(() => {
    getGroupsList();
  }, []);



  return (
    <div className="w-full">
      <div>
        <div className="dark:bg-dark-gray flex flex-row items-center justify-between themeTransition bg-gray-200 py-[20px] px-6 text-black dark:text-white drop-shadow-sm">
          <div>
            <h2>{`Mis Fotos`}</h2>
          </div>
          {group && (
            <div className="flex flex-col justify-end items-end">
              <h4>{`Escuela ${group.school} `}</h4>
              <h5 className="text-xs">{`${group.name} - ${group.agencyName}`}</h5>
            </div>
          )}
        </div>
      </div>
      <div className="p-14">
        <div>
        {group && <PhotoGrid selectedGroup={group as Group} />}
        </div>
      </div>
    </div>
  );
}
