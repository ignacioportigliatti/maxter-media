import React, { useState } from 'react'
import { TbDoorExit, TbDownload } from 'react-icons/tb'
import { Gallery, Item } from 'react-photoswipe-gallery'
import { FolderWithPhotos, Photo } from './PhotoGrid';
import Image from 'next/image';

type PhotoGalleryProps = {
    selectedFolder: string;
    handleGalleryClose: () => void;
    signedPhotos: any;
    folderWithPhotos: FolderWithPhotos;
}

const PhotoGallery = (props: PhotoGalleryProps) => {

    const { selectedFolder, handleGalleryClose, signedPhotos, folderWithPhotos } = props;
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState<boolean>(false);

    const handlePhotoClick = (photoKey: string) => {
        if (selectedPhotos.includes(photoKey)) {
          setSelectedPhotos((prevSelected) =>
            prevSelected.filter((key) => key !== photoKey)
          );
        } else {
          setSelectedPhotos((prevSelected) => [...prevSelected, photoKey]);
        }
      };


      const handleDownloadDropdown = () => {

      };

      const handleDownloadSelected = () => {
        // Generar una lista de URLs de las fotos seleccionadas
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
          <div className="fixed flex flex-row items-center w-full bg-dark-gray z-30 h-[50px] justify-end">
            <button
              onClick={handleGalleryClose}
              className="flex flex-row justify-center items-center button !border-0 duration-500"
            >
              <p className="!text-white text-sm font-semibold ">Volver</p>
              <TbDoorExit />
            </button>
            <div>

            <button
              onClick={handleDownloadDropdown}
              className="flex flex-row justify-center items-center button !border-0 duration-500"
            >
              <p className="!text-white text-sm font-semibold ">
                Descargar
              </p>
              <TbDownload />
            </button>
            {isDownloadDropdownOpen && (
              <div>

              </div>
            )}
            </div>
          </div>
          <div className="bg-medium-gray pt-[50px]">
            <Gallery id={selectedFolder} withDownloadButton>
              <div className="grid grid-cols-4 p-9 gap-2 relative top-0 animate-in fade-in-0 duration-1000">
                {signedPhotos.map((photo: Photo, index: number) => (
                  <div
                    className="cursor-pointer opacity-75 hover:opacity-100 transition duration-500 relative"
                    key={photo.Key}
                    
                  >
                    <div className="absolute top-0 left-0 p-2">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.includes(photo.Key)}
                        onChange={() => handlePhotoClick(photo.Key)}
                      />
                    </div>
                    <Item
                        original={photo.url}
                        thumbnail={photo.url}
                        id={photo.Key}
                      >
                        {({ ref, open }) => (
                          <Image
                            alt={`${selectedFolder} Foto ${index}`}
                            ref={ref as any}
                            onClick={open}
                            width={384}
                            height={180}
                            src={photo.url}
                            className="aspect-video object-cover object-center fade-in-0 duration-1000 rounded-md"
                            onLoad={(e) => {
                              e.currentTarget.className +=
                                " fade-in-0 duration-1000 animate";
                            }}
                          />
                        )}
                      </Item>
                  </div>
                ))}
                {selectedPhotos.length > 0 && (
                  <button
                    onClick={handleDownloadSelected}
                    className="flex flex-row items-center justify-center mt-2 p-2 bg-blue-500 text-white font-semibold rounded-md transition duration-300 hover:bg-blue-600"
                  >
                    Descargar {selectedPhotos.length} fotos
                  </button>
                )}
              </div>
            </Gallery>
          </div>
        </div>

  )
}

export default PhotoGallery