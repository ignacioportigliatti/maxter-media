import React, { useRef, useEffect } from "react";

interface VideoPlayerProps {
  videoSrc: string;
  onVideoEnded: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props: VideoPlayerProps) => {
  const { videoSrc, onVideoEnded } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initPlayer = async () => {
        try {
          const shaka = require('shaka-player/dist/shaka-player.ui.js');
          await shaka.polyfill.installAll();
          const videoElement = videoRef.current;
          const player = new shaka.Player(videoElement);

          // Habilitar el AdaptationRateBased ABR
          const abrConfig = {
            enabled: true,
          };
          player.configure({abr: abrConfig});

          // Definir las representaciones de diferentes calidades
          const manifestUri = videoSrc;
          await player.load(manifestUri);

          videoElement?.addEventListener("ended", onVideoEnded);
        } catch (error) {
          console.error("Error loading DASH video:", error);
        }
      };

      initPlayer();
    }
  }, [videoSrc]);

  return (
    <video
      ref={videoRef}
      autoPlay
      className={`w-full h-full`}
      controls
      onEnded={() => onVideoEnded()}
    />
  );
};

export default VideoPlayer;
