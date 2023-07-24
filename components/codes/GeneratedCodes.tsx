'use client'

import { Codes, Group } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { Pagination } from "../ui";

type GeneratedCodesProps = {
  selectedGroup: Group;
};

const GeneratedCodes = (props: GeneratedCodesProps) => {
  const { selectedGroup } = props;
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [groupCodes, setGroupCodes] = useState<Codes[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'code',
    direction: 'asc',
  });
  const itemsPerPage = 1; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

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

  const getGroupCodes = async () => {
    try {
      const res = await axios.post('/api/codes/get', {
        groupId: selectedGroup.id,
      }).then((res) => res.data);

      if (res.success) {
        // Ordenar los códigos según la configuración actual
        const sortedCodes = sortCodes(res.codes, sortConfig.key, sortConfig.direction);
        setGroupCodes(sortedCodes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGroupCodes();
  }, [sortConfig]);

  const sortCodes = (codes: Codes[], key: string, direction: 'asc' | 'desc') => {
    return [...codes].sort((a: Record<string, any>, b: Record<string, any>) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Función para cambiar la configuración de ordenamiento cuando se hace clic en el encabezado de la columna
  const handleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  // Función para manejar la selección de todos los códigos
  const handleSelectAll = () => {
    const allCodes = groupCodes.map((code) => code.code);
    setSelectedCodes((prevSelected) =>
      prevSelected.length === allCodes.length ? [] : allCodes);
  };

  const handleDelete = async (codeId: string) => {
    try {
        const res = await axios.post('/api/codes/delete', {
            codeId: codeId
        }).then((res) => res.data);
        if (res.success) {
            getGroupCodes();
        }
        return res;
      } catch (error) {
        console.error(error);
      }
  }

  return (
    <div className="w-full">
      <h2 className="text-base text-center w-full font-semibold">
        Codigos Generados
      </h2>
      <div className="flex items-center gap-2"></div>
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
            <th
              align="left"
              id="headerCode"
              className="w-1/8 text-xs py-2 cursor-pointer"
              onClick={() => handleSort('code')}
            >
              Codigo
              {sortConfig.key === 'code' && (
                <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th
              align="left"
              id="headerType"
              className="w-1/8 text-xs cursor-pointer"
              onClick={() => handleSort('type')}
            >
              Tipo
              {sortConfig.key === 'type' && (
                <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th
              align="left"
              id="headerOptional"
              className="w-1/8 text-xs cursor-pointer"
              onClick={() => handleSort('optional')}
            >
              Opcional
              {sortConfig.key === 'optional' && (
                <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th align="right" id="headerActions" className="w-1/8 text-xs">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {groupCodes.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                ).map((code, index) => (
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
                <button onClick={() => handleDelete(code.id)}>
                  <AiOutlineDelete className="opacity-50 hover:opacity-100 cursor-pointer transition duration-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={groupCodes.length}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default GeneratedCodes;
