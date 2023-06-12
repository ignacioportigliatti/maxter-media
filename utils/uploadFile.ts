import axios, { AxiosResponse } from "axios";
import { generateOAuth2Token } from "./";
import { toast } from "react-toastify";

export const uploadFile = async (file: File, folder: string) => {
  
    const formData = new FormData();
    formData.append("archivo", file);
    const uploadOptions = {
      autoClose: false as false, // No cerrar automáticamente el toast
    };
  
    const uploadToastId = toast.info("Subiendo archivo...", uploadOptions); // Obtener el ID del toast
  
    try {
      const OAuthToken = await generateOAuth2Token(process.env.NEXT_PUBLIC_BUCKET_KEYFILE as string)
      const response: AxiosResponse = await axios.post(
        `https://www.googleapis.com/upload/storage/v1/b/${process.env.NEXT_PUBLIC_BUCKET_NAME}/o?uploadType=media&name=${folder}/${file.name}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${OAuthToken}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / file.size) * 100
            );
            toast.update(uploadToastId, {
              render: `Subiendo archivo (${progress}%)...`, // Actualizar el contenido del toast con el porcentaje de carga
            });
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Archivo subido exitosamente", response);
        toast.success("Archivo subido exitosamente"); // Mostrar toast de éxito
        return response.data.selfLink;
      } else {
        console.error("Error al subir el archivo:", response.data);
        toast.error("Error al subir el archivo"); // Mostrar toast de error
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al subir el archivo"); // Mostrar toast de error
    } finally {
      toast.dismiss(uploadToastId); // Cerrar el toast de carga una vez que la carga se complete o ocurra un error
    }
  };