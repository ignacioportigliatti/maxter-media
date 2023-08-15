"use client";


import { Providers } from "@/components/auth/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "@/components/admin/Sidebar";
import { TbFileUpload, TbQrcode, TbUserCheck, TbUsers } from "react-icons/tb";
import { AiOutlineGroup } from "react-icons/ai";
import { useEffect } from "react";
import { getGroups } from "@/utils";
import { Agency, Group } from "@prisma/client";
import { setGroups } from "@/redux/groupsSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAgencies } from "@/redux/agenciesSlice";
import useSignedUrl from "@/hooks/useSignedUrl";



const navigationItems = [
  {
    label: "Grupos",
    icon: <TbUsers className="sideBarIconSize" />,
    href: "/admin/groups",
  },
  {
    label: "Empresas",
    icon: <AiOutlineGroup className="sideBarIconSize" />,
    href: "/admin/agencies",
  },
  {
    label: "Subir Material",
    icon: <TbFileUpload className="sideBarIconSize" />,
    href: "/admin/upload",
  },
  {
    label: "Usuarios",
    icon: <TbUserCheck className="sideBarIconSize" />,
    href: "/admin/users",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const CACHE_PREFIX = 'signedUrlCache_';

  const getAndSetData = async () => {
    try {
      const groupsFromApi: Group[] = await axios.get("/api/groups").then((res) => res.data);
      const agenciesFromApi: Agency[] = await axios.get("/api/agencies").then((res) => res.data);

      const updatedAgencies = await Promise.all(
        agenciesFromApi.map(async (agency) => {
          const logoSrc = agency.logoSrc;
          const cacheKey = CACHE_PREFIX + logoSrc;

          const cachedSignedUrl = localStorage.getItem(cacheKey);
          const parsedCachedSignedUrl = cachedSignedUrl ? JSON.parse(cachedSignedUrl) : null;

          if (cachedSignedUrl) {
            return { ...agency, logoSrc: parsedCachedSignedUrl.url };
          }

          const signedLogoSrc = await axios
            .post('/api/sign-url/', {
              bucketName: 'maxter-media',
              fileName: logoSrc,
              isUpload: false,
            })
            .then(res => res.data.url);

          // Store the signed URL in localStorage with expiration time
          const expirationTimestamp = Date.now() + 55 * 60 * 1000; // 55 minutes in milliseconds
          const cacheObject = { url: signedLogoSrc, expiration: expirationTimestamp };
          localStorage.setItem(cacheKey, JSON.stringify(cacheObject));

          return { ...agency, logoSrc: signedLogoSrc };
        })
      );
      
      dispatch(setGroups(groupsFromApi));
      dispatch(setAgencies(updatedAgencies));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAndSetData();
  }, []);
  
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Providers>
          <div className="flex">
            <ToastContainer />
            <div className="hidden lg:flex">
              <Sidebar navigationItems={navigationItems} />
            </div>
            <div className="lg:h-full flex mx-auto w-full">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
