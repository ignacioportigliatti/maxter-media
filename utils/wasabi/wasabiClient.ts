import AWS, { Credentials } from "aws-sdk";
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const wasabiEndpoint = new AWS.Endpoint("s3.us-central-1.wasabisys.com");
export const wasabiClient = new AWS.S3({
  endpoint: wasabiEndpoint,
  credentials: new Credentials({
    accessKeyId: process.env.WASABI_ACCESS_KEY as string,
    secretAccessKey: process.env.WASABI_SECRET_KEY as string,
  }),
  signatureVersion: "v4",
  region: "us-central-1",
});