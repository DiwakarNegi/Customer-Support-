import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getBillingFromDB } from "../db/mysql.js"; // We will make this next
import { searchTechnicalDocs } from "../db/weaviate.js"; // We will make this next

export const billingTool = tool(
  async ({ customerId }) => {
    const data = await getBillingFromDB(customerId);
    
    // using demo data for sql
    if (!data) {
      if (customerId === "DIWAKAR-001") {
        return "Billing Info: Status is ACTIVE, Balance is $0.00. No outstanding invoices.";
      }
      return "Customer ID not found in records.";
    }
    return JSON.stringify(data);
  },
  {
    name: "fetchBillingInfo",
    description: "Queries the MySQL database for billing.",
    schema: z.object({ customerId: z.string() }),
  }
);

export const technicalTool = tool(
  async ({ query }) => {
    const results = await searchTechnicalDocs(query);
    
    // demo data for weaviate search results
    if (!results || results.includes("unavailable")) {
      if (query.toLowerCase().includes("red light")) {
        return "Troubleshooting: A red light indicates a power surge. Please unplug for 30 seconds.";
      }
      return "Standard Troubleshooting: Restart your device and check all cable connections.";
    }
    return results;
  },
  {
    name: "searchTechnicalDocs",
    description: "Searches technical manuals.",
    schema: z.object({ query: z.string() }),
  }
);