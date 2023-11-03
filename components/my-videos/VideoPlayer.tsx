import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import VideoJS from "./VideoJS";


interface VideoPlayerProps {
  videoSrc: string;
  onVideoEnded: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props: VideoPlayerProps) => {
  const { videoSrc, onVideoEnded } = props;
  const playerRef = React.useRef(null);


  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    disablePictureInPicture: true,
    preload: 'metadata',
    sources: [
      {
        src: videoSrc,
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player: typeof videojs.players) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />

  );
};

export default VideoPlayer;
