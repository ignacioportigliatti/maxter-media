"use client";

import { useEffect, useState } from "react";
import { GroupsTable } from "./components/GroupsTable";
import axios from "axios";

export default function GroupsPage() {
  const [groups, setGroups] = useState<
    Array<{
      master: string;
      agencyName: string;
      coordinator: string;
      school: string;
      entry: string;
      exit: string;
    }>
  >([]);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/groups");
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
        <GroupsTable
          groups={groups.map((group) => group.master)}
          agencies={groups.map((group) => group.agencyName)}
          coordinators={groups.map((group) => group.coordinator)}
          schools={groups.map((group) => group.school)}
          entries={groups.map((group) => group.entry)}
          exits={groups.map((group) => group.exit)}
        />
      </div>
    </div>
  );
}
