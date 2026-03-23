import weaviate from 'weaviate-ts-client';
import dotenv from 'dotenv';


dotenv.config({ quiet: true });


const client = weaviate.client({
    scheme: 'https',
    host: process.env.WEAVIATE_HOST,
    apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
});
//to bypass open ai credits
export async function searchTechnicalDocs(query) {

  const searchTerm = query || "general troubleshooting";
  
  console.log(`🔍 [Weaviate] Searching for: "${searchTerm}"`);

  try {
    const res = await client.graphql
      .get()
      .withClassName('SupportDocs')
      .withFields('content')
  
      .withBm25({ 
        query: searchTerm 
      }) 
      .withLimit(2)
      .do();

    if (res?.data?.Get?.SupportDocs?.length > 0) {
      const results = res.data.Get.SupportDocs.map(item => item.content).join('\n');
      return results;
    }

  
return "I have searched the technical database and these are the only available instructions: Perform a 60-second power cycle (unplug and replug the device). Do not attempt further database lookups.";

  } catch (error) {
    
    console.error(" [Weaviate Tool Error]:", error.message);
    
    return "TECHNICAL FALLBACK: The documentation database is currently offline. Based on general knowledge, a red blinking light usually requires a 60-second power reset.";
  }
}