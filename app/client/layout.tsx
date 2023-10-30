"use client";

import ClientHeader from "@/components/client/ClientHeader";
import ClientMobileNavbar from "@/components/client/ClientMobileNavbar";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { setReduxCode } from "@/redux/codeSlice";
import { useSelectGroup } from "@/redux/groupManager";
import { formattedDate } from "@/utils/formattedDate";
import { Agency, Codes, Group } from "@prisma/client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineVideoCamera } from "react-icons/ai";
import { TbPhoneCalling, TbPhotoAi } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
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
  const [isVideoDisabled, setIsVideoDisabled] = useState(true);
  const [isPhotoDisabled, setIsPhotoDisabled] = useState(true);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const dispatch = useDispatch();

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
    {
      label: "Contacto",
      icon: <TbPhoneCalling className="w-5 h-5" />,
      href: `/client/contact?code=${code.code}`,
      isDisabled: false,
    },
  ];

  const setGroup = async (group: Group, code: Codes) => {
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
        const folderPath = `media/${group.agencyName}/videos/${group.name}`;

        const videos = await axios
          .post("/api/videos/", {
            bucketName,
            folderPath,
            needThumbs: true,
            groupName: group.name,
          })
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
            folderPath: `media/${group.agencyName}/fotos/${group.name}`,
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

      if (code.type === "full") {
        await toast.info(`Cargando fotos y videos...`, {toastId: "loading", autoClose: false})
        const signedPhotos = await getPhotos();
        const signedVideos = await getVideos();
        selectGroup.updateVideos(signedVideos);
        selectGroup.updatePhotos(signedPhotos);
        setIsVideoDisabled(false);
        if (signedPhotos.length === 0) {
          setIsPhotoDisabled(true);
        } else {
          setIsPhotoDisabled(false);
        }
        if (signedVideos.length === 0) {
          setIsVideoDisabled(true);
        } else {
          setIsVideoDisabled(false);
        }
        setIsMediaLoading(false);
       toast.update("loading", {render: "Carga completa", type: "success", autoClose: 2000})
      } else if (code.type === "photo") {
        toast.info(`Cargando fotos...`, {toastId: "loading", autoClose: false})
        const signedPhotos = await getPhotos();
        selectGroup.updatePhotos(signedPhotos);
        selectGroup.updateVideos([]);
        setIsVideoDisabled(true);
        setIsPhotoDisabled(false);
        setIsMediaLoading(false);
        toast.update("loading", {render: "Carga completa", type: "success", autoClose: 2000})
      } else if (code.type === "video") {
        toast.info(`Cargando videos...`, {toastId: "loading", autoClose: false})
        const signedVideos = await getVideos();
        selectGroup.updatePhotos([]);
        selectGroup.updateVideos(signedVideos);
        setIsVideoDisabled(false);
        setIsPhotoDisabled(true);
        setIsMediaLoading(false);
        toast.update("loading", {render: "Carga completa", type: "success", autoClose: 2000})
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
          setGroup(response.selectedGroup, response.code);
          dispatch(setReduxCode(response.code))
          
        } else if (response.error) {
          if (response.code) {
            setCode(response.code);
            setGroup(response.selectedGroup, response.code);
            dispatch(setReduxCode(response.code))
          }
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
          <div
            className={`border-t-transparent border-solid animate-spin rounded-full ${
              agency.primaryColor !== undefined
                ? `border-[${agency.primaryColor}]`
                : "border-white"
            } border-8 h-16 w-16`}
          ></div>
        </div>
      ) : isVerified ? (
        <div className="flex w-screen h-full">
          <ToastContainer
            position="bottom-right"
            limit={3}
            toastStyle={{
              backgroundImage: `linear-gradient(45deg, ${agency.primaryColor}, ${agency.secondaryColor})`,
              color: agency.accentColor as string,
              fontSize: "12px",
            }}
            progressStyle={{
              backgroundImage: `linear-gradient(215deg, ${agency.primaryColor}, ${agency.secondaryColor})`,
            }}
          />
          <div className="hidden min-h-full w-[10vh] md:flex z-50">
            <ClientSidebar
              navigationItems={navigationItems}
              agency={agency}
              
            />
          </div>

          <div className="flex flex-col w-full min-h-screen h-full">
            <div className="flex sticky top-0 w-full h-[8vh] z-50">
              <ClientHeader
                agency={agency}
                selectedGroup={selectedGroup}
                navigationItems={navigationItems}
    
              />
            </div>
            <div className="min-h-[92vh] flex  pb-20 md:pb-0">
              {children}
            </div>

            <div className="flex md:hidden">
              <ClientMobileNavbar
                navigationItems={navigationItems}
                agency={agency}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-center w-screen h-screen justify-center items-center">
          <h1>El código no es válido o la fecha de expiracion no es valida</h1>
          {code && <h2>Fecha de expiracion: {formattedDate(code.expires)}</h2>}
        </div>
      )}
    </div>
  );
}
