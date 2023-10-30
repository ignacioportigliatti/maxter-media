"use client";

import JSZip from "jszip";
import { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FolderWithPhotos } from "../my-photos/PhotoGrid";
import { handleDownloadAlbum } from "../my-photos/utils/handleDownloadAlbum";

type DownloadModalProps = {
  handleToggleModal: any;
  activeTab: string;
};

interface Video {
  video: {
    Key: string;
    Size: number;
    url: string;
  };
}

const DownloadModal = (props: DownloadModalProps) => {
  const { handleToggleModal, activeTab } = props;
  const [isDownloading, setIsDownloading] = useState(false); // Controla si se está descargando
  const videos = useSelector((state: any) => state.videos);
  const photos = useSelector((state: any) => state.photos);
  const agency = useSelector((state: any) => state.agency);

  const handleDownloadVideo = async (video: Video) => {
    setIsDownloading(true);

    if (isDownloading) {
      return;
    }

    const link = document.createElement("a");
    link.href = video.video.url;
    link.download = video.video.Key.split("/")[3];
    link.click();

    setIsDownloading(false);
  };


  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center py-4 sm:py-0 bg-black bg-opacity-90">
      <div className="bg-medium-gray w-full max-w-4xl mx-4 rounded-lg shadow-lg">
        <div className="py-4 bg-dark-gray flex justify-between px-4 text-white text-center rounded-t-lg">
          <h2 className="text-lg uppercase font-light">
            Descarga de {activeTab === 'Mis Videos' ? 'videos' : 'fotos'}
          </h2>
          <button onClick={handleToggleModal} className="text-white">
            <TfiClose className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-4 grid-cols-2 w-full py-8 px-4 sm:px-8 flex-wrap gap-2">
          {activeTab === "Mis Videos" && (
            <>
            {videos.map((video: any, index: number) => (
                <div key={index} className="flex flex-col w-full justify-center items-center gap-1">
                  <h2 className="text-xs md:text-end text-center">{video.video.Name}</h2>
                  <button
                    className="text-xs w-full py-1 opacity-75 hover:opacity-100 text-white rounded-md  transition duration-300"
                    onClick={() => handleDownloadVideo(video)}
                    style={{backgroundImage: `linear-gradient(to right, ${agency.primaryColor} , ${agency.secondaryColor})`}}
                  >
                    Descargar
                  </button>
                </div>
              ))}
            </>
          )}
          {activeTab === "Mis Fotos" && (
            <>
            {photos.map((folderWithPhotos: FolderWithPhotos, index: number) => (
                <div key={index} className="flex flex-col w-full justify-center items-center gap-1">
                  <h2 className="text-xs text-end">{`${folderWithPhotos.folder} (${folderWithPhotos.photos.length} fotos)`}</h2>
                  <button
                    className="text-xs px-2 w-full py-1 opacity-75 hover:opacity-100 text-white rounded-md  transition duration-300"
                    onClick={() =>  handleDownloadAlbum(folderWithPhotos)}
                    style={{backgroundImage: `linear-gradient(to right, ${agency.primaryColor} , ${agency.secondaryColor})`}}
                  >
                    Descargar
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default DownloadModal;
