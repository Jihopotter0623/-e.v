import type { IncomingMessage, ServerResponse } from 'http';

const ESPN_LEAGUES: Record<string, string> = {
  epl: 'eng.1',
  premierleague: 'eng.1',
  laliga: 'esp.1',
  bundesliga: 'ger.1',
  seriea: 'ita.1',
  ligue1: 'fra.1',
};

async function fetchLeague(leagueKey: string) {
  const normKey = (leagueKey || 'epl').toLowerCase();

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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const league = (req.query?.league as string) || 'epl';
  try {
    const standings = await fetchLeague(league);
    return res.status(200).json({
      league,
      standings,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Failed to fetch league standings',
      league,
    });
  }
}
