'use client'

import { useEffect, useState } from "react";
import { getGoogleStorageFiles } from "@/utils";
import { Group } from "@prisma/client";
import { getSignedUrl } from "@/utils/googleStorage/getSignedUrl";

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

  useEffect(() => {
    const getPhotosList = async () => {
      try {
        const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
        const folderPath = `media/${selectedGroup.name}/photos`;

        const photos = await getGoogleStorageFiles(
          bucketName as string,
          folderPath,
        );
        console.log("photos", photos);

        // Crear una estructura de carpetas y fotos
        const foldersMap = new Map<string, any[]>();

        photos.forEach((photo: any) => {
          const folder = photo.name.split("/")[3];
          const folderPhotos = foldersMap.get(folder) || [];
          folderPhotos.push(photo);
          foldersMap.set(folder, folderPhotos);
        });

        // Convertir el Map a un array de objetos FolderWithPhotos
        const foldersWithPhotosArray: FolderWithPhotos[] = Array.from(foldersMap).map(([folder, photos]) => ({
          folder,
          photos,
        }));

        // Firmar las URL de las fotos y reemplazar las fotos dentro de FolderWithPhotos
        const signedPhotos = await Promise.all(
          foldersWithPhotosArray.map(async (folderWithPhotos) => {
            const signedPhotos = await Promise.all(
              folderWithPhotos.photos.map(async (photo) => {
                const signedPhoto = await getSignedUrl(bucketName as string, photo.name);
                return { ...photo, url: signedPhoto };
              })
            );
            return { ...folderWithPhotos, photos: signedPhotos };
          })
        );

        setFoldersWithPhotos(signedPhotos);
      } catch (error) {
        console.error("Error al obtener la lista de videos:", error);
      }
    };

    getPhotosList();
  }, [selectedGroup]);


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
      {foldersWithPhotos.map((folderWithPhotos) => (
        <div key={folderWithPhotos.folder}>
          <h2>Folder: {folderWithPhotos.folder}</h2>
          <div className="gallery">
            {folderWithPhotos.photos.map((photo) => (
              <div key={photo.id} className="gallery-item">
                <img src={photo.url} alt={photo.name} className="gallery-image" />
                <div className="gallery-overlay">
                  <div className="gallery-caption">
                    <h3>{photo.name}</h3>
                    <p>{formatUploadedAt(photo.timeCreated)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
