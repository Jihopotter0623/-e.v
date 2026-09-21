import snapshotsData from '../snapshots.json';

export interface StandingsEntry {
  rank: number;
  teamId: string;
  teamName: string;
  teamShortName?: string;
  koreanName?: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form?: string;
}

export interface LeagueMeta {
  key: string;
  name: string;
  enName: string;
  country: string;
  badge: string;
  espnCode?: string;
}

export const LEAGUES: LeagueMeta[] = [
  { key: 'epl', name: '프리미어리그', enName: 'Premier League', country: 'England', badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', espnCode: 'eng.1' },
  { key: 'laliga', name: '라리가', enName: 'LALIGA', country: 'Spain', badge: '🇪🇸', espnCode: 'esp.1' },
  { key: 'bundesliga', name: '분데스리가', enName: 'Bundesliga', country: 'Germany', badge: '🇩🇪', espnCode: 'ger.1' },
  { key: 'seriea', name: '세리에 A', enName: 'Serie A', country: 'Italy', badge: '🇮🇹', espnCode: 'ita.1' },
  { key: 'ligue1', name: '리그 1', enName: 'Ligue 1', country: 'France', badge: '🇫🇷', espnCode: 'fra.1' },
  { key: 'kleague', name: 'K리그 1', enName: 'K League 1', country: 'Korea', badge: '🇰🇷' }
];

export const TEAM_KOREAN_NAMES: Record<string, string> = {
  // EPL
  "Manchester City": "맨체스터 시티",
  "Arsenal": "아스널",
  "Brighton & Hove Albion": "브라이턴",
  "Liverpool": "리버풀",
  "Aston Villa": "애스턴 빌라",
  "Chelsea": "첼시",
  "Tottenham Hotspur": "토트넘 홋스퍼",
  "Manchester United": "맨체스터 유나이티드",
  "Newcastle United": "뉴캐슬",
  "Nottingham Forest": "노팅엄",
  "Bournemouth": "본머스",
  "Fulham": "풀럼",
  "Brentford": "브렌트퍼드",
  "West Ham United": "웨스트햄",
  "Everton": "에버턴",
  "Leicester City": "레스터 시티",
  "Crystal Palace": "크리스털 팰리스",
  "Ipswich Town": "입스위치",
  "Wolverhampton Wanderers": "울버햄프턴",
  "Southampton": "사우샘프턴",

  // La Liga
  "Barcelona": "바르셀로나",
  "Real Madrid": "레알 마드리드",
  "Atlético Madrid": "아틀레티코 마드리드",
  "Atletico Madrid": "아틀레티코 마드리드",
  "Athletic Club": "아틀레틱 빌바오",
  "Villarreal": "비야레알",
  "Mallorca": "마요르카",
  "Real Betis": "레알 베티스",
  "Osasuna": "오사수나",
  "Girona": "지로나",
  "Real Sociedad": "레알 소시에다드",
  "Celta Vigo": "셀타 비고",
  "Sevilla": "세비야",
  "Espanyol": "에스파뇰",
  "Getafe": "헤타페",
  "Deportivo Alavés": "알라베스",
  "Rayo Vallecano": "라요 바예카노",
  "Leganés": "레가네스",
  "Valencia": "발렌시아",
  "Real Valladolid": "바야돌리드",
  "Las Palmas": "라스팔마스",

  // Bundesliga
  "Borussia Dortmund": "도르트문트",
  "Bayern Munich": "바이에른 뮌헨",
  "Bayer Leverkusen": "레버쿠젠",
  "RB Leipzig": "라이프치히",
  "Eintracht Frankfurt": "프랑크푸르트",
  "VfB Stuttgart": "슈투트가르트",
  "SC Freiburg": "프라이부르크",
  "1. FC Union Berlin": "우니온 베를린",
  "Borussia Mönchengladbach": "묀헨글라트바흐",
  "SV Werder Bremen": "베르더 브레멘",
  "VfL Wolfsburg": "볼프스부르크",
  "FC Augsburg": "아우크스부르크",
  "1. FSV Mainz 05": "마인츠",
  "1. FC Heidenheim 1846": "하이덴하임",
  "FC St. Pauli": "장크트파울리",
  "TSG Hoffenheim": "호펜하임",
  "Holstein Kiel": "홀슈타인 킬",
  "VfL Bochum 1848": "보훔",

  // Serie A
  "AS Roma": "AS 로마",
  "Inter Milan": "인테르",
  "AC Milan": "AC 밀란",
  "Juventus": "유벤투스",
  "Napoli": "나폴리",
  "Atalanta": "아탈란타",
  "Lazio": "라치오",
  "Fiorentina": "피오렌티나",
  "Torino": "토리노",
  "Bologna": "볼로냐",
  "Udinese": "우디네세",
  "Empoli": "엠폴리",
  "Cagliari": "칼리아리",
  "Como": "코모",
  "Genoa": "제노아",
  "Parma": "파르마",
  "Hellas Verona": "엘라스 베로나",
  "Lecce": "레체",
  "Monza": "몬차",
  "Venezia": "베네치아",

  // Ligue 1
  "AS Monaco": "AS 모나코",
  "Paris Saint-Germain": "파리 생제르맹",
  "Marseille": "마르세유",
  "Lille": "릴",
  "Lens": "랑스",
  "Lyon": "올림피크 리옹",
  "Nice": "OGC 니스",
  "Stade de Reims": "스타드 랭스",
  "Rennes": "스타드 렌",
  "Strasbourg": "스트라스부르",
  "Brest": "스타드 브레스트",
  "Auxerre": "오세르",
  "Toulouse": "툴루즈",
  "Nantes": "낭트",
  "Angers": "앙제",
  "Le Havre": "르아브르",
  "Saint-Étienne": "생테티엔",
  "Montpellier": "몽펠리에",

  // K League
  "서울": "FC 서울",
  "울산": "울산 HD",
  "제주": "제주 유나이티드",
  "전북": "전북 현대",
  "강원": "강원 FC",
  "포항": "포항 스틸러스",
  "김천": "김천 상무",
  "수원FC": "수원 FC",
  "대전": "대전 하나시티즌",
  "광주": "광주 FC",
  "인천": "인천 유나이티드",
  "대구": "대구 FC"
};

export function getKoreanTeamName(name: string): string {
  if (!name) return '';
  if (TEAM_KOREAN_NAMES[name]) return TEAM_KOREAN_NAMES[name];
  for (const [en, ko] of Object.entries(TEAM_KOREAN_NAMES)) {
    if (name.includes(en) || en.includes(name)) return ko;
  }
  return name;
}

export function getSnapshotStandings(leagueKey: string): StandingsEntry[] {
  const data = (snapshotsData as Record<string, StandingsEntry[]>)[leagueKey] || [];
  return data.map(item => ({
    ...item,
    koreanName: getKoreanTeamName(item.teamName || item.teamShortName || '')
  }));
}
