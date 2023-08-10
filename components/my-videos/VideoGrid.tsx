import { VideoCard } from "./VideoCard";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

interface VideoGridProps {
  selectedGroup: Group;
}

export const VideoGrid = (props: VideoGridProps) => {
  const { selectedGroup } = props;

  const videos = useSelector((state: any) => state.videos);

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
   
      <div className="flex flex-row items-start justify-center mx-auto animate-in fade-in-0 duration-500">
        <div className="flex flex-wrap gap-2 justify-center items-start min-w-screen w-full h-full">
          {videos.map((video: any, index: number) => (
              <VideoCard
                key={video.Key}
                title={video.Key.split("/")[3].split(".")[0]}
                agencyName={selectedGroup.agencyName as string}
                uploadedAt={formatUploadedAt(video.LastModified)}
                filePath={video.Key}
                videoIndex={index}
              />
          ))}
        </div>
      </div>
  );
};
