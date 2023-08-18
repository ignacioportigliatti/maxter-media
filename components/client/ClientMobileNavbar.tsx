"use client";

import { usePathname } from "next/navigation";
import { TbDoorExit, TbPhoto, TbVideo } from "react-icons/tb";
import Image from "next/image";
import { Agency, Group } from "@prisma/client";
import { useState } from "react";
import Link from "next/link";

interface ClientMobileNavbarProps {
  navigationItems: {
    label: string;
    icon: React.ReactNode;
    href: string;
  }[];
  setSelectedNavItemLabel?: React.Dispatch<React.SetStateAction<string>>;
  agency: Agency;
}

const ClientMobileNavbar = (props: ClientMobileNavbarProps) => {
  const { navigationItems, agency, setSelectedNavItemLabel } = props;

  const [hoveredItems, setHoveredItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const pathName = usePathname();

  if (pathName === "/auth/signin" || pathName === "/auth/signup") {
    return <></>;
  } else {
    return (
      <div
      style={{
        background: `linear-gradient(to left, ${agency.primaryColor} , ${agency.secondaryColor})`
      }}
        className="fixed z-50 bottom-0 w-full pl-4 py-2 sm:pl-8"
      >
        <div className="flex flex-row justify-between items-center text-gray-700 shadow">
          <Link className="h-8 w-8 p-1" href={navigationItems[0].href}>
            <Image
              className="h-full w-full object-contain"
              src={agency.logoSrc as string}
              alt={`${agency.name} logo`}
              width={24}
              height={24}
            />
          </Link>

          <ul className="flex flex-row">
            {navigationItems.map((item, index) => {
              const isItemHovered = !!hoveredItems[index];

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
                      textDecoration: "none",
                    }}
                    className="h-12 px-3 sm:px-6 flex flex-col justify-center items-center"
                    onClick={
                      setSelectedNavItemLabel
                        ? () => setSelectedNavItemLabel(item.label)
                        : () => {}
                    }
                  >
                    {item.icon}
                    <p
                      className="text-xs"
                      style={{ color: agency.accentColor as string }}
                    >
                      {item.label}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto w-12 h-12">
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
              className="h-full w-full flex justify-center items-center
				focus:text-orange-500 hover:bg-red-200 focus:outline-none"
            >
              <TbDoorExit className="w-5 h-5 text-white opacity-70 hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ClientMobileNavbar;