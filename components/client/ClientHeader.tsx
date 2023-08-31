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
  const [currentNavItemLabel, setCurrentNavItemLabel] =
    useState(selectedNavItemLabel);

  // Utilizamos el efecto de React para realizar la transición cuando el valor cambie
  useEffect(() => {
    setCurrentNavItemLabel(selectedNavItemLabel);
  }, [selectedNavItemLabel]);

  return (
    <div
      style={{
        background: `linear-gradient(to right, ${agency.primaryColor} , ${agency.secondaryColor})`,
      }}
      className="flex w-full min-w-screen flex-row items-center justify-between themeTransition h-full px-6 text-white"
    >
      <div>
        {/* Utilizamos currentNavItemLabel en lugar de selectedNavItemLabel */}
        <h2 className="font-light text-2xl md:text-3xl animate-in transition fade-in-40">
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
