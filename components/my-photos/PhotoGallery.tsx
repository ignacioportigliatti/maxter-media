import React, { useEffect, useRef, useState } from "react";
import { TbDoorExit, TbDownload } from "react-icons/tb";
import { Gallery, Item } from "react-photoswipe-gallery";
import { FolderWithPhotos, Photo } from "./PhotoGrid";
import axios from "axios";
import JSZip from "jszip";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Agency } from "@prisma/client";
import { handleDownloadAlbum } from "./utils/handleDownloadAlbum";
import { downloadFile } from "./utils/downloadFile";

type PhotoGalleryProps = {
  handleGalleryClose: () => void;
  folderWithPhotos: FolderWithPhotos;
};

const PhotoGallery = (props: PhotoGalleryProps) => {
  const { handleGalleryClose, folderWithPhotos } = props;
  const [signedPhotos, setSignedPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photosToShow, setPhotosToShow] = useState<Photo[]>([]);
  const [loadedPhotosCount, setLoadedPhotosCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const lastPhotoRef = useRef<HTMLDivElement | null>(null);
  const [buttonIsHovered, setButtonIsHovered] = useState(false);
  const selectedFolder = folderWithPhotos.folder;
  const selectedAgency: Agency = useSelector((state: any) => state.agency);

  useEffect(() => {
    const loadInitialPhotos = async () => {
      const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
      const initialPhotosChunk = folderWithPhotos.photos.slice(0, 12);

      const signedPhotoPromises = initialPhotosChunk.map(async (photo) => {
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
        }
      });

      const initialSignedPhotos = await Promise.all(signedPhotoPromises);
      setSignedPhotos(initialSignedPhotos);
      setPhotosToShow(initialSignedPhotos);
      setLoadedPhotosCount(initialSignedPhotos.length);
    };

    loadInitialPhotos();
  }, []);

  const loadMorePhotos = async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    const startIndex = loadedPhotosCount;
    const endIndex = startIndex + 4;

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const photosChunk = folderWithPhotos.photos.slice(startIndex, endIndex);

    const signedPhotoPromises = photosChunk.map(async (photo) => {
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
      }
    });

    const newSignedPhotos = await Promise.all(signedPhotoPromises);
    setSignedPhotos([...signedPhotos, ...newSignedPhotos]);
    setPhotosToShow([...photosToShow, ...newSignedPhotos]);
    setLoadedPhotosCount(endIndex);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    if (!lastPhotoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePhotos();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(lastPhotoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [lastPhotoRef.current, loadMorePhotos]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    console.log("scrolling");
    const target = e.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      loadMorePhotos();
    }
  };

  const handlePhotoClick = (photoKey: string) => {
    if (selectedPhotos.includes(photoKey)) {
      setSelectedPhotos((prevSelected) =>
        prevSelected.filter((key) => key !== photoKey)
      );
    } else {
      setSelectedPhotos((prevSelected) => [...prevSelected, photoKey]);
    }
  };

  


  const handleDownloadSelected = async () => {
    try {
      toast.info(`Descargando ${selectedPhotos.length} fotos...`, {
        toastId: "downloading-multiple",
        autoClose: 1500,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
      });

      const duplicateArray = async () => {
        return [...selectedPhotos];
      }

      const selectedPhotosCopy = await duplicateArray();
  
      const downloadNextPhoto = async (index: number) => {
        if (index < selectedPhotosCopy.length) {
          const selectedPhoto = signedPhotos.find(
            (photo) => photo.Key === selectedPhotosCopy[index]
          );
  
          if (selectedPhoto) {
            console.log("Descargando foto:", selectedPhoto);
            const pathComponents = selectedPhoto.Key.split("/");
            const fileName = `${pathComponents[2]} - ${pathComponents[3]} - ${pathComponents[4]} - ${pathComponents[5]}.jpg`;
  
            try {
              await downloadFile(selectedPhoto.url, fileName);
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 segundo antes de continuar con la siguiente descarga
            } catch (error) {
              console.error("Error al descargar la foto:", error);
              toast.error(`Error al descargar ${fileName}`);
            }
  
            // Descargar la siguiente foto
            await downloadNextPhoto(index + 1);
          }
        }
      }
  
      await downloadNextPhoto(0); // Comienza la descarga con la primera foto
      setSelectedPhotos([]);
    } catch (error) {
      console.error("Error al descargar las fotos:", error);
      toast.error("Error al descargar las fotos");
    }
  };
  

  return (
    <div className="z-50 flex flex-col w-full h-full absolute top-0 left-0 bg-medium-gray ">
      <div className="fixed flex flex-row items-center w-full bg-dark-gray z-30 h-[50px] justify-between">
        <div className="h-full w-full">
          {selectedPhotos.length > 0 && (
            <button
              onClick={handleDownloadSelected}
              className="button flex w-max items-center justify-center !border-0 h-full duration-500"
            >
              <TbDownload className="!text-white" />{" "}
              <p className="text-[10px] md:text-sm !text-white">
                Descargar {selectedPhotos.length} fotos
              </p>
            </button>
          )}
        </div>
        <div className="h-full w-full justify-center items-center flex font-light text-xs md:text-base">
          {selectedFolder &&
            `${selectedFolder} (${folderWithPhotos.photos.length} Fotos)`}
        </div>
        <div className="flex w-full flex-row justify-end items-center h-full">
          <button
            onMouseEnter={() => {}}
            onMouseLeave={() => setButtonIsHovered(false)}
            onClick={handleGalleryClose}
            style={{
              backgroundColor: buttonIsHovered
                ? (selectedAgency.primaryColor as string)
                : "transparent",
            }}
            className={`flex flex-row h-full justify-center items-center px-5 py-2 text-sm transition-colors duration-200 
             gap-x-2  text-gray-200 hover:text-white`}
          >
            <p className="!text-white hidden md:block text-xs  md:text-sm font-semibold ">
              Volver
            </p>
            <TbDoorExit />
          </button>

          <button
            onClick={() => handleDownloadAlbum(folderWithPhotos)}
            className="flex flex-row h-full justify-center items-center button !border-0 duration-500"
          >
            <p className="!text-white hidden md:block text-xs md:text-sm font-semibold ">
              Descargar
            </p>
            <TbDownload />
          </button>
        </div>
      </div>
      <div className="bg-medium-gray pt-[50px]">
        <Gallery
          id={selectedFolder}
          options={{
            preload: [1, 3],
            bgOpacity: 0.9,
            bgClickAction: "close",
            loop: false,
            counter: false,
            showHideAnimationType: "fade",
            hideAnimationDuration: 333,
            wheelToZoom: true,
          }}
          withDownloadButton
        >
          <div
            onScroll={handleScroll}
            className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 p-9 gap-4 relative top-0 animate-in fade-in-0 duration-1000"
          >
            {(photosToShow.length > 0
              ? photosToShow
              : new Array(12).fill(null)
            ).map((photo: Photo | null, index: number) => {
              if (!photo) {
                return (
                  <div
                    key={index}
                    className="cursor-pointer opacity-75 hover:scale-105 hover:shadow-xl hover:opacity-100 transition duration-500 relative"
                  >
                    <div className="absolute top-0 left-0 p-4">
                      <div className="w-5 h-5 bg-gray-300 animate-pulse rounded-md"></div>
                    </div>
                    <div className="aspect-[3/2] w-full shadow-md h-full bg-gray-300 animate-pulse rounded-md"></div>
                  </div>
                );
              }
            })}
            {photosToShow.map((photo: Photo, index: number) => (
              <div
                ref={index === photosToShow.length - 1 ? lastPhotoRef : null}
                className="cursor-pointer opacity-75 hover:scale-105 hover:shadow-xl hover:opacity-100 transition duration-500 relative"
                key={photo.url}
              >
                <div className="absolute top-0 left-0 p-4">
                  <input
                    className="w-5 h-5 bg-white rounded-md"
                    type="checkbox"
                    checked={selectedPhotos.includes(photo.Key)}
                    onChange={() => handlePhotoClick(photo.Key)}
                  />
                </div>
                <Item
                  original={photo.url}
                  thumbnail={photo.url}
                  id={photo.Key}
                  alt={`${selectedFolder} Foto ${index}`}
                >
                  {({ ref, open }) => (
                    <img
                      alt={`${selectedFolder} Foto ${index}`}
                      ref={ref as any}
                      onClick={open}
                      src={photo.url}
                      className="aspect-[3/2] w-full shadow-md h-full object-cover object-center fade-in-0 duration-1000 rounded-md"

                    />
                  )}
                </Item>
              </div>
            ))}
          </div>
        </Gallery>
      </div>
    </div>
  );
};

export default PhotoGallery;
