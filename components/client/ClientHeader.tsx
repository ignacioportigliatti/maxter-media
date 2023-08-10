import { Agency, Group } from "@prisma/client";
import React, { useState, useEffect } from "react";

type ClientHeaderProps = {
  agency: Agency;
  selectedGroup: Group;
  selectedNavItemLabel: string;
};

const ClientHeader = (props: ClientHeaderProps) => {
  const { agency, selectedGroup, selectedNavItemLabel } = props;

  // Estado local para mantener el valor actual de selectedNavItemLabel
  const [currentNavItemLabel, setCurrentNavItemLabel] = useState(selectedNavItemLabel);

  // Utilizamos el efecto de React para realizar la transición cuando el valor cambie
  useEffect(() => {
    setCurrentNavItemLabel(selectedNavItemLabel);
  }, [selectedNavItemLabel]);

  return (
    <div
      style={{ backgroundColor: agency.primaryColor as string }}
      className="fixed flex w-full min-w-screen z-20 flex-row items-center justify-between themeTransition py-3 px-6 text-black dark:text-white"
    >
      <div>
        {/* Utilizamos currentNavItemLabel en lugar de selectedNavItemLabel */}
        <h2 className="font-light text-3xl md:pl-16 animate-in transition fade-in-40">
          {currentNavItemLabel}
        </h2>
      </div>
      {selectedGroup && (
        <div className="flex flex-col justify-end items-end">
          <h4>{`Escuela ${selectedGroup.school} `}</h4>
          <h5 className="text-xs">{`${selectedGroup.name} - ${selectedGroup.agencyName}`}</h5>
        </div>
      )}
    </div>
  );
};

export default ClientHeader;
