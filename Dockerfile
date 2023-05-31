# Utiliza una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de tu aplicación al directorio de trabajo
COPY . .

# Instala las dependencias de tu aplicación
RUN npm install --production

# Compila la aplicación
RUN npm run build

# Expone el puerto en el que se ejecutará tu aplicación
EXPOSE 8080

# Define el comando para iniciar la aplicación
CMD [ "npm", "run", "dev" ]
