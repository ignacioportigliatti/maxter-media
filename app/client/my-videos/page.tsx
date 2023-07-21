"use client";

import { VideoGrid } from "@/components/my-videos/VideoGrid";

import { Group } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MyVideosPage() {


  const group: Group = useSelector((state: any) => state.group);

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
        
          {group && <VideoGrid selectedGroup={group as Group} />}
   
      </div>
    </div>
  );
}
