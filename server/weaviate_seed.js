import weaviate from 'weaviate-ts-client';
import dotenv from 'dotenv';

dotenv.config();


const client = weaviate.client({
    scheme: 'https',
    host: process.env.WEAVIATE_HOST,
    apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
});

async function seedData() {
  console.log(" Starting Weaviate Seed process...");

  try {
  
    try {
      await client.schema.classDeleter().withClassName('SupportDocs').do();
      console.log("  Old class 'SupportDocs' deleted successfully.");
    } catch (e) {
      console.log("ℹ  No existing class found, skipping deletion.");
    }

    // creating a class with no vectorizer to avoid the openai problem
    const classObj = {
      class: 'SupportDocs',
      description: "Technical Support Documentation for Customer Queries",
      vectorizer: 'none', 
      properties: [
        { 
          name: 'content', 
          dataType: ['text'],
          description: "The technical troubleshooting content"
        },
        { 
          name: 'category', 
          dataType: ['text'],
          description: "The category of the issue"
        }
      ],
    };

    await client.schema.classCreator().withClass(classObj).do();
    console.log(" New Class 'SupportDocs' created with 'vectorizer: none'.");

 
    const techData = [
      {
        content: "If your router shows a blinking red light, unplug it for 60 seconds and then restart. This usually clears a power-cycle error.",
        category: "Network"
      },
      {
        content: "Error 404 on the client portal usually means your session has expired. Please clear your browser cache and log in again.",
        category: "Technical"
      },
      {
        content: "To set up two-factor authentication, go to Settings > Security and scan the QR code with your authenticator app.",
        category: "Account Management"
      }
    ];

    
    for (const item of techData) {
      await client.data
        .creator()
        .withClassName('SupportDocs')
        .withProperties(item)
        .do();
    }

    console.log(" SUCCESS: Data successfully seeded into Weaviate!");
    console.log(" Note: Use '.withBm25()' in your search tool instead of '.withNearText()'.");

  } catch (error) {
    console.error(" Seeding failed with error:", error.message);
  }
}

seedData();