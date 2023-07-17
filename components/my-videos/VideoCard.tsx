import { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Agency } from "@prisma/client";
import { getSignedUrl } from "@/utils/googleStorage/getSignedUrl";
import Image from "next/image";
import { TbDoorExit, TbDownload } from "react-icons/tb";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

interface VideoCardProps {
  title: string;
  agencyName: string;
  uploadedAt: string;
  filePath?: string;
}

export const VideoCard = (props: VideoCardProps) => {
  const { title, agencyName, uploadedAt, filePath } = props;
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<string[]>([]); // Array de rutas de video
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const previousVideo = () => {
    setCurrentVideoIndex((prevIndex) => prevIndex - 1);
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prevIndex) => prevIndex + 1);
  };

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

  useEffect(() => {
    if (lightboxIsOpen) {
      // Evitar scroll en la página de fondo
      document.body.style.overflow = "hidden";
    } else {
      // Habilitar scroll en la página de fondo
      document.body.style.overflow = "";
    }

    // Restaurar el estado original cuando el componente se desmonte
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIsOpen]);

  const openLightbox = () => {
    setLightboxIsOpen(true);
  };

  const closeLightbox = () => {
    setLightboxIsOpen(false);
  };

  return (
    <div>
      <div className="min-w-[350px]">
        <div className="w-full flex flex-col">
          <div className="w-full cursor-pointer">
            <Image
              height={320}
              width={640}
              src="https://via.placeholder.com/350x200.png?text=Thumbnail"
              alt=""
              onClick={openLightbox}
            />
          </div>

          <div className="flex flex-row mt-3 gap-2">
            <a href="#">
              <img
                src={selectedAgency?.logoSrc as string}
                alt="Agency Logo"
                className="rounded-full max-h-10 max-w-10 mr-2"
              />
            </a>

            <div className="flex flex-col">
              <a href="#">
                <p
                  className="dark:text-gray-100 text-dark-gray text-sm font-semibold hover:text-orange-500 cursor-pointer"
                  onClick={openLightbox}
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
      {lightboxIsOpen && (
        <div className="fixed flex flex-col top-0 left-0 fade-in-0 animate-in duration-500 w-screen h-full bg-medium-gray  items-center justify-center">
          <div className="flex flex-row items-center w-full bg-dark-gray min-h-[50px] justify-between px-10">
            <div className="w-8">
              <Image
                src={selectedAgency?.logoSrc as string}
                alt="Maxter Logo"
                height={40}
                width={40}
              />
            </div>
            <div>
              <p className="font-semibold">{title}</p>
            </div>

            <div className="flex flex-row items-center">
              <button
                onClick={closeLightbox}
                className="flex flex-row justify-center items-center button !border-0 duration-500"
              >
                <p className="!text-white text-sm font-semibold ">Volver</p>
                <TbDoorExit />
              </button>
              <button
                onClick={closeLightbox}
                className="flex flex-row justify-center items-center button !border-0 duration-500"
              >
                <p className="!text-white text-sm font-semibold ">Descargar</p>
                <TbDownload />
              </button>
            </div>
          </div>
          <div className="flex min-h-fit">
            <button
              onClick={previousVideo}
              className="flex flex-row justify-center items-center button !border-0 duration-500"
            >
              <ArrowLeftFromLine />
            </button>
            <div className=" z-50 w-full h-full px-48 py-9 overflow-hidden">
              {videoRef && (
                <video
                  onLoadStart={() => {
                    setIsLoading(true);
                  }}
                  onLoad={() => {
                    setIsLoading(false);
                  }}
                  autoPlay
                  className={`video-js vjs-default-skin w-full h-full`}
                  preload="metadata"
                  controls
                  muted
                  ref={videoRef}
                  src={videoSrc as string}
                />
              )}
            </div>
            <button
              onClick={nextVideo}
              className="flex flex-row justify-center items-center button !border-0 duration-500"
            >
              <ArrowRightFromLine />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
