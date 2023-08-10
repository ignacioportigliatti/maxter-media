import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";

interface VideoThumbnailProps {
  cors?: boolean;
  width?: number;
  height?: number;
  renderThumbnail?: boolean;
  snapshotAtTime?: number;
  thumbnailHandler?: (thumbnail: string) => void;
  videoUrl: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  cors = false,
  width,
  height,
  renderThumbnail = true,
  snapshotAtTime = 2,
  thumbnailHandler,
  videoUrl,
}) => {
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [suspended, setSuspended] = useState(false);
  const [seeked, setSeeked] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const ThumbnailImage = () => {
    return (
      <div className="react-thumbnail-generator">
        <img src={snapshot as string} className="h-full" alt="my video thumbnail" />
      </div>
    );
  };

  const getSnapshot = () => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      if (!width || !height) {
        context.drawImage(video, 0, 0);
      } else {
        context.drawImage(video, 0, 0, width, height);
      }

      const thumbnail = canvas.toDataURL("image/png");

      video.src = "";
      video.remove();
      canvas.remove();

      setSnapshot(thumbnail);
      setThumbnailLoaded(true);
      if (thumbnailHandler) {
        thumbnailHandler(thumbnail);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (videoRef.current && !cors) {
      videoRef.current.setAttribute("crossOrigin", "Anonymous");
    }
  }, []);

  useEffect(() => {
    if (!snapshot) {
      if (metadataLoaded && dataLoaded && suspended) {
        if (
          !videoRef.current?.currentTime ||
          videoRef.current?.currentTime < snapshotAtTime
        ) {
          if (videoRef.current) {
            videoRef.current.currentTime = snapshotAtTime;
          }
        }

        if (seeked && !snapshot) {
          getSnapshot();
        }
      }
    }
  }, [metadataLoaded, dataLoaded, suspended, seeked, snapshot, snapshotAtTime]);

  return (
    <div className="react-thumbnail-generator min-h-[150px] w-full h-full">
      {!snapshot && (
        <div className="w-full h-full">
          <canvas className="snapshot-generator" ref={canvasRef}></canvas>
          <video
            muted
            className="snapshot-generator"
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={() => setMetadataLoaded(true)}
            onLoadedData={() => setDataLoaded(true)}
            onSuspend={() => setSuspended(true)}
            onSeeked={() => setSeeked(true)}
          ></video>
        </div>
      )}
      {thumbnailLoaded === true ? (
        <ThumbnailImage />
      ) : (
        <div className="flex w-full h-full min-h-[250px] md:min-h-[150px] animate-pulse bg-gray-400">
          <p>Cargando</p>
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
