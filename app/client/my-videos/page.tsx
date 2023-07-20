"use client";

import { VideoGrid } from "@/components/my-videos/VideoGrid";
import { getGroups } from "@/utils";
import { Group } from "@prisma/client";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MyVideosPage() {

  const [isLoading, setIsLoading] = useState(true);

  const group: Group = useSelector((state: any) => state.group);
  
  useEffect(() => {
    if (group.id !== "") {
      setIsLoading(false);
    }
  }, [group]);

  console.log("group", group);

  const skeletonArray = Array.from(Array(9).keys());

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
      <div className="flex items-center justify-center w-full py-14 px-7 mx-auto">
        {isLoading ? (
          <div className="flex flex-row items-start w-full justify-center mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-4 max-w-6xl">
              {skeletonArray.map(() => (
                <div className="min-w-[350px]">
                  <div className="w-full cursor-pointer">
                    <div className="w-[350px] h-[200px] bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="flex flex-row mt-3 gap-2">
                    <a href="#">
                      <div className="w-[40px] h-[40px] bg-gray-200 rounded-full animate-pulse"></div>
                    </a>
                    <div className="flex flex-col gap-1">
                      <div className="w-[250px] h-[10px] bg-gray-200 animate-pulse"></div>
                      <div className="w-[150px] h-[10px] bg-gray-200 animate-pulse"></div>
                      <div className="w-[50px] h-[10px] bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          group && <VideoGrid selectedGroup={group as Group}  />
        )}
      </div>
    </div>
  );
}
