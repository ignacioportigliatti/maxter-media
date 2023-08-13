import { useState, useEffect } from "react";
import axios from "axios";

function useSignedUrl(filePath: string) {
  const [signedUrl, setSignedUrl] = useState("");

  useEffect(() => {
    const setUrl = async () => {
      try {
        if (!filePath) return;

        const signedUrl = await axios.post("/api/sign-url", {
          bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
          fileName: filePath,
          isUpload: false,
        });
        setSignedUrl(signedUrl.data.url);
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      }
    };

    setUrl();
  }, [filePath]);

  return signedUrl;
}

export default useSignedUrl;
