"use client";

import { usePathname } from "next/navigation";
import { TbDoorExit, TbPhoto, TbVideo } from "react-icons/tb";
import { Agency, Group } from "@prisma/client";
import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

interface ClientMobileNavbarProps {
  navigationItems: {
    label: string;
    icon: React.ReactNode;
    href: string;
    isDisabled: boolean;
    isMediaLoading?: boolean;
  }[];
 
  agency: Agency;
}

const ClientMobileNavbar = (props: ClientMobileNavbarProps) => {
  const { navigationItems, agency} = props;

  const photos = useSelector((state: any) => state.photos);
  const videos = useSelector((state: any) => state.videos);
  const code = useSelector((state: any) => state.code);

  const [hoveredItems, setHoveredItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const pathName = usePathname();

  if (pathName === "/auth/signin" || pathName === "/auth/signup") {
    return <></>;
  } else {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t shadow-md" style={{
        backgroundImage: `linear-gradient(to top, ${agency.primaryColor} , ${agency.secondaryColor})`,
      }}>
        <nav className="flex justify-around items-center text-gray-700 py-2">
          {navigationItems.map((item, index) => {
            const isItemHovered = !!hoveredItems[index];
    
            const inlineStyles = {
              color: agency.accentColor as string,
              backgroundColor: isItemHovered
                ? agency.secondaryColor ?? ""
                : "transparent",
              transition: "background-color 0.3s ease",
            };
    
            return item.isMediaLoading ? (
              <div
                key={index}
                style={inlineStyles}
                className="group animate-pulse"
              >
                <div className="flex flex-col justify-center items-center cursor-wait">
                  <div className="w-5 h-5 animate-pulse bg-gray-300 rounded-lg mb-1"></div>
                  <div className="w-14 h-3 animate-pulse bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            ) : (
              <Link
                key={index}
                href={item.isDisabled ? "#" : item.href}
                style={{
                  color: agency.accentColor as string,
                  textDecoration: "none",
                }}
                className={`flex flex-col justify-center items-center ${
                  item.isDisabled
                    ? "cursor-help pointer-events-none"
                    : "cursor-pointer"
                }`}
              >
                {item.icon}
                <span className="text-[11px]">{item.label}</span>
                {item.isDisabled && (
                  <span className="group-hover:opacity-100 opacity-0 absolute top-0 inset-6vw duration-300 flex justify-center items-center">
                    <span className="relative text-[11px] bg-black p-3 rounded-lg text-white">
                      {code.type === "full"
                        ? photos.length === 0 || videos.length === 0
                          ? `No se encuentran ${item.label.split(" ")[1]}`
                          : `Quiero Acceder a ${item.label}`
                        : code.type === "photo"
                        ? photos.length === 0
                          ? `No se encuentran ${item.label.split(" ")[1]}`
                          : `Quiero Acceder a ${item.label}`
                        : videos.length === 0
                        ? `No se encuentran ${item.label.split(" ")[1]}`
                        : `Quiero Acceder a ${item.label}`}
                    </span>
                  </span>
                )}
              </Link>
            );
          })}
    
          <Link href="/">
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
              className="h-16 focus:text-red-600 focus:outline-none"
            >
              <TbDoorExit className="w-5 h-5 text-white opacity-70 hover:text-red-800 hover:opacity-100 duration-500" />
            </button>
          </Link>
        </nav>
      </div>
    );
    
  }
};

export default ClientMobileNavbar;