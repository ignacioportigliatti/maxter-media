// useSignedVideoUrl.ts
import { useState, useEffect } from "react";
import axios from "axios";

function useSignedVideoUrl(filePath: string) {
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        if (!filePath) return;

        const signedVideo = await axios.post("/api/sign-url", {
          bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
          fileName: filePath,
        });

        setVideoSrc(signedVideo.data.url);
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      }
    };

    loadVideo();
  }, [filePath]);

  return videoSrc;
}

export default useSignedVideoUrl;
