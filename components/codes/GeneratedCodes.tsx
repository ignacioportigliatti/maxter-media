'use client'

import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

type GeneratedCodesProps = {
  codesTableContent: {
    code: string;
    type: string;
    optional: string;
  }[];
};

const GeneratedCodes = (props: GeneratedCodesProps) => {
  const { codesTableContent } = props;
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

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

  // Función para manejar la selección de todos los códigos
  const handleSelectAll = () => {
    const allCodes = codesTableContent.map((code) => code.code);
    setSelectedCodes((prevSelected) =>
      prevSelected.length === allCodes.length ? [] : allCodes);
  };

  return (
    <div className="w-full">
      <h2 className="text-base text-center w-full font-semibold">
        Codigos Generados
      </h2>
      <div className="flex items-center gap-2">

      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th align="left" id="headerCode" className="w-1/8 text-xs py-2">
              <input
                type="checkbox"
                checked={selectedCodes.length === codesTableContent.length}
                onChange={handleSelectAll}
              />
            </th>
            <th align="left" id="headerCode" className="w-3/8 text-xs py-2">
              Codigo
            </th>
            <th align="left" id="headerType" className="w-3/8 text-xs">
              Tipo
            </th>
            <th align="left" id="headerType" className="w-1/8 text-xs">
              Opcional
            </th>
          </tr>
        </thead>
        <tbody>
          {codesTableContent.map((code, index) => (
            <tr key={index}>
              <td className="text-sm" align="left">
                <input
                  type="checkbox"
                  checked={selectedCodes.includes(code.code)}
                  onChange={() => handleSelectCode(code.code)}
                />
              </td>
              <td className="text-sm" align="left" id="rowCode">
                {code.code}
              </td>
              <td className="text-sm" align="left" id="rowType">
                {code.type}
              </td>
              <td className="text-sm" align="left" id="rowOptional">
                {code.optional}
              </td>
              <td align="right" id="rowDelete">
                <button>
                  <AiOutlineDelete className="opacity-50 hover:opacity-100 cursor-pointer transition duration-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GeneratedCodes;
