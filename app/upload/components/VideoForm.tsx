import { FileUpload, Input, Select, TextArea } from "@/app/components/ui/form";

export const VideoForm = () => {
  const empresas = ["Astros", "Eilat", "Setil", "Pretti"];
  const grupos = ["M249 - Esc. Belgrano", "M235 - Esc. Velez Sarsfield"];

  return (
    <div className="fade-in animate-in duration-700">
      <section className="p-6 shadow-md">
        <form>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Select id="empresas" label="Empresa" options={empresas} />
            <Select id="grupo" label="Grupo/Master" options={grupos} />
          </div>
          <div className="grid grid-cols-1 mt-2 gap-2">
            <TextArea id="observaciones" label="Observaciones" />
            <FileUpload 
                      label="Subir Videos"
                      id="videos"
                      buttonText="Subir Videos"
                      description="Subí los archivos .MP4 de cada excursión."
                    />
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 focus:outline-none focus:bg-gray-600">
              Subir Archivos
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
