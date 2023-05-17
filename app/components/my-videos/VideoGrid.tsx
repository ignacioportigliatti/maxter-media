import { VideoCard } from "../ui/VideoCard";

interface Props {}

export const VideoGrid = (props: Props) => {
  return (
    <div>
      <div className="flex">
        <div className="flex flex-row items-start justify-center mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-4 max-w-6xl">
            <VideoCard
                title="01 - Cocoguana"
                agency="Astros Viajes"
                duration="35:21"
                uploadedAt="Subido hace 2 Horas."
            />
            <VideoCard
                title="01 - Cocoguana"
                agency="Astros Viajes"
                duration="35:21"
                uploadedAt="Subido hace 2 Horas."
            />
            <VideoCard
                title="01 - Cocoguana"
                agency="Astros Viajes"
                duration="35:21"
                uploadedAt="Subido hace 2 Horas."
            />
            <VideoCard
                title="01 - Cocoguana"
                agency="Astros Viajes"
                duration="35:21"
                uploadedAt="Subido hace 2 Horas."
            />
            <VideoCard
                title="01 - Cocoguana"
                agency="Astros Viajes"
                duration="35:21"
                uploadedAt="Subido hace 2 Horas."
            />
            <VideoCard
                title="01 - Cocoguana"
                agency="Astros Viajes"
                duration="35:21"
                uploadedAt="Subido hace 2 Horas."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
