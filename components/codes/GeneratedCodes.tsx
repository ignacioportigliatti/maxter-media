"use client";

import { Agency, Codes, Group } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineFilePdf,
  AiOutlineLoading,
  AiOutlinePrinter,
  AiOutlineQrcode,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { Pagination } from "../ui";

import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import { useSelector } from "react-redux";
import { CodePdfTemplate } from "./CodePdfTemplate";
import { CodePrintTemplate } from "./CodePrintTemplate";
import { formattedDate } from "@/utils/formattedDate";

type GeneratedCodesProps = {
  selectedGroup: Group;
};

const GeneratedCodes = (props: GeneratedCodesProps) => {
  const { selectedGroup } = props;
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | undefined>();
  const [groupCodes, setGroupCodes] = useState<Codes[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "code",
    direction: "asc",
  });
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const agencies = useSelector((state: any) => state.agencies);
  const [accordionState, setAccordionState] = useState<{
    [key: string]: boolean;
  }>({});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Función para manejar la selección individual de códigos
  const handleSelectCode = (code: Codes) => {
    if (selectedCodes.includes(code.code)) {
      setSelectedCodes((prevSelected) =>
        prevSelected.filter((selectedCode) => selectedCode !== code.code)
      );
    } else {
      setSelectedCodes((prevSelected) => [...prevSelected, code.code]);
    }
    if (!accordionState[code.type]) {
      setAccordionState((prevState) => ({
        ...prevState,
        [code.type]: true,
      }));
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

  const groupedCodesByType = groupCodes.reduce((acc: any, code: Codes) => {
    const key = code.type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(code);
    return acc;
  }, []);

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

  const handleCodePrint = async (code: Codes) => {
    const zip = new JSZip();
    // for each pdf you have to add the blob to the zip
    
      zip.file(
        `${code.code}.pdf`,
        pdf(
          <CodePrintTemplate codes={[code]} />
        ).toBlob()
      );
    

    // once you finish adding all the pdf to the zip, return the zip file
    return zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = selectedGroup.name + ".zip";
      link.click();
    });
  }

  const handleMultiPrint = async () => {
    const codes = groupCodes.filter((code) =>
      selectedCodes.includes(code.code)
    );

   
       const Pdf = async () => {
        return pdf(
          <CodePrintTemplate codes={codes} />
        ).toBlob()
       }
   


    // once you finish adding all the pdf to the zip, return the zip file
    
      const link = document.createElement("a");
      link.href = URL.createObjectURL(await Pdf());
      link.download = selectedGroup.name + ".zip";
      link.click();
 
  };

  const deleteMultipleCodes = async () => {
    const codes = groupCodes.filter((code) =>
      selectedCodes.includes(code.code)
    );

    try {
      codes.forEach(async (code) => {
        const res = await axios
          .post("/api/codes/delete", {
            codeId: code.id,
          })
          .then((res) => res.data);

        if (res.success) {
          getGroupCodes();
          setSelectedCodes([]);
        }
        return res;
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {groupCodes.length > 0 && (
        <h2 className="text-base text-center w-full font-normal mb-1">
          Codigos Generados
        </h2>
      )}
      {groupCodes.length === 0 && (
        <div className="flex gap-1 items-center justify-center w-full h-full">
          <AiOutlineQrcode className="text-2xl opacity-50" />
          <p className="text-xs opacity-50">No hay codigos generados</p>
        </div>
      )}
      <div className="flex flex-row w-full justify-between mb-2">
        <div className="flex items-center">
          <>
            <input
              type="checkbox"
              checked={selectedCodes.length === groupCodes.length}
              onChange={handleSelectAll}
            />

            <span className="text-xs ml-2">Seleccionar todo</span>
          </>
        </div>
        {selectedCodes.length > 0 && (
          <div className="flex gap-2 items-center">
            <p>{selectedCodes.length} codigos</p>
            <button onClick={handleMultiPDF} className="button !p-1 !text-xs">
              Exportar PDF
            </button>
            <button onClick={handleMultiPrint} className="button !p-1 !text-xs">Imprimir</button>
            <button
              onClick={deleteMultipleCodes}
              className="button !p-1 !text-xs"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {Object.keys(groupedCodesByType).map((type, index) => (
          <div
            key={type}
            
            className="border rounded pb-1 px-1"
          >
            <button className="text-xs w-full text-left cursor-pointer" onClick={() => {
              setAccordionState((prevState) => ({
                ...prevState,
                [type]: !prevState[type],
              }));
            }}>
              {type === "photo"
                ? `Fotos (${groupedCodesByType[type].length} Codigos)`
                : type === "video"
                ? `Videos (${groupedCodesByType[type].length} Codigos)`
                : `Full (${groupedCodesByType[type].length} Codigos)`}
            </button>
            {accordionState[type] && (
              <div>
                <div className="grid grid-cols-6 gap-2 bg-gray-500 text-xs mt-2 p-2 rounded-t-lg">
                  <div className="col-span-1 text-center">Seleccionar</div>
                  <div className="col-span-1 text-center">Código</div>
                  <div className="col-span-1 text-center">Expiración</div>
                  <div className="col-span-1 text-center">Opcional</div>
                  <div className="col-span-1 text-center">Incluido</div>
                  <div className="col-span-1 text-center">Acciones</div>
                </div>
                {groupedCodesByType[type]
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((code: Codes, index: number) => (
                    <div
                      key={index}
                      className="grid bg-gray-800 grid-cols-6 gap-2 p-2"
                    >
                      <div className="col-span-1 text-center">
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(code.code)}
                          onChange={() => handleSelectCode(code)}
                        />
                      </div>
                      <div
                        className="w-max flex text-xs flex-wrap items-center justify-center text-center"
                        id="rowCode"
                      >
                        {code.code}
                      </div>
                      <div
                        className="flex text-xs items-center justify-center text-center"
                        id="rowType"
                      >
                        {formattedDate(code.expires)}
                      </div>
                      <div
                        className="flex text-xs items-center justify-center text-center"
                        id="rowOptional"
                      >
                        {code.optional === true ? "Si" : "No"}
                      </div>
                      <div
                        className="flex text-xs items-center justify-center text-center"
                        id="rowIncludes"
                      >
                        {code.included === true ? "Si" : "No"}
                      </div>
                      <div className="col-span-1 flex justify-center items-center text-base">
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
                          <AiOutlinePrinter onClick={() => handleCodePrint(code)} className="opacity-50 hover:opacity-100 cursor-pointer transition duration-500" />
                        </button>
                        <button onClick={() => handleDelete(code.id)}>
                          <AiOutlineDelete className="opacity-50 hover:opacity-100 cursor-pointer transition duration-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {groupCodes.length > itemsPerPage && (
        <Pagination
          totalItems={groupCodes.length}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default GeneratedCodes;
