"use server";

const { GoogleAuth } = require("google-auth-library");

export default async function generateOAuth2Token(keyfile: string) {
  const auth = new GoogleAuth({
    keyFile: keyfile,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  if (isTokenExpired(token)) {
    console.log("Token expirado, refrescando...");
    await client.refreshAccessToken();
    const refreshedToken = await client.getAccessToken();
    return refreshedToken.token;
  }
  return token.token;
}

function isTokenExpired(token: any) {
  // Obtener la fecha actual
  const currentTime = new Date().getTime() / 1000;

  // Verificar si la fecha de vencimiento del token es menor que la fecha actual
  return token.expiry_date < currentTime;
}
