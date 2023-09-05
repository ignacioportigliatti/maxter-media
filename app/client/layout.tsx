"use client";

import ClientHeader from "@/components/client/ClientHeader";
import ClientMobileNavbar from "@/components/client/ClientMobileNavbar";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { useSelectGroup } from "@/redux/groupManager";
import { Agency, Codes, Group } from "@prisma/client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineVideoCamera } from "react-icons/ai";
import { TbPhotoAi } from "react-icons/tb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [selectedGroup, setSelectedGroup] = useState({} as Group);
  const [agency, setAgency] = useState({} as Agency);
  const [selectedNavItemLabel, setSelectedNavItemLabel] = useState("");
  const [isVideoDisabled, setIsVideoDisabled] = useState(true);
  const [isPhotoDisabled, setIsPhotoDisabled] = useState(true);
  const [isMediaLoading, setIsMediaLoading] = useState(true);

  const searchParams = useSearchParams();

  const navigationItems = [
    {
      label: "Inicio",
      icon: <AiOutlineHome className="w-5 h-5" />,
      href: `/client?code=${code.code}`,
      isDisabled: false,
    },
    {
      label: "Mis Videos",
      icon: <AiOutlineVideoCamera className="w-5 h-5" />,
      href: `/client/my-videos?code=${code.code}`,
      isDisabled: isVideoDisabled,
      isMediaLoading: isMediaLoading,
    },
    {
      label: "Mis Fotos",
      icon: <TbPhotoAi className="w-5 h-5" />,
      href: `/client/my-photos?code=${code.code}`,
      isDisabled: isPhotoDisabled,
      isMediaLoading: isMediaLoading,
    },
  ];

  const setGroup = async (group: Group, codeType: string) => {
    try {
      const agencies = await fetch("/api/agencies").then((res) => res.json());
      const selectedAgency: Agency = agencies.find(
        (agency: any) => agency.id === group.agencyId
      );

      const signedAgencyLogo = await axios
        .post("/api/sign-url/", {
          bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
          fileName: selectedAgency.logoSrc,
        })
        .then((res) => res.data.url);

      selectedAgency.logoSrc = signedAgencyLogo;
      const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;

      setSelectedGroup(group);
      setAgency(selectedAgency);

      selectGroup.updateGroup(group);
      selectGroup.updateSelectedAgency(selectedAgency);
      setIsLoading(false);

      const getVideos = async () => {
        const folderPath = `media/videos/${group.name}`;

        const videos = await axios
          .post("/api/videos/", {
            bucketName,
            folderPath,
            needThumbs: true,
            groupName: group.name,
          }, )
          .then((res) => {
            if (res.data.success) {
              return res.data.videos;
            }
          });

        const getSignedVideoUrl = async (
          bucketName: string,
          fileName: string
        ) => {
          const signedVideo = await axios
            .post("/api/sign-url/", {
              bucketName,
              fileName,
            })
            .then((res) => res.data.url);

          // Cache the signed URL with expiration time

          return signedVideo;
        };

        const signedVideos = await Promise.all(
          videos.map(async (video: any) => {
            const signedVideoUrl = await getSignedVideoUrl(
              bucketName as string,
              video.video.Key
            );

            const cachedThumbUrl = localStorage.getItem(
              `video_${video.thumbnail.Key}`
            );

            let signedThumbUrl;
            if (cachedThumbUrl) {
              signedThumbUrl = cachedThumbUrl;
            } else {
              signedThumbUrl = await getSignedVideoUrl(
                bucketName as string,
                video.thumbnail.Key
              );
            }

            return {
              video: { ...video.video, url: signedVideoUrl },
              thumbnail: { ...video.thumbnail, url: signedThumbUrl },
            };
          })
        );

        return signedVideos;
      };

      const getPhotos = async () => {
        const photos = await axios
          .post("/api/photos/", {
            bucketName: bucketName,
            folderPath: `media/fotos/${group.name}`,
          })
          .then((res) => res.data.photos);
        const foldersMap = new Map<string, any[]>();

        if (photos !== undefined) {
          photos.forEach((photo: any) => {
            const folderPath = photo.Key.split("/");
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

            const firstPhotoSignedUrl = await axios
              .post("/api/sign-url/", {
                bucketName: bucketName,
                fileName: firstPhoto.Key,
              })
              .then((res) => res.data.url);

            const signedThumbnail = { ...firstPhoto, url: firstPhotoSignedUrl };
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

        return signedPhotos;
      };

      if (codeType === "full") {
        const signedPhotos = await getPhotos();
        const signedVideos = await getVideos();
        selectGroup.updateVideos(signedVideos);
        selectGroup.updatePhotos(signedPhotos);
        setIsVideoDisabled(false);
        setIsPhotoDisabled(false);
        setIsMediaLoading(false);
      } else if (codeType === "photo") {
        const signedPhotos = await getPhotos();
        selectGroup.updatePhotos(signedPhotos);
        setIsVideoDisabled(true);
        setIsPhotoDisabled(false);
        setIsMediaLoading(false);
      } else if (codeType === "video") {
        const signedVideos = await getVideos();
        selectGroup.updateVideos(signedVideos);
        setIsVideoDisabled(false);
        setIsPhotoDisabled(true);
        setIsMediaLoading(false);
      }
    } catch (error) {
      console.error("Error al setear el grupo", error);
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");

    const verifyCode = async () => {
      try {
        const response = await axios
          .post("/api/codes/verify", { code })
          .then((res) => res.data);
        if (response.success) {
          setIsVerified(true);
          setCode(response.code);
          setGroup(response.selectedGroup, response.code.type);
        } else {
          setIsVerified(false);
          setIsLoading(false);
        }
      } catch (error) {
        setIsVerified(false);
        setIsLoading(false);
        console.error("Error verificando el código", error);
      }
    };

    if (code) {
      verifyCode();
    } else {
      setIsVerified(false);
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="absolute right-1/2 bottom-1/2">
            <div
              className={`border-t-transparent border-solid animate-spin rounded-full ${
                agency.primaryColor !== undefined
                  ? `border-[${agency.primaryColor}]`
                  : "border-white"
              } border-8 h-16 w-16`}
            ></div>
          </div>
        </div>
      ) : isVerified ? (
        <div className="flex w-screen h-full">
          <ToastContainer
            position="bottom-right" limit={3}
            toastStyle={{
              backgroundImage: `linear-gradient(45deg, ${agency.primaryColor}, ${agency.secondaryColor})`,
              color: agency.accentColor as string,
              fontSize: "12px",
            }}
            progressStyle={{
              backgroundImage: `linear-gradient(215deg, ${agency.primaryColor}, ${agency.secondaryColor})`,
            }}
          />
          <div className="hidden min-h-full w-[10vh] md:flex">
            <ClientSidebar
              navigationItems={navigationItems}
              agency={agency}
              setSelectedNavItemLabel={setSelectedNavItemLabel}
            />
          </div>

          <div className="flex flex-col w-full min-h-screen h-full">
            <div className="flex sticky top-0 w-full h-[8vh] z-50">
              <ClientHeader
                agency={agency}
                selectedGroup={selectedGroup}
                selectedNavItemLabel={selectedNavItemLabel}
              />
            </div>
            <div className="min-h-[92vh] flex max-w-[100vw] pb-20 md:pb-0">
              {children}
            </div>

            <div className="flex md:hidden">
              <ClientMobileNavbar
                navigationItems={navigationItems}
                agency={agency}
                setSelectedNavItemLabel={setSelectedNavItemLabel}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-screen h-screen justify-center items-center">
          <h1>El código no es válido o la fecha de expiracion no es valida</h1>
          {code && <h2>{code.expires.toString()}</h2>}
        </div>
      )}
    </div>
  );
}
