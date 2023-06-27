'use server'

const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');

// Crea una instancia del cliente de Video Intelligence
const client = new VideoIntelligenceServiceClient();

async function generateThumbnail(bucketName: string, videoPath: string, outputPath: string) {
  try {
    // Configura la solicitud para generar un thumbnail del frame específico
    const request = {
      inputUri: `gs://${bucketName}/${videoPath}`,
      outputUri: `gs://${bucketName}/${outputPath}`,
      features: ['THUMBNAIL'],
      videoContext: {
        segments: [
          {
            startTimeOffset: {
              seconds: 60,  // Minuto 1 (60 segundos)
            },
            endTimeOffset: {
              seconds: 61,  // Minuto 1 + 1 segundo
            },
          },
        ],
        thumbnailSize: '500x500',
      },
    };

    // Envía la solicitud de análisis de video
    const [operation] = await client.annotateVideo(request);

    // Espera a que la operación de análisis de video se complete
    const [operationResult] = await operation.promise();

    // Obtiene la ruta del archivo del thumbnail generado
    const [thumbnail] = operationResult.annotationResults.thumbnailAnnotations;
    const thumbnailPath = thumbnail.thumbnail;
    
    console.log('Thumbnail generado:', thumbnailPath);
  } catch (error) {
    console.error('Error al generar el thumbnail:', error);
  }
}

// Ejemplo de uso
generateThumbnail('my-bucket', 'videos/my-video.mp4', 'thumbnails/my-video-thumbnail.jpg');
