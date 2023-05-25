"use client";

import { useState, useEffect } from "react";
import { AgencyTable } from "./components/AgencyTable";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function EnterprisesPage() {
  const [agencies, setAgencies] = useState<
    Array<{
      name: string;
      location: string;
      phone: string;
      email: string;
      groups: number;
      logoSrc: string;
      id: string;
    }>
  >([]);

  const mappedAgencies = agencies.map((agency) => ({
    name: agency.name,
    location: agency.location,
    group: agency.groups,
    phone: agency.phone,
    email: agency.email,
    logoSrc: agency.logoSrc,
    id: agency.id,
  }));

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/agencies");
      setAgencies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full mx-auto justify-center items-start">
      <div
        className="w-full flex flex-row dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 
      text-black dark:text-white drop-shadow-sm items-center"
      >
        <h2>Empresas</h2>
      </div>
      <div className="mx-auto p-7">
        <AgencyTable
          agencies={mappedAgencies}
        />
      </div>
    </div>
  );
}
