import axios, { AxiosResponse } from "axios";
import { generateOAuth2Token } from ".";
import { toast } from "react-toastify";

export const uploadGoogleStorageFile = async (
  file: File,
  folder: string,
  bucket: string,
  isPublic?: boolean
) => {
  
  const uploadOptions = {
    autoClose: false as false, // No cerrar automáticamente el toast
  };

  const uploadToastId = toast.info("Subiendo archivo...", uploadOptions); // Obtener el ID del toast

  try {
    const OAuthToken = await generateOAuth2Token(
      process.env.NEXT_PUBLIC_BUCKET_KEYFILE as string
    );
    const response: AxiosResponse = await axios.post(
      `https://www.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${folder}/${file.name}`,
      file,
      {
        headers: {
          Authorization: `Bearer ${OAuthToken}`,
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / file.size) * 100);
          toast.update(uploadToastId, {
            render: `Subiendo archivo (${progress}%)...`, // Actualizar el contenido del toast con el porcentaje de carga
          });
        },
      }
    );
    if (response.status === 200) {
      if (isPublic === true) {
        try {
          const publicResponse: AxiosResponse = await axios.post(
            `https://www.googleapis.com/storage/v1/b/${bucket}/o/${folder}%2F${file.name}/acl`,
            {
              entity: "allUsers",
              role: "READER",
            },
            {
              headers: {
                Authorization: `Bearer ${OAuthToken}`,
              },
            }
          );
          const publicLink = `https://storage.googleapis.com/${bucket}/${folder}/${file.name}`;
          return publicLink;
        } catch (error) {
          console.error("Error al hacer publico el archivo", error);
        }
      }
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
