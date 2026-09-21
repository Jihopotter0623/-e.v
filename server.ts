import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

function getGenAI(customKey?: string) {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function cleanGeminiErrorMessage(err: any): string {
  if (!err) return '알 수 없는 오류가 발생했습니다.';
  let msg = typeof err === 'string' ? err : err.message || '';
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error && parsed.error.message) {
      msg = parsed.error.message;
    }
  } catch {}
  if (msg.includes('experiencing high demand') || msg.includes('503') || msg.includes('overloaded') || msg.includes('UNAVAILABLE')) {
    return '현재 AI 모델 서버 사용량이 일시적으로 급증했습니다. 잠시 후 다시 시도해주세요.';
  }
  if (msg.includes('Resource has been exhausted') || msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
    return '요청 허용 한도에 도달했습니다. 잠시 후 다시 시도해주세요.';
  }
  return msg || '서버 통신 오류가 발생했습니다.';
}

function isOverloadedOrRateLimited(err: any): boolean {
  const str = (err?.message || '') + (typeof err === 'string' ? err : '') + JSON.stringify(err || {});
  return (
    str.includes('503') ||
    str.includes('experiencing high demand') ||
    str.includes('UNAVAILABLE') ||
    str.includes('overloaded') ||
    str.includes('429') ||
    str.includes('Resource has been exhausted') ||
    str.includes('RESOURCE_EXHAUSTED')
  );
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.post('/api/chat', async (req, res) => {
  const { messages, model = 'gemini-3.8-flash', stream = true, apiKey: clientApiKey } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  let ai: GoogleGenAI;
  try {
    ai = getGenAI(clientApiKey);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

  const sysMsg = messages.find((m: any) => m.role === 'system');
  const conversation = messages.filter((m: any) => m.role !== 'system');

  const contents = conversation.map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content || '') }],
  }));

  const config: any = {};
  if (sysMsg && sysMsg.content) {
    config.systemInstruction = {
      parts: [{ text: String(sysMsg.content) }],
    };
  }

  // Model fallback pipeline to gracefully recover from 503 high-demand spikes
  const candidateModels = [
    model,
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-3.8-flash',
  ].filter((m, i, arr) => m && arr.indexOf(m) === i);

  let lastError: any = null;

  for (const candidateModel of candidateModels) {
    try {
      if (stream) {
        // Initiate the stream first before committing response headers
        const responseStream = await ai.models.generateContentStream({
          model: candidateModel,
          contents,
          config,
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of responseStream) {
          const text = chunk.text || '';
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }

        res.write('data: [DONE]\n\n');
        res.end();
        return;
      } else {
        const response = await ai.models.generateContent({
          model: candidateModel,
          contents,
          config,
        });
        res.json({ text: response.text || '' });
        return;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Model ${candidateModel} failed]:`, err?.message || err);

      // If headers were already written (failure happened mid-stream), abort cleanly
      if (res.headersSent) {
        const cleanMsg = cleanGeminiErrorMessage(err);
        res.write(`data: ${JSON.stringify({ error: cleanMsg })}\n\n`);
        res.end();
        return;
      }

      // If error is high demand / 503 / 429, try the next candidate model
      if (isOverloadedOrRateLimited(err) || !clientApiKey) {
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }
      break;
    }
  }

  const friendlyMessage = cleanGeminiErrorMessage(lastError);
  console.error('All Gemini model candidates exhausted:', lastError);
  if (!res.headersSent) {
    res.status(503).json({ error: friendlyMessage });
  } else {
    res.write(`data: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
    res.end();
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
