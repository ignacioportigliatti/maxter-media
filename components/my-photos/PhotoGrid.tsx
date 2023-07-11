'use client'

import { useEffect, useState } from "react";
import { getGoogleStorageFiles } from "@/utils";
import { Group } from "@prisma/client";
import { getSignedUrl } from "@/utils/googleStorage/getSignedUrl";
import Image from "next/image";

interface PhotoGridProps {
  selectedGroup: Group;
}

interface FolderWithPhotos {
  folder: string;
  photos: any[];
}

export const PhotoGrid = (props: PhotoGridProps) => {
  const { selectedGroup } = props;
  const [foldersWithPhotos, setFoldersWithPhotos] = useState<FolderWithPhotos[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  useEffect(() => {
    const getPhotosList = async () => {
      try {
        const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
        const folderPath = `media/${selectedGroup.name}/photos`;

        const photos = await getGoogleStorageFiles(bucketName as string, folderPath);

        // Crear una estructura de carpetas y fotos
        const foldersMap = new Map<string, any[]>();

        photos.forEach((photo: any) => {
          const folderPath = photo.name.split("/");
          const folder = folderPath[folderPath.length - 2]; // Obtener la carpeta en lugar de la fecha
          const folderPhotos = foldersMap.get(folder) || [];
          folderPhotos.push(photo);
          foldersMap.set(folder, folderPhotos);
        });

        // Convertir el Map a un array de objetos FolderWithPhotos
        const foldersWithPhotosArray: FolderWithPhotos[] = Array.from(foldersMap).map(([folder, photos]) => ({
          folder,
          photos,
        }));

        setFoldersWithPhotos(foldersWithPhotosArray);
        console.log("foldersWithPhotos", foldersWithPhotos);
      } catch (error) {
        console.error("Error al obtener la lista de videos:", error);
      }
    };

    getPhotosList();
  }, [selectedGroup]);

  const handleFolderClick = async (folder: string) => {
    setSelectedFolder(folder);

    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;

    // Firmar las URL de las fotos para la carpeta seleccionada y reemplazar las fotos dentro de FolderWithPhotos
    const signedPhotos = await Promise.all(
      foldersWithPhotos.map(async (folderWithPhotos) => {
        if (folderWithPhotos.folder === folder) {
          const signedPhotos = await Promise.all(
            folderWithPhotos.photos.map(async (photo) => {
              const signedPhoto = await getSignedUrl(bucketName as string, photo.name);
              return { ...photo, url: signedPhoto };
            })
          );
          return { ...folderWithPhotos, photos: signedPhotos };
        } else {
          return folderWithPhotos;
        }
      })
    );

    setFoldersWithPhotos(signedPhotos);
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
    <div>
      {/* Mapping folders with photos */}
      {foldersWithPhotos.map((folderWithPhotos) => (
        <div key={folderWithPhotos.folder}>
          <div onClick={() => handleFolderClick(folderWithPhotos.folder)}>
            <h2>Folder: {folderWithPhotos.folder}</h2>
            {selectedFolder === folderWithPhotos.folder && (
              <div className="gallery">
                {/* Mapping photos of the requested folder */}
                {folderWithPhotos.photos.map((photo, index) => (
                  <div key={photo.id} className="gallery-item">

                      <img src={photo.url} alt={photo.name} className="gallery-thumbnail" />

                    <div className="gallery-overlay">
                      <div className="gallery-caption">
                        <h3>{photo.name}</h3>
                        <p>{formatUploadedAt(photo.timeCreated)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
