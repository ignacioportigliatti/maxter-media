"use client";

import { VideoGrid } from "@/components/my-videos/VideoGrid";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function MyVideosPage() {
  const group: Group = useSelector((state: any) => state.group);

  return (
    <div className="w-full flex max-w-[100vw] px-4 py-8 md:py-14 md:px-14">
      {group && <VideoGrid selectedGroup={group as Group} />}
    </div>
  );
}
