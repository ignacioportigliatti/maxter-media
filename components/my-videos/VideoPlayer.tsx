import React from "react";

interface VideoPlayerProps {
  videoSrc: string;
  onVideoEnded: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props: VideoPlayerProps ) => {
    const { videoSrc, onVideoEnded } = props;
  return (
    <video
      autoPlay
      className={`w-full h-full`}
      preload="metadata"
      controls
      src={videoSrc}
      onEnded={() => onVideoEnded()}
    />
  );
};

export default VideoPlayer;
