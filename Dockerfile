# Utiliza una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de tu aplicación al directorio de trabajo
COPY . .

# Instala las dependencias de tu aplicación
RUN npm install

# Compila la aplicación

# Expone el puerto en el que se ejecutará tu aplicación
EXPOSE 8080

# Define el comando para iniciar la aplicación
CMD [ "npm", "run", "dev" ]
