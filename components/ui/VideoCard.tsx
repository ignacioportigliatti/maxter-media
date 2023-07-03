import { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Agency } from "@prisma/client";
import { getSignedUrl } from "@/utils/googleStorage/getSignedUrl";

interface Props {
  title: string;
  agencyName: string;
  uploadedAt: string;
  filePath?: string;
}

export const VideoCard = (props: Props) => {
  const { title, agencyName, uploadedAt, filePath } = props;
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  

  useEffect(() => {
    const getSelectedAgency = async () => {
      try {
        const response = await fetch("/api/agencies");
        const agencies: Agency[] = await response.json();
        const agency = agencies.find(
          (agency: Agency) => agency.name === agencyName
        );
        setSelectedAgency(agency || null);
      } catch (error) {
        console.error("Error al obtener el logo de la agencia:", error);
      }
    };

    getSelectedAgency();
  }, [agencyName]);

  useEffect(() => {
    const getVideoSrc = async () => {
      try {
        const video = await getSignedUrl("maxter-media", filePath as string);
        setVideoSrc(video);
      } catch (error) {
        console.error("Error al obtener el video:", error);
      }
    };

    if (filePath) {
      getVideoSrc();
    }
  }, [filePath]);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      const player = videojs(videoRef.current, {
        sources: [
          {
            src: videoSrc,
            type: "video/mp4",
          },
        ],
      });

      return () => {
        player.dispose();
      };
    }
  }, [videoSrc]);

  const handleTitleClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div>
      <div className="min-w-[350px]">
        <div className="w-full flex flex-col">
          <div className="w-full">
            <video
              height={200}
              controls
              width={350}
              ref={videoRef}
              preload="metadata"
              className="video-js vjs-default-skin w-full"
            />

          </div>

          <div className="flex flex-row mt-3 gap-2">
            <a href="#">
              <img
                src={selectedAgency?.logoSrc as string}
                className="rounded-full max-h-10 max-w-10 mr-2"
              />
            </a>

            <div className="flex flex-col">
              <a href="#">
                <p
                  className="dark:text-gray-100 text-dark-gray text-sm font-semibold hover:text-orange-500"
                  onClick={handleTitleClick}
                >
                  {title}
                </p>
              </a>
              <p className="text-gray-400 text-xs">{agencyName}</p>
              <p className="text-gray-400 text-xs">{uploadedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
