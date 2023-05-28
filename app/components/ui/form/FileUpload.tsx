import { AiOutlineFileAdd } from "react-icons/ai";

interface FileUploadProps {
  label: string;
  id: string;
  description: string;
  buttonText: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
}

export const FileUpload = (props: FileUploadProps) => {
  const { id, label, buttonText, description, handleFileChange, fileName } =
    props;

  return (
    <div>
      <label className="text-dark-gray dark:text-light-gray">{label}</label>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 dark:border-gray-500 border-gray-200 border-dashed">
        <div className="space-y-1 text-center">
          <AiOutlineFileAdd className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
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
            {fileName ? `Archivo seleccionado: ${fileName}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};
