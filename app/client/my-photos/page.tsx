"use client";

import { PhotoGrid } from "@/components/my-photos/PhotoGrid";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function MyPhotosPage() {
  const group: Group = useSelector((state: any) => state.group);

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
        <div>{group && <PhotoGrid selectedGroup={group as Group} />}</div>
      </div>
    </div>
  );
}
