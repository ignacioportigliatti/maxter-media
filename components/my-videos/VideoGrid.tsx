import { VideoCard } from "./VideoCard";
import { Group } from "@prisma/client";
import { useSelector } from "react-redux";

interface VideoGridProps {
  selectedGroup: Group;
}

export const VideoGrid = (props: VideoGridProps) => {
  const { selectedGroup } = props;

  const videos = useSelector((state: any) => state.videos);
  const skeletonsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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
    <div className="flex flex-row w-full items-center justify-center mx-auto animate-in fade-in-0 duration-500">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2 min-w-full w-full h-full">
        {videos !== null ? (
          videos.map((video: any, index: number) => (
            <VideoCard
              key={video.video.Key}
              title={video.video.Name}
              agencyName={selectedGroup.agencyName as string}
              uploadedAt={formatUploadedAt(video.video.LastModified)}
              videoSrc={video.video.url}
              videoIndex={index}
              thumbnailSrc={video.thumbnail.url}
            />
          ))
        ) : (
          <>
            {skeletonsArray.map((_, index) => (
              <div
                key={index}
                className="animate-pulse w-full duration-1000 flex gap-2 flex-col justify-center items-start bg-medium-gray"
              >
                <div className="w-full aspect-video bg-light-gray"></div>
                <div className="w-1/2 h-[15px] bg-light-gray"></div>
                <div className="w-1/3 h-[10px] bg-light-gray "></div>
                <div className="w-1/4 h-[8px] bg-light-gray"></div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
