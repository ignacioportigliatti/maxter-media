import axios, { AxiosResponse } from "axios";
import { generateOAuth2Token } from "..";
import { toast } from "react-toastify";

export const deleteGoogleStorageFile = async (
    fileName: string,
    folder: string,
    bucket: string,
) => {
    const deleteOptions = {
        autoClose: false as false, // No cerrar automáticamente el toast
    };

    const deleteToastId = toast.info("Eliminando archivo...", deleteOptions); // Obtener el ID del toast

    try {
        const OAuthToken = await generateOAuth2Token(
            process.env.NEXT_PUBLIC_BUCKET_KEYFILE as string
        );
        const response: AxiosResponse = await axios.delete(
            `https://www.googleapis.com/storage/v1/b/${bucket}/o/${folder}%2F${fileName}`,
            {
                headers: {
                    Authorization: `Bearer ${OAuthToken}`,
                },
            }
        );
        if (response.status === 204) {
            toast.success("Archivo eliminado exitosamente"); // Mostrar toast de éxito
        } else {
            console.error("Error al eliminar el archivo:", response);
        }
    } catch (error) {
        console.error(error);
    } finally {
        toast.dismiss(deleteToastId);
    }
}