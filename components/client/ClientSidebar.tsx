"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { TbDoorExit } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Agency, Group } from "@prisma/client";
import { useState } from "react";
import Link from "next/link";

interface ClientSidebarProps {
  navigationItems: {
    label: string;
    icon: React.ReactNode;
    href: string;
    isDisabled: boolean;
    isMediaLoading?: boolean;
  }[];
  setSelectedNavItemLabel?: React.Dispatch<React.SetStateAction<string>>;
  agency: Agency;
}

export const ClientSidebar = (props: ClientSidebarProps) => {
  const { navigationItems, agency, setSelectedNavItemLabel } = props;

  const photos = useSelector((state: any) => state.photos);
  const videos = useSelector((state: any) => state.videos);

  const [hoveredItems, setHoveredItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const pathName = usePathname();

  if (pathName === "/auth/signin" || pathName === "/auth/signup") {
    return <></>;
  } else {
    return (
      <div className="min-h-screen w-full h-full  top-0">
        <aside
          style={{
            background: `linear-gradient(to bottom, ${agency.primaryColor} , ${agency.secondaryColor})`,
          }}
          className="flex-col w-full items-center text-gray-700 shadow min-h-full"
        >
          <div className="sticky top-0">
            <div className="h-16 flex items-center w-full">
              <Link className="h-8 w-8 mx-auto" href={navigationItems[0].href}>
                <img
                  className="h-8 w-8 mx-auto object-contain"
                  src={agency.logoSrc as string}
                  alt={`${agency.name} logo}`}
                  width={32}
                  height={32}
                />
              </Link>
            </div>

            <ul>
              {navigationItems.map((item, index) => {
                const isItemHovered = !!hoveredItems[index]; // Comprueba si el ítem actual está siendo hover

                const inlineStyles = {
                  color: agency.accentColor as string,
                  backgroundColor: isItemHovered
                    ? agency.secondaryColor ?? ""
                    : "transparent",
                  transition: "background-color 0.3s ease",
                  opacity: item.isDisabled ? 0.5 : 1,
                };

                return item.isMediaLoading ? (
                  <li
                    key={index}
                    style={inlineStyles}
                    className="relative w-full group animate-pulse"
                  >
                    <div
                      className={`h-16 flex flex-col justify-center items-center w-full cursor-wait
                      }`}
                    >
                      <div className="w-5 h-5 animate-pulse duration-1000 bg-gray-300 rounded-lg mb-1"></div>
                      <div className="w-14 h-3 animate-pulse bg-gray-300 duration-1000 rounded-lg"></div>
                      
                    </div>
                  </li>
                ) : (
                  <li
                    key={index}
                    style={inlineStyles}
                    onMouseEnter={() =>
                      setHoveredItems((prevState) => ({
                        ...prevState,
                        [index]: true,
                      }))
                    }
                    className="relative w-full group"
                    onMouseLeave={() =>
                      setHoveredItems((prevState) => ({
                        ...prevState,
                        [index]: false,
                      }))
                    }
                  >
                    <Link
                      href={item.isDisabled ? "#" : item.href}
                      style={{
                        color: agency.accentColor as string,
                        textDecoration: "none", // Opcional: quitar el subrayado del enlace
                      }}
                      className={`h-16 flex flex-col justify-center items-center w-full ${
                        item.isDisabled ? "cursor-help pointer-events-none" : "cursor-pointer"
                      }`}
                      onClick={
                        setSelectedNavItemLabel
                          ? () => setSelectedNavItemLabel(item.label)
                          : () => {}
                      }
                    >
                      {item.icon}
                      <h5 className="text-[11px]">{item.label}</h5>
                      {item.isDisabled && (
                        <span className="z-50  group-hover:opacity-100 opacity-0 absolute top-0 inset-[5vw] duration-300 w-max h-full flex justify-center items-center">
                          <h5 className="relative text-[11px] z-50 bg-black p-3 rounded-lg text-white">{`${photos.length === 0 || videos.length === 0 ? `No se encuentran ${item.label.split(" ")[1]}` : `Quiero Acceder a ${item.label}`}`}</h5>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto h-16 flex items-center w-full">
              <Link
                className="w-full mx-auto flex justify-center items-center"
                href="/"
              >
                <button
                  onMouseEnter={() =>
                    setHoveredItems((prevState) => ({
                      ...prevState,
                      [4]: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setHoveredItems((prevState) => ({
                      ...prevState,
                      [4]: false,
                    }))
                  }
                  className="h-16 
				focus:text-red-600  focus:outline-none"
                >
                  <TbDoorExit className="w-5 h-5 text-white opacity-70 hover:text-red-800 hover:opacity-100 duration-500" />
                </button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    );
  }
};
