"use client";

import { useState, forwardRef } from "react";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";

interface FolderUploadProps {
  label: string;
  id: string;
  description: string;
  buttonText: string;
  handleFolderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  folderName?: string;
  required?: boolean;
  error?: string;
}

export const FolderUpload = (props: FolderUploadProps) => {
  const {
    id,
    label,
    buttonText,
    description,
    handleFolderChange,
    folderName,
    required,
    error,
  } = props;

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [isDragging, setIsDragging] = useState(false);
  

  const files = acceptedFiles.map((file) => (
    <li 
      className="border-b-2 border-gray-500 p-2 text-xs"
    key={file.webkitRelativePath}>
      {file.webkitRelativePath === "" ? file.name : file.webkitRelativePath} -{" "}
      {file.size} bytes
    </li>
  ));

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <div>
      <label className="text-light-gray">{label}</label>
      <div className={``}>
        <div
          {...getRootProps({
            className: `dropzone mt-2 flex flex-col justify-center mx-auto items-center px-6 pt-5 pb-6 border-2 border-gray-500 border-dashed 
        ${isDragging ? "border-red-600" : "border-gray-200"}`,
          })}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragLeave}
          
        >
          <input {...getInputProps()} />
          <div className="pointer-events-none">
            <p>{description}</p>
          </div>
        </div>
      </div>
      <aside className="mt-2 text-center">
        <h4>Archivos</h4>
        <ul className="border-2 border-b-0">{files}</ul>
      </aside>
      {error && <p className="text-red-600 text-xs text-center">{error}</p>}
    </div>
  );
};
