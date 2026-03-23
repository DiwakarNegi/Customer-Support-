import weaviate from 'weaviate-ts-client';
import dotenv from 'dotenv';

dotenv.config();

const client = weaviate.client({
    scheme: 'http',
    host: process.env.WEAVIATE_HOST || 'localhost:8080',
    apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY || 'your-weaviate-api-key'),
});

export async function searchTechnicalDocs(query) {
  const res = await client.graphql
    .get()
    .withClassName('SupportDocs') 
    .withFields('content')
    .withNearText({ concepts: [query] }) 
    .do();


  return res.data.Get.SupportDocs.map(item => item.content).join('\n');
}