"use client";

import { PhotoGrid } from "@/components/my-photos/PhotoGrid";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function MyPhotosPage() {
  const group: Group = useSelector((state: any) => state.group);

  return (
    <div className="w-full p-14">
      {group && <PhotoGrid selectedGroup={group as Group} />}
    </div>
  );
}
