"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { TbDoorExit, TbPhoto, TbVideo } from "react-icons/tb";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Agency, Group } from "@prisma/client";
import { useState } from "react";
import Link from "next/link";

interface ClientSidebarProps {
  navigationItems: {
    label: string;
    icon: React.ReactNode;
    href: string;
  }[];
  setSelectedNavItemLabel?: React.Dispatch<React.SetStateAction<string>>;
  agency: Agency;
}

export const ClientSidebar = (props: ClientSidebarProps) => {
  const { navigationItems, agency, setSelectedNavItemLabel } = props;

  const [hoveredItems, setHoveredItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const pathName = usePathname();

  if (pathName === "/auth/signin" || pathName === "/auth/signup") {
    return <></>;
  } else {
    return (
      <div className="fixed z-50 min-h-screen h-full top-0">
        <aside
          style={{
            backgroundColor: agency.primaryColor as string,
          }}
          className="flex-col items-center text-gray-700 shadow h-full"
        >
          <div className="h-16 flex items-center w-full">
            <Link className="h-6 w-6 mx-auto" href="http://svelte.dev/">
              <Image
                className="h-6 w-6 mx-auto"
                src={agency.logoSrc as string}
                alt={`${agency.name} logo}`}
                width={24}
                height={24}
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
              };

              return (
                <li
                  key={index}
                  style={inlineStyles}
                  onMouseEnter={() =>
                    setHoveredItems((prevState) => ({
                      ...prevState,
                      [index]: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setHoveredItems((prevState) => ({
                      ...prevState,
                      [index]: false,
                    }))
                  }
                >
                  <Link
                    href={item.href}
                    style={{
                      color: agency.accentColor as string,
                      textDecoration: "none", // Opcional: quitar el subrayado del enlace
                    }}
                    className="h-16 px-6 flex justify-center items-center w-full"
                    onClick={setSelectedNavItemLabel ? () => setSelectedNavItemLabel(item.label) : () => {}}
                  >
                    {item.icon}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto h-16 flex items-center w-full">
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
              className="h-16 w-full mx-auto flex justify-center items-center
				focus:text-orange-500 hover:bg-red-200 focus:outline-none"
            >
              <TbDoorExit className="w-5 h-5 text-white opacity-70 hover:opacity-100" />
            </button>
          </div>
        </aside>
      </div>
    );
  }
};
