"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { TbDoorExit, TbPhoto, TbVideo } from "react-icons/tb";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Agency } from "@prisma/client";

interface clientSidebarProps {
  navigationItems: {
    label: string;
    icon: React.ReactNode;
    href: string;
  }[];
}

export const ClientSidebar = (props: clientSidebarProps) => {
  const { navigationItems } = props;
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const logoSrc =
    theme === "light"
      ? "/sidebar/maxter-logo.png"
      : "/sidebar/maxter-logo-dark.png";

  const pathName = usePathname();

  if (pathName === "/auth/signin" || pathName === "/auth/signup") {
    return <></>;
  }

  const agency: Agency = useSelector((state: any) => state.agency);

  return (
    <div className="min-h-screen">
      <aside style={{
        backgroundColor: agency.primaryColor as string
      }} className="flex-col items-center text-gray-700 shadow h-full">
        <div className="h-16 flex items-center w-full">
          <a className="h-6 w-6 mx-auto" href="http://svelte.dev/">
            <Image
              className="h-6 w-6 mx-auto"
              src={agency.logoSrc as string}
              alt={`${agency.name} logo}`}
              width={24}
              height={24}
            />
          </a>
        </div>

        <ul>
         {navigationItems.map((item) => {
          return (
            <li style={{}}>
            <a
              href={item.href}
              style={{
                color: agency.accentColor as string,
              }}
              className="h-16 px-6 flex justify-center items-center w-full"
            >
              {item.icon}
            </a>
          </li>
          )
         })}
        </ul>

        <div className="mt-auto h-16 flex items-center w-full">
          <button
            className="h-16 w-full mx-auto flex justify-center items-center
				focus:text-orange-500 hover:bg-red-200 focus:outline-none"
          >
            <TbDoorExit className="w-5 h-5 text-red-700" />
          </button>
        </div>
      </aside>
    </div>
  );
};
