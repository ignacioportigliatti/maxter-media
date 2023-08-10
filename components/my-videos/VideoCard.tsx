// VideoCard.tsx
import { useEffect, useState } from "react";
import HoverVideoPlayer from "react-hover-video-player";
import useSignedVideoUrl from "./hooks/useSignedVideoUrl";
import { useSelector } from "react-redux";
import { Agency, Group } from "@prisma/client";
import VideoLightbox from "./VideoLightBox";
import VideoThumbnail from "./VideoThumbnail"; // use npm published version
import axios from "axios";
import Image from "next/image";

interface VideoCardProps {
  title: string;
  agencyName: string;
  uploadedAt: string;
  filePath?: string;
  videoIndex: number;
}

export const VideoCard = (props: VideoCardProps) => {
  const { title, agencyName, uploadedAt, filePath, videoIndex } = props;
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const selectedAgency: Agency = useSelector((state: any) => state.agency);

  const videoSrc: string | undefined = useSignedVideoUrl(filePath as string);

  const openLightbox = () => {
    setLightboxIsOpen(true);
  };

  const closeLightbox = () => {
    setLightboxIsOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6 lg:w-1/4 md:w-1/3 w-full px-4 md:p-0">
        <div
          className="cursor-pointer"
          onClick={openLightbox}
        >
          <HoverVideoPlayer
            videoSrc={videoSrc}
            playbackRangeStart={25}
            playbackRangeEnd={30}
            preload="metadata"
            unloadVideoOnPaused
            disableRemotePlayback
            sizingMode="overlay"
            disablePictureInPicture
            loadingOverlay={
              <div className="flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            }
            pausedOverlayWrapperClassName="block"
            pausedOverlay={
              <VideoThumbnail
                videoUrl={videoSrc as string}
                snapshotAtTime={25}
                width={300}
              />
            }
          />
        </div>

        <div className="flex flex-row">
          <a href="#">
            <Image
              src={selectedAgency?.logoSrc as string}
              alt="Agency Logo"
              width={40}
              height={40}
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
      <div>
        {lightboxIsOpen && (
          <VideoLightbox
            videoIndex={videoIndex}
            videoSrc={videoSrc}
            title={title}
            closeLightbox={closeLightbox}
            agencyLogoSrc={selectedAgency?.logoSrc as string}
          />
        )}
      </div>
    </>
  );
};
