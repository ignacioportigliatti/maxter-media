"use client";

import { useEffect, useState } from "react";
import { GroupsTable } from "@/components/groups";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function GroupsPage() {
  const [groups, setGroups] = useState<
    Array<{
      name: string;
      agencyName: string;
      coordinator: string;
      school: string;
      entry: string;
      exit: string;
      id: string;
    }>
  >([]);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const response = await axios.get("/api/groups");
      setGroups(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full mx-auto justify-center items-start">
      <div className="w-full flex flex-row dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 text-black dark:text-white drop-shadow-sm items-center">
        <h2>Grupos</h2>
      </div>
      <div className="mx-auto p-7">
        <GroupsTable/>
      </div>
    </div>
  );
}
