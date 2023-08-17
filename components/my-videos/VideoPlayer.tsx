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
      // This ensures the following code runs only on the client-side
      const initPlayer = async () => {
        try {
          const shaka = require('shaka-player/dist/shaka-player.compiled.js');
          await shaka.polyfill.installAll();

          const videoElement = videoRef.current;
          const player = new shaka.Player(videoElement);

          player.configure({
            abr: { enabled: true },
            'overflowMenuButtons': ['quality'],
          });

          await player.load(videoSrc);

          videoElement?.addEventListener("ended", onVideoEnded);
        } catch (error) {
          console.error("Error loading DASH video:", error);
        }
      };

      initPlayer();
    }
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
