import React, { useEffect, useState } from "react";
import { TbDoorExit, TbDownload } from "react-icons/tb";
import { Gallery, Item } from "react-photoswipe-gallery";
import { FolderWithPhotos, Photo } from "./PhotoGrid";
import Image from "next/image";
import axios from "axios";

type PhotoGalleryProps = {
  selectedFolder: string;
  handleGalleryClose: () => void;
  folderWithPhotos: FolderWithPhotos;
};

const PhotoGallery = (props: PhotoGalleryProps) => {
  const { selectedFolder, handleGalleryClose, folderWithPhotos } = props;
  const [signedPhotos, setSignedPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photosToShow, setPhotosToShow] = useState<Photo[]>([]);

  useEffect(() => {
    const loadSignedPhotos = async () => {
      const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
      const newSignedPhotos = [];

      for (let i = 0; i < folderWithPhotos.photos.length; i += 6) {
        const photosChunk = folderWithPhotos.photos.slice(i, i + 6);
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
            console.error("Error obteniendo la URL firmada de la foto:", error);
          }
        });
        const signedPhotosChunk = await Promise.all(signedPhotoPromises);
        newSignedPhotos.push(...signedPhotosChunk);
        setPhotosToShow((prevPhotos) => [...prevPhotos, ...signedPhotosChunk]);
      }

      setSignedPhotos(newSignedPhotos);
    };

    loadSignedPhotos();
  }, [folderWithPhotos]);

  const handlePhotoClick = (photoKey: string) => {
    if (selectedPhotos.includes(photoKey)) {
      setSelectedPhotos((prevSelected) =>
        prevSelected.filter((key) => key !== photoKey)
      );
    } else {
      setSelectedPhotos((prevSelected) => [...prevSelected, photoKey]);
    }
  };

  const handleDownloadAlbum = () => {};

  const handleDownloadSelected = () => {
    const selectedUrls = selectedPhotos.map((photoKey) => {
      const selectedPhoto = signedPhotos.find(
        (photo: Photo) => photo.Key === photoKey
      );
      return selectedPhoto ? selectedPhoto.url : "";
    });

    console.log("selectedUrls", selectedUrls);
  };

  return (
    <div className="z-50 flex flex-col w-full h-full absolute top-0 left-0 bg-medium-gray ">
      <div className="fixed flex flex-row items-center w-full bg-dark-gray z-30 h-[50px] justify-between">
        <div className="h-full">
          {selectedPhotos.length > 0 && (
            <button
              onClick={handleDownloadSelected}
              className="button flex items-center justify-center !border-0 h-full duration-500"
            >
              <TbDownload className="!text-white"/> <p className="text-xs !text-white">Descargar {selectedPhotos.length} fotos</p>
            </button>
          )}
        </div>
        <div className="h-full justify-center items-center flex font-light text-md">
          {selectedFolder && `${selectedFolder} (${signedPhotos.length} Fotos)` }
        </div>
        <div className="flex flex-row justify-center items-center h-full">
          <button
            onClick={handleGalleryClose}
            className="flex flex-row h-full justify-center items-center button !border-0 duration-500"
          >
            <p className="!text-white text-sm font-semibold ">Volver</p>
            <TbDoorExit />
          </button>

          <button
            onClick={handleDownloadAlbum}
            className="flex flex-row h-full justify-center items-center button !border-0 duration-500"
          >
            <p className="!text-white text-sm font-semibold ">Descargar</p>
            <TbDownload />
          </button>
        </div>
      </div>
      <div className="bg-medium-gray pt-[50px]">
        <Gallery id={selectedFolder} withDownloadButton>
          <div className="grid grid-cols-4 p-9 gap-4 relative top-0 animate-in fade-in-0 duration-1000">
            {photosToShow.map((photo: Photo, index: number) => (
              <div
                className="cursor-pointer opacity-75 hover:scale-105 hover:shadow-xl hover:opacity-100 transition duration-500 relative"
                key={photo.url}
              >
                <div className="absolute top-0 left-0 p-2">
                  <input
                    type="checkbox"
                    checked={selectedPhotos.includes(photo.Key)}
                    onChange={() => handlePhotoClick(photo.Key)}
                  />
                </div>
                <Item original={photo.url} thumbnail={`${photo.url}?w=96&q=30`} id={photo.Key}>
                  {({ ref, open }) => (
                    <Image
                      alt={`${selectedFolder} Foto ${index}`}
                      ref={ref as any}
                      onClick={open}
                      width={384}
                      height={180}
                      src={photo.url}
                      className="aspect-[3/2] w-full shadow-md h-full object-cover object-center fade-in-0 duration-1000 rounded-md"
                      onLoad={(e) => {
                        e.currentTarget.className +=
                          " fade-in-0 duration-1000 animate";
                      }}
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
