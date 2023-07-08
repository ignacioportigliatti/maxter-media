export const generateVideoThumbnail = (file: File) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");
  
      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
      console.log('videosrc', video.src);
  
      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");
  
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        if(ctx) {
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        }
        
        video.pause();
        const dataBlob = canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/png");
        resolve(dataBlob);
        return dataBlob;
      };
    });
  };