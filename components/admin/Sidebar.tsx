"use client";

import { useState } from "react";
import Image from "next/image";
import {
  TbDoorExit,
  TbFileUpload,
  TbMoonStars,
  TbQrcode,
  TbUserCheck,
  TbUsers,
} from "react-icons/tb";
import { AiOutlineGroup, AiOutlineUser } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {}

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
    label: "Generar Códigos",
    icon: <TbQrcode className="sideBarIconSize" />,
    href: "/admin/upload",
  },
  {
    label: "Usuarios",
    icon: <TbUserCheck className="sideBarIconSize" />,
    href: "/admin/users",
  },
];

export const Sidebar = (props: SidebarProps) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleThemeChange = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkTheme((isDarkTheme) => !isDarkTheme);
  };

  const logoSrc =
    isDarkTheme === true
      ? "/sidebar/maxter-logo-dark.png"
      : "/sidebar/maxter-logo.png";

  const pathName = usePathname();

  if (pathName === "/auth/signin" || pathName === "/auth/signup") {
    return <></>;
  }

  return (
    <div className="min-h-full h-full flex flex-col flex-auto flex-shrink-0 antialiased text-gray-800">
      <div className="flex flex-col sticky h-screen top-0 left-0 w-64 bg-gray-200 dark:bg-dark-gray themeTransition">
        <div className="flex items-center justify-center p-6 h-20 border-b border-orange-500">
          <div>
            <Image
              src={logoSrc}
              width={128}
              height={26}
              alt="maxter website logo"
            />
          </div>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5">
              <div className="sideBarCategories">
                <div className="sideBarCategoriesText">Admin</div>
              </div>
            </li>
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="sideBarButton">
                  <span className="sideBarIcon">{item.icon}</span>
                  <span className="sideBarIconText">{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <a
                onClick={handleThemeChange}
                className="sideBarButton cursor-pointer"
              >
                <span className="sideBarIcon">
                  <TbMoonStars className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Oscuro/Claro</span>
              </a>
            </li>
            <li>
              <Link href="/api/auth/signout" className="sideBarButton">
                <span className="sideBarIcon">
                  <TbDoorExit className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Cerrar Sesión</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
