import { GoogleGenAI } from '@google/genai';

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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { messages, model = 'gemini-3.8-flash', stream = true, apiKey: clientApiKey } = req.body || {};

  const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const sysMsg = (messages || []).find((m: any) => m.role === 'system');
  const conversation = (messages || []).filter((m: any) => m.role !== 'system');

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
        return res.status(200).json({ text: response.text || '' });
      }
    } catch (err: any) {
      lastError = err;
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: cleanGeminiErrorMessage(err) })}\n\n`);
        res.end();
        return;
      }
      continue;
    }
  }

  const friendlyMessage = cleanGeminiErrorMessage(lastError);
  if (!res.headersSent) {
    res.status(503).json({ error: friendlyMessage });
  } else {
    res.write(`data: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
    res.end();
  }
}
