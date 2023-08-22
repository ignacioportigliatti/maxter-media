import React, { useEffect, useRef, useState } from "react";
import { TbDoorExit, TbDownload } from "react-icons/tb";
import { Gallery, Item } from "react-photoswipe-gallery";
import { FolderWithPhotos, Photo } from "./PhotoGrid";
import Image from "next/image";
import axios from "axios";
import JSZip from "jszip";

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
  const selectedFolder = folderWithPhotos.folder;

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
  }, [folderWithPhotos]);

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

  const handleDownloadAlbum = async () => {
    // Ensure that all photos are signed before downloading
    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const unsavedPhotos = folderWithPhotos.photos.filter(
      (photo) =>
        !signedPhotos.some((signedPhoto) => signedPhoto.Key === photo.Key)
    );

    const unsavedPhotoPromises = unsavedPhotos.map(async (photo) => {
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

    const newSignedPhotos = (await Promise.all(unsavedPhotoPromises)).filter(
      (photo) => photo !== null
    );

    const allPhotosToDownload = [...signedPhotos, ...newSignedPhotos];

    // Create the ZIP file and initiate the download
    const zip = new JSZip();

    await Promise.all(
      allPhotosToDownload.map(async (photo) => {
        const response = await fetch(photo.url);
        const pathComponents = photo.Key.split("/");
        const blob = await response.blob();
        const fileName = `${pathComponents[2]} - ${pathComponents[3]} - ${pathComponents[4]} - ${pathComponents[5]}`;
        zip.file(fileName, blob);
      })
    );

    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = selectedFolder;
      link.click();
    });
  };

  const downloadFile = async (url: string, fileName: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.jpg`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  const handleDownloadSelected = () => {
    selectedPhotos.forEach((photoKey) => {
      const selectedPhoto = signedPhotos.find(
        (photo) => photo.Key === photoKey
      );
      if (selectedPhoto) {
        const pathComponents = selectedPhoto.Key.split("/");
        const fileName = `${pathComponents[2]} - ${pathComponents[3]} - ${pathComponents[4]} - ${pathComponents[5]}`;
        downloadFile(selectedPhoto.url, fileName);
      }
    });
  };

  return (
    <div className="z-50 flex flex-col w-full h-full absolute top-0 left-0 bg-medium-gray ">
      <div className="fixed flex flex-row items-center w-full bg-dark-gray z-30 h-[50px] justify-between">
        <div className="h-full w-full">
          {selectedPhotos.length > 0 && (
            <button
              onClick={handleDownloadSelected}
              className="button flex items-center justify-center !border-0 h-full duration-500"
            >
              <TbDownload className="!text-white" />{" "}
              <p className="text-xs !text-white">
                Descargar {selectedPhotos.length} fotos
              </p>
            </button>
          )}
        </div>
        <div className="h-full w-full justify-center items-center flex font-light text-md">
          {selectedFolder &&
            `${selectedFolder} (${folderWithPhotos.photos.length} Fotos)`}
        </div>
        <div className="flex w-full flex-row justify-end items-center h-full">
          <button
            onClick={handleGalleryClose}
            className="flex flex-row h-full justify-center items-center button !border-0 duration-500"
          >
            <p className="!text-white hidden md:block text-xs  md:text-sm font-semibold ">
              Volver
            </p>
            <TbDoorExit />
          </button>

          <button
            onClick={handleDownloadAlbum}
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
        <Gallery id={selectedFolder} withDownloadButton>
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
                  <div className="cursor-pointer opacity-75 hover:scale-105 hover:shadow-xl hover:opacity-100 transition duration-500 relative">
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
    <div
      className={`absolute top-0 left-0 p-4 ${
        selectedPhotos.includes(photo.Key) ? "z-10" : "z-20"
      }`}
    >
      <input
        className="w-5 h-5 rounded-md"
        type="checkbox"
        checked={selectedPhotos.includes(photo.Key)}
        onChange={() => handlePhotoClick(photo.Key)}
      />
    </div>
    <Item
      original={photo.url}
      thumbnail={`${photo.url}?w=96&q=30`}
      id={photo.Key}
    >
      {({ ref, open }) => (
        <div className="aspect-[3/2] w-full shadow-md h-full object-cover object-center fade-in-0 duration-1000 rounded-md">
          <img
            loading="lazy"
            alt=""
            ref={(img) => {
            
              // Esperar a que la imagen esté completamente cargada antes de mostrarla
              if (img && img.complete) {
                setLoadedPhotosCount(index + 1);
              }
            }}
            onClick={open}
            width={384}
            height={180}
            src={photo.url}
            className={`w-full h-full object-cover object-center absolute top-0 left-0 transition-opacity ${
              loadedPhotosCount > index ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`w-full h-full absolute top-0 left-0 transition ${
              loadedPhotosCount > index ? "opacity-0" : "opacity-100 bg-light-gray animate-pulse duration-1000"
            }`}
          ></div>
        </div>
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
