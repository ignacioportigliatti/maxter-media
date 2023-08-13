import React, { useState, useEffect, useRef } from "react";

interface VideoThumbnailProps {
  cors?: boolean;
  width?: number;
  height?: number;
  renderThumbnail?: boolean;
  snapshotAtTime?: number;
  thumbnailHandler?: (thumbnail: string) => void;
  videoUrl: string;
  videoId: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  cors = false,
  width,
  height,
  renderThumbnail = true,
  snapshotAtTime = 2,
  thumbnailHandler,
  videoUrl,
  videoId,
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
      thumbnailLoaded && (
        <img
          src={snapshot as string}
          className="h-full w-full object-fill "
          alt="my video thumbnail"
        />
      )
    );
  };

  const getSnapshot = async () => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.height = video.videoHeight * 0.15;
      canvas.width = video.videoWidth * 0.15;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      if (!width || !height) {
        context.drawImage(
          video,
          0,
          0,
          video.videoWidth * 0.15,
          video.videoHeight * 0.15
        );
      } else {
        context.drawImage(video, 0, 0, width, height);
      }

      const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.95);

      if (thumbnailUrl) {
        const img = new Image();
        img.onload = function () {
          console.log(
            "For image",
            img.crossOrigin ? "WITH" : "without",
            "crossOrigin set"
          );
          try {
            const ctx = document.createElement("canvas").getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              ctx.getImageData(0, 0, 1, 1);
            } else {
              console.log("Canvas is not supported");
            }
            console.log("canvas still clean");
          } catch (error) {
            console.error("Canvas error:", error);
          }
        };
        img.src = thumbnailUrl;

        console.log(thumbnailUrl);
        video.src = "";
        video.remove();
        canvas.remove();
        localStorage.setItem(videoId, thumbnailUrl);
        setSnapshot(thumbnailUrl);
        setThumbnailLoaded(true);
        if (thumbnailHandler) {
          thumbnailHandler(thumbnailUrl);
        }
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
    const cachedThumbnail = localStorage.getItem(videoUrl);

    if (cachedThumbnail) {
      setSnapshot(cachedThumbnail);
      setThumbnailLoaded(true);
    } else {
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
    <div className="react-thumbnail-generator min-h-[200px] w-full h-full">
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
        <div className="flex w-full h-full min-h-[250px] md:min-h-[200px] animate-pulse bg-gray-400">
          <p>Cargando</p>
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
