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

interface FootballCache {
  data: any[];
  timestamp: number;
}
const footballCache: Record<string, FootballCache> = {};
const CACHE_TTL_MS = 60 * 1000;

const ESPN_LEAGUES: Record<string, string> = {
  epl: 'eng.1',
  premierleague: 'eng.1',
  laliga: 'esp.1',
  bundesliga: 'ger.1',
  seriea: 'ita.1',
  ligue1: 'fra.1',
};

async function fetchLeagueFromSource(leagueKey: string) {
  const normKey = leagueKey.toLowerCase();

  if (normKey === 'kleague' || normKey === 'k-league') {
    const url = 'https://api-gw.sports.naver.com/statistics/categories/kleague/seasons/2026/teams';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });
    if (!response.ok) {
      throw new Error(`K-League source returned HTTP ${response.status}`);
    }
    const json = await response.json();
    const stats = json.result?.seasonTeamStats || [];
    return stats.map((t: any) => ({
      rank: t.rank,
      teamId: String(t.teamId || ''),
      teamName: t.teamName || '',
      teamShortName: t.teamShortName || t.teamName || '',
      logo: t.teamEmblemUrl || `https://sports-phinf.pstatic.net/team/kleague/default/${t.teamId}.png?type=f92_88`,
      played: t.matchesPlayed ?? 0,
      won: t.wins ?? 0,
      drawn: t.draws ?? 0,
      lost: t.losses ?? 0,
      goalsFor: t.goals ?? 0,
      goalsAgainst: t.goalsConceded ?? 0,
      goalDiff: t.goalsDifference ?? 0,
      points: t.points ?? 0,
      form: t.lastFiveGames || '',
    }));
  }

  const espnCode = ESPN_LEAGUES[normKey] || 'eng.1';
  const url = `https://site.api.espn.com/apis/v2/sports/soccer/${espnCode}/standings`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ESPN returned HTTP ${response.status}`);
  }
  const json = await response.json();
  const entries = json.children?.[0]?.standings?.entries || [];
  return entries.map((entry: any) => {
    const getStat = (name: string) => entry.stats?.find((s: any) => s.name === name)?.value ?? 0;
    return {
      rank: getStat('rank'),
      teamId: String(entry.team?.id || ''),
      teamName: entry.team?.displayName || entry.team?.name || '',
      teamShortName: entry.team?.shortDisplayName || entry.team?.abbreviation || '',
      logo: entry.team?.logos?.[0]?.href || '',
      played: getStat('gamesPlayed'),
      won: getStat('wins'),
      drawn: getStat('ties'),
      lost: getStat('losses'),
      goalsFor: getStat('pointsFor'),
      goalsAgainst: getStat('pointsAgainst'),
      goalDiff: getStat('pointDifferential'),
      points: getStat('points'),
    };
  });
}

app.get('/api/football/standings', async (req, res) => {
  const league = (req.query.league as string) || 'epl';
  const normLeague = league.toLowerCase();

  const now = Date.now();
  if (footballCache[normLeague] && now - footballCache[normLeague].timestamp < CACHE_TTL_MS) {
    return res.json({
      league: normLeague,
      cached: true,
      standings: footballCache[normLeague].data,
    });
  }

  try {
    const standings = await fetchLeagueFromSource(normLeague);
    footballCache[normLeague] = { data: standings, timestamp: now };
    return res.json({
      league: normLeague,
      cached: false,
      standings,
    });
  } catch (err: any) {
    console.warn(`Failed to fetch fresh football standings for ${normLeague}:`, err.message);
    if (footballCache[normLeague]) {
      return res.json({
        league: normLeague,
        stale: true,
        standings: footballCache[normLeague].data,
      });
    }
    return res.status(500).json({
      error: err.message,
      league: normLeague,
    });
  }
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
