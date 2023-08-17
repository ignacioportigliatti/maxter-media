"use client";

import { PhotoGrid } from "@/components/my-photos/PhotoGrid";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function MyPhotosPage() {
  const group: Group = useSelector((state: any) => state.group);

  return (
    <div className="w-full flex max-w-[100vw] px-4 py-8 md:py-14 md:px-14">
      {group && <PhotoGrid selectedGroup={group as Group} />}
    </div>
  );
}
