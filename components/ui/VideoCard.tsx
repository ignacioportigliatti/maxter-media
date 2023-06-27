import { Agency } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  agencyName: string;
  duration: string;
  uploadedAt: string;
  thumbSrc?: string;
}

export const VideoCard = (props: Props) => {
  const { title, agencyName, duration, uploadedAt, thumbSrc = "https://picsum.photos/seed/59/300/200" } = props;
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const getSelectedAgency = async () => {
    try {
      const response = await fetch('/api/agencies')
      const agencies: Agency[] = await response.json()
      const agency = await agencies.find((agency: Agency) => agency.name === agencyName)
      setSelectedAgency(agency as Agency)
      return agency
    } catch (error) {
      console.error("Error al obtener el logo de la agencia:", error);
    }
  }

  useEffect(() => {
    getSelectedAgency()
  }, [])

  

  return (
    <div>
      <div className="col-span-12 sm:col-span-6 md:col-span-3">
        <div className="w-full flex flex-col">
          <div className="relative">
            <a href="#">
              <img
                src={thumbSrc}
                className="w-96 h-auto"
                alt="video thumbnail"
              />
            </a>

            <p className="absolute right-2 bottom-2 text-gray-100 text-xs px-1 py">
              {duration}
            </p>
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
                <p className="dark:text-gray-100 text-dark-gray text-sm font-semibold hover:text-orange-500">{title}</p>
              </a>
              <p className="text-gray-400 text-xs">
                {" "}
                {agencyName}{" "}
              </p>
              <p className="text-gray-400 text-xs">{uploadedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
