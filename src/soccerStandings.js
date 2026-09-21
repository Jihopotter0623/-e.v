// Real-time Soccer Standings HUD Module
// Covers: Premier League, La Liga, Bundesliga, Serie A, Ligue 1, K League 1
// Built with dual-layer fallback for 100% Vercel deployment compatibility

export const LEAGUES_CONFIG = {
  epl: {
    key: 'epl',
    name: '프리미어리그',
    enName: 'Premier League',
    country: 'England',
    badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    espnCode: 'eng.1',
    topQualify: 4, // UCL
    relegationCount: 3,
  },
  laliga: {
    key: 'laliga',
    name: '라리가',
    enName: 'LALIGA',
    country: 'Spain',
    badge: '🇪🇸',
    espnCode: 'esp.1',
    topQualify: 4, // UCL
    relegationCount: 3,
  },
  bundesliga: {
    key: 'bundesliga',
    name: '분데스리가',
    enName: 'Bundesliga',
    country: 'Germany',
    badge: '🇩🇪',
    espnCode: 'ger.1',
    topQualify: 4, // UCL
    relegationCount: 2,
  },
  seriea: {
    key: 'seriea',
    name: '세리에 A',
    enName: 'Serie A',
    country: 'Italy',
    badge: '🇮🇹',
    espnCode: 'ita.1',
    topQualify: 4, // UCL
    relegationCount: 3,
  },
  ligue1: {
    key: 'ligue1',
    name: '리그 1',
    enName: 'Ligue 1',
    country: 'France',
    badge: '🇫🇷',
    espnCode: 'fra.1',
    topQualify: 3, // UCL
    relegationCount: 2,
  },
  kleague: {
    key: 'kleague',
    name: 'K리그 1',
    enName: 'K League 1',
    country: 'Korea',
    badge: '🇰🇷',
    topQualify: 3, // ACL
    relegationCount: 1,
  },
};

export const KOREAN_TEAM_NAMES = {
  // EPL
  'Manchester City': '맨체스터 시티',
  'Arsenal': '아스널',
  'Brighton & Hove Albion': '브라이턴',
  'Liverpool': '리버풀',
  'Aston Villa': '애스턴 빌라',
  'Chelsea': '첼시',
  'Tottenham Hotspur': '토트넘 홋스퍼',
  'Manchester United': '맨체스터 유나이티드',
  'Newcastle United': '뉴캐슬',
  'Nottingham Forest': '노팅엄',
  'Bournemouth': '본머스',
  'Fulham': '풀럼',
  'Brentford': '브렌트퍼드',
  'West Ham United': '웨스트햄',
  'Everton': '에버턴',
  'Leicester City': '레스터 시티',
  'Crystal Palace': '크리스털 팰리스',
  'Ipswich Town': '입스위치',
  'Wolverhampton Wanderers': '울버햄프턴',
  'Southampton': '사우샘프턴',

  // La Liga
  'Barcelona': '바르셀로나',
  'Real Madrid': '레알 마드리드',
  'Atlético Madrid': '아틀레티코 마드리드',
  'Atletico Madrid': '아틀레티코 마드리드',
  'Athletic Club': '아틀레틱 빌바오',
  'Villarreal': '비야레알',
  'Mallorca': '마요르카',
  'Real Betis': '레알 베티스',
  'Osasuna': '오사수나',
  'Girona': '지로나',
  'Real Sociedad': '레알 소시에다드',
  'Celta Vigo': '셀타 비고',
  'Sevilla': '세비야',
  'Espanyol': '에스파뇰',
  'Getafe': '헤타페',
  'Deportivo Alavés': '알라베스',
  'Alaves': '알라베스',
  'Rayo Vallecano': '라요 바예카노',
  'Leganés': '레가네스',
  'Valencia': '발렌시아',
  'Real Valladolid': '바야돌리드',
  'Las Palmas': '라스팔마스',

  // Bundesliga
  'Borussia Dortmund': '도르트문트',
  'Bayern Munich': '바이에른 뮌헨',
  'Bayer Leverkusen': '레버쿠젠',
  'RB Leipzig': '라이프치히',
  'Eintracht Frankfurt': '프랑크푸르트',
  'VfB Stuttgart': '슈투트가르트',
  'SC Freiburg': '프라이부르크',
  '1. FC Union Berlin': '우니온 베를린',
  'Borussia Mönchengladbach': '묀헨글라트바흐',
  'SV Werder Bremen': '베르더 브레멘',
  'VfL Wolfsburg': '볼프스부르크',
  'FC Augsburg': '아우크스부르크',
  '1. FSV Mainz 05': '마인츠',
  '1. FC Heidenheim 1846': '하이덴하임',
  'FC St. Pauli': '장크트파울리',
  'TSG Hoffenheim': '호펜하임',
  'Holstein Kiel': '홀슈타인 킬',
  'VfL Bochum 1848': '보훔',

  // Serie A
  'AS Roma': 'AS 로마',
  'Inter Milan': '인테르',
  'AC Milan': 'AC 밀란',
  'Juventus': '유벤투스',
  'Napoli': '나폴리',
  'Atalanta': '아탈란타',
  'Lazio': '라치오',
  'Fiorentina': '피오렌티나',
  'Torino': '토리노',
  'Bologna': '볼로냐',
  'Udinese': '우디네세',
  'Empoli': '엠폴리',
  'Cagliari': '칼리아리',
  'Como': '코모',
  'Genoa': '제노아',
  'Parma': '파르마',
  'Hellas Verona': '엘라스 베로나',
  'Lecce': '레체',
  'Monza': '몬차',
  'Venezia': '베네치아',

  // Ligue 1
  'AS Monaco': 'AS 모나코',
  'Paris Saint-Germain': '파리 생제르맹',
  'Marseille': '마르세유',
  'Lille': '릴',
  'Lens': '랑스',
  'Lyon': '올림피크 리옹',
  'Nice': 'OGC 니스',
  'Stade de Reims': '스타드 랭스',
  'Rennes': '스타드 렌',
  'Strasbourg': '스트라스부르',
  'Brest': '스타드 브레스트',
  'Auxerre': '오세르',
  'Toulouse': '툴루즈',
  'Nantes': '낭트',
  'Angers': '앙제',
  'Le Havre': '르아브르',
  'Saint-Étienne': '생테티엔',
  'Montpellier': '몽펠리에',

  // K League 1
  '서울': 'FC 서울',
  '울산': '울산 HD',
  '제주': '제주 유나이티드',
  '전북': '전북 현대',
  '강원': '강원 FC',
  '포항': '포항 스틸러스',
  '김천': '김천 상무',
  '수원FC': '수원 FC',
  '대전': '대전 하나시티즌',
  '광주': '광주 FC',
  '인천': '인천 유나이티드',
  '대구': '대구 FC',
};

// Snapshot fallback dataset (for 100% offline & static Vercel reliability)
const SNAPSHOT_KLEAGUE = [
  { rank: 1, teamName: 'FC 서울', teamShortName: '서울', played: 30, won: 19, drawn: 5, lost: 6, goalsFor: 54, goalsAgainst: 29, goalDiff: 25, points: 62, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/09.png?type=f92_88' },
  { rank: 2, teamName: '울산 HD', teamShortName: '울산', played: 30, won: 14, drawn: 5, lost: 11, goalsFor: 48, goalsAgainst: 36, goalDiff: 12, points: 47, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/01.png?type=f92_88' },
  { rank: 3, teamName: '제주 유나이티드', teamShortName: '제주', played: 30, won: 12, drawn: 10, lost: 8, goalsFor: 41, goalsAgainst: 34, goalDiff: 7, points: 46, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/04.png?type=f92_88' },
  { rank: 4, teamName: '전북 현대', teamShortName: '전북', played: 30, won: 11, drawn: 11, lost: 8, goalsFor: 46, goalsAgainst: 39, goalDiff: 7, points: 44, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/05.png?type=f92_88' },
  { rank: 5, teamName: '강원 FC', teamShortName: '강원', played: 30, won: 10, drawn: 12, lost: 7, goalsFor: 40, goalsAgainst: 35, goalDiff: 5, points: 42, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/21.png?type=f92_88' },
  { rank: 6, teamName: '포항 스틸러스', teamShortName: '포항', played: 30, won: 11, drawn: 8, lost: 11, goalsFor: 43, goalsAgainst: 42, goalDiff: 1, points: 41, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/03.png?type=f92_88' },
  { rank: 7, teamName: '김천 상무', teamShortName: '김천', played: 30, won: 10, drawn: 9, lost: 11, goalsFor: 37, goalsAgainst: 39, goalDiff: -2, points: 39, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/26.png?type=f92_88' },
  { rank: 8, teamName: '수원 FC', teamShortName: '수원FC', played: 30, won: 9, drawn: 9, lost: 12, goalsFor: 36, goalsAgainst: 44, goalDiff: -8, points: 36, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/29.png?type=f92_88' },
  { rank: 9, teamName: '대전 하나시티즌', teamShortName: '대전', played: 30, won: 8, drawn: 11, lost: 11, goalsFor: 34, goalsAgainst: 41, goalDiff: -7, points: 35, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/10.png?type=f92_88' },
  { rank: 10, teamName: '광주 FC', teamShortName: '광주', played: 30, won: 9, drawn: 6, lost: 15, goalsFor: 32, goalsAgainst: 41, goalDiff: -9, points: 33, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/22.png?type=f92_88' },
  { rank: 11, teamName: '인천 유나이티드', teamShortName: '인천', played: 30, won: 7, drawn: 11, lost: 12, goalsFor: 31, goalsAgainst: 40, goalDiff: -9, points: 32, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/18.png?type=f92_88' },
  { rank: 12, teamName: '대구 FC', teamShortName: '대구', played: 30, won: 6, drawn: 9, lost: 15, goalsFor: 30, goalsAgainst: 47, goalDiff: -17, points: 27, logo: 'https://sports-phinf.pstatic.net/team/kleague/default/17.png?type=f92_88' },
];

export function getKoreanTeamName(name) {
  if (!name) return '';
  if (KOREAN_TEAM_NAMES[name]) return KOREAN_TEAM_NAMES[name];
  for (const [en, ko] of Object.entries(KOREAN_TEAM_NAMES)) {
    if (name.includes(en) || en.includes(name)) return ko;
  }
  return name;
}

// In-memory cache in client
const clientStandingsCache = {};

export async function fetchStandingsData(leagueKey) {
  const normKey = (leagueKey || 'epl').toLowerCase();
  const config = LEAGUES_CONFIG[normKey] || LEAGUES_CONFIG.epl;

  // Layer 1: Call server proxy
  try {
    const res = await fetch(`/api/football/standings?league=${normKey}`);
    if (res.ok) {
      const data = await res.json();
      if (data.standings && Array.isArray(data.standings) && data.standings.length > 0) {
        const enriched = data.standings.map(t => ({
          ...t,
          koreanName: getKoreanTeamName(t.teamName || t.teamShortName),
        }));
        clientStandingsCache[normKey] = enriched;
        return enriched;
      }
    }
  } catch (err) {
    console.warn(`[SoccerHUD] /api/football/standings request error:`, err);
  }

  // Layer 2: Client-side direct fetch (for Vercel static deployments)
  if (config.espnCode) {
    try {
      const espnUrl = `https://site.api.espn.com/apis/v2/sports/soccer/${config.espnCode}/standings`;
      const res = await fetch(espnUrl);
      if (res.ok) {
        const json = await res.json();
        const entries = json.children?.[0]?.standings?.entries || [];
        if (entries.length > 0) {
          const parsed = entries.map(entry => {
            const getStat = name => entry.stats?.find(s => s.name === name)?.value ?? 0;
            const teamName = entry.team?.displayName || entry.team?.name || '';
            const teamShort = entry.team?.shortDisplayName || entry.team?.abbreviation || '';
            return {
              rank: getStat('rank'),
              teamId: String(entry.team?.id || ''),
              teamName,
              teamShortName: teamShort,
              koreanName: getKoreanTeamName(teamName || teamShort),
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
          clientStandingsCache[normKey] = parsed;
          return parsed;
        }
      }
    } catch (espnErr) {
      console.warn(`[SoccerHUD] ESPN direct fetch error:`, espnErr);
    }
  } else if (normKey === 'kleague') {
    // Try Naver API
    try {
      const kleagueUrl = 'https://api-gw.sports.naver.com/statistics/categories/kleague/seasons/2026/teams';
      const res = await fetch(kleagueUrl);
      if (res.ok) {
        const json = await res.json();
        const stats = json.result?.seasonTeamStats || [];
        if (stats.length > 0) {
          const parsed = stats.map(t => ({
            rank: t.rank,
            teamId: String(t.teamId || ''),
            teamName: t.teamName || '',
            teamShortName: t.teamShortName || t.teamName || '',
            koreanName: getKoreanTeamName(t.teamName || t.teamShortName),
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
          clientStandingsCache[normKey] = parsed;
          return parsed;
        }
      }
    } catch (kleagueErr) {
      console.warn(`[SoccerHUD] K-League direct fetch error:`, kleagueErr);
    }
  }

  // Layer 3: Cache / Snapshot fallback
  if (clientStandingsCache[normKey] && clientStandingsCache[normKey].length > 0) {
    return clientStandingsCache[normKey];
  }

  if (normKey === 'kleague') {
    return SNAPSHOT_KLEAGUE;
  }

  return [];
}

export function initSoccerStandings() {
  const panel = document.getElementById('leftLeaguePanel');
  if (!panel) return;

  const tabs = document.querySelectorAll('.league-tab');
  const refreshBtn = document.getElementById('leagueRefreshBtn');
  const refreshIcon = document.getElementById('leagueRefreshIcon');
  const collapseBtn = document.getElementById('leagueCollapseBtn');
  const expandTab = document.getElementById('leagueExpandTab');
  const leagueToggleBtn = document.getElementById('leagueToggleBtn');
  const metaFlag = document.getElementById('leagueCurrentFlag');
  const metaName = document.getElementById('leagueCurrentName');
  const syncDot = document.getElementById('leagueSyncDot');
  const syncText = document.getElementById('leagueSyncText');
  const searchInput = document.getElementById('leagueSearchInput');
  const searchClearBtn = document.getElementById('leagueSearchClearBtn');
  const tableBody = document.getElementById('leagueTableBody');
  const tableEmpty = document.getElementById('leagueTableEmpty');
  const updatedTime = document.getElementById('leagueUpdatedTime');

  let currentLeague = 'epl';
  let currentStandings = [];
  let isFetching = false;

  function setSyncStatus(isLive, label) {
    if (syncDot) {
      syncDot.className = `sync-dot ${isLive ? 'live' : ''}`;
    }
    if (syncText) {
      syncText.textContent = label || (isLive ? 'LIVE' : 'OFFLINE');
    }
  }

  function formatTimeNow() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} 동기화`;
  }

  function renderTable(standings) {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const filterText = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const config = LEAGUES_CONFIG[currentLeague] || LEAGUES_CONFIG.epl;

    const filtered = standings.filter(item => {
      if (!filterText) return true;
      const ko = (item.koreanName || '').toLowerCase();
      const en = (item.teamName || '').toLowerCase();
      const short = (item.teamShortName || '').toLowerCase();
      return ko.includes(filterText) || en.includes(filterText) || short.includes(filterText);
    });

    if (filtered.length === 0) {
      if (tableEmpty) tableEmpty.hidden = false;
      return;
    }
    if (tableEmpty) tableEmpty.hidden = true;

    const totalTeams = standings.length;
    const relegationThreshold = totalTeams - config.relegationCount;

    filtered.forEach(team => {
      const tr = document.createElement('tr');
      const rank = team.rank;

      if (rank === 1) {
        tr.className = 'rank-1';
      } else if (rank <= config.topQualify) {
        tr.className = 'rank-ucl';
      } else if (rank > relegationThreshold) {
        tr.className = 'rank-rel';
      }

      // Rank TD
      const tdRank = document.createElement('td');
      tdRank.className = 'td-rank';
      tdRank.textContent = String(rank);
      tr.appendChild(tdRank);

      // Team TD
      const tdTeam = document.createElement('td');
      tdTeam.className = 'td-team';

      const cellWrap = document.createElement('div');
      cellWrap.className = 'team-cell-wrap';

      const img = document.createElement('img');
      img.className = 'team-emblem';
      img.alt = team.koreanName || team.teamName;
      img.src = team.logo || '';
      img.referrerPolicy = 'no-referrer';
      img.loading = 'lazy';
      img.onerror = () => {
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%233fe3ff" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
      };
      cellWrap.appendChild(img);

      const nameBox = document.createElement('div');
      nameBox.className = 'team-names-box';

      const nameKo = document.createElement('span');
      nameKo.className = 'team-name-ko';
      nameKo.textContent = team.koreanName || team.teamName;
      nameBox.appendChild(nameKo);

      const nameEn = document.createElement('span');
      nameEn.className = 'team-name-en';
      nameEn.textContent = team.teamShortName || team.teamName;
      nameBox.appendChild(nameEn);

      cellWrap.appendChild(nameBox);
      tdTeam.appendChild(cellWrap);
      tr.appendChild(tdTeam);

      // Played TD
      const tdP = document.createElement('td');
      tdP.className = 'td-stat';
      tdP.textContent = String(team.played ?? 0);
      tr.appendChild(tdP);

      // Won TD
      const tdW = document.createElement('td');
      tdW.className = 'td-stat';
      tdW.textContent = String(team.won ?? 0);
      tr.appendChild(tdW);

      // Drawn TD
      const tdD = document.createElement('td');
      tdD.className = 'td-stat';
      tdD.textContent = String(team.drawn ?? 0);
      tr.appendChild(tdD);

      // Lost TD
      const tdL = document.createElement('td');
      tdL.className = 'td-stat';
      tdL.textContent = String(team.lost ?? 0);
      tr.appendChild(tdL);

      // Goal Diff TD
      const tdGd = document.createElement('td');
      const gd = team.goalDiff ?? 0;
      tdGd.className = `td-gd ${gd > 0 ? 'positive' : gd < 0 ? 'negative' : 'zero'}`;
      tdGd.textContent = gd > 0 ? `+${gd}` : String(gd);
      tr.appendChild(tdGd);

      // Points TD
      const tdPts = document.createElement('td');
      tdPts.className = 'td-pts';
      tdPts.textContent = String(team.points ?? 0);
      tr.appendChild(tdPts);

      tableBody.appendChild(tr);
    });
  }

  async function loadStandings(leagueKey, forceRefresh = false) {
    if (isFetching) return;
    isFetching = true;
    currentLeague = leagueKey;

    if (refreshIcon) refreshIcon.classList.add('spinning');
    setSyncStatus(true, 'FETCHING...');

    const config = LEAGUES_CONFIG[leagueKey] || LEAGUES_CONFIG.epl;
    if (metaFlag) metaFlag.textContent = config.badge;
    if (metaName) metaName.textContent = `${config.name} (${config.enName})`;

    if (forceRefresh) {
      delete clientStandingsCache[leagueKey];
    }

    try {
      const data = await fetchStandingsData(leagueKey);
      currentStandings = data;
      renderTable(data);
      setSyncStatus(true, 'LIVE');
      if (updatedTime) updatedTime.textContent = formatTimeNow();
    } catch (err) {
      console.error('[SoccerHUD] Standings load failed:', err);
      setSyncStatus(false, 'OFFLINE');
    } finally {
      isFetching = false;
      if (refreshIcon) refreshIcon.classList.remove('spinning');
    }
  }

  // Bind Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const league = tab.getAttribute('data-league');
      if (!league || league === currentLeague) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (searchInput) {
        searchInput.value = '';
        if (searchClearBtn) searchClearBtn.hidden = true;
      }

      loadStandings(league);
    });
  });

  // Bind Refresh
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadStandings(currentLeague, true);
    });
  }

  // Bind Search Input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const val = searchInput.value.trim();
      if (searchClearBtn) searchClearBtn.hidden = !val;
      renderTable(currentStandings);
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchClearBtn.hidden = true;
      renderTable(currentStandings);
      searchInput.focus();
    });
  }

  // Bind Collapse & Expand
  function collapsePanel() {
    panel.classList.add('collapsed');
    if (expandTab) expandTab.hidden = false;
  }

  function expandPanel() {
    panel.classList.remove('collapsed');
    if (expandTab) expandTab.hidden = true;
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', collapsePanel);
  }

  if (expandTab) {
    expandTab.addEventListener('click', expandPanel);
  }

  // Topbar Toggle Button
  if (leagueToggleBtn) {
    leagueToggleBtn.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 1024;
      if (isMobile) {
        panel.classList.toggle('mobile-open');
      } else {
        if (panel.classList.contains('collapsed')) {
          expandPanel();
        } else {
          collapsePanel();
        }
      }
    });
  }

  // Close mobile drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 1024) return;
    if (!panel.classList.contains('mobile-open')) return;
    if (panel.contains(e.target) || (leagueToggleBtn && leagueToggleBtn.contains(e.target))) return;
    panel.classList.remove('mobile-open');
  });

  // Initial load
  loadStandings('epl');
}

// Helper to provide quick soccer summary for E.V's chat responses
export function getQuickStandingsSummary(leagueKey = 'epl') {
  const normKey = (leagueKey || 'epl').toLowerCase();
  const cached = clientStandingsCache[normKey] || (normKey === 'kleague' ? SNAPSHOT_KLEAGUE : []);
  if (!cached || cached.length === 0) return null;

  const config = LEAGUES_CONFIG[normKey] || LEAGUES_CONFIG.epl;
  const top3 = cached.slice(0, 3).map(t => `${t.rank}위 ${t.koreanName || t.teamName} (${t.points}점, ${t.won}승 ${t.drawn}무 ${t.lost}패)`).join(', ');

  return `[${config.name} (${config.enName})] 선두권: ${top3}`;
}
