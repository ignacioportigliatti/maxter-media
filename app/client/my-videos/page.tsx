"use client";

import { VideoGrid } from "@/components/my-videos/VideoGrid";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function MyVideosPage() {
  const group: Group = useSelector((state: any) => state.group);

  return (
    <div className="w-full flex max-w-[100vw] p-9 md:py-14 px-9">
      {group && <VideoGrid selectedGroup={group as Group} />}
    </div>
  );
}
