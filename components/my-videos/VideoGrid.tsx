"use client";

import { useEffect, useState } from "react";

import { VideoCard } from "@/components/ui";
import { getGoogleStorageFiles } from "@/utils";
import { Group } from "@prisma/client";

interface VideoGridProps {
  selectedGroup: Group;
}

export const VideoGrid = (props: VideoGridProps) => {
  const { selectedGroup } = props;
  const [videos, setVideos] = useState<any[]>([]);
  
  useEffect(() => {
    const getVideoList = async () => {
      try {
        const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
        const folderPath = `media/M0023/videos`;

        const videos = await getGoogleStorageFiles(
          bucketName as string,
          folderPath
        );
        console.log("videos", videos);

        setVideos(videos);
      } catch (error) {
        console.error("Error al obtener la lista de videos:", error);
      }
    };

    getVideoList();
  }, []);

  // Resto del código del componente
  return (
    <div>
      <div className="flex">
        <div className="flex flex-row items-start justify-center mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-4 max-w-6xl">
            {videos.map((video, index) => (
              <VideoCard
                key={index}
                title={video.name.split("/")[3].split(".")[0]}
                agencyName={selectedGroup.agencyName as string}
                duration={video.size}
                uploadedAt={video.timeCreated}
                thumbSrc={video.mediaLink}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
