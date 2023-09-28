import { Agency, Group } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { useSelector } from "react-redux";
import JSZip from "jszip";
import { toast } from "react-toastify";
import DownloadModal from "./DownloadModal";

type ClientHeaderProps = {
  agency: Agency;
  selectedGroup: Group;
  navigationItems: {
    label: string;
    icon: React.ReactNode;
    href: string;
  }[];
};

const ClientHeader = (props: ClientHeaderProps) => {
  const { agency, selectedGroup, navigationItems } = props;

  // Estado local para mantener el valor actual de selectedNavItemLabel
  const [currentNavItemLabel, setCurrentNavItemLabel] = useState("");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const videos = useSelector((state: any) => state.videos);
  const photos = useSelector((state: any) => state.photos);

  const setItemLabel = async () => {
    const windowPathname = await new Promise((resolve) => {
      resolve(window.location.pathname);
    });
    const itemLabel = await navigationItems.filter(
      (item) => item.href.split("?")[0] === windowPathname
    );

    if (itemLabel && itemLabel[0]) {
      setCurrentNavItemLabel(itemLabel[0].label);
    }
  };

  useEffect(() => {
    setItemLabel(); // Llama a setItemLabel inmediatamente
    const intervalId = setInterval(async () => {
      await setItemLabel();
    });
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const handleDownload = async () => {
    setIsDownloadModalOpen(true);
  };

  const handleToggleModal = () => {
    setIsDownloadModalOpen(!isDownloadModalOpen);
  };

  return (
    <div
      style={{
        background: `linear-gradient(to right, ${agency.primaryColor} , ${agency.secondaryColor})`,
        color: `${agency.accentColor}`,
      }}
      className="flex w-full min-w-screen flex-row items-center justify-between themeTransition h-full px-6"
    >
      <div className="flex items-center justify-center gap-3">
        {/* Utiliza showSkeleton para alternar entre esqueleto y contenido real */}
        <h2 className="font-light -mt-1 text-2xl md:text-3xl animate-in transition fade-in-40">
          {currentNavItemLabel}
        </h2>
        {(currentNavItemLabel === "Mis Videos" && videos && videos.length !== 0) ||
        (currentNavItemLabel === "Mis Fotos" && photos && photos.length !== 0) ? (
    
            <button
              onClick={handleDownload}
              className="flex md:flex-row items-center opacity-60 hover:opacity-100 transition-opacity duration-300 justify-center gap-1 border border-white rounded-md p-1"
              style={{}}
            >
              <p className="text-xs text-white">
                Descargar
              </p>
              <AiOutlineDownload />
            </button>
     
        ) : (
          ""
        )}
      </div>
      {selectedGroup && (
        <div className="flex flex-col justify-end items-end">
          <h4>{`${selectedGroup.agencyName}`}</h4>
          <h5 className="text-xs text-end">{`${selectedGroup.name} - ${selectedGroup.coordinator}`}</h5>
        </div>
      )}
      {isDownloadModalOpen && (
        <DownloadModal
          handleToggleModal={handleToggleModal}
          activeTab={currentNavItemLabel}
        />
      )}
    </div>
  );
};

export default ClientHeader;
