import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

function getGeminiClient(apiKey?: string): GoogleGenAI {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is required. Please provide it via the API key input or environment variable.');
  }
  
  // Create new client for each request with provided key to avoid caching issues
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
        'Connection': 'close',
      },
      timeout: 90000,
    }
  });
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Chat Triage Assistant (Sinhala, Tamil, English supported)
app.post('/api/gemini/chat', async (req: express.Request, res: express.Response) => {
  try {
    const { message, history, language = 'en', medicalConditions = '', apiKey } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message payload is required.' });
      return;
    }

    const ai = getGeminiClient(apiKey);

    // Map language code to human-readable names for the system prompt
    const langNames = {
      en: 'English',
      si: 'Sinhala (සිංහල)',
      ta: 'Tamil (தமிழ்)',
    };
    const targetLanguage = langNames[language as keyof typeof langNames] || 'English';

    const systemInstruction = `
      You are the LifeLine AI Advanced Emergency Response Triage Specialist.
      
      CRITICAL ROLE & RULES:
      1. Your primary goal is to guide the caller calmly through active medical, safety, or mental health emergencies.
      2. Provide immediate, simple, step-by-step first aid or panic-calming instructions.
      3. Use clear, bulleted lists for sequential physical actions (e.g., 1. Do this, 2. Do that).
      4. Speak and reply strictly in ${targetLanguage}. Do not write English translations if the language is Sinhala or Tamil. Keep your tone urgent, authoritative, but deeply comforting and clear.
      5. Assess the emergency and always end your first message by declaring a suggested Triage Level (e.g. "Suggested Triage Level: [CRITICAL/HIGH/MEDIUM/LOW]" with a brief justification).
      6. User Medical Background provided: "${medicalConditions}". Incorporate this (e.g., drug allergies, heart conditions) if highly relevant to their symptoms.
      7. Emphasize calling official local emergency response numbers immediately (e.g., dial 1990 for Suwa Seriya in Sri Lanka, 119 for police, 110 for fire).
      8. Do not make diagnostic or pharmaceutical promises. Focus strictly on stabilizing the patient until responders arrive.
    `;

    // Map the user history format to Gemini SDK standard structure
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user') {
          formattedContents.push({ role: 'user', parts: [{ text: msg.content }] });
        } else if (msg.role === 'model') {
          formattedContents.push({ role: 'model', parts: [{ text: msg.content }] });
        }
      }
    }

    // Append the active prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.3, // Lower temperature for factual, reliable first-aid instructions
      },
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error('Gemini Chat Triage Error:', error);
    res.status(500).json({
      error: 'Failed to generate emergency guidance response.',
      details: error.message || String(error)
    });
  }
});

// Image-Based Emergency Detection (Sinhala, Tamil, English supported)
app.post('/api/gemini/analyze-image', async (req: express.Request, res: express.Response) => {
  try {
    const { image, mimeType, language = 'en', apiKey } = req.body;

    if (!image || !mimeType) {
      res.status(400).json({ error: 'Image (base64 string) and mimeType are required.' });
      return;
    }

    const ai = getGeminiClient(apiKey);

    const langNames = {
      en: 'English',
      si: 'Sinhala (සිංහල)',
      ta: 'Tamil (தமிழ்)',
    };
    const targetLanguage = langNames[language as keyof typeof langNames] || 'English';

    const promptText = `
      You are the LifeLine AI Visual Computer Vision Emergency Triage System.
      
      Look closely at this uploaded emergency photo (e.g., burns, injuries, swelling, allergic rashes, pill labels, environmental hazards, poison details).
      Provide a highly precise analysis strictly in ${targetLanguage}.
      
      You must respond in a valid JSON format matching this schema:
      {
        "hazardDetected": "A 1-sentence plain summary of what is seen in the image",
        "triageLevel": "one of 'low' | 'medium' | 'high' | 'critical'",
        "severityJustification": "1-2 sentence explanation of why this triage level was selected",
        "firstAidSteps": [
          "Step 1 - immediate first aid action",
          "Step 2 - follow-up action",
          "Step 3 - what to monitor"
        ],
        "warnings": [
          "Crucial warning - what NOT to do",
          "Another warning if applicable"
        ]
      }
    `;

    const imagePart = {
      inlineData: {
        mimeType,
        data: image,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hazardDetected: { type: Type.STRING },
            triageLevel: { 
              type: Type.STRING, 
              enum: ['low', 'medium', 'high', 'critical'] 
            },
            severityJustification: { type: Type.STRING },
            firstAidSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['hazardDetected', 'triageLevel', 'severityJustification', 'firstAidSteps', 'warnings']
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || '{}');
    res.json(result);
  } catch (error: any) {
    console.error('Gemini Image Emergency Detector Error:', error);
    res.status(500).json({
      error: 'Failed to analyze emergency image.',
      details: error.message || String(error)
    });
  }
});

// ---------------------- DEV / PROD SERVER BOOTSTAP ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LifeLine AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
