import { createSpiderLogoGeometry } from './spiderLogo.js';
import { initSoccerStandings, getQuickStandingsSummary } from './soccerStandings.js';

(function(){
  const $ = (id) => document.getElementById(id);
  const orbPane = $('orbPane');
  const signOutBtn = $('signOutBtn');
  const statusDot = $('statusDot');
  const statusText = $('statusText');
  const userTag = $('userTag');
  const chatLog = $('chatLog');
  const textInput = $('textInput');
  const sendBtn = $('sendBtn');
  const micBtn = $('micBtn');
  const ttsBtn = $('ttsBtn');
  const modeBtn = $('modeBtn2');
  const cornerFrame = $('cornerFrame');
  const dockHandle = $('dockHandle');
  const hudReadouts = $('hudReadouts');
  const hudUptime = $('hudUptime');
  const hudTemp = $('hudTemp');
  const hudMode = $('hudMode');
  const hudEngine = $('hudEngine');
  const settingsBtn = $('settingsBtn');
  const settingsPanel = $('settingsPanel');
  const providerStatus = $('providerStatus');
  const geminiKeyInput = $('geminiKeyInput');
  const geminiModelInput = $('geminiModelInput');
  const geminiConnectBtn = $('geminiConnectBtn');
  const geminiClearBtn = $('geminiClearBtn');
  const settingsMsg = $('settingsMsg');
  const nameInput = $('nameInput');
  const voiceSelect = $('voiceSelect');
  const voiceTestBtn = $('voiceTestBtn');
  const savePrefsBtn = $('savePrefsBtn');
  const prefsMsg = $('prefsMsg');
  const baseballBtn = $('baseballBtn');
  const valorantBtn = $('valorantBtn');
  const ligaBoard = $('ligaBoard');
  const holoClockTime = $('holoClockTime');
  const holoClockDate = $('holoClockDate');
  const soccerBtn = $('soccerBtn');
  const soccerOverlay = $('soccerOverlay');
  const soccerCloseBtn = $('soccerCloseBtn');
  const soccerSearch = $('soccerSearch');
  const soccerTabs = $('soccerTabs');
  const soccerList = $('soccerList');
  const timeBtn = $('timeBtn');
  const timeOverlay = $('timeOverlay');
  const timeCloseBtn = $('timeCloseBtn');
  const timeYearInput = $('timeYearInput');
  const timeInputError = $('timeInputError');
  const timeStartBtn = $('timeStartBtn');
  const timeTunnel = $('timeTunnel');
  const timeCore = $('timeCore');
  const timeLog = $('timeLog');
  const timeResult = $('timeResult');
  const baseballOverlay = $('baseballOverlay');
  const bbCloseBtn = $('bbCloseBtn');
  const bbSetup = $('bbSetup');
  const bbGame = $('bbGame');
  const bbAwayName = $('bbAwayName');
  const bbHomeName = $('bbHomeName');
  const bbInningsSelect = $('bbInnings');
  const bbStartBtn = $('bbStartBtn');
  const bbPitchBtn = $('bbPitchBtn');
  const bbResetBtn = $('bbResetBtn');
  const bbAwayLabel = $('bbAwayLabel');
  const bbHomeLabel = $('bbHomeLabel');
  const bbAwayScore = $('bbAwayScore');
  const bbHomeScore = $('bbHomeScore');
  const bbInningInfo = $('bbInningInfo');
  const bbBase1 = $('bbBase1');
  const bbBase2 = $('bbBase2');
  const bbBase3 = $('bbBase3');
  const bbLog = $('bbLog');

  let ttsOn = true;
  let sensing = false;
  let bootTime = null;
  let recognizing = false;
  let recognition = null;

  function loadPrefs(){
    try{ return JSON.parse(localStorage.getItem('ev_prefs') || '{}'); }catch(e){ return {}; }
  }
  const prefs = loadPrefs();
  let savedName = prefs.name || '';
  let savedVoiceURI = prefs.voiceURI || '';

  function savePrefs(){
    try{ localStorage.setItem('ev_prefs', JSON.stringify({ name: savedName, voiceURI: savedVoiceURI })); }
    catch(e){}
  }

  // Resizable bottom chat dock
  (function setupDockResize(){
    const MIN_H = 160;
    function clampHeight(h){
      return Math.min(Math.max(h, MIN_H), Math.round(window.innerHeight * 0.7));
    }
    function saveHeight(h){
      try{ localStorage.setItem('ev_dock_height', String(h)); }catch(e){}
    }
    try{
      const saved = parseInt(localStorage.getItem('ev_dock_height'), 10);
      if(saved > 0) cornerFrame.style.height = clampHeight(saved) + 'px';
    }catch(e){}

    let dragging = false, startY = 0, startHeight = 0;
    function dragStart(clientY){
      dragging = true;
      startY = clientY;
      startHeight = cornerFrame.getBoundingClientRect().height;
      dockHandle.classList.add('dragging');
      document.body.style.userSelect = 'none';
    }
    function dragMove(clientY){
      if(!dragging) return;
      const newHeight = clampHeight(Math.round(startHeight - (clientY - startY)));
      cornerFrame.style.height = newHeight + 'px';
    }
    function dragEnd(){
      if(!dragging) return;
      dragging = false;
      dockHandle.classList.remove('dragging');
      document.body.style.userSelect = '';
      saveHeight(Math.round(cornerFrame.getBoundingClientRect().height));
    }

    dockHandle.addEventListener('mousedown', (e)=>{ dragStart(e.clientY); e.preventDefault(); });
    window.addEventListener('mousemove', (e)=> dragMove(e.clientY));
    window.addEventListener('mouseup', dragEnd);

    dockHandle.addEventListener('touchstart', (e)=>{
      dragStart(e.touches[0].clientY);
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', (e)=>{
      if(!dragging) return;
      dragMove(e.touches[0].clientY);
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', dragEnd);

    window.addEventListener('resize', ()=>{
      const h = cornerFrame.getBoundingClientRect().height;
      cornerFrame.style.height = clampHeight(h) + 'px';
    });
  })();

  const state = { provider: 'gemini', geminiKey: '', geminiModel: 'gemini-3.8-flash' };
  const history = [];

  const SYSTEM_PROMPT = `You are E.V, a personal AI assistant with the spirit of a "brand new day" Spider-Man:
warm, upbeat, quick-witted, and fiercely loyal, in the tradition of J.A.R.V.I.S. (Iron Man) and E.D.I.T.H.
(Spider-Man). You look out for your user like a friendly neighborhood hero looks out for their city. Keep
replies concise and useful unless asked for depth, with a light, confident sense of humor when appropriate.
Refer to the user respectfully. Never claim to control real hardware, cameras, satellites, drones, or physical
devices — you are a conversational assistant only.

SPEECH & SUBTITLE PROTOCOL (CRITICAL REQUIREMENT):
1. E.V's voice speaks strictly in English (the voice engine reads your EN line aloud).
2. The HUD subtitles on screen MUST be in natural Korean so the user can read the Korean subtitles.
3. Therefore, for EVERY single response, you MUST output strictly in this two-line format:
EN: <your natural, quick-witted English spoken response>
KO: <natural Korean subtitle translation of the English response>

Output ONLY those two lines. No markdown quotes, no other labels or commentary.

SOCCER HUD PROTOCOL:
You have real-time access to the 6 major football leagues synchronized on the left HUD panel: Premier League (EPL), LALIGA, Bundesliga, Serie A, Ligue 1, and K League 1 (K리그). If the user asks about rankings, leaders, or clubs, give a quick friendly briefing and let them know the left panel is synchronized live with full team details.`;

  function systemPromptWithName(){
    const nameKO = savedName || '사령관';
    const nameEN = savedName || 'Commander';
    if(!savedName) return SYSTEM_PROMPT;
    return SYSTEM_PROMPT + `\n\nThe user's preferred name is "${savedName}". In the EN spoken line, address them naturally as "${nameEN}". In the KO subtitle line, address them naturally as "${nameKO}님".`;
  }

  function parseDual(text){
    const raw = String(text || '').trim();
    const m = raw.match(/EN:\s*([\s\S]*?)\n+\s*KO:\s*([\s\S]*)/i);
    if(m){
      const en = m[1].replace(/^(EN:|KO:)\s*/i, '').trim();
      const ko = m[2].replace(/^(EN:|KO:)\s*/i, '').trim();
      return { en, ko };
    }
    const mRev = raw.match(/KO:\s*([\s\S]*?)\n+\s*EN:\s*([\s\S]*)/i);
    if(mRev){
      const ko = mRev[1].replace(/^(EN:|KO:)\s*/i, '').trim();
      const en = mRev[2].replace(/^(EN:|KO:)\s*/i, '').trim();
      return { en, ko };
    }
    let single = raw.replace(/^(EN:|KO:)\s*/i, '').trim();
    return { en: single, ko: single };
  }

  function renderEvBubble(bubble, { ko, en }){
    bubble.innerHTML = '';
    const koEl = document.createElement('div');
    koEl.className = 'sub-ko';
    koEl.textContent = ko || '(자막 없음)';
    bubble.appendChild(koEl);

    if(en && en !== ko){
      const enEl = document.createElement('div');
      enEl.className = 'voice-en';
      const badge = document.createElement('span');
      badge.className = 'voice-badge';
      badge.textContent = 'VOICE · EN';
      const enText = document.createElement('span');
      enText.className = 'voice-text';
      enText.textContent = en;
      enEl.appendChild(badge);
      enEl.appendChild(enText);
      bubble.appendChild(enEl);
    }
  }

  function addMessage(role, text){
    const wrap = document.createElement('div');
    wrap.className = 'msg ' + role;
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = role === 'user' ? 'YOU' : role === 'ev' ? 'E.V' : 'SYSTEM';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    wrap.appendChild(tag);
    wrap.appendChild(bubble);
    chatLog.appendChild(wrap);
    chatLog.scrollTop = chatLog.scrollHeight;
    return bubble;
  }

  function setStatus(online, label){
    statusDot.classList.toggle('online', online);
    statusText.textContent = label;
  }

  function fmtUptime(){
    if(!bootTime) return '00:00:00';
    const s = Math.floor((Date.now() - bootTime)/1000);
    const hh = String(Math.floor(s/3600)).padStart(2,'0');
    const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return hh+':'+mm+':'+ss;
  }
  setInterval(()=>{
    hudUptime.textContent = fmtUptime();
    hudTemp.textContent = (86 + Math.sin(Date.now()/4000)*8).toFixed(0) + '%';
  }, 1000);

  function pickVoice(voiceURIOverride){
    if(!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const wantURI = voiceURIOverride !== undefined ? voiceURIOverride : savedVoiceURI;
    if(wantURI){
      const chosen = voices.find(v => v.voiceURI === wantURI);
      if(chosen) return chosen;
    }
    // Strictly prioritize natural English voices (US, GB, or English general)
    return voices.find(v => /^en[-_]US/i.test(v.lang))
        || voices.find(v => /^en[-_]GB/i.test(v.lang))
        || voices.find(v => /^en/i.test(v.lang))
        || voices[0] || null;
  }

  function speak(text, voiceURIOverride){
    if(!ttsOn || !text) return;
    if(!('speechSynthesis' in window)) return;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 1.02; u.pitch = 1.0;
      const preferred = pickVoice(voiceURIOverride);
      if(preferred){
        u.voice = preferred;
        u.lang = preferred.lang || 'en-US';
      }
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  function populateVoiceSelect(){
    if(!('speechSynthesis' in window)){
      voiceSelect.innerHTML = '<option value="">(이 브라우저는 음성 합성을 지원하지 않습니다)</option>';
      voiceSelect.disabled = true;
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    let list = voices.filter(v => /^en/i.test(v.lang));
    if(list.length === 0) list = voices;
    voiceSelect.innerHTML = '';
    if(list.length === 0){
      voiceSelect.innerHTML = '<option value="">(사용 가능한 영문 음성이 없습니다)</option>';
      return;
    }
    list.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      voiceSelect.appendChild(opt);
    });
    if(savedVoiceURI && list.some(v => v.voiceURI === savedVoiceURI)){
      voiceSelect.value = savedVoiceURI;
    } else {
      const defVoice = pickVoice();
      if(defVoice) voiceSelect.value = defVoice.voiceURI;
    }
  }
  if('speechSynthesis' in window){
    window.speechSynthesis.onvoiceschanged = populateVoiceSelect;
  }

  ttsBtn.addEventListener('click', ()=>{
    ttsOn = !ttsOn;
    ttsBtn.classList.toggle('muted', !ttsOn);
    if(!ttsOn) window.speechSynthesis && window.speechSynthesis.cancel();
  });

  modeBtn.addEventListener('click', ()=>{
    sensing = !sensing;
    modeBtn.classList.toggle('active', sensing);
    cornerFrame.classList.toggle('sensing', sensing);
    hudMode.textContent = sensing ? 'BIO-ALERT' : 'STANDBY';
  });

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(SR){
    recognition = new SR();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e)=>{
      const t = e.results[0][0].transcript;
      textInput.value = t;
      handleSend();
    };
    recognition.onend = ()=>{ recognizing = false; micBtn.classList.remove('active'); };
    recognition.onerror = ()=>{ recognizing = false; micBtn.classList.remove('active'); };
  } else {
    micBtn.style.opacity = '0.3';
    micBtn.title = 'Voice input not supported in this browser';
  }
  micBtn.addEventListener('click', ()=>{
    if(!recognition) return;
    if(recognizing){ recognition.stop(); return; }
    recognizing = true;
    micBtn.classList.add('active');
    try{ recognition.start(); }catch(e){ recognizing=false; micBtn.classList.remove('active'); }
  });

  async function handleSend(){
    const text = textInput.value.trim();
    if(!text) return;

    textInput.value = '';
    sendBtn.disabled = true;
    addMessage('user', text);
    history.push({role:'user', content:text});

    const bubble = addMessage('ev', '');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    bubble.appendChild(cursor);

    try{
      const messages = [{role:'system', content: systemPromptWithName()}, ...history];
      let full = '';
      const resp = await callAI(messages, { stream: true });
      if(resp && typeof resp[Symbol.asyncIterator] === 'function'){
        for await (const part of resp){
          const chunk = (part && (part.text ?? part?.message?.content)) ?? '';
          if(chunk) full += chunk;
        }
      } else {
        full = extractText(resp);
      }
      cursor.remove();
      const { en, ko } = parseDual(full || 'EN: Standing by.\nKO: 대기 중입니다.');
      renderEvBubble(bubble, { ko, en });
      history.push({role:'assistant', content: `EN: ${en}\nKO: ${ko}`});
      speak(en);
    }catch(err){
      cursor.remove();
      const cleanMsg = formatErrorMessage(err);
      bubble.innerHTML = '';
      const textSpan = document.createElement('span');
      textSpan.textContent = `[연결 안내] ${cleanMsg} `;
      bubble.appendChild(textSpan);

      const retryBtn = document.createElement('button');
      retryBtn.className = 'retry-btn';
      retryBtn.type = 'button';
      retryBtn.innerHTML = '&#x21bb; 다시 시도';
      retryBtn.addEventListener('click', ()=>{
        bubble.parentElement.remove();
        textInput.value = text;
        handleSend();
      });
      bubble.appendChild(retryBtn);
      bubble.parentElement.classList.add('sys');
    }finally{
      sendBtn.disabled = false;
      textInput.focus();
    }
  }

  function formatErrorMessage(err){
    if(!err) return '알 수 없는 통신 오류가 발생했습니다.';
    let raw = err?.message || err?.error?.message || String(err);
    try {
      const parsed = JSON.parse(raw);
      if (parsed.error) {
        raw = typeof parsed.error === 'string' ? parsed.error : (parsed.error.message || raw);
        try {
          const inner = JSON.parse(raw);
          if (inner.error?.message) raw = inner.error.message;
        } catch {}
      }
    } catch {}
    if (raw.includes('experiencing high demand') || raw.includes('503') || raw.includes('overloaded')) {
      return '현재 AI 모델 서버 사용량이 일시적으로 급증했습니다. 잠시 후 [다시 시도]를 눌러주세요.';
    }
    if (raw.includes('Resource has been exhausted') || raw.includes('429') || raw.includes('quota')) {
      return '요청 허용 한도에 도달했습니다. 잠시 후 다시 시도해주세요.';
    }
    return raw;
  }

  function extractText(resp){
    if(resp == null) return '';
    if(typeof resp === 'string') return resp;
    if(typeof resp.message?.content === 'string') return resp.message.content;
    if(Array.isArray(resp.message?.content)){
      return resp.message.content.map(c => c.text || '').join('');
    }
    if(typeof resp.text === 'string') return resp.text;
    try{ return String(resp); }catch(e){ return ''; }
  }

  async function* sseIterator(response){
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while(true){
      const { done, value } = await reader.read();
      if(done) break;
      buffer += decoder.decode(value, { stream: true });
      let boundary;
      while((boundary = buffer.indexOf('\n\n')) !== -1){
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const line = block.split('\n').find(l => l.startsWith('data:'));
        if(!line) continue;
        const jsonStr = line.slice(5).trim();
        if(!jsonStr || jsonStr === '[DONE]') continue;
        try{
          const parsed = JSON.parse(jsonStr);
          if(parsed.error) throw new Error(parsed.error);
          if(parsed.text) yield { text: parsed.text };
        }catch(e){
          if(e.message && e.message !== 'Unexpected end of JSON input') throw e;
        }
      }
    }
  }

  async function callAI(messages, opts){
    opts = opts || {};
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: state.geminiModel || 'gemini-3.8-flash',
        stream: opts.stream !== false,
        apiKey: state.geminiKey || undefined
      })
    });

    if(!res.ok){
      const errData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }

    if(opts.stream !== false && res.body){
      return sseIterator(res);
    }
    const data = await res.json();
    return data.text || '';
  }

  function renderSettingsPanel(){
    providerStatus.textContent = state.geminiKey ? `GEMINI (${state.geminiModel} · Custom Key)` : `GEMINI (${state.geminiModel} · Server Core)`;
    geminiModelInput.value = state.geminiModel;
    hudEngine.textContent = 'GEMINI';
  }

  settingsBtn.addEventListener('click', ()=>{
    settingsMsg.textContent = '';
    prefsMsg.textContent = '';
    settingsPanel.hidden = !settingsPanel.hidden;
    if(!settingsPanel.hidden){
      renderSettingsPanel();
      nameInput.value = savedName;
      populateVoiceSelect();
    }
  });

  savePrefsBtn.addEventListener('click', ()=>{
    savedName = nameInput.value.trim();
    savedVoiceURI = voiceSelect.value || '';
    savePrefs();
    prefsMsg.style.color = 'var(--gold)';
    prefsMsg.textContent = '저장되었습니다.';
  });

  voiceTestBtn.addEventListener('click', ()=>{
    speak('Hello! I am E.V, your friendly neighborhood AI assistant. All systems operational.', voiceSelect.value || undefined);
  });

  geminiConnectBtn.addEventListener('click', async ()=>{
    const key = geminiKeyInput.value.trim();
    const model = geminiModelInput.value.trim() || 'gemini-3.8-flash';
    state.provider = 'gemini';
    state.geminiKey = key;
    state.geminiModel = model;
    settingsMsg.style.color = 'var(--gold)';
    settingsMsg.textContent = key ? '커스텀 Gemini 키 및 모델이 적용되었습니다.' : 'Gemini 모델 설정이 적용되었습니다.';
    geminiKeyInput.value = '';
    renderSettingsPanel();
    if(bootTime){
      addMessage('sys', `Gemini 엔진 설정이 갱신되었습니다. (모델: ${state.geminiModel})`);
      userTag.textContent = `Gemini · ${state.geminiModel}`;
    }
  });

  geminiClearBtn.addEventListener('click', ()=>{
    state.provider = 'gemini';
    state.geminiKey = '';
    state.geminiModel = 'gemini-3.8-flash';
    geminiKeyInput.value = '';
    geminiModelInput.value = 'gemini-3.8-flash';
    settingsMsg.style.color = 'var(--gold)';
    settingsMsg.textContent = '기본 서버 Gemini 엔진(gemini-3.8-flash)으로 복원되었습니다.';
    renderSettingsPanel();
    if(bootTime){
      addMessage('sys', '기본 서버 Gemini 엔진으로 재설정되었습니다.');
      userTag.textContent = `Gemini · 3.8 Flash`;
    }
  });

  sendBtn.addEventListener('click', handleSend);
  textInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') handleSend();
  });

  async function activateSession(){
    const nameKO = savedName || '사령관';
    const nameEN = savedName || 'Commander';
    setStatus(true, 'ONLINE');
    userTag.style.display = 'inline';
    userTag.textContent = state.geminiKey ? `Gemini · Custom` : `Gemini · ${state.geminiModel}`;
    hudEngine.textContent = 'GEMINI';
    bootTime = Date.now();
    addMessage('sys', `E.V 양자 코어 가동 완료. (엔진: Google Gemini / 음성: 영어 / 자막: 한국어)`);
    const greetBubble = addMessage('ev', '');
    const greetCursor = document.createElement('span');
    greetCursor.className='cursor';
    greetBubble.appendChild(greetCursor);
    try{
      const resp = await callAI(
        [{role:'system', content: systemPromptWithName()},
         {role:'user', content:`(system: You just came online. Greet the user briefly and warmly in the required EN / KO two-line format.)`}],
        { stream: true }
      );
      let full = '';
      if(resp && typeof resp[Symbol.asyncIterator] === 'function'){
        for await (const part of resp){
          const chunk = (part && (part.text ?? part?.message?.content)) ?? '';
          if(chunk) full += chunk;
        }
      } else {
        full = extractText(resp);
      }
      const raw = full || `EN: All systems online, ${nameEN}. Ready for action!\nKO: 모든 시스템 정상 가동되었습니다, ${nameKO}님. 언제든 준비 완료되었습니다!`;
      const { en, ko } = parseDual(raw);
      greetCursor.remove();
      renderEvBubble(greetBubble, { ko, en });
      history.push({role:'assistant', content: `EN: ${en}\nKO: ${ko}`});
      speak(en);
    }catch(e){
      greetCursor.remove();
      const defEN = `All systems operational, ${nameEN}.`;
      const defKO = `모든 시스템 정상 가동 중입니다, ${nameKO}님.`;
      renderEvBubble(greetBubble, { ko: defKO, en: defEN });
      speak(defEN);
    }
    textInput.focus();
  }

  orbPane?.addEventListener('click', ()=>{
    playSpiderHoloScan();
    speak('Holographic quantum core online and operating at maximum efficiency.');
    addMessage('sys', 'E.V 양자 홀로그램 코어가 최적 상태로 가동 중입니다. (엔진: Google Gemini)');
  });

  signOutBtn?.addEventListener('click', ()=>{
    location.reload();
  });

  // ---- Baseball simulation ----
  let bb = null;
  const BB_OUTCOMES = [
    { type:'strikeout', w:22 },
    { type:'walk',      w:9  },
    { type:'single',    w:16 },
    { type:'double',    w:6  },
    { type:'triple',    w:1  },
    { type:'hr',        w:4  },
    { type:'groundout', w:22 },
    { type:'flyout',    w:20 },
  ];

  function bbWeightedPick(list){
    const total = list.reduce((a, o) => a + o.w, 0);
    let r = Math.random() * total;
    for(const o of list){
      if(r < o.w) return o.type;
      r -= o.w;
    }
    return list[list.length - 1].type;
  }

  function bbAdvance(n){
    let runs = 0;
    const next = [false, false, false];
    for(let i = 0; i < 3; i++){
      if(bb.bases[i]){
        const dest = i + n;
        if(dest >= 3) runs++; else next[dest] = true;
      }
    }
    bb.bases = next;
    if(n < 4){
      const battersDest = n - 1;
      if(battersDest < 3) bb.bases[battersDest] = true;
    }
    return runs;
  }

  function bbWalk(){
    let runs = 0;
    if(bb.bases[0]){
      if(bb.bases[1]){
        if(bb.bases[2]) runs++;
        bb.bases[2] = true;
      }
      bb.bases[1] = true;
    }
    bb.bases[0] = true;
    return runs;
  }

  function bbNewGame(awayName, homeName, innings){
    return {
      away: awayName || 'AWAY', home: homeName || 'HOME', innings,
      inning: 1, half: 'top', outs: 0, bases: [false, false, false],
      score: { away: 0, home: 0 }, over: false
    };
  }

  function bbLogLine(text, highlight){
    const line = document.createElement('div');
    line.className = 'bb-line' + (highlight ? ' bb-highlight' : '');
    line.textContent = text;
    bbLog.appendChild(line);
    bbLog.scrollTop = bbLog.scrollHeight;
  }

  function bbRender(){
    bbAwayLabel.textContent = bb.away;
    bbHomeLabel.textContent = bb.home;
    bbAwayScore.textContent = bb.score.away;
    bbHomeScore.textContent = bb.score.home;
    bbInningInfo.textContent = `${bb.inning}회${bb.half === 'top' ? '초' : '말'} · OUT ${bb.outs}` + (bb.over ? ' · 경기 종료' : '');
    bbBase1.classList.toggle('on', bb.bases[0]);
    bbBase2.classList.toggle('on', bb.bases[1]);
    bbBase3.classList.toggle('on', bb.bases[2]);
    bbPitchBtn.disabled = bb.over;
    bbPitchBtn.textContent = bb.over ? '경기 종료' : '타석 진행 ▶';
  }

  function bbFinishGame(message){
    bb.over = true;
    bbLogLine(message, true);
    bbRender();
    try{ addMessage('sys', `⚾ ${message}`); }catch(e){}
  }

  function bbAtBat(){
    if(!bb || bb.over) return;
    const battingTeam = bb.half === 'top' ? bb.away : bb.home;
    const scoringKey = bb.half === 'top' ? 'away' : 'home';
    const outcome = bbWeightedPick(BB_OUTCOMES);
    let text = '';

    switch(outcome){
      case 'strikeout':
        bb.outs++;
        text = `${battingTeam} 타자, 삼진 아웃.`;
        break;
      case 'walk': {
        const runs = bbWalk();
        bb.score[scoringKey] += runs;
        text = `${battingTeam} 타자, 볼넷으로 출루.` + (runs ? ` (밀어내기 ${runs}점!)` : '');
        break;
      }
      case 'single': {
        const runs = bbAdvance(1);
        bb.score[scoringKey] += runs;
        text = `${battingTeam} 타자, 안타!` + (runs ? ` ${runs}점 득점!` : '');
        break;
      }
      case 'double': {
        const runs = bbAdvance(2);
        bb.score[scoringKey] += runs;
        text = `${battingTeam} 타자, 2루타!` + (runs ? ` ${runs}점 득점!` : '');
        break;
      }
      case 'triple': {
        const runs = bbAdvance(3);
        bb.score[scoringKey] += runs;
        text = `${battingTeam} 타자, 3루타!` + (runs ? ` ${runs}점 득점!` : '');
        break;
      }
      case 'hr': {
        const runs = bbAdvance(4) + 1;
        bb.score[scoringKey] += runs;
        text = `${battingTeam} 타자, 홈런! ${runs}점 득점!`;
        break;
      }
      case 'groundout': {
        if(bb.bases[0] && bb.outs < 2 && Math.random() < 0.35){
          bb.outs += 2;
          bb.bases[0] = false;
          text = `${battingTeam} 타자, 병살타! 아웃 2개 추가.`;
        } else {
          bb.outs++;
          text = `${battingTeam} 타자, 땅볼 아웃.`;
        }
        break;
      }
      case 'flyout': {
        if(bb.bases[2] && bb.outs < 2 && Math.random() < 0.4){
          bb.bases[2] = false;
          bb.score[scoringKey]++;
          bb.outs++;
          text = `${battingTeam} 타자, 희생플라이! 3루 주자 득점.`;
        } else {
          bb.outs++;
          text = `${battingTeam} 타자, 뜬공 아웃.`;
        }
        break;
      }
    }

    bbLogLine(text, outcome === 'hr' || outcome === 'triple');
    bbRender();

    if(bb.half === 'bottom' && bb.inning >= bb.innings && bb.score.home > bb.score.away){
      bbFinishGame(`끝내기 승리! ${bb.home} ${bb.score.home} : ${bb.score.away} ${bb.away}`);
      return;
    }

    if(bb.outs >= 3){
      const finishedHalf = bb.half;
      const finishedInning = bb.inning;
      bb.outs = 0;
      bb.bases = [false, false, false];
      if(finishedHalf === 'top'){
        if(finishedInning >= bb.innings && bb.score.home > bb.score.away){
          bbFinishGame(`경기 종료! ${bb.home} ${bb.score.home} : ${bb.score.away} ${bb.away} — ${bb.home} 승리!`);
          return;
        }
        bb.half = 'bottom';
      } else {
        if(finishedInning >= bb.innings && bb.score.home !== bb.score.away){
          const winner = bb.score.home > bb.score.away ? bb.home : bb.away;
          bbFinishGame(`경기 종료! ${bb.home} ${bb.score.home} : ${bb.score.away} ${bb.away} — ${winner} 승리!`);
          return;
        }
        bb.half = 'top';
        bb.inning = finishedInning + 1;
        if(finishedInning >= bb.innings){
          bbLogLine(`${finishedInning}회 종료, 동점! 연장 ${bb.inning}회로 이어집니다.`);
        }
      }
      bbRender();
    }
  }

  baseballBtn.addEventListener('click', ()=>{ baseballOverlay.hidden = false; });
  valorantBtn.addEventListener('click', ()=>{
    addMessage('system', '🎮 발로란트 실행 신호(jarvis://launch-valorant)를 보냈습니다. 처음 사용하신다면 함께 받은 install-jarvis-protocol.bat을 먼저 실행해 프로토콜을 등록해주세요. 브라우저가 "Jarvis Protocol을 여시겠습니까?" 라고 물으면 허용을 눌러주세요.');
    try{
      window.location.href = 'jarvis://launch-valorant';
    }catch(e){
      addMessage('system', '실행 신호를 보내지 못했습니다: ' + e.message);
    }
  });

  if(ligaBoard){
    ligaBoard.addEventListener('click', (e)=>{
      const pill = e.target.closest('.liga-result');
      if(!pill || !ligaBoard.contains(pill)) return;
      const teamBlock = pill.closest('.liga-team');
      const teamName = teamBlock ? (teamBlock.querySelector('.liga-name')?.textContent || '').trim() : '';
      const resultText = pill.textContent.trim();
      const query = [teamName, resultText, '하이라이트'].filter(Boolean).join(' ');
      window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), '_blank', 'noopener');
    });
  }
  bbCloseBtn.addEventListener('click', ()=>{ baseballOverlay.hidden = true; });
  baseballOverlay.addEventListener('click', (e)=>{ if(e.target === baseballOverlay) baseballOverlay.hidden = true; });

  bbStartBtn.addEventListener('click', ()=>{
    const away = bbAwayName.value.trim();
    const home = bbHomeName.value.trim();
    const innings = parseInt(bbInningsSelect.value, 10) || 9;
    bb = bbNewGame(away, home, innings);
    bbLog.innerHTML = '';
    bbSetup.hidden = true;
    bbGame.hidden = false;
    bbLogLine(`⚾ 경기 시작: ${bb.away} vs ${bb.home} (${innings}이닝)`, true);
    bbRender();
  });

  bbPitchBtn.addEventListener('click', bbAtBat);
  bbResetBtn.addEventListener('click', ()=>{
    bb = null;
    bbGame.hidden = true;
    bbSetup.hidden = false;
  });

  // =========================================================================
  // 3D HOLOGRAPHIC CORE (Three.js) — SMOOTH & ELEGANT QUANTUM CORE
  // =========================================================================
  function initCore3D(){
    try{
      const canvas = document.getElementById('coreCanvas');
      if(!canvas || typeof THREE === 'undefined') return false;
      const W = 220, H = 220;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W / H, 1, 1000);
      camera.position.set(0, 0, 215);

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // warm gold / amber palette + electric energy highlights
      const gold      = new THREE.Color('#ffb347');
      const goldDeep  = new THREE.Color('#e07a1c');
      const goldPale  = new THREE.Color('#ffe3a8');
      const white     = new THREE.Color('#fff6e6');
      const electric  = new THREE.Color('#3fe3ff');

      function makeGlowSprite(){
        const s = 64;
        const c = document.createElement('canvas'); c.width = c.height = s;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.35, 'rgba(255,210,140,0.85)');
        g.addColorStop(1, 'rgba(255,150,40,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        return new THREE.CanvasTexture(c);
      }
      const sprite = makeGlowSprite();

      // Main chaotic rig
      const rig = new THREE.Group();
      scene.add(rig);

      // Central eye rings + multiple wild tumbling gyro rings (산만한 회전 링들)
      const eyeRing = new THREE.Mesh(
        new THREE.TorusGeometry(16, 3.6, 16, 60),
        new THREE.MeshBasicMaterial({ color: white, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rig.add(eyeRing);

      const eyeRing2 = new THREE.Mesh(
        new THREE.TorusGeometry(25, 1.8, 12, 60),
        new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rig.add(eyeRing2);

      // Additional erratic gyroscopic rings spinning at wild angles
      const gyroRing1 = new THREE.Mesh(
        new THREE.TorusGeometry(38, 1.2, 8, 48),
        new THREE.MeshBasicMaterial({ color: goldPale, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      gyroRing1.rotation.x = Math.PI / 3;
      rig.add(gyroRing1);

      const gyroRing2 = new THREE.Mesh(
        new THREE.TorusGeometry(50, 0.9, 8, 48),
        new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      gyroRing2.rotation.y = Math.PI / 4;
      rig.add(gyroRing2);

      // Rapidly fluctuating glow & solid core
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(32, 24, 24),
        new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rig.add(glow);

      const solidCore = new THREE.Mesh(
        new THREE.SphereGeometry(15, 20, 20),
        new THREE.MeshBasicMaterial({ color: white, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rig.add(solidCore);

      // Core flares
      const flare = new THREE.Sprite(new THREE.SpriteMaterial({
        map: sprite, color: white, transparent: true, opacity: 0.95,
        blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false
      }));
      flare.scale.set(46, 46, 1);
      rig.add(flare);

      const flareBig = new THREE.Sprite(new THREE.SpriteMaterial({
        map: sprite, color: gold, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false
      }));
      flareBig.scale.set(84, 84, 1);
      rig.add(flareBig);

      // Radial spokes: jagged chaotic spikes
      function makeSpokes(count, minR, maxR, color, opacity){
        const positions = new Float32Array(count * 6);
        for(let i = 0; i < count; i++){
          const u = Math.random() * 2 - 1;
          const theta = Math.random() * Math.PI * 2;
          const sr = Math.sqrt(1 - u*u);
          const dx = sr * Math.cos(theta), dy = sr * Math.sin(theta), dz = u;
          const r0 = minR * (0.4 + Math.random() * 0.3);
          const r1 = maxR * (0.75 + Math.random() * 0.5);
          positions[i*6]   = dx * r0; positions[i*6+1] = dy * r0; positions[i*6+2] = dz * r0;
          positions[i*6+3] = dx * r1; positions[i*6+4] = dy * r1; positions[i*6+5] = dz * r1;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
        const lines = new THREE.LineSegments(geo, mat);
        rig.add(lines);
        return lines;
      }
      const spokesLong  = makeSpokes(80, 10, 96, gold, 0.65);
      const spokesShort = makeSpokes(55, 8, 64, goldPale, 0.5);
      const spokesElectric = makeSpokes(28, 12, 105, electric, 0.45);

      // Jagged circuit-like lattice shells
      const latticeOuter = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(78, 2)),
        new THREE.LineBasicMaterial({ color: goldDeep, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rig.add(latticeOuter);

      const latticeInner = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(52, 1)),
        new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rig.add(latticeInner);

      // Faint lat/long globe shell
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(66, 14, 10),
        new THREE.MeshBasicMaterial({ color: goldDeep, wireframe: true, transparent: true, opacity: 0.16 })
      );
      rig.add(globe);

      // Static and dynamic dust particles
      function makeDust(count, radius, color, size){
        const positions = new Float32Array(count * 3);
        for(let i = 0; i < count; i++){
          const u = Math.random() * 2 - 1;
          const theta = Math.random() * Math.PI * 2;
          const sr = Math.sqrt(1 - u*u);
          const r = radius * (0.55 + Math.random() * 0.5);
          positions[i*3]   = sr * Math.cos(theta) * r;
          positions[i*3+1] = sr * Math.sin(theta) * r;
          positions[i*3+2] = u * r;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
        const pts = new THREE.Points(geo, mat);
        rig.add(pts);
        return pts;
      }
      const dustFine   = makeDust(160, 92, goldPale, 1.6);
      const dustCoarse = makeDust(65, 102, white, 2.5);

      // Bokeh particles
      function makeBokeh(count, radius){
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for(let i = 0; i < count; i++){
          const u = Math.random() * 2 - 1;
          const theta = Math.random() * Math.PI * 2;
          const sr = Math.sqrt(1 - u*u);
          const r = radius * (0.3 + Math.random() * 0.9);
          positions[i*3]   = sr * Math.cos(theta) * r;
          positions[i*3+1] = sr * Math.sin(theta) * r;
          positions[i*3+2] = u * r;
          sizes[i] = 4 + Math.random() * 9;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
          color: gold, map: sprite, size: 8, transparent: true, opacity: 0.65,
          blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
        });
        const pts = new THREE.Points(geo, mat);
        rig.add(pts);
        return pts;
      }
      const bokeh = makeBokeh(32, 110);

      // Luminous orbital quantum particle aura (부드럽게 궤도를 선회하는 양자 오라)
      const swarmCount = 64;
      const swarmPos = new Float32Array(swarmCount * 3);
      const swarmOrbits = [];
      for(let i = 0; i < swarmCount; i++){
        const r = 32 + Math.random() * 55;
        const theta = Math.random() * Math.PI * 2;
        const tilt = (Math.random() - 0.5) * Math.PI * 0.9;
        const speed = (0.008 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1);
        swarmOrbits.push({ r, theta, tilt, speed, yOff: (Math.random() - 0.5) * 16 });
        swarmPos[i*3]   = r * Math.cos(theta);
        swarmPos[i*3+1] = r * Math.sin(theta) * Math.sin(tilt);
        swarmPos[i*3+2] = r * Math.sin(theta) * Math.cos(tilt);
      }
      const swarmGeo = new THREE.BufferGeometry();
      swarmGeo.setAttribute('position', new THREE.BufferAttribute(swarmPos, 3));
      const swarmMat = new THREE.PointsMaterial({
        color: goldPale, map: sprite, size: 4.8, transparent: true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
      });
      const swarmPts = new THREE.Points(swarmGeo, swarmMat);
      rig.add(swarmPts);

      // Smooth hover boost with interpolation
      let targetBoost = 1.0;
      let currentBoost = 1.0;
      orbPane.addEventListener('mouseenter', ()=>{ targetBoost = 1.35; });
      orbPane.addEventListener('mouseleave', ()=>{ targetBoost = 1.0; });

      let t = 0;

      function animate(){
        // Smoothly interpolate hover response
        currentBoost += (targetBoost - currentBoost) * 0.05;
        t += 0.015 * currentBoost;

        // Smooth quantum levitation (안정적인 공중에 떠 있는 움직임)
        rig.position.set(0, Math.sin(t * 0.8) * 1.6, 0);

        // Gentle, majestic multi-axis orbital precession
        rig.rotation.y += 0.008 * currentBoost;
        rig.rotation.x = Math.sin(t * 0.5) * 0.08;
        rig.rotation.z = Math.cos(t * 0.6) * 0.06;

        // Smooth counter-rotating eye aperture rings
        eyeRing.rotation.z += 0.018 * currentBoost;
        eyeRing.rotation.x = Math.sin(t * 0.9) * 0.22;
        eyeRing.rotation.y = Math.cos(t * 0.7) * 0.18;

        eyeRing2.rotation.z -= 0.014 * currentBoost;
        eyeRing2.rotation.y = Math.sin(t * 0.8) * 0.24;
        eyeRing2.rotation.x = Math.cos(t * 0.6) * 0.16;

        // Smooth celestial gyro rings
        gyroRing1.rotation.x += 0.011 * currentBoost;
        gyroRing1.rotation.y += 0.014 * currentBoost;

        gyroRing2.rotation.y -= 0.013 * currentBoost;
        gyroRing2.rotation.z += 0.009 * currentBoost;

        // Smooth radial spoke rotation
        spokesLong.rotation.y += 0.009 * currentBoost;
        spokesLong.rotation.x = Math.sin(t * 0.4) * 0.05;

        spokesShort.rotation.y -= 0.012 * currentBoost;
        spokesShort.rotation.z = Math.cos(t * 0.5) * 0.04;

        spokesElectric.rotation.x += 0.016 * currentBoost;
        spokesElectric.rotation.z -= 0.014 * currentBoost;

        // Nested crystalline lattice rotation
        latticeOuter.rotation.y += 0.006 * currentBoost;
        latticeOuter.rotation.x -= 0.005 * currentBoost;

        latticeInner.rotation.y -= 0.009 * currentBoost;
        latticeInner.rotation.z += 0.007 * currentBoost;

        globe.rotation.y += 0.005 * currentBoost;

        // Ambient dust & bokeh drifting smoothly
        dustFine.rotation.y -= 0.007 * currentBoost;
        dustFine.rotation.x += 0.004 * currentBoost;

        dustCoarse.rotation.y += 0.009 * currentBoost;
        dustCoarse.rotation.z -= 0.005 * currentBoost;

        bokeh.rotation.y += 0.006 * currentBoost;
        bokeh.rotation.x += 0.004 * currentBoost;

        // Serene, rhythmic core breathing pulse
        const corePulse = 1 + Math.sin(t * 1.6) * 0.06;
        flare.scale.set(46 * corePulse, 46 * corePulse, 1);
        flare.material.opacity = 0.88 + Math.sin(t * 1.6) * 0.08;

        const bigPulse = 1 + Math.cos(t * 1.2) * 0.05;
        flareBig.scale.set(84 * bigPulse, 84 * bigPulse, 1);
        glow.scale.setScalar(1 + Math.sin(t * 1.4) * 0.05);
        solidCore.scale.setScalar(1 + Math.sin(t * 1.8) * 0.04);

        // Smooth orbital particle simulation (우아하게 도는 양자 스파크들)
        const pArr = swarmGeo.attributes.position.array;
        for(let i = 0; i < swarmCount; i++){
          const orb = swarmOrbits[i];
          orb.theta += orb.speed * currentBoost;
          const idx = i * 3;
          pArr[idx]   = orb.r * Math.cos(orb.theta);
          pArr[idx+1] = orb.r * Math.sin(orb.theta) * Math.sin(orb.tilt) + Math.sin(t + i) * 1.5;
          pArr[idx+2] = orb.r * Math.sin(orb.theta) * Math.cos(orb.tilt);
        }
        swarmGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
      return true;
    }catch(e){
      return false;
    }
  }

  // ---- Soccer skill encyclopedia ----
  const SOCCER_SKILLS = [
    { name: '스텝오버', cat: 'dribble', desc: '발을 공 위로 빠르게 지나가며 방향을 속이는 페인트 동작. 상대의 무게중심을 흔들어 돌파 공간을 만든다.' },
    { name: '크루이프 턴', cat: 'dribble', desc: '패스나 슈팅을 하는 척하다가 축발 반대쪽 발 안쪽으로 공을 끌어 몸 뒤로 돌려 방향을 완전히 바꾸는 기술.' },
    { name: '마르세유 턴 (룰렛)', cat: 'dribble', desc: '공을 발 사이에 두고 몸을 360도 회전시키며 공을 끌어와 상대를 등지고 벗어나는 기술.' },
    { name: '엘라스티코', cat: 'dribble', desc: '발 바깥쪽으로 공을 밀었다가 순간적으로 안쪽으로 감아 반대 방향으로 튕겨내는 브라질식 드리블 기술.' },
    { name: '라보나', cat: 'dribble', desc: '축발 뒤쪽으로 반대발을 교차시켜 공을 다루는 기술. 킥이나 패스에도 응용된다.' },
    { name: '넛메그 (알까기)', cat: 'dribble', desc: '상대 선수의 다리 사이로 공을 통과시켜 돌파하는 기술. 심리적으로도 상대를 크게 흔든다.' },
    { name: '헛다리 짚기', cat: 'dribble', desc: '몸의 방향과 시선을 속여 상대의 예측을 무너뜨리는 기본 페인트 동작.' },
    { name: '지단 롤', cat: 'dribble', desc: '발바닥으로 공을 끌며 몸을 회전시켜 상대를 등지고 순간적으로 방향을 트는 기술.' },
    { name: '원터치 패스', cat: 'pass', desc: '공을 멈추지 않고 받는 즉시 한 번의 터치로 연결하는 패스. 빠른 템포의 패스 플레이에 핵심적이다.' },
    { name: '스루패스', cat: 'pass', desc: '수비 라인 뒤 공간으로 공격수가 침투하는 타이밍에 맞춰 찔러주는 패스.' },
    { name: '힐 패스 (백힐)', cat: 'pass', desc: '발뒤꿈치로 공을 밀어 뒤쪽이나 예상 밖의 방향으로 연결하는 패스.' },
    { name: '로빙 패스', cat: 'pass', desc: '공을 띄워 수비수나 압박 라인을 넘겨 동료에게 전달하는 패스.' },
    { name: '크로스', cat: 'pass', desc: '측면에서 페널티 지역 안으로 올리는 패스. 인스윙/아웃스윙 등 궤적에 따라 종류가 나뉜다.' },
    { name: '스위칭 플레이 (사이드체인지)', cat: 'pass', desc: '공격 방향을 반대편 측면으로 길게 바꿔 수비 대형을 무너뜨리는 패스.' },
    { name: '무회전 슈팅 (너클볼)', cat: 'shoot', desc: '공에 회전을 거의 주지 않고 강하게 차서 궤도가 불규칙하게 흔들리며 날아가게 하는 슈팅.' },
    { name: '바나나킥 (감아차기)', cat: 'shoot', desc: '공에 강한 횡회전을 줘 바나나 모양으로 휘어 들어가게 하는 슈팅. 프리킥에 자주 쓰인다.' },
    { name: '오버헤드킥 (바이시클킥)', cat: 'shoot', desc: '몸을 뒤로 젖혀 공중에서 자전거 페달을 밟듯 다리를 휘둘러 공을 넘겨차는 고난도 슈팅.' },
    { name: '발리슛', cat: 'shoot', desc: '땅에 닿지 않은 공을 공중에서 바로 차는 슈팅. 타이밍과 임팩트가 중요하다.' },
    { name: '칩샷', cat: 'shoot', desc: '공 밑을 짧고 부드럽게 걷어차 골키퍼 머리 위로 살짝 띄워 넣는 슈팅.' },
    { name: '인프런트킥', cat: 'shoot', desc: '발등 안쪽으로 공을 감아 차는 정확도 높은 슈팅/킥 방식.' },
    { name: '슬라이딩 태클', cat: 'defend', desc: '몸을 미끄러뜨려 발로 공을 걷어내는 수비 기술. 타이밍이 조금만 늦어도 파울이 되기 쉽다.' },
    { name: '지역방어 (존 마킹)', cat: 'defend', desc: '특정 선수가 아니라 정해진 구역을 책임지는 수비 방식.' },
    { name: '대인방어 (맨 마킹)', cat: 'defend', desc: '특정 상대 선수를 전담해 밀착 마크하는 수비 방식.' },
    { name: '오프사이드 트랩', cat: 'defend', desc: '수비 라인을 의도적으로 앞으로 끌어올려 상대 공격수를 오프사이드로 만드는 조직적 수비 전술.' },
    { name: '인터셉트', cat: 'defend', desc: '상대의 패스 경로를 미리 읽고 중간에서 끊어내는 수비 동작.' },
    { name: '조키잉 (자세 방어)', cat: 'defend', desc: '무리하게 태클하지 않고 자세를 낮춰 상대와 거리를 유지하며 방향을 제한하는 수비 기술.' },
    { name: '다이빙 세이브', cat: 'keep', desc: '골키퍼가 몸을 날려 공을 막아내는 대표적인 선방 기술.' },
    { name: '펀칭', cat: 'keep', desc: '크로스나 위험한 공을 잡지 않고 주먹으로 강하게 쳐내는 골키퍼 기술.' },
    { name: '1대1 각도 좁히기', cat: 'keep', desc: '상대 공격수와 단독 상황에서 앞으로 나가 슈팅 각도를 최소화하는 골키퍼 기술.' },
    { name: '스위퍼 키퍼', cat: 'keep', desc: '골문을 벗어나 최종 수비수처럼 뒷공간을 커버하는 현대적 골키퍼 역할.' },
    { name: '캐칭', cat: 'keep', desc: '공을 쳐내지 않고 양손으로 안전하게 감싸 잡는 골키퍼의 기본기.' },
  ];
  const SOCCER_TABS = [
    { key: 'all', label: '전체' },
    { key: 'dribble', label: '드리블' },
    { key: 'pass', label: '패스' },
    { key: 'shoot', label: '슈팅' },
    { key: 'defend', label: '수비' },
    { key: 'keep', label: '골키핑' },
  ];
  let soccerActiveTab = 'all';

  function renderSoccerTabs(){
    if(!soccerTabs) return;
    soccerTabs.innerHTML = '';
    SOCCER_TABS.forEach(tab=>{
      const el = document.createElement('div');
      el.className = 'soccer-tab' + (tab.key === soccerActiveTab ? ' active' : '');
      el.textContent = tab.label;
      el.addEventListener('click', ()=>{ soccerActiveTab = tab.key; renderSoccerTabs(); renderSoccerList(); });
      soccerTabs.appendChild(el);
    });
  }

  function renderSoccerList(){
    if(!soccerList) return;
    const query = (soccerSearch?.value || '').trim().toLowerCase();
    const filtered = SOCCER_SKILLS.filter(s=>{
      const catMatch = soccerActiveTab === 'all' || s.cat === soccerActiveTab;
      const textMatch = !query || s.name.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query);
      return catMatch && textMatch;
    });
    soccerList.innerHTML = '';
    if(filtered.length === 0){
      const empty = document.createElement('div');
      empty.className = 'soccer-empty';
      empty.textContent = '검색 결과가 없습니다.';
      soccerList.appendChild(empty);
      return;
    }
    const catLabel = Object.fromEntries(SOCCER_TABS.map(t=>[t.key, t.label]));
    filtered.forEach(s=>{
      const entry = document.createElement('div');
      entry.className = 'soccer-entry';
      const head = document.createElement('div');
      head.className = 'soccer-entry-head';
      const name = document.createElement('span');
      name.className = 'soccer-entry-name';
      name.textContent = s.name;
      const cat = document.createElement('span');
      cat.className = 'soccer-entry-cat';
      cat.textContent = catLabel[s.cat] || s.cat;
      head.appendChild(name); head.appendChild(cat);
      const desc = document.createElement('div');
      desc.className = 'soccer-entry-desc';
      desc.textContent = s.desc;
      entry.appendChild(head); entry.appendChild(desc);
      soccerList.appendChild(entry);
    });
  }

  if(soccerBtn && soccerOverlay){
    soccerBtn.addEventListener('click', ()=>{
      soccerOverlay.hidden = false;
      renderSoccerTabs();
      renderSoccerList();
    });
    soccerCloseBtn?.addEventListener('click', ()=>{ soccerOverlay.hidden = true; });
    soccerOverlay.addEventListener('click', (e)=>{ if(e.target === soccerOverlay) soccerOverlay.hidden = true; });
    soccerSearch?.addEventListener('input', renderSoccerList);
  }

  // ---- Quantum reality simulator ----
  const TIME_STEPS = [
    '양자 코어 부팅 중...',
    '입력된 대상 분석 중...',
    '시뮬레이션 파라미터 초기화...',
    '가능한 결과 분기 트리 탐색 중 (경로 후보 계산)...',
    '변수 간 상호작용 및 역설 발생 가능성 점검 중...',
    '정밀도 보정 중 (오차 범위 최소화)...',
    '목표 대상 잠금 시도...',
  ];
  let timeRunning = false;

  function timeAppendLine(text, highlight){
    if(!timeLog) return;
    const line = document.createElement('div');
    line.className = 'time-line' + (highlight ? ' time-highlight' : '');
    line.textContent = text;
    timeLog.appendChild(line);
    timeLog.scrollTop = timeLog.scrollHeight;
  }

  function timeSleep(ms){
    return new Promise(resolve=> setTimeout(resolve, ms));
  }

  const TIME_SYSTEM_PROMPT = [
    '너는 홀로그램 UI를 가진 초고성능 양자 시뮬레이션 컴퓨터야.',
    '사용자가 입력한 대상을 시뮬레이션한다 — 그 대상은 시간여행 시나리오일 수도, 특정 물건(제품, 발명품, 기계 등)일 수도, 사건이나 상황일 수도, 그 밖의 무엇이든 될 수 있다.',
    '너의 임무는 정확하고 구체적인 시뮬레이션 결과를 한국어로 3~6문장 서술하는 것이다.',
    '규칙:',
    '1) 뜬구름 잡는 추상적인 말 대신, 실제로 있을 법한 구체적인 디테일(수치, 재질, 원리, 이름, 절차 등)을 담아 정밀하게 서술할 것.',
    '2) 대상이 실존하는 사물/현상이면 알려진 사실(물리 법칙, 공학적 제약 등)에 최대한 부합하게 서술하고, 존재하지 않는 사실을 단정적인 실제 사실처럼 말하지 말 것 — 필요하면 "시뮬레이션상" 같은 표현으로 가상의 추론임을 표시할 것.',
    '3) 시간여행처럼 현재 기술로 불가능한 것을 시뮬레이션할 경우, 그것이 허구의 가상 시나리오라는 점을 결과 안에 자연스럽게 녹여낼 것.',
    '4) 결과는 마지막에 한 문장으로 핵심 결론을 요약할 것.',
    '5) 출력은 순수한 결과 서술문만 담을 것 — 인사말, 메타 설명, 마크다운 기호를 넣지 말 것.'
  ].join('\n');

  async function generateTimeResultText(scenario){
    const messages = [
      { role: 'system', content: TIME_SYSTEM_PROMPT },
      { role: 'user', content: `시뮬레이션 대상: "${scenario}"` }
    ];
    const resp = await callAI(messages, { stream: false });
    const text = extractText(resp).trim();
    if(!text) throw new Error('empty AI response');
    return text;
  }

  async function runTimeSimulation(){
    if(timeRunning) return;
    const scenario = (timeYearInput?.value || '').trim();
    if(timeInputError) timeInputError.textContent = '';
    if(!scenario){
      if(timeInputError) timeInputError.textContent = '어떤 것을 시뮬레이션할지 먼저 적어주세요.';
      timeYearInput?.focus();
      return;
    }
    timeRunning = true;

    if(timeStartBtn){ timeStartBtn.disabled = true; timeStartBtn.textContent = '시뮬레이션 진행 중...'; }
    if(timeLog) timeLog.innerHTML = '';
    if(timeResult) timeResult.classList.remove('show');
    timeTunnel?.querySelectorAll('.time-ring').forEach(r=> r.classList.add('pulse'));
    timeCore?.classList.add('active');

    for(const step of TIME_STEPS){
      timeAppendLine(step);
      await timeSleep(420 + Math.random()*260);
    }
    timeAppendLine(`목표 대상 고정: "${scenario}"`, true);
    await timeSleep(400);
    const pathCount = 1000000 + Math.floor(Math.random()*8000000);
    timeAppendLine(`가능한 경로 ${pathCount.toLocaleString('ko-KR')}개 중 최적 결과 계산 중 (AI 정밀 추론)...`, true);

    let resultText;
    let aiFailed = false;
    try{
      resultText = await generateTimeResultText(scenario);
    }catch(err){
      aiFailed = true;
      resultText = `"${scenario}"에 대한 시뮬레이션 결과를 정밀 계산하지 못했습니다 (${err?.message || 'AI 연결 오류'}). 설정에서 로그인 상태 또는 API 키를 확인한 뒤 다시 시도해주세요.`;
    }

    timeAppendLine(aiFailed ? '⚠️ 정밀 계산 실패 — 재시도 필요' : '✅ 시뮬레이션 완료', true);

    timeTunnel?.querySelectorAll('.time-ring').forEach(r=> r.classList.remove('pulse'));
    timeCore?.classList.remove('active');

    if(timeResult){
      timeResult.textContent = resultText;
      timeResult.classList.add('show');
      timeResult.classList.toggle('time-result-error', aiFailed);
    }

    if(timeStartBtn){ timeStartBtn.disabled = false; timeStartBtn.textContent = '시뮬레이션 시작 ▶'; }
    timeRunning = false;
  }

  if(timeBtn && timeOverlay){
    timeBtn.addEventListener('click', ()=>{ timeOverlay.hidden = false; });
    timeCloseBtn?.addEventListener('click', ()=>{ timeOverlay.hidden = true; });
    timeOverlay.addEventListener('click', (e)=>{ if(e.target === timeOverlay) timeOverlay.hidden = true; });
    timeStartBtn?.addEventListener('click', runTimeSimulation);
    timeYearInput?.addEventListener('input', ()=>{ if(timeInputError) timeInputError.textContent = ''; });
  }

  // Digital clock
  const WEEKDAY_KO = ['일','월','화','수','목','금','토'];
  function tickHoloClock(){
    if(!holoClockTime || !holoClockDate) return;
    const now = new Date();
    const pad = (n)=> String(n).padStart(2, '0');
    holoClockTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    holoClockDate.textContent = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} (${WEEKDAY_KO[now.getDay()]})`;
  }

  // =========================================================================
  // 3D HOLOGRAPHIC SPIDER-MAN LOGO (Three.js) — PARKER TECH / STARK HUD
  // =========================================================================
  function initSpiderHologram3D(){
    try{
      const canvas = document.getElementById('spiderCanvas');
      const pane = document.getElementById('spiderHoloPane');
      if(!canvas || typeof THREE === 'undefined') return false;

      const W = 220, H = 220;
      canvas.width = W;
      canvas.height = H;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, W / H, 1, 1000);
      camera.position.set(0, 0, 168);

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Spider-Man color palette (Nanotech Red + Electric Blue HUD accents)
      const spiderRed   = new THREE.Color('#ff2a4b');
      const spiderGlow  = new THREE.Color('#ff6b82');
      const spiderWhite = new THREE.Color('#ffffff');
      const spiderCyan  = new THREE.Color('#3fe3ff');

      function makeGlowSprite(){
        const s = 64;
        const c = document.createElement('canvas'); c.width = c.height = s;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.35, 'rgba(255,60,90,0.85)');
        g.addColorStop(1, 'rgba(255,20,50,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        return new THREE.CanvasTexture(c);
      }
      const sparkSprite = makeGlowSprite();

      // Main container rig
      const rig = new THREE.Group();
      scene.add(rig);

      // Procedural Spider-Man 3D Geometry
      const geometry = createSpiderLogoGeometry(THREE);
      geometry.computeBoundingBox();
      geometry.computeVertexNormals();

      const box = geometry.boundingBox;
      const center = new THREE.Vector3();
      box.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);
      const size = new THREE.Vector3();
      box.getSize(size);
      const longest = Math.max(size.x, size.y, size.z) || 1;
      const emblemScale = 72 / longest;

      // Emblem group inside rig
      const emblemGroup = new THREE.Group();
      emblemGroup.scale.setScalar(emblemScale);
      rig.add(emblemGroup);

      // 1. Translucent Volumetric Hologram Fill
      const fillMat = new THREE.MeshBasicMaterial({
        color: spiderRed,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const fillMesh = new THREE.Mesh(geometry, fillMat);
      emblemGroup.add(fillMesh);

      // 2. High-intensity Cyber Edges
      const edgeMat = new THREE.LineBasicMaterial({
        color: spiderGlow,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const edgesMesh = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 12), edgeMat);
      emblemGroup.add(edgesMesh);

      // 3. Delicate Wireframe lattice for holographic depth
      const wireMat = new THREE.LineBasicMaterial({
        color: spiderRed,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const wireMesh = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireMat);
      emblemGroup.add(wireMesh);

      // 4. Subtle Outer Holographic Halo Rim
      const rimMat = new THREE.MeshBasicMaterial({
        color: spiderRed,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide
      });
      const rimMesh = new THREE.Mesh(geometry, rimMat);
      rimMesh.scale.setScalar(1.05);
      emblemGroup.add(rimMesh);

      // 5. Spider-Man Stark HUD Targeting Reticle Rings
      const hudOuterRing = new THREE.Mesh(
        new THREE.TorusGeometry(47, 0.65, 8, 48),
        new THREE.MeshBasicMaterial({ color: spiderRed, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rig.add(hudOuterRing);

      const hudInnerRing = new THREE.Mesh(
        new THREE.TorusGeometry(35, 0.5, 8, 36),
        new THREE.MeshBasicMaterial({ color: spiderCyan, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      hudInnerRing.rotation.x = Math.PI / 3.8;
      rig.add(hudInnerRing);

      // 6. Spider Radar Web Radial Grid Lines
      const spokeGeo = new THREE.BufferGeometry();
      const spokeVerts = [];
      for(let a = 0; a < Math.PI * 2; a += Math.PI / 4){
        spokeVerts.push(0, 0, -2, Math.cos(a) * 47, Math.sin(a) * 47, -2);
      }
      spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(spokeVerts, 3));
      const webSpokes = new THREE.LineSegments(
        spokeGeo,
        new THREE.LineBasicMaterial({ color: spiderRed, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      rig.add(webSpokes);

      // 7. Ambient Nanite Spark Cloud (36 floating quantum sparks)
      const sparkCount = 36;
      const sparkPositions = new Float32Array(sparkCount * 3);
      const sparkOrbits = [];
      for(let i = 0; i < sparkCount; i++){
        const r = 24 + Math.random() * 45;
        const theta = Math.random() * Math.PI * 2;
        const tilt = (Math.random() - 0.5) * Math.PI * 0.8;
        const speed = (0.01 + Math.random() * 0.02) * (Math.random() < 0.5 ? 1 : -1);
        sparkOrbits.push({ r, theta, tilt, speed });
        sparkPositions[i*3]   = r * Math.cos(theta);
        sparkPositions[i*3+1] = r * Math.sin(theta) * Math.sin(tilt);
        sparkPositions[i*3+2] = r * Math.sin(theta) * Math.cos(tilt);
      }
      const sparkGeo = new THREE.BufferGeometry();
      sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
      const sparkMat = new THREE.PointsMaterial({
        color: spiderGlow,
        map: sparkSprite,
        size: 4.6,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });
      const sparkPts = new THREE.Points(sparkGeo, sparkMat);
      rig.add(sparkPts);

      // Interactive hover & cursor tracking
      let mouseX = 0, mouseY = 0;
      let isHovered = false;
      let pulseTimer = 0;

      if(pane){
        pane.addEventListener('mouseenter', ()=>{ isHovered = true; });
        pane.addEventListener('mouseleave', ()=>{ isHovered = false; mouseX = 0; mouseY = 0; });
        pane.addEventListener('mousemove', (e)=>{
          const rect = pane.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          mouseX = (e.clientX - cx) / (rect.width / 2);
          mouseY = (e.clientY - cy) / (rect.height / 2);
        });

        pane.addEventListener('click', ()=>{
          pulseTimer = 35;
          addMessage('sys', '🕷️ [PARKER TECH] Spider suit nanotech sync: 100% (Voice: EN / Subtitle: KO)');
          const holoMsg = addMessage('ev', '');
          const holoEN = 'Spider suit nanotech systems fully online and synchronized.';
          const holoKO = '스파이더 슈트 나노테크 시스템, 전 기능 정상 동기화 완료되었습니다.';
          renderEvBubble(holoMsg, { ko: holoKO, en: holoEN });
          speak(holoEN);
        });
      }

      let t = 0;

      function animate(){
        t += 0.015;

        // Smooth quantum levitation
        rig.position.y = Math.sin(t * 1.1) * 1.8;

        // Smooth 3D orbital continuous spin
        rig.rotation.y += 0.011;

        // Interactive mouse tilt with smooth spring lerp
        const targetRotX = isHovered ? -mouseY * 0.45 : Math.sin(t * 0.6) * 0.1;
        const targetRotZ = isHovered ? mouseX * 0.35 : Math.cos(t * 0.7) * 0.07;
        rig.rotation.x += (targetRotX - rig.rotation.x) * 0.08;
        rig.rotation.z += (targetRotZ - rig.rotation.z) * 0.08;

        // HUD Targeting Rings counter-rotation
        hudOuterRing.rotation.z += 0.012;
        hudInnerRing.rotation.z -= 0.016;
        hudInnerRing.rotation.y = Math.sin(t * 0.8) * 0.2;

        // Web radar grid gentle pulse
        webSpokes.rotation.z -= 0.008;

        // Hologram pulse flash on click or periodic diagnostic scan
        if(pulseTimer > 0){
          pulseTimer--;
          const flash = Math.sin(pulseTimer * 0.4) * 0.4;
          fillMat.opacity = 0.3 + flash;
          edgeMat.opacity = 0.95 + flash;
          emblemGroup.scale.setScalar(emblemScale * (1 + flash * 0.12));
        } else {
          fillMat.opacity = 0.28 + Math.sin(t * 1.8) * 0.06;
          edgeMat.opacity = 0.92 + Math.sin(t * 1.8) * 0.08;
          emblemGroup.scale.setScalar(emblemScale);
        }

        // Nanite particle orbits update
        const pArr = sparkGeo.attributes.position.array;
        for(let i = 0; i < sparkCount; i++){
          const orb = sparkOrbits[i];
          orb.theta += orb.speed;
          const idx = i * 3;
          pArr[idx]   = orb.r * Math.cos(orb.theta);
          pArr[idx+1] = orb.r * Math.sin(orb.theta) * Math.sin(orb.tilt) + Math.sin(t + i) * 1.2;
          pArr[idx+2] = orb.r * Math.sin(orb.theta) * Math.cos(orb.tilt);
        }
        sparkGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
      return true;
    }catch(e){
      return false;
    }
  }

  window.addEventListener('load', ()=>{
    initCore3D();
    initSpiderHologram3D();
    initSoccerStandings();
    tickHoloClock();
    setInterval(tickHoloClock, 1000);
    setTimeout(async ()=>{
      await activateSession();
    }, 200);
  });
})();
