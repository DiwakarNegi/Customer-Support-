import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {agent} from '.graph/agent.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/agent', async (req, res) => {
    try {  
        const {message,threadId} = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const response = await agent.invoke(
      { messages: [{ role: "user", content: message }] },
      { configurable: { thread_id: threadId || "default-user" } }
    );
const lastMessage = response.messages[response.messages.length - 1];

    res.json({ 
      reply: lastMessage.content 
    });
    
