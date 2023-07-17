"use client";

import { VideoGrid } from "@/components/my-videos/VideoGrid";
import { getGroups } from "@/utils";
import { Group } from "@prisma/client";
import { useEffect, useState } from "react";

export default function MyVideosPage() {
  const [group, setGroup] = useState<Group>();
  const [isLoading, setIsLoading] = useState(true);

  const getGroupsList = async () => {
    setIsLoading(true);
    const groups: Group[] = await getGroups();
    setGroup(groups[5]);
    console.log("groups", groups);
    return groups;
  };

  useEffect(() => {
    getGroupsList().finally(() => setIsLoading(false));
  }, []);


  return (
    <div className="w-full">
      <div>
        <div className="dark:bg-dark-gray flex flex-row items-center justify-between themeTransition bg-gray-200 py-[26px] px-6 text-black dark:text-white drop-shadow-sm">
          <div>
            <h2>{`Mis Videos`}</h2>
          </div>
          {group && (
            <div className="flex flex-col justify-end items-end">
              <h4>{`Escuela ${group.school} `}</h4>
              <h5 className="text-xs">{`${group.name} - ${group.agencyName}`}</h5>
            </div>
          )}
        </div>
      </div>
      <div className="py-14 px-7">
        <div>
        {group && <VideoGrid selectedGroup={group as Group} />}
        </div>
      </div>
    </div>
  );
}
