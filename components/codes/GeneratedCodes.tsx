"use client";

import { Agency, Codes, Group } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineLoading,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { Pagination } from "../ui";

import { CodePdfTemplate } from "./CodePdfTemplate";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import JSZip from "jszip";

type GeneratedCodesProps = {
  selectedGroup: Group;
};

const GeneratedCodes = (props: GeneratedCodesProps) => {
  const { selectedGroup } = props;
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [selectedAgency, setSelectedAgency] = React.useState<Agency>();
  const [groupCodes, setGroupCodes] = useState<Codes[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "code",
    direction: "asc",
  });
  const itemsPerPage = 6; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const agencies = useSelector((state: any) => state.agencies);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Función para manejar la selección individual de códigos
  const handleSelectCode = (code: string) => {
    if (selectedCodes.includes(code)) {
      setSelectedCodes((prevSelected) =>
        prevSelected.filter((selectedCode) => selectedCode !== code)
      );
    } else {
      setSelectedCodes((prevSelected) => [...prevSelected, code]);
    }
  };

  const getSelectedAgency = async (group: Group) => {
    const selectedAgency = agencies.find(
      (agency: any) => agency.id === group.agencyId
    );
    setSelectedAgency(selectedAgency);
    return selectedAgency;
  };

  const getGroupCodes = async () => {
    await getSelectedAgency(selectedGroup);
    try {
      const res = await axios
        .post("/api/codes/get", {
          groupId: selectedGroup.id,
        })
        .then((res) => res.data);

      if (res.success) {
        // Ordenar los códigos según la configuración actual
        const sortedCodes = sortCodes(
          res.codes,
          sortConfig.key,
          sortConfig.direction
        );
        setGroupCodes(sortedCodes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGroupCodes();
  }, [sortConfig]);

  const handleMultiPDF = () => {
    const codes = groupCodes.filter((code) =>
      selectedCodes.includes(code.code)
    );

    const zip = new JSZip();
    // for each pdf you have to add the blob to the zip
    codes.forEach((code) => {
      zip.file(
        `${code.code}.pdf`,
        pdf(
          <CodePdfTemplate
            code={code}
            selectedGroup={selectedGroup}
            selectedAgency={selectedAgency as Agency}
          />
        ).toBlob()
      );
    });

    // once you finish adding all the pdf to the zip, return the zip file
    return zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = selectedGroup.name + ".zip";
      link.click();
    });
  };

  const sortCodes = (
    codes: Codes[],
    key: string,
    direction: "asc" | "desc"
  ) => {
    return [...codes].sort((a: Record<string, any>, b: Record<string, any>) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Función para cambiar la configuración de ordenamiento cuando se hace clic en el encabezado de la columna
  const handleSort = (key: string) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Función para manejar la selección de todos los códigos
  const handleSelectAll = () => {
    const allCodes = groupCodes.map((code) => code.code);
    setSelectedCodes((prevSelected) =>
      prevSelected.length === allCodes.length ? [] : allCodes
    );
  };
  

  const handleDelete = async (codeId: string) => {
    try {
      const res = await axios
        .post("/api/codes/delete", {
          codeId: codeId,
        })
        .then((res) => res.data);
      if (res.success) {
        getGroupCodes();
      }
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-base text-center w-full font-normal mb-1">
        Codigos Generados
      </h2>
      <table className="w-full h-full">
        <thead>
          <tr>
            <th align="left" id="headerCode" className="w-auto text-xs py-2">
              <input
                type="checkbox"
                checked={selectedCodes.length === groupCodes.length}
                onChange={handleSelectAll}
              />
            </th>
            <th align="left" id="headerCode" className="w-auto text-xs py-2">
              Codigo
            </th>
            <th
              align="left"
              id="headerType"
              className="w-auto text-xs cursor-pointer"
              onClick={() => handleSort("type")}
            >
              Tipo
              {sortConfig.key === "type" && (
                <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th
              align="center"
              id="headerOptional"
              className="w-auto text-xs cursor-pointer"
              onClick={() => handleSort("optional")}
            >
              Opc.
              {sortConfig.key === "optional" && (
                <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th
              align="center"
              id="headerIncludes"
              className="w-auto text-xs cursor-pointer"
              onClick={() => handleSort("includes")}
            >
              Incl.
              {sortConfig.key === "includes" && (
                <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th align="center" id="headerActions" className="w-auto text-xs">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {groupCodes
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((code: Codes, index) => (
              <tr key={index}>
                <td className="text-xs" align="left">
                  <input
                    type="checkbox"
                    checked={selectedCodes.includes(code.code)}
                    onChange={() => handleSelectCode(code.code)}
                  />
                </td>
                <td className="text-xs" align="left" id="rowCode">
                  {code.code}
                </td>
                <td className="text-xs" align="left" id="rowType">
                  {code.type === "photo"
                    ? "Fotos"
                    : code.type === "video"
                    ? "Videos"
                    : "Full"}
                </td>
                <td className="text-xs" align="center" id="rowOptional">
                  {code.optional === true ? "Si" : "No"}
                </td>
                <td className="text-xs" align="center" id="rowIncludes">
                  {code.included === true ? "Si" : "No"}
                </td>
                <td align="center" id="rowDelete">
                  <div className="flex flex-row justify-center items-center">
                    <PDFDownloadLink
                      document={
                        <CodePdfTemplate
                          code={code}
                          selectedGroup={selectedGroup}
                          selectedAgency={selectedAgency as Agency}
                        />
                      }
                      fileName={code.code}
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? (
                          <AiOutlineLoading />
                        ) : (
                          <AiOutlineFilePdf className="opacity-50 hover:opacity-100 cursor-pointer transition duration-500" />
                        )
                      }
                    </PDFDownloadLink>

                    <button>
                      <AiOutlineWhatsApp className="opacity-50 hover:opacity-100 cursor-pointer transition duration-500" />
                    </button>
                    <button onClick={() => handleDelete(code.id)}>
                      <AiOutlineDelete className="opacity-50 hover:opacity-100 cursor-pointer transition duration-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="">
        {groupCodes.length > itemsPerPage && (
          <Pagination
            totalItems={groupCodes.length}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
      {/* Bottom Actions */}
      <div className="p-2 flex gap-2 justify-center">
        {selectedCodes && selectedCodes.length > 0 && (
          <div className="flex flex-row gap-2 items-center">
            <p>{selectedCodes.length} codigos</p>
            <button onClick={handleMultiPDF} className="button !p-1 !text-xs">
              Exportar PDF
            </button>
            <button className="button !p-1 !text-xs">Enviar a Empresa</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedCodes;
