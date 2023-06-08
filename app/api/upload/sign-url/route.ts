import express from 'express';
import { Storage } from '@google-cloud/storage';	

const app = express();

const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename:  process.env.BUCKET_KEYFILE,
});

const bucket = storage.bucket(process.env.BUCKET_NAME as string);


export async function POST(req: any, res: any) {
    app.post('/api/generate-presigned-url', async (req, res) => {
        try {
          const { filename, options } = req.body;
          const file = bucket.file(filename);
          const [url] = await file.getSignedUrl(options);
            console.log('url:', url);
          res.json({ url });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al generar la URL prefirmada' });
        }
      });
      

  }


