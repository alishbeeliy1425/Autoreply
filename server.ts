import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory Database for local state
  const db = {
    settings: {
      businessName: 'AutoReply AI Store',
      industry: 'Retail & E-commerce',
      systemPrompt: 'You are an intelligent, friendly AI assistant on WhatsApp, acting like ChatGPT. You are happy to answer any questions, chat for fun, and tally your response seamlessly with whatever the customer says. You are not limited to just products — you can hold casual conversations too.\n\nCRITICAL RULE: If a customer asks a question that requires human support or that you are unsure about, politely direct them to our human agent at: 091 3567 077.',
      whatsappNumber: '',
      autoReplyEnabled: true
    },
    users: [],
    keywords: [
      { id: 1, keyword: 'Price', reply: 'Our pricing is flexible depending on what you need. Can you give me more details?', enabled: true },
      { id: 2, keyword: 'Location', reply: 'We are primarily an online service! We can reach you anywhere.', enabled: true }
    ],
    customers: [
       { id: 101, name: 'Alice Smith', phone: '+1234567890', tags: ['VIP', 'Friendly'], lastMessage: 'Hi! Can you tell me a joke?' },
       { id: 102, name: 'Bob Jones', phone: '+0987654321', tags: ['New'], lastMessage: 'How much for delivery?' }
    ],
    chats: [
       { id: 1, customerId: 101, sender: 'customer', text: 'Hi! Can you tell me a joke?', timestamp: new Date().toISOString() },
       { id: 2, customerId: 101, sender: 'bot', text: 'Sure! Why did the scarecrow win an award? Because he was outstanding in his field! 😂 How can I help you today?', timestamp: new Date().toISOString() },
       { id: 3, customerId: 102, sender: 'customer', text: 'How much for delivery?', timestamp: new Date().toISOString() }
    ],
    broadcasts: [],
  };

  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // API Routes
  app.get("/api/settings", (req, res) => res.json(db.settings));
  
  app.post("/api/settings", (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    res.json(db.settings);
  });

  app.get("/api/stats", (req, res) => {
    res.json({
        totalMessages: db.chats.length,
        activeCustomers: db.customers.length,
        aiResponses: db.chats.filter(c => c.sender === 'bot').length,
        broadcastsSent: db.broadcasts.length
    });
  });

  app.get("/api/keywords", (req, res) => res.json(db.keywords));
  
  app.post("/api/keywords", (req, res) => {
    const newKeyword = { id: Date.now(), ...req.body, enabled: true };
    db.keywords.push(newKeyword);
    res.json(newKeyword);
  });

  app.post("/api/keywords/:id/toggle", (req, res) => {
    const kw = db.keywords.find(k => k.id === parseInt(req.params.id));
    if (kw) {
        kw.enabled = !kw.enabled;
        res.json(kw);
    } else {
        res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/keywords/:id", (req, res) => {
    db.keywords = db.keywords.filter(k => k.id !== parseInt(req.params.id));
    res.json({ success: true });
  });

  app.put("/api/keywords/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.keywords.findIndex(k => k.id === id);
    if (index !== -1) {
      db.keywords[index] = { ...db.keywords[index], ...req.body };
      res.json(db.keywords[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.get("/api/customers", (req, res) => res.json(db.customers));
  
  app.get("/api/chats/:customerId", (req, res) => {
    const chats = db.chats.filter(c => c.customerId === parseInt(req.params.customerId));
    res.json(chats);
  });

  app.delete("/api/chats/:customerId", (req, res) => {
    const customerId = parseInt(req.params.customerId);
    db.chats = db.chats.filter(c => c.customerId !== customerId);
    
    // update customer's last message
    const customer = db.customers.find(c => c.id === customerId);
    if (customer) {
        customer.lastMessage = '';
    }

    res.json({ success: true });
  });

  app.delete("/api/chats/message/:msgId", (req, res) => {
    const msgId = parseInt(req.params.msgId);
    db.chats = db.chats.filter(c => c.id !== msgId);
    res.json({ success: true });
  });

  app.post("/api/chats/send", (req, res) => {
    const { customerId, text } = req.body;
    const msg = {
      id: Date.now(),
      customerId,
      sender: 'bot',
      text,
      timestamp: new Date().toISOString()
    };
    db.chats.push(msg);
    res.json(msg);
  });

  app.post("/api/ai/suggest", async (req, res) => {
    const { message } = req.body;
    try {
        const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: `Suggest a concise, polite, and professional customer service reply to this message: "${message}"`,
         });
         res.json({ suggestion: response.text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate AI reply" });
    }
  });

  app.post("/api/ai/simulate-incoming", async (req, res) => {
      const { text, customerId } = req.body;
      const customerMsg = { id: Date.now(), customerId, sender: 'customer', text, timestamp: new Date().toISOString() };
      db.chats.push(customerMsg);

      const customer = db.customers.find(c => c.id === customerId);
      if (customer) customer.lastMessage = text;

      if (!db.settings.autoReplyEnabled) {
          return res.json({ customerMsg });
      }

      // Check keywords
      const matchedKeyword = db.keywords.find(k => k.enabled && text.toLowerCase().includes(k.keyword.toLowerCase()));
      if (matchedKeyword) {
          const replyMsg = { id: Date.now()+1, customerId, sender: 'bot', text: matchedKeyword.reply, timestamp: new Date().toISOString() };
          db.chats.push(replyMsg);
          return res.json({ customerMsg, replyMsg });
      }

      // Generate AI auto-reply
      try {
          const prompt = `${db.settings.systemPrompt}\n\nCustomer says: "${text}"\n\nProvide the reply:`;
          const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
         });
         const replyMsg = { id: Date.now()+1, customerId, sender: 'bot', text: response.text, timestamp: new Date().toISOString() };
         db.chats.push(replyMsg);
         return res.json({ customerMsg, replyMsg });
      } catch (err) {
         console.error("AI Auto-reply error:", err);
         const replyMsg = { id: Date.now()+1, customerId, sender: 'bot', text: "(Error generating response: " + (err.message || 'Unknown Error') + ")", timestamp: new Date().toISOString() };
         db.chats.push(replyMsg);
         return res.json({ customerMsg, replyMsg });
      }
  });

  app.post("/api/auth/login", (req, res) => {
     res.json({ token: "fake-jwt-token", user: { name: "Admin", email: req.body.email } });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // NOTE: In Express version 4, you MUST use `app.get('*',)`
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
