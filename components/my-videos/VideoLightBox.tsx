import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { TbDoorExit, TbDownload } from "react-icons/tb";
import VideoPlayer from "./VideoPlayer";
import { useSelector } from "react-redux";
import useSignedVideoUrl from "./hooks/useSignedVideoUrl";

type VideoLightboxProps = {
  videoSrc: string;
  title: string;
  closeLightbox: () => void;
  agencyLogoSrc: string;
  videoIndex: number;
};

const VideoLightbox = (props: VideoLightboxProps) => {
    const { videoSrc, title, closeLightbox, agencyLogoSrc, videoIndex } = props;
    const [currentVideoIndex, setCurrentVideoIndex] = useState(videoIndex);
    const [currentTitle, setCurrentTitle] = useState(title);
    const videos = useSelector((state: any) => state.videos);
  
    // Call the hook directly in the component body
    const currentVideoSrc = useSignedVideoUrl(videos[currentVideoIndex].Key);
  
    const previousVideo = () => {
      const newIndex = Math.max(currentVideoIndex - 1, 0);
      setCurrentVideoIndex(newIndex);
      setCurrentTitle(videos[newIndex].Key.split("/")[3].split(".")[0]);
    };
  
    const nextVideo = () => {
      const newIndex = Math.min(currentVideoIndex + 1, videos.length - 1);
      setCurrentVideoIndex(newIndex);
      setCurrentTitle(videos[newIndex].Key.split("/")[3].split(".")[0]);
    };
  
    return (
        <div className="fixed inset-0 flex flex-col bg-black z-50">
          <div className="flex justify-between items-center py-2 px-4 bg-opacity-80 bg-gray-900">
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
            <div className="flex space-x-4">
              <button
                onClick={closeLightbox}
                className="flex items-center space-x-1 text-white font-semibold transition-opacity duration-300 hover:opacity-70"
              >
                <p>Volver</p>
                <TbDoorExit />
              </button>
              <button
                onClick={closeLightbox}
                className="flex items-center space-x-1 text-white font-semibold transition-opacity duration-300 hover:opacity-70"
              >
                <p>Descargar</p>
                <TbDownload />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center flex-1">
            <button
              onClick={previousVideo}
              className="flex items-center justify-center w-12 h-full bg-gray-800 bg-opacity-50 transition-opacity duration-300 hover:opacity-70"
            >
              <ArrowLeftFromLine />
            </button>
            <div className="flex justify-center flex-1">
      <div className="flex-1 max-w-screen-xl mx-auto overflow-hidden">
        {videoSrc && (
          <VideoPlayer
            videoSrc={currentVideoSrc ? currentVideoSrc : videoSrc}
            onVideoEnded = {nextVideo}
          />
        )}
      </div>
    </div>
            <button
              onClick={nextVideo}
              className="flex items-center justify-center w-12 h-full bg-gray-800 bg-opacity-50 transition-opacity duration-300 hover:opacity-70"
            >
              <ArrowRightFromLine />
            </button>
          </div>
        </div>
      );
      
};

export default VideoLightbox;
