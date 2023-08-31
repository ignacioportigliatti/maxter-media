"use client";

import { Steps } from "@/components/home/Steps";
import VideosCarousel from "@/components/home/VideosCarousel";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

export default function ClientHome() {

  const selectedGroup: Group = useSelector((state: any) => state.group);

  return (

      <div className="flex flex-col justify-center w-full items-center mx-auto my-auto h-full p-7">
        
        <Steps />
       
      </div>

  );
}
