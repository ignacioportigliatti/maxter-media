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
      <div className="min-h-screen w-full h-full  top-0">
        <aside
          style={{
            backgroundColor: agency.primaryColor as string,
          }}
          className="flex-col w-full items-center text-gray-700 shadow min-h-full"
        >
          <div className="sticky top-0">
            <div className="h-16 flex items-center w-full">
              <Link className="h-8 w-8 mx-auto" href={navigationItems[0].href}>
                <Image
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
                      className="h-16 flex flex-col justify-center items-center w-full"
                      onClick={
                        setSelectedNavItemLabel
                          ? () => setSelectedNavItemLabel(item.label)
                          : () => {}
                      }
                    >
                      {item.icon}
                      <h5 className="text-[11px]">{item.label}</h5>
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
				focus:text-orange-500  focus:outline-none"
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
