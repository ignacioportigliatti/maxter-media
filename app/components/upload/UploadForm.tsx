import { FileUpload, Input, Select, TextArea } from "../ui/form";

export const UploadForm = () => {
  const empresas = ["Astros", "Eilat", "Setil", "Pretti"];
  const grupos = ['M249 - Esc. Belgrano', 'M235 - Esc. Velez Sarsfield',];

  return (
    <div>
      <section className="p-6 shadow-md">
        <form>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Select id="empresas" label="Empresa" options={empresas} />
            <Select id="grupo" label="Grupo/Master" options={grupos} />
            <Select id="material" label="Tipo de Material" options={['Fotos', 'Videos']} />
            <FileUpload id="file" label="Subida de Archivos" />
            <TextArea id="observaciones" label="Observaciones" />
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600">
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
