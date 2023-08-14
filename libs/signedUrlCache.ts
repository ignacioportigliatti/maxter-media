// cache.js

import NodeCache from "node-cache";

// Interface para el objeto de caché de URLs firmadas
interface SignedUrlCache {
  [key: string]: {
    url: string;
    expires: number;
  };
}

// Objeto para almacenar el caché de URLs firmadas
export const signedUrlCache = new NodeCache();
