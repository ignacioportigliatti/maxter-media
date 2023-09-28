import { toast } from "react-toastify";

export const downloadFile = async (url: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      // Simular un clic en el enlace
      link.click();
    } catch (error) {
      toast.error(`Error descargando ${fileName}`);
      console.error("Error al descargar el archivo:", error);
    }
  };