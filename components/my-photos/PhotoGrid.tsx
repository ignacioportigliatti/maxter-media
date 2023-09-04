"use client";

import { Agency, Group } from "@prisma/client";
import Image from "next/image";
import "photoswipe/dist/photoswipe.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import PhotoGallery from "./PhotoGallery";

interface PhotoGridProps {
  selectedGroup: Group;
}

export interface FolderWithPhotos {
  folder: string;
  photos: any[];
  thumbnail: string;
}

export interface Photo {
  Key: string;
  LastModified: string;
  ETag: string;
  Size: number;
  StorageClass: string;
  url: string;
}

export const PhotoGrid = (props: PhotoGridProps) => {
  const { selectedGroup } = props;

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

  const [signedPhotos, setSignedPhotos] = useState<any[]>([]);
  const selectedAgency: Agency = useSelector((state: any) => state.agency);
  const foldersWithPhotos: FolderWithPhotos[] = useSelector(
    (state: any) => state.photos
  );
  console.log("foldersWithPhotos", foldersWithPhotos);

  const handleGalleryClose = () => {
    setIsGalleryOpen(false);
  };

  const handleFolderClick = async (folder: string) => {
    setSelectedFolder(folder);
    setIsGalleryOpen(true);
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
      return `Hace ${days} día${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    } else {
      return "Hace unos segundos";
    }
  };

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 animate-in fade-in-0 duration-500">
      {/* Mapeo de carpetas con fotos */}
      {foldersWithPhotos.map((folderWithPhotos) => (
        <div className="" key={folderWithPhotos.folder}>
          {/* Mapeo de fotos de la carpeta solicitada */}
          <div className="relative flex items-center justify-center cursor-pointer opacity-75 hover:opacity-100 transition duration-500 group">
            <div className="absolute transition duration-500 top-0 right-0 opacity-0 group-hover:opacity-100 p-1 bg-black/80 text-gray-400 text-xs">
              {
                <span className="px-1" style={{
                  backgroundImage: `linear-gradient(315deg, ${selectedAgency.primaryColor} 0%, ${selectedAgency.secondaryColor} 100%)`,
                  color: selectedAgency.accentColor as string,
                }}>
                  {`${folderWithPhotos.photos.length}`}
                  </span>
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
              className="aspect-video object-cover"
            />
          </div>
          <div className="flex flex-row mt-3 gap-2">
            <a href="#">
              <img
                src={selectedAgency?.logoSrc as string}
                className="rounded-full max-h-10 max-w-10"
              />
            </a>

            <div className="flex flex-col">
              <a href="#">
                <p className="dark:text-gray-100 text-dark-gray text-sm font-semibold hover:text-red-600">
                  {folderWithPhotos.folder}
                </p>
              </a>
              <p className="text-gray-400 text-xs">
                {selectedGroup.agencyName}
              </p>
              <p className="text-gray-400 text-xs">
                {formatUploadedAt(folderWithPhotos.photos[0].LastModified)}
              </p>
            </div>
          </div>

          {isGalleryOpen && selectedFolder === folderWithPhotos.folder ? (
            <PhotoGallery
              handleGalleryClose={handleGalleryClose}
              folderWithPhotos={folderWithPhotos}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};
