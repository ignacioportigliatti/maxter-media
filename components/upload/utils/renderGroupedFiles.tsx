import Uppy from "@uppy/core";
import { UppyFile } from "@uppy/core";
import { AiOutlineDelete } from "react-icons/ai";
import { UploadData } from "../UploadContext";

export const renderGroupedFiles = (
    activeTab: string,
    uploadQueue: [UppyFile, UploadData][],
    uppy: Uppy,
    fileUploadProgress: Record<string, number>,
    deleteFromVideoUploadQueue: (file: UppyFile, data: any) => void,
    deleteFromPhotoUploadQueue: (file: UppyFile, data: any) => void,
    groupedFiles: Record<string, [UppyFile, any][]>
  ) => {
    return uploadQueue.length === 0 ? (
      <div className="flex items-center justify-center h-full">
        <p className="flex-grow flex items-center justify-center">
          No hay archivos en la cola
        </p>
      </div>
    ) : (
      Object.entries(groupedFiles).map(([groupName, files], index) => (
        <details key={index} className="border -mb-[1px] border-slate-800">
          <summary className="px-4 py-2 cursor-pointe bg-medium-gray hover:bg-red-600 duration-500 transition cursor-pointer">
            {groupName} ({files.length} archivo{files.length !== 1 ? "s" : ""})
          </summary>
          <div className="">
            <table className="w-full">
              <thead className="">
                <tr className="bg-slate-800">
                  <th className="px-4 py-2 font-normal uppercase text-left text-sm  text-white">
                    Archivo
                  </th>
                  <th className="px-4 py-2 font-normal uppercase text-left text-sm  text-white">
                    Grupo
                  </th>
                  <th className="px-4 py-2 font-normal uppercase text-left text-sm  text-white">
                    Agencia
                  </th>
                  <th className="px-4 py-2 font-normal uppercase text-left text-sm  text-white">
                    Progreso
                  </th>
                  <th
                    align="right"
                    className="px-4 py-2 font-normal uppercase text-left text-sm  text-white"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map(([file, data], index) => (
                  <tr key={file.id}>
                    <td className="px-4 py-2">{file.name}</td>
                    <td className="px-4 py-2">{data.groupName}</td>
                    <td className="px-4 py-2">{data.agencyName}</td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-gray-200 rounded-full">
                        <div
                          className="bg-red-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                          style={{
                            width: `${
                              (fileUploadProgress[file.id] || 0) * 100
                            }%`,
                          }}
                        >
                          {((fileUploadProgress[file.id] || 0) * 100).toFixed(2)}%
                        </div>
                      </div>
                    </td>
                    <td align="right" className="px-4 py-2">
                      <button
                        onClick={() => {
                          if (activeTab === 'videos') {
                            deleteFromVideoUploadQueue(file, data);
                          } else if (activeTab === 'photos') {
                            deleteFromPhotoUploadQueue(file, data)
                          }
                        }}
                        className=""
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))
    );
  };