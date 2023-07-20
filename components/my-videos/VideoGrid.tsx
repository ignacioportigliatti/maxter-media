import { useEffect, useState } from "react";
import { VideoCard } from "./VideoCard";
import { getGoogleStorageFiles } from "@/utils";
import { Group } from "@prisma/client";

interface VideoGridProps {
  selectedGroup: Group;
}

export const VideoGrid = (props: VideoGridProps) => {
  const { selectedGroup } = props;
  console.log("selectedGroup", selectedGroup);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getVideoList = async () => {
      setIsLoading(true);
      try {
        const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
        const folderPath = `media/${selectedGroup.name}/videos`;

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

    getVideoList().finally(() => setIsLoading(false));
  }, [selectedGroup]);

  const formatUploadedAt = (dateString: string) => {
    const currentDate = new Date();
    const uploadedDate = new Date(dateString);
    const timeDiff = currentDate.getTime() - uploadedDate.getTime();

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Hace ${days} día${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    } else {
      return "Hace unos segundos";
    }
  };

  return (
    <div className="flex animate-in fade-in-0 duration-500">
      <div className="flex flex-row items-start justify-between mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-4 max-w-6xl">
          {videos.map((video) => (
            <VideoCard
              key={video.id} // Utilizar una propiedad única del video como clave
              title={video.name.split("/")[3].split(".")[0]}
              agencyName={selectedGroup.agencyName as string}
              uploadedAt={formatUploadedAt(video.timeCreated)}
              filePath={video.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
