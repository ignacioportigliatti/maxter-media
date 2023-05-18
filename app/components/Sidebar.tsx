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
import { TbFileUpload, TbMoonStars } from "react-icons/tb";
import { AiOutlineGroup, AiOutlineUser } from "react-icons/ai";

interface SidebarProps {}

export const Sidebar = (props: SidebarProps) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleThemeChange = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  const logoSrc = isDarkTheme
    ? "/sidebar/maxter-logo-dark.png"
    : "/sidebar/maxter-logo.png";

  return (
    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased text-gray-800">
      <div className="flex flex-col top-0 left-0 w-64 bg-gray-200 dark:bg-dark-gray themeTransition h-screen">
        <div className="flex items-center justify-start p-6 h-20 border-b border-orange-500">
          <div>
            <Image
              src={logoSrc}
              width={256}
              height={75}
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
              <a href="/my-videos" className="sideBarButton">
                <span className="sideBarIcon">
                  <TfiVideoCamera
                    width={36}
                    height={36}
                    className="sideBarIconSize"
                  />
                </span>
                <span className="sideBarIconText">Mis Videos</span>
              </a>
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
              <a href="#" onClick={handleThemeChange} className="sideBarButton">
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
              <a href="#" className="sideBarButton">
                <span className="sideBarIcon">
                  <AiOutlineUser className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Grupos</span>
              </a>
            </li>
            <li>
              <a href="#" className="sideBarButton">
                <span className="sideBarIcon">
                  <AiOutlineGroup className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Empresas</span>
              </a>
            </li>
            <li>
              <a href="/upload" className="sideBarButton">
                <span className="sideBarIcon">
                  <TbFileUpload className="sideBarIconSize" />
                </span>
                <span className="sideBarIconText">Subir Material</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};