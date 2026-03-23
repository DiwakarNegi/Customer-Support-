##AI Customer Support Agent (LangGraph)
A multi-agent support system that routes queries between a relational database (MySQL) and a vector database (Weaviate) using an agentic workflow.

 ###Graph Structure
The application is built on a directed acyclic graph (DAG) using LangGraph to manage state and control flow.

Entry Point: The user input enters the agent node.

Conditional Routing: The agent evaluates the message and decides whether to:

Call the fetchBillingInfo tool (MySQL).

Call the searchTechnicalDocs tool (Weaviate).

Respond directly to the user (End).

Action Loop: If a tool is called, the graph moves to the action node, executes the tool, returns the result to the agent node, and re-evaluates until a final response is generated.

Edge Logic: Uses a should_continue function to determine if the process should loop back for more information or terminate.

 ###Node Responsibilities
agent (The LLM): Powered by llama3-70b via Groq. Responsible for intent classification, entity extraction (e.g., Customer IDs), and synthesizing final answers from tool outputs.

tools (Action Node): A centralized node that executes the requested function based on the LLM's decision.

Billing Tool: Queries a MySQL database to retrieve structured payment status, balance, and due dates.

Technical Tool: Queries a Weaviate instance to retrieve unstructured troubleshooting steps and documentation.

State Management: A persistent state object that tracks the messages array, ensuring the LLM has access to the full conversation history for follow-up questions.

 ###Design Decisions
1. Hybrid Search Architecture (RAG)
To handle technical documentation without requiring high-cost embedding API credits, the system uses BM25 (Best Matching 25) keyword-based retrieval in Weaviate. This decision ensures high accuracy for technical terms (e.g., "404", "router") while maintaining zero-cost operation on the vector database layer.

2. State Persistence & Checkpointing
Implemented SqliteSaver (or MemorySaver) to handle session persistence. This allows the graph to maintain state across different thread_id sessions, preventing the agent from "forgetting" the customer ID or previous troubleshooting steps in mid-conversation.

3. Tool-Output Normalization
All tool nodes are wrapped in a try/catch block that returns a stringified fallback message rather than throwing a system error. This design prevents GraphRecursionErrors (infinite loops) by ensuring the LLM always receives a parseable string it can use to formulate a final response.

4. Intent Separation
Database logic is strictly separated:

MySQL handles "Hard Data" (numbers, statuses, IDs).

Weaviate handles "Soft Data" (explanations, guides, fixes).
This separation reduces "hallucination" by forcing the model to look in the correct source based on the query type.

###Setup
1.npm install
2.node weaviate_seed.js
3.npm start
node weaviate_seed.js

npm start
