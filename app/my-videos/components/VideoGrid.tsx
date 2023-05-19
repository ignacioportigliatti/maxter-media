import { VideoCard } from "../../components/ui/VideoCard";

interface Props {}

export const VideoGrid = (props: Props) => {
  const videos = [
    {
      title: "01 - Cocoguana",
      agency: "Astros Viajes",
      duration: "35:21",
      uploadedAt: "Subido hace 2 Horas.",
      thumbSrc: "https://picsum.photos/seed/59/300/200",
    },
    {
      title: "02 - Pekos",
      agency: "Astros Viajes",
      duration: "07:21",
      uploadedAt: "Subido hace 2 Horas.",
      thumbSrc: "https://picsum.photos/seed/59/300/200",
    },
    // Agrega más objetos de video aquí...
  ];

  return (
    <div>
      <div className="flex">
        <div className="flex flex-row items-start justify-center mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-4 max-w-6xl">
            {videos.map((video, index) => (
              <VideoCard
                key={index}
                title={video.title}
                agency={video.agency}
                duration={video.duration}
                uploadedAt={video.uploadedAt}
                thumbSrc={video.thumbSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
