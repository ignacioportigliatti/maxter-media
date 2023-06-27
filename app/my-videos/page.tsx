"use client";

import { VideoGrid } from "@/components/my-videos/VideoGrid";
import { getGroups } from "@/utils";
import { Group } from "@prisma/client";
import { useEffect, useState } from "react";

export default function MyVideosPage() {
  const [groups, setGroups] = useState<Group[]>([]);

  const getGroupsList = async () => {
    const groups: Group[] = await getGroups();
    await setGroups(groups);
    console.log("groups", groups);
    return groups;
  };

  useEffect(() => {
    getGroupsList();
  }, []);

  return (
    <div className="w-full">
      <div>
        <div className="dark:bg-dark-gray flex flex-row items-center justify-between themeTransition bg-gray-200 py-[26px] px-7 text-black dark:text-white drop-shadow-sm">
          <div>
            <h2>{`Mis Videos`}</h2>
          </div>
          {groups.length > 0 && (
            <div className="flex flex-col justify-end items-end">
              <h4>{`Escuela ${groups[0].school} `}</h4>
              <h5 className="text-xs">{`${groups[0].name} - ${groups[0].agencyName}`}</h5>
            </div>
          )}
        </div>
      </div>
      <div className="py-14 px-7">
        <VideoGrid selectedGroup={groups[0]} />
      </div>
    </div>
  );
}
