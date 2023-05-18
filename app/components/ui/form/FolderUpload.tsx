interface FolderUploadProps {
    id: string;
    label: string;
}

export const FolderUpload = (props: FolderUploadProps) => {

    const { id, label } = props;

    return (
        <div>
              <label className="text-dark-gray dark:text-light-gray">
                {label}
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed ">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-dark-gray dark:text-white"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer px-2 py-1 dark:bg-white bg-gray-300 font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                      <span className="">Subir Carpeta</span>
                      <input
                        id={id}
                        type="file"
                        className="sr-only"
                        
                      />
                    </label>
                    <p className="pl-1 text-dark-gray dark:text-white self-center">o arrastrá acá</p>
                  </div>
                  <p className="text-xs text-dark-gray dark:text-white">Subí solo la carpeta raíz del Grupo/Master</p>
                </div>
              </div>
            </div>
    )
}