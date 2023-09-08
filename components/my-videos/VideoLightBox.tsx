import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { TbDoorExit, TbDownload } from "react-icons/tb";
import VideoPlayer from "./VideoPlayer";
import { useSelector } from "react-redux";
import useSignedUrl from "../../hooks/useSignedUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { Agency } from "@prisma/client";

type VideoLightboxProps = {
  title: string;
  closeLightbox: () => void;
  agencyLogoSrc: string;
  videoIndex: number;
};

const VideoLightbox = (props: VideoLightboxProps) => {
  const { title, closeLightbox, agencyLogoSrc, videoIndex } = props;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(videoIndex);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isDownloading, setIsDownloading] = useState(false);
  const agency: Agency = useSelector((state: any) => state.agency);

  const reduxVideos = useSelector((state: any) => state.videos);

  const currentVideoSrc = reduxVideos[currentVideoIndex].video.url;

  const previousVideo = () => {
    const newIndex = Math.max(currentVideoIndex - 1, 0);
    setCurrentVideoIndex(newIndex);
    setCurrentTitle(
      reduxVideos[newIndex].video.Key.split("/")[3].split(".")[0]
    );
  };

  const nextVideo = () => {
    const newIndex = Math.min(currentVideoIndex + 1, reduxVideos.length - 1);
    setCurrentVideoIndex(newIndex);
    setCurrentTitle(
      reduxVideos[newIndex].video.Key.split("/")[3].split(".")[0]
    );
  };

  const handleVideoDownload = async () => {
    if (isDownloading) {
      // Si ya se está descargando, no hacer nada
      return;
    }

    setIsDownloading(true);

    try {
      const downloadVideoUrl = currentVideoSrc;

      const link = document.createElement("a");
      link.href = downloadVideoUrl;
      link.download = currentTitle;

      link.click();

      setIsDownloading(false);
    } catch (error) {
      console.error("Error al descargar el video:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-black z-50">
      <div className="fixed w-full z-50 flex justify-between items-center py-4 px-16 bg-opacity-80 ">
        <div className="flex items-center space-x-4">
          <div className="w-8">
            <Image
              src={agencyLogoSrc as string}
              alt="Maxter Logo"
              height={40}
              width={40}
            />
          </div>
          <div className="font-semibold text-white">{currentTitle}</div>
        </div>
        {/* Display download progress */}

        <div className="flex space-x-4">
          <button
            disabled={isDownloading === true ? true : false}
            onClick={handleVideoDownload}
            className="flex items-center space-x-1 text-white font-semibold transition-opacity duration-300 hover:opacity-70"
          >
            <TbDownload className="w-6 h-6" width={24} height={24} />
          </button>

          <button
            onClick={closeLightbox}
            className="flex items-center space-x-1 text-white font-semibold transition-opacity duration-300 hover:opacity-70"
          >
            <TbDoorExit className="w-6 h-6" width={24} height={24} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center flex-1">
        <div className="z-0 flex-1 w-full h-full max-h-screen justify-center items-center mx-auto overflow-hidden">
          {currentVideoSrc && (
            <VideoPlayer videoSrc={currentVideoSrc} onVideoEnded={nextVideo} />
          )}
        </div>
        {/* Previous Video Button */}
        <button className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-center w-12 h-full bg-opacity-0 transition duration-500 hover:opacity-70">
          <ArrowLeftFromLine
            onClick={previousVideo}
            className={`hover:animate-pulse active:animate-ping`}
          />
        </button>
        {/* Next Video Button */}
        <button className="absolute top-1/2 right-0  -translate-y-1/2 flex items-center justify-center w-12 h-full bg-opacity-0 transition duration-500 hover:opacity-70">
          <ArrowRightFromLine
            onClick={nextVideo}
            className={`hover:animate-pulse active:animate-ping`}
          />
        </button>
      </div>
    </div>
  );
};

export default VideoLightbox;
