import { useState, useEffect, useRef } from "react";
import { Agency } from "@prisma/client";
import { getSignedUrl } from "@/utils/googleStorage/getSignedUrl";

interface PhotoGalleryProps {
  title: string;
  agencyName: string;
  uploadedAt: string;
  filePath?: string;
}

export const PhotoGallery = (props: PhotoGalleryProps) => {
  const { title, agencyName, uploadedAt, filePath } = props;
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const photoRef = useRef<HTMLImageElement>(null);
  

  useEffect(() => {
    const getSelectedAgency = async () => {
      try {
        const response = await fetch("/api/agencies");
        const agencies: Agency[] = await response.json();
        const agency = agencies.find(
          (agency: Agency) => agency.name === agencyName
        );
        setSelectedAgency(agency || null);
      } catch (error) {
        console.error("Error al obtener el logo de la agencia:", error);
      }
    };

    getSelectedAgency();
  }, [agencyName]);

  useEffect(() => {
    const getPhotoSrc = async () => {
      try {
        const photo = await getSignedUrl("maxter-media", filePath as string);
        setPhotoSrc(photo);
      } catch (error) {
        console.error("Error al obtener el photo:", error);
      }
    };

    if (filePath) {
      getPhotoSrc();
    }
  }, [filePath]);

  useEffect(() => {
    if (photoRef.current && photoSrc) {
      const player = photojs(photoRef.current, {
        sources: [
          {
            src: photoSrc,
            type: "image/jpg",
          },
        ],
      });

      return () => {
        player.dispose();
      };
    }
  }, [photoSrc]);

  const handleTitleClick = () => {
    if (photoRef.current) {
      photoRef.current.play();
    }
  };

  return (
    <div>
      <div className="min-w-[350px]">
        <div className="w-full flex flex-col">
          <div className="w-full">
            <photo
              height={200}
              controls
              width={350}
              ref={photoRef}
              preload="metadata"
              className="photo-js vjs-default-skin w-full"
            />

          </div>

          <div className="flex flex-row mt-3 gap-2">
            <a href="#">
              <img
                src={selectedAgency?.logoSrc as string}
                className="rounded-full max-h-10 max-w-10 mr-2"
              />
            </a>

            <div className="flex flex-col">
              <a href="#">
                <p
                  className="dark:text-gray-100 text-dark-gray text-sm font-semibold hover:text-orange-500"
                  onClick={handleTitleClick}
                >
                  {title}
                </p>
              </a>
              <p className="text-gray-400 text-xs">{agencyName}</p>
              <p className="text-gray-400 text-xs">{uploadedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
