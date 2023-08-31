"use client";

import { AiOutlineFileAdd } from "react-icons/ai";
import { useState } from "react";

interface FileUploadProps {
  label: string;
  id: string;
  description: string;
  buttonText: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
  required?: boolean;
  error?: string;
}

export const FileUpload = (props: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const {
    id,
    label,
    buttonText,
    description,
    handleFileChange,
    fileName,
    required,
    error,
  } = props;

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.files = files;
    const fileChangeEvent = {
      target: fileInput,
    } as React.ChangeEvent<HTMLInputElement>;

    handleFileChange(fileChangeEvent);
  };

  return (
    <div>
      <label className="text-dark-gray text-sm dark:text-light-gray">
        {label}
      </label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 dark:border-gray-500 border-gray-200 border-dashed ${
          isDragging ? "border-red-600" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <AiOutlineFileAdd className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <div className="flex text-sm justify-center text-gray-600">
            <label className="relative cursor-pointer px-2 py-1 dark:bg-white bg-gray-300 font-medium text-red-600 hover:text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-600">
              <span className="">{buttonText}</span>
              <input
                required={required}
                id={id}
                type="file"
                className="sr-only"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1 text-dark-gray dark:text-white self-center">
              o arrastrá acá
            </p>
          </div>
          <p className="text-xs text-dark-gray dark:text-white">
            {description}
          </p>
          <p className="text-xs text-dark-gray dark:text-white">
            {fileName ? `Archivo seleccionado: ${fileName}` : ""}
          </p>
        </div>
      </div>
      {error && <p className="text-red-600 text-xs text-center">{error}</p>}
    </div>
  );
};
