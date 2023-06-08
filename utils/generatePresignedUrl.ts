export const generatePresignedUrl = async (filename: string, contentType: string) => {
  const options = {
    action: "write" as 'write',
    version: 'v4' as 'v4',
    expires: Date.now() + 15 * 60 * 1000, // Expira en 15 minutos
    contentType: contentType,
  };

  // Realiza la solicitud fetch para obtener la URL prefirmada
  const response = await fetch("/api/upload/sign-url", {
    method: "POST",
    body: JSON.stringify({ filename, options }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const { url } = await response.json();
    return url;
  } else {
    throw new Error("Error al generar la URL prefirmada");
  }
};
