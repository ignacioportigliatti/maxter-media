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
        const folderPath = `media/${selectedGroup.name}/videos`;

        const videos = await getGoogleStorageFiles(
          bucketName as string,
          folderPath,
        );
        console.log("videos", videos);

        setVideos(videos);
      } catch (error) {
        console.error("Error al obtener la lista de videos:", error);
      }
    };

    getVideoList();
  }, [selectedGroup]);

  const extractFileName = (filePath: string) => {
    const parts = filePath.split("/");
    const fileNameWithExtension = parts[parts.length - 1];
    const fileName = fileNameWithExtension.split(".")[0];
    return fileName;
  };

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
    <div>
      <div className="flex">
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
    </div>
  );
};
