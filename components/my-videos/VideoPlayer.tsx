import React, { useRef, useEffect } from "react";
const shaka = require('shaka-player/dist/shaka-player.ui.js');

interface VideoPlayerProps {
  videoSrc: string;
  onVideoEnded: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props: VideoPlayerProps) => {
  const { videoSrc, onVideoEnded } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const initPlayer = async () => {
      try {
        await shaka.polyfill.installAll();

        const videoElement = videoRef.current;
        const player = new shaka.Player(videoElement);
        // Configurar ABR automático
        player.configure({
          abr: { enabled: true },
          'overflowMenuButtons': ['quality'],
        });

        await player.load(videoSrc);

        videoElement?.addEventListener("ended", onVideoEnded);
      } catch (error) {
        console.error("Error al cargar el video DASH:", error);
      }
    };

    initPlayer();
  }, [videoSrc, onVideoEnded]);

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
