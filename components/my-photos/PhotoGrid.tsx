"use client";

import { useEffect, useState } from "react";
import { getGoogleStorageFiles } from "@/utils";
import { Agency, Group } from "@prisma/client";
import { getSignedUrl } from "@/utils/googleStorage/getSignedUrl";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import Image from "next/image";
import { TbDoorExit, TbDownload, TbPhotoPlus } from "react-icons/tb";
import { useSelector } from "react-redux";

interface PhotoGridProps {
  selectedGroup: Group;
}

interface FolderWithPhotos {
  folder: string;
  photos: any[];
  thumbnail: string;
}

export const PhotoGrid = (props: PhotoGridProps) => {
  const { selectedGroup } = props;

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [cachedPhotos, setCachedPhotos] = useState<Record<string, any[]>>({});
  const selectedAgency: Agency = useSelector((state: any) => state.agency);
  const foldersWithPhotos: FolderWithPhotos[] = useSelector((state: any) => state.photos);

  

  const handleGalleryClose = () => {
    setIsGalleryOpen(false);
  };

 

  const handleFolderClick = async (folder: string) => {
    setSelectedFolder(folder);
    setIsGalleryOpen((prev) => !prev);

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;

    if (cachedPhotos[folder]) {
      return;
    }

    try {
      const folderWithPhotos = foldersWithPhotos.find(
        (folderWithPhotos) => folderWithPhotos.folder === folder
      );

      if (!folderWithPhotos) {
        return;
      }

      const signedPhotos: any[] = [];

      for (const photo of folderWithPhotos.photos) {
        const signedPhoto = await getSignedUrl(
          bucketName as string,
          photo.name
        );
        signedPhotos.push({ ...photo, url: signedPhoto });
        setCachedPhotos((prevState) => ({
          ...prevState,
          [folder]: signedPhotos,
        }));
      }
    } catch (error) {
      console.error("Error al obtener las URL firmadas de las fotos:", error);
    }
  };

  const formatUploadedAt = (dateString: string) => {
    const currentDate = new Date();
    const uploadedDate = new Date(dateString);
    const timeDiff = currentDate.getTime() - uploadedDate.getTime();

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Subido hace ${days} día${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `Subido hace ${hours} hora${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `Subido hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    } else {
      return "Subido hace unos segundos";
    }
  };

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2">
      {/* Mapeo de carpetas con fotos */}
      {foldersWithPhotos.map((folderWithPhotos) => (
        <div className="" key={folderWithPhotos.folder}>
          {/* Mapeo de fotos de la carpeta solicitada */}
          <div className="relative flex items-center justify-center cursor-pointer opacity-75 hover:opacity-100 transition duration-500 group">
            <div className="absolute transition duration-500 top-0 right-0 opacity-0 group-hover:opacity-100 p-1 bg-black/80 text-gray-400 text-xs">
              {
                <span className="bg-orange-500 px-1 text-white">{`${folderWithPhotos.photos.length}`}</span>
              }{" "}
              Fotos
            </div>
            <p className="absolute bottom-0 text-xs !text-white left-0 px-2 py-1 group-hover:bg-black transition duration-500 bg-black/80">
              {"24/11"}
            </p>
            <Image
              src={folderWithPhotos.thumbnail} // Utilizar la miniatura como fuente de la imagen
              alt={`${folderWithPhotos.folder} Foto 0`}
              width={384}
              height={180}
              onClick={() => handleFolderClick(folderWithPhotos.folder)}
            />
          </div>
          <div className="flex flex-row mt-3 gap-2">
            <a href="#">
              <img
                src={selectedAgency?.logoSrc as string}
                className="rounded-full max-h-10 max-w-10 mr-2"
              />
            </a>

            <div className="flex flex-col">
              <a href="#">
                <p className="dark:text-gray-100 text-dark-gray text-sm font-semibold hover:text-orange-500">
                  {folderWithPhotos.folder}
                </p>
              </a>
              <p className="text-gray-400 text-xs">
                {selectedGroup.agencyName}
              </p>
              <p className="text-gray-400 text-xs">
                {formatUploadedAt(folderWithPhotos.photos[0].timeCreated)}
              </p>
            </div>
          </div>

          {isGalleryOpen && selectedFolder === folderWithPhotos.folder ? (
            <div className="z-50 flex flex-col w-full h-full absolute top-0 left-0 bg-medium-gray ">
              <div className="flex flex-row items-center w-full bg-dark-gray min-h-[50px] justify-end">
                <button
                  onClick={handleGalleryClose}
                  className="flex flex-row justify-center items-center button !border-0 duration-500"
                >
                  <p className="!text-white text-sm font-semibold ">Volver</p>
                  <TbDoorExit />
                </button>
                <button
                  onClick={handleGalleryClose}
                  className="flex flex-row justify-center items-center button !border-0 duration-500"
                >
                  <p className="!text-white text-sm font-semibold ">
                    Descargar
                  </p>
                  <TbDownload />
                </button>
              </div>
              <div>
                <Gallery id={folderWithPhotos.folder} withDownloadButton>
                  <div className="grid grid-cols-4 p-9 gap-2 relative top-0 animate-in fade-in-0 duration-1000">
                    {cachedPhotos[folderWithPhotos.folder]?.map(
                      (photo, index) => (
                        <div
                          className="cursor-pointer opacity-75 hover:opacity-100 transition duration-500"
                          key={photo.id}
                        >
                          <Item
                            original={photo.url}
                            thumbnail={photo.url}
                            id={photo.id}
                          >
                            {({ ref, open }) => (
                              <Image
                                alt={`${folderWithPhotos.folder} Foto ${index}`}
                                ref={ref as any}
                                onClick={open}
                                width={384}
                                height={180}
                                src={photo.url}
                                className="fade-in-0 duration-1000"
                                onLoad={(e) => {
                                  e.currentTarget.className +=
                                    " fade-in-0 duration-1000 animate";
                                }}
                              />
                            )}
                          </Item>
                        </div>
                      )
                    )}
                  </div>
                </Gallery>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
