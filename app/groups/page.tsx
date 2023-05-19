"use client";

import { GroupsTable } from "./components/GroupsTable";

export default function GroupsPage() {

    const groups  = [
        {
          group: "M001",
          agency: "Astros Turismo",
          coordinator: "Juan Perez",
          school: "Esc. Dalmacio Velez Sarsfield",
          entry: "01/01/2021",
          exit: "01/01/2021",
        },
        {
          group: "M001",
          agency: "Astros Turismo",
          coordinator: "Juan Perez",
          school: "Esc. Dalmacio Velez Sarsfield",
          entry: "01/01/2021",
          exit: "01/01/2021",
        },
    ]

  return (
    <div className="w-full mx-auto justify-center items-start">
      <div className="w-full flex flex-row dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 
      text-black dark:text-white drop-shadow-sm items-center">
        <h2>Grupos</h2>
      </div>
      <div className="mx-auto p-7">
        <GroupsTable 
          groups={groups.map((group) => group.group)}
          agencies={groups.map((group) => group.agency)}
          coordinators={groups.map((group) => group.coordinator)}
          schools={groups.map((group) => group.school)}
          entries={groups.map((group) => group.entry)}
          exits={groups.map((group) => group.exit)}
        />
      </div>
    </div>
  );
}
