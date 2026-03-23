import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import {billingTool,technicalTool} from "./tools.js";
import { SystemMessage } from "@langchain/core/messages";


const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", 
  temperature: 0,
});

//remembering user's previous request 
const checkpointer = new MemorySaver();

//promptfilling
const systemPrompt=`
You are a Multi-Step Customer Support Assistant.
- For Billing queries (invoices, payments, balances): Use 'fetchBillingInfo'.
- For Technical queries (troubleshooting, errors, manuals): Use 'searchTechnicalDocs'.
- For General queries (greetings): Respond directly using your internal knowledge.
Always be polite and structured in your final response.
`;
export const agent = createReactAgent({
    llm,
    tools: [billingTool, technicalTool],
    checkpointSaver: checkpointer,
    messagesModifier: systemPrompt, 
});