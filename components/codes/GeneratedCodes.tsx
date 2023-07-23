'use client'

import { Codes, Group } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

type GeneratedCodesProps = {
  selectedGroup: Group;
};

const GeneratedCodes = (props: GeneratedCodesProps) => {
  const { selectedGroup } = props;
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [groupCodes, setGroupCodes] = useState<Codes[]>([]);

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

  const getGroupCodes = async () => {
    try {
        const res = await axios.post('/api/codes/get', {
            groupId: selectedGroup.id
        }).then((res) => res.data);
        if (res.success) {
            setGroupCodes(res.codes);
        }
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    getGroupCodes();
  }, []);

  // Función para manejar la selección de todos los códigos
  const handleSelectAll = () => {
    const allCodes = groupCodes.map((code) => code.code);
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
                checked={selectedCodes.length === groupCodes.length}
                onChange={handleSelectAll}
              />
            </th>
            <th align="left" id="headerCode" className="w-1/8 text-xs py-2">
              Codigo
            </th>
            <th align="left" id="headerType" className="w-1/8 text-xs">
              Tipo
            </th>
            <th align="left" id="headerType" className="w-1/8 text-xs">
              Opcional
            </th>
            <th align="right" id="headerType" className="w-1/8 text-xs">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {groupCodes.map((code, index) => (
            <tr key={index}>
              <td className="text-sm" align="left">
                <input
                  type="checkbox"
                  checked={selectedCodes.includes(code.code)}
                  onChange={() => handleSelectCode(code.code)}
                />
              </td>
              <td className="text-sm" width={250} align="left" id="rowCode">
                {code.code}
              </td>
              <td className="text-sm" width={50} align="left" id="rowType">
                {code.type === 'photo' ? 'Fotos' : code.type === 'video' ? 'Videos' : 'Full'}
              </td>
              <td className="text-sm" align="left" id="rowOptional">
                {code.optional === true ? "Si" : "No"}
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
