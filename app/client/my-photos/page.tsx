"use client";

import { PhotoGrid } from "@/components/my-photos/PhotoGrid";
import { Codes, Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function MyPhotosPage() {
  const group: Group = useSelector((state: any) => state.group);
  const code: Codes = useSelector((state:any) => state.code);
  const codeType = code?.type;

  if ( codeType === "photo" || "full" ) {
    return (
      <div className="w-full flex max-w-[100vw] px-4 py-8 md:py-14 md:px-14">
      {group && <PhotoGrid selectedGroup={group as Group} />}
    </div>
    )
  } else if ( codeType === "video" ) {
    return (
      <div className="w-full flex max-w-[100vw] px-4 py-8 md:py-14 md:px-14">
      <h1 className="text-2xl font-bold text-center">No hay fotos para mostrar</h1>
    </div>
    )
  }

}
