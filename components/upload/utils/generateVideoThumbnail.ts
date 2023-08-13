import React, { useRef, useState, useEffect } from "react";

export const generateVideoThumbnail = async (videoUrl: string) => {
  const video = document.createElement("video");
  video.src = videoUrl;
  video.currentTime = 25;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  try {

    video.addEventListener("loadedmetadata", () => {
      canvas.height = video.videoHeight * 0.15;
      canvas.width = video.videoWidth * 0.15;
    });

    if (!context) {
      return;
    } else {
      context.drawImage(
        video,
        0,
        0,
        video.videoWidth * 0.15,
        video.videoHeight * 0.15
      );
    }

    const thumbnailBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob: any) => {
          if (blob) {
            console.log(blob);
            resolve(blob);
          }
          video.src = "";
          video.remove();
          canvas.remove();
        },
        "image/jpeg",
        0.95
      );
    });
    return thumbnailBlob as Blob;
  } catch (error) {
    console.error(error);
  }
};
