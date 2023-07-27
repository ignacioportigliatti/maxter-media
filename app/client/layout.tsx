"use client";

import "../globals.css";
import { Providers } from "@/components/auth/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { TbPhotoAi } from "react-icons/tb";
import { AiOutlineHome, AiOutlineVideoCamera } from "react-icons/ai";
import { useEffect, useState } from "react";
import { getGoogleStorageFiles, getGroups } from "@/utils";
import { Agency, Codes, Group } from "@prisma/client";
import { useSelectGroup } from "@/redux/client/groupManager";
import axios from "axios";
import { getSignedUrl } from "@/utils/googleStorage/getSignedUrl";
import { useSearchParams } from "next/navigation";

export const metadata = {
  title: "Maxter",
  description: "Generated by create next app",
};

interface FolderWithPhotos {
  folder: string;
  photos: any[];
  thumbnail: string;
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const selectGroup = useSelectGroup();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState({} as Codes);

  const searchParams = useSearchParams();

  const navigationItems = [
    {
      label: "Inicio",
      icon: <AiOutlineHome className="w-5 h-5"/>,
      href: `/client?code=${code.code}`,
    },
    {
      label: "Mis Videos",
      icon: <AiOutlineVideoCamera className="w-5 h-5"/>,
      href: `/client/my-videos?code=${code.code}`,
    },
    {
      label: "Mis Fotos",
      icon: <TbPhotoAi className="w-5 h-5"/>,
      href: `/client/my-photos?code=${code.code}`,
    },
  ];

  const setGroup = async (group: Group) => {
    try {
      const agencies = await fetch("/api/agencies").then((res) => res.json());
      const selectedAgency: Agency = agencies.find(
        (agency: any) => agency.name === group.agencyName
      );
      const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
      const folderPath = `media/${group.name}/videos`;
      const videos = await getGoogleStorageFiles(
        bucketName as string,
        folderPath
      );

      const photos = await getGoogleStorageFiles(
        bucketName as string,
        `media/${group.name}/photos`
      );
      const foldersMap = new Map<string, any[]>();

      if (photos !== undefined) {
        photos.forEach((photo: any) => {
          const folderPath = photo.name.split("/");
          const folder = folderPath[folderPath.length - 2]; // Obtener la carpeta en lugar de la fecha
          const folderPhotos = foldersMap.get(folder) || [];
          folderPhotos.push(photo);
          foldersMap.set(folder, folderPhotos);
        });
      }

      // Convertir el Map a un array de objetos FolderWithPhotos
      const foldersWithPhotosArray: FolderWithPhotos[] = Array.from(
        foldersMap
      ).map(([folder, photos]) => {
        const thumbnail = photos.length > 0 ? photos[0].url : ""; // Obtener la URL de la primera foto como miniatura
        return {
          folder,
          photos,
          thumbnail,
        };
      });

      const signedPhotos: FolderWithPhotos[] = await Promise.all(
        foldersWithPhotosArray.map(async (folderWithPhotos) => {
          const firstPhoto = folderWithPhotos.photos[0];
          const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
          const signedUrl = await getSignedUrl(
            bucketName as string,
            firstPhoto.name
          );
          const signedThumbnail = { ...firstPhoto, url: signedUrl };
          const signedPhotos = [
            signedThumbnail,
            ...folderWithPhotos.photos.slice(1),
          ];
          return {
            ...folderWithPhotos,
            photos: signedPhotos,
            thumbnail: signedThumbnail.url,
          };
        })
      );

      selectGroup(group, videos, signedPhotos, selectedAgency);
    } catch (error) {
      console.log("Error al setear el grupo", error);
    }
  };

  useEffect(() => {
    try {
      const code = searchParams.get("code");
      if (!code) {
        setIsVerified(false);
      }

      const verifyCode = async () => {
        try {
          const response = await axios
            .post("/api/codes/verify", {
              code,
            })
            .then((res) => res.data);
          if (response.success) {
            setIsVerified(true);
            setCode(response.code);
            setGroup(response.selectedGroup).finally(() => {
              setIsLoading(false);
            });
            return true;
          }
        } catch (error) {
          setIsVerified(false)
          setIsLoading(false);
          console.error("Error verificando el código", error);
        }
      };

      verifyCode()
    } catch (error) {
      console.error("Error al obtener el grupo", error);
    }
  }, []);

  return (
    <Providers>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="relative w-24 h-24 animate-spin rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 ">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 "></div>
          </div>
        </div>
      ) : isVerified ? (
        <div className="flex">
          <ToastContainer />
          <div className="hidden lg:flex">
            <ClientSidebar navigationItems={navigationItems} />
          </div>
          <div className="lg:h-full flex mx-auto w-full">{children}</div>
        </div>
      ) : (
        <div>
          <h1>El código no es válido</h1>
        </div>
      )}
    </Providers>
  );
}
