import { VideoCard } from "./VideoCard";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

interface VideoGridProps {
  selectedGroup: Group;
}

export const VideoGrid = (props: VideoGridProps) => {
  const { selectedGroup } = props;

  const videos = useSelector((state: any) => state.videos);
  console.log(videos);

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
          {videos.map((video: any, index: number) => (
            <VideoCard
              key={video.key} // Utilizar una propiedad única del video como clave
              title={video.key.split("/")[3].split(".")[0]}
              agencyName={selectedGroup.agencyName as string}
              uploadedAt={formatUploadedAt(video.lastModified)}
              filePath={video.key}
              videoIndex={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
