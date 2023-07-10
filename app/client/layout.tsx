'use client'

import '../globals.css'
import { Providers } from "@/components/auth/Providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar } from '@/components/admin/Sidebar';
import { TbFileUpload, TbPhotoAi, TbQrcode, TbUserCheck, TbUsers } from 'react-icons/tb';
import { AiOutlineGroup, AiOutlineHome, AiOutlineVideoCamera } from 'react-icons/ai';

export const metadata = {
  title: "Maxter",
  description: "Generated by create next app",
};

const navigationItems = [
  {
    label: "Inicio",
    icon: <AiOutlineHome />,
    href: "/client/",
  },
  {
    label: "Mis Videos",
    icon: <AiOutlineVideoCamera />,
    href: "/client/my-videos",
  },
  {
    label: "Mis Fotos",
    icon: <TbPhotoAi />,
    href: "/client/my-photos",
  },
];
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Providers>
        <div className="flex">
          <ToastContainer />
          <div className="hidden lg:flex">
            <Sidebar navigationItems={navigationItems}/>
          </div>
          <div className="lg:h-full flex mx-auto w-full">{children}</div>
        </div>
        </Providers>
      </body>
    </html>
  );
}
