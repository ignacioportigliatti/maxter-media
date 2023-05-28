import { useState } from "react";
import axios from "axios";
import { AiOutlineFileAdd } from "react-icons/ai";

interface FileUploadProps {
  label: string;
  id: string;
  description: string;
  buttonText: string;
  onUpload: (filePath: string, file: File) => Promise<void> // Actualizamos la firma de la función onUpload
}

export const FileUpload = (props: FileUploadProps) => {
  const { id, label, buttonText, description, onUpload } = props;
  const [file, setFile] = useState<File | undefined>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
    if (selectedFile) {
      uploadFile(selectedFile); // Llamamos a la función de carga con el archivo seleccionado
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload", formData);
      // Manejar la respuesta del API de carga según sea necesario
      console.log(response.data);

      if (response.data.success) {
        const filePath = response.data.filePath; // Obtenemos el path del archivo subido
        onUpload(filePath, file); // Pasamos el path al callback onUpload
      } else {
        // Manejar el error de carga si es necesario
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  };

  return (
    <div>
      <label className="text-dark-gray dark:text-light-gray">{label}</label>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 dark:border-gray-500 border-gray-200 border-dashed">
        <div className="space-y-1 text-center">
          <AiOutlineFileAdd
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          />
          <div className="flex text-sm justify-center text-gray-600">
            <label className="relative cursor-pointer px-2 py-1 dark:bg-white bg-gray-300 font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
              <span className="">{buttonText}</span>
              <input
                id={id}
                type="file"
                className="sr-only"
                accept="image/png, image/jpeg"
                onChange={handleFileChange} // Actualizamos el manejador de eventos para capturar el archivo seleccionado
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
            {file ? `Archivo seleccionado: ${file.name}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};
