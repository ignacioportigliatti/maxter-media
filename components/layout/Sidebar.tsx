"use client";

import { useState } from "react";
import Image from "next/image";
import {
  TfiCamera,
  TfiVideoCamera,
  TfiSettings,
  TfiHome,
  TfiExport,
} from "react-icons/tfi";
import {
  TbFileUpload,
  TbMoonStars,
  TbQrcode,
  TbUser,
  TbUserCheck,
  TbUsers,
} from "react-icons/tb";
import { AiOutlineGroup, AiOutlineUser } from "react-icons/ai";
import Link from "next/link";
import Modal from "../ui/Modal";

interface SidebarProps {}

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
                <div className="sideBarCategoriesText">
                  Descargá tu material
                </div>
              </div>
            </li>
            <li>
              <a href="/" className="sideBarButton">
                <span className="sideBarIcon">
                  <TfiHome className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Inicio</span>
              </a>
            </li>
            <li>
              <a href="#" className="sideBarButton">
                <span className="sideBarIcon">
                  <TfiCamera
                    width={36}
                    height={36}
                    className="sideBarIconSize"
                  />
                </span>
                <span className="sideBarIconText">Mis Fotos</span>
              </a>
            </li>
            <li>
              <Link href="/my-videos" className="sideBarButton">
                <span className="sideBarIcon">
                  <TfiVideoCamera
                    width={36}
                    height={36}
                    className="sideBarIconSize"
                  />
                </span>
                <span className="sideBarIconText">Mis Videos</span>
              </Link>
            </li>
            <li className="px-5">
              <div className="sideBarCategories">
                <div className="sideBarCategoriesText">Mi Cuenta</div>
              </div>
            </li>
            <li>
              <a href="#" className="sideBarButton">
                <span className="sideBarIcon">
                  <TfiSettings className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Ajustes</span>
              </a>
            </li>
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
              <a href="#" className="sideBarButton">
                <span className="sideBarIcon">
                  <TfiExport className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Cerrar Sesión</span>
              </a>
            </li>
            <li className="px-5">
              <div className="sideBarCategories">
                <div className="sideBarCategoriesText">Admin</div>
              </div>
            </li>
            <li>
              <Link href="/groups" className="sideBarButton">
                <span className="sideBarIcon">
                  <TbUsers className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Grupos</span>
              </Link>
            </li>
            <li>
              <Link href="/agencies" className="sideBarButton">
                <span className="sideBarIcon">
                  <AiOutlineGroup className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Empresas</span>
              </Link>
            </li>
            <li>
              <Link href="/upload" className="sideBarButton">
                <span className="sideBarIcon">
                  <TbFileUpload className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Subir Material</span>
              </Link>
            </li>
            <li>
              <Link href="/upload" className="sideBarButton">
                <span className="sideBarIcon">
                  <TbQrcode className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Generar Códigos</span>
              </Link>
            </li>
            <li>
              <Link href="/users" className="sideBarButton">
                <span className="sideBarIcon">
                  <TbUserCheck className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Usuarios</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
