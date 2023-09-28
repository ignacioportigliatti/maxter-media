import { toast } from "react-toastify";
import { FolderWithPhotos } from "../PhotoGrid";
import axios from "axios";
import JSZip from "jszip";
import { downloadFile } from "./downloadFile";

export const handleDownloadAlbum = async (folderWithPhotos: FolderWithPhotos) => {
    toast.info(`Descargando ${folderWithPhotos.folder}...`, {
      autoClose: false,
      closeButton: false,
      toastId: "downloading-zip",
    });

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const getAllPhotosToDownload = async () => {
     
  
      const photoPromises = folderWithPhotos.photos.map(async (photo) => {
        try {
          const signedPhoto = await axios.post("/api/sign-url/", {
            bucketName: bucketName,
            fileName: photo.Key,
          });
          return {
            ...photo,
            url: signedPhoto.data.url,
          };
        } catch (error) {
          console.error("Error obtaining signed photo URL:", error);
          return null;
        }
      });
  
      const newSignedPhotos = await Promise.all(photoPromises)
  
      return newSignedPhotos
    }

    const allPhotosToDownload = await getAllPhotosToDownload();

    const zip = new JSZip();
    const totalPhotosToDownload = allPhotosToDownload.length;
    let downloadedPhotosCount = 0;

    await Promise.all(
      allPhotosToDownload.map(async (photo, index) => {
        try {
          const imgBlob = await fetch(photo.url).then((r) => r.blob());
          const pathComponents = photo.Key.split("/");
          const fileName = `${pathComponents[2]} - ${pathComponents[3]} - ${pathComponents[4]} - ${pathComponents[5]}`;
          zip.file(fileName, imgBlob);
          downloadedPhotosCount++;

          const progress =
            (downloadedPhotosCount / totalPhotosToDownload) * 100;
         

          toast.update("downloading-zip", {
            render: `Comprimiendo ${folderWithPhotos.folder} - ${downloadedPhotosCount}/${totalPhotosToDownload} Fotos (${progress.toFixed(
              0
            )}%)`,
            autoClose: false,
          });
        } catch (error) {
          console.error("Error al descargar la foto:", error);
        }
      })
    );

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const link = URL.createObjectURL(content);
      await downloadFile(link, `${folderWithPhotos.folder}.zip`);
      toast.success(`Descargado ${folderWithPhotos.folder}`);
      toast.dismiss("downloading-zip");
    } catch (error) {
      console.error("Error al descargar el álbum:", error);
      toast.error(`Error al descargar ${folderWithPhotos.folder}`);
    }
  };