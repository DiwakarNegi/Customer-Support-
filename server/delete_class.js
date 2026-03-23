import weaviate from 'weaviate-ts-client';
import dotenv from 'dotenv';
dotenv.config();

const client = weaviate.client({
    scheme: 'https',
    host: process.env.WEAVIATE_HOST,
    apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
});

client.schema.classDeleter().withClassName('SupportDocs').do()
  .then(() => console.log(" Old class deleted!"))
  .catch((e) => console.log("Class didn't exist or already deleted."));