import {ChatOpenAi} from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import {billingTool,technicalTool} from "./tools.js";
import { SystemMessage } from "@langchain/core/messages";

//intializing the llm/agent 
const llm = new ChatOpenAi({
    modelName: "gpt-4o",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

//remembering user's previous request 
const checkpointer = new MemorySaver();

//prompt
const SystemMessage=`
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
    messagesModifier: systemMessage, 
});