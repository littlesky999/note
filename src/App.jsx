import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "for0608";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500&family=Caveat:wght@400;500&family=IM+Fell+English:ital@0;1&display=swap');`;

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .app {
    min-height: 100vh;
    background: #daeef8;
    background-image:
      radial-gradient(ellipse at 15% 0%, rgba(180,220,255,0.7) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 10%, rgba(200,235,255,0.5) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 100%, rgba(160,210,240,0.3) 0%, transparent 50%);
    font-family: 'Noto Serif TC', serif;
    color: #2a3a4a;
    position: relative;
    overflow-x: hidden;
  }

  .sky-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  }

  .content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 5rem; }

  .journal-header {
    text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(100,160,210,0.25);
    position: relative;
  }
  .journal-header h1 { font-family: 'IM Fell English', serif; font-size: 2.1rem; font-weight: 400; color: #2a5878; letter-spacing: 0.03em; }
  .journal-header .subtitle { font-family: 'Caveat', cursive; font-size: 1.1rem; color: #5a88a8; margin-top: 4px; }
  .date-stamp { font-size: 0.75rem; color: #7aa8c8; letter-spacing: 0.1em; margin-top: 6px; text-transform: uppercase; }

  .new-entry-card {
    background: rgba(255,255,255,0.72);
    border: 1px solid rgba(140,200,240,0.4);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    backdrop-filter: blur(2px);
    position: relative; overflow: hidden;
  }
  .card-deco-img { position: absolute; right: 10px; top: 8px; opacity: 0.22; pointer-events: none; }

  .section-label {
    font-family: 'Caveat', cursive; font-size: 1rem; color: #5a88a8;
    margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
  }
  .section-label .pill {
    font-size: 0.7rem; background: rgba(100,180,230,0.15); color: #3a6888;
    padding: 2px 9px; border-radius: 10px; font-family: 'Noto Serif TC', serif;
  }

  .datetime-row {
    display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;
  }
  .datetime-input {
    border: 1px solid rgba(100,180,230,0.35); background: rgba(255,255,255,0.8);
    border-radius: 8px; padding: 6px 10px;
    font-family: 'Noto Serif TC', serif; font-size: 0.82rem; color: #2a3a4a;
    outline: none; transition: border 0.15s;
  }
  .datetime-input:focus { border-color: rgba(80,160,220,0.6); }

  .note-textarea {
    width: 100%; min-height: 90px; border: none; background: transparent;
    font-family: 'Noto Serif TC', serif; font-size: 0.94rem; color: #2a3a4a;
    line-height: 1.9; resize: vertical; outline: none;
  }
  .note-textarea::placeholder { color: #9ac8e0; font-style: italic; }

  .bgm-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(100,180,230,0.25); flex-wrap: wrap; }
  .bgm-input {
    flex: 1; min-width: 150px; border: none; border-bottom: 1px solid rgba(100,180,230,0.3);
    background: transparent; font-family: 'Caveat', cursive; font-size: 1rem; color: #2a3a4a;
    padding: 2px 4px; outline: none;
  }
  .bgm-input::placeholder { color: #9ac8e0; }

  .mood-selector { display: flex; gap: 5px; }
  .mood-btn {
    width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid transparent;
    cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center;
    background: transparent; transition: all 0.15s;
  }
  .mood-btn:hover { transform: scale(1.2); }
  .mood-btn.active { border-color: #60a8d0; background: rgba(96,168,208,0.15); }

  .save-btn {
    margin-top: 14px; padding: 7px 22px; background: #4a90c0;
    color: white; border: none; border-radius: 20px; cursor: pointer;
    font-family: 'Noto Serif TC', serif; font-size: 0.85rem; letter-spacing: 0.06em;
    transition: all 0.2s;
  }
  .save-btn:hover { background: #2a6898; }
  .save-btn:disabled { background: #a8cce0; cursor: not-allowed; }

  /* Timeline */
  .timeline-section { margin-top: 0.5rem; }
  .tl-section-title {
    font-family: 'Caveat', cursive; font-size: 1rem; color: #6aa8c8;
    margin-bottom: 1.2rem; display: flex; align-items: center; gap: 8px;
  }
  .tl-section-title::after { content: ''; flex: 1; height: 1px; background: rgba(100,180,230,0.2); }

  .tl-day-group { margin-bottom: 0.4rem; }

  .tl-day-header {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    padding: 6px 0; user-select: none;
  }
  .tl-day-dot {
    width: 13px; height: 13px; border-radius: 50%; flex-shrink: 0;
    background: #70c0e8; border: 2px solid #daeef8;
    box-shadow: 0 0 0 1.5px rgba(80,160,220,0.4);
    position: relative; z-index: 2;
  }
  .tl-day-label { font-family: 'Caveat', cursive; font-size: 1.05rem; color: #3a6888; }
  .tl-day-count { font-size: 0.72rem; background: rgba(100,180,230,0.15); color: #5a8aaa; padding: 1px 7px; border-radius: 10px; }
  .tl-day-chevron { margin-left: auto; font-size: 11px; color: #80b8d8; transition: transform 0.22s; }
  .tl-day-chevron.open { transform: rotate(180deg); }

  .tl-entries {
    padding-left: 28px; border-left: 1px solid rgba(100,180,230,0.22);
    margin-left: 6px; overflow: hidden;
    max-height: 0; transition: max-height 0.38s ease, opacity 0.25s ease;
    opacity: 0;
  }
  .tl-entries.open { max-height: 5000px; opacity: 1; }

  .tl-entry {
    background: rgba(255,255,255,0.68);
    border: 1px solid rgba(140,200,240,0.3);
    border-radius: 10px;
    padding: 0.9rem 1rem;
    margin: 8px 0;
    position: relative;
    animation: fadeUp 0.25s ease;
  }
  .tl-entry::before {
    content: ''; position: absolute; left: -18px; top: 18px;
    width: 8px; height: 1px; background: rgba(100,180,230,0.3);
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  .tl-entry-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .tl-entry-time { font-family: 'Caveat', cursive; font-size: 0.9rem; color: #6aaac8; }
  .tl-entry-mood { font-size: 13px; }
  .tl-entry-body { font-size: 0.91rem; line-height: 1.82; color: #2a3a4a; white-space: pre-wrap; }
  .tl-entry-bgm { display: flex; align-items: center; gap: 5px; margin-top: 6px; font-family: 'Caveat', cursive; font-size: 0.86rem; color: #7aaac8; }
  .delete-btn { margin-left: auto; background: none; border: none; cursor: pointer; color: #b0d0e8; font-size: 12px; padding: 1px 5px; border-radius: 2px; transition: all 0.15s; }
  .delete-btn:hover { color: #a03020; background: rgba(160,48,32,0.07); }

  .empty-state { text-align: center; padding: 3rem 1rem; color: #80b8d8; font-family: 'IM Fell English', serif; font-style: italic; }

  /* Admin */
  .nav-admin { position: fixed; bottom: 24px; right: 24px; z-index: 50; }
  .admin-toggle-btn {
    background: rgba(60,120,180,0.8); color: white; border: none; border-radius: 50%;
    width: 44px; height: 44px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 14px rgba(60,120,180,0.3); transition: all 0.2s;
  }
  .admin-toggle-btn:hover { background: #2a6898; transform: scale(1.08); }

  .admin-overlay {
    position: fixed; inset: 0; background: rgba(20,50,80,0.6); z-index: 100;
    display: flex; align-items: center; justify-content: center;
  }
  .admin-panel {
    background: #f0f8ff; border: 1px solid rgba(100,180,230,0.3);
    border-radius: 12px; width: min(660px, 92vw); max-height: 85vh;
    overflow-y: auto; padding: 1.8rem;
    box-shadow: 0 24px 70px rgba(20,60,100,0.25);
  }
  .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.4rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(100,180,230,0.2); }
  .admin-header h2 { font-family: 'IM Fell English', serif; font-size: 1.3rem; color: #2a5878; }
  .close-btn { background: none; border: none; cursor: pointer; color: #80b8d8; font-size: 20px; }
  .close-btn:hover { color: #2a5878; }

  .login-form { display: flex; flex-direction: column; gap: 12px; max-width: 280px; margin: 2rem auto; }
  .login-form input { border: 1px solid rgba(100,180,230,0.3); background: white; padding: 8px 12px; font-family: 'Noto Serif TC', serif; font-size: 0.9rem; border-radius: 8px; outline: none; color: #2a3a4a; }
  .login-form button { padding: 8px; background: #4a90c0; color: white; border: none; border-radius: 20px; cursor: pointer; font-family: 'Noto Serif TC', serif; font-size: 0.88rem; }
  .login-form button:hover { background: #2a6898; }
  .login-error { font-size: 0.82rem; color: #a03020; text-align: center; }

  .visitor-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 1.4rem; }
  .stat-card { background: rgba(100,180,230,0.12); border-radius: 10px; padding: 12px; text-align: center; }
  .stat-num { font-family: 'IM Fell English', serif; font-size: 1.8rem; color: #2a6898; }
  .stat-label { font-size: 0.72rem; color: #6aaac8; letter-spacing: 0.06em; margin-top: 2px; text-transform: uppercase; }
  .vlist-header { display: grid; grid-template-columns: 1.2fr 2fr 1fr 1fr; gap: 8px; padding: 6px 8px; background: rgba(100,180,230,0.15); color: #4a7898; font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 6px; margin-bottom: 4px; }
  .vlist-row { display: grid; grid-template-columns: 1.2fr 2fr 1fr 1fr; gap: 8px; padding: 7px 8px; border-bottom: 1px solid rgba(100,180,230,0.1); color: #2a3a4a; align-items: center; }
  .vlist-row:hover { background: rgba(100,180,230,0.07); }
  .badge { font-size: 0.7rem; padding: 2px 7px; border-radius: 10px; background: rgba(100,180,230,0.15); color: #2a6898; }
  .badge.new-v { background: rgba(100,200,150,0.15); color: #1a7840; }
  .logout-btn { margin-top: 1.2rem; background: none; border: 1px solid rgba(100,180,230,0.25); color: #6aaac8; padding: 5px 14px; border-radius: 20px; cursor: pointer; font-size: 0.8rem; }
  .logout-btn:hover { background: rgba(100,180,230,0.1); }
  .saving-ind { font-family: 'Caveat', cursive; font-size: 0.9rem; color: #6aaac8; animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
`;

const MOODS = ["😊","😌","🤔","😴","✨","🌧️"];

function toLocalDatetimeValue(date) {
  const d = new Date(date);
  const pad = n => String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDate(d) {
  const date = new Date(d);
  const days = ["日","一","二","三","四","五","六"];
  return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,"0")}.${String(date.getDate()).padStart(2,"0")} 週${days[date.getDay()]}`;
}
function formatTime(d) {
  const date = new Date(d);
  return `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`;
}
function dateKey(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function getDevice(ua) {
  if (/Mobile|Android|iPhone/.test(ua)) return "手機";
  if (/iPad|Tablet/.test(ua)) return "平板";
  return "桌機";
}

const SkyBg = () => (
  <svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    {/* Sun */}
    <circle cx="140" cy="110" r="60" fill="#fff9c0" opacity="0.5"/>
    <circle cx="140" cy="110" r="40" fill="#ffe880" opacity="0.55"/>
    <circle cx="140" cy="110" r="28" fill="#ffd020" opacity="0.6"/>
    {/* Clouds */}
    <g opacity="0.82">
      <ellipse cx="380" cy="130" rx="90" ry="46" fill="white"/>
      <ellipse cx="320" cy="145" rx="55" ry="36" fill="white"/>
      <ellipse cx="440" cy="144" rx="60" ry="35" fill="white"/>
    </g>
    <g opacity="0.75">
      <ellipse cx="780" cy="90" rx="110" ry="52" fill="white"/>
      <ellipse cx="700" cy="104" rx="65" ry="40" fill="white"/>
      <ellipse cx="860" cy="102" rx="70" ry="40" fill="white"/>
    </g>
    <g opacity="0.65">
      <ellipse cx="1050" cy="160" rx="80" ry="40" fill="white"/>
      <ellipse cx="990" cy="172" rx="50" ry="30" fill="white"/>
      <ellipse cx="1110" cy="170" rx="55" ry="30" fill="white"/>
    </g>
    <g opacity="0.55">
      <ellipse cx="200" cy="200" rx="65" ry="32" fill="white"/>
      <ellipse cx="155" cy="210" rx="40" ry="24" fill="white"/>
      <ellipse cx="248" cy="208" rx="45" ry="24" fill="white"/>
    </g>
    {/* Birds */}
    <g fill="none" stroke="#8ab8d8" strokeWidth="1.6" strokeLinecap="round" opacity="0.55">
      <path d="M500 170 Q507 163 514 170"/>
      <path d="M520 165 Q527 158 534 165"/>
      <path d="M640 140 Q648 133 656 140"/>
      <path d="M662 144 Q670 137 678 144"/>
      <path d="M900 200 Q907 193 914 200"/>
      <path d="M300 240 Q307 233 314 240"/>
    </g>
    {/* Ground hills */}
    <ellipse cx="600" cy="560" rx="700" ry="120" fill="#b8daf0" opacity="0.18"/>
    {/* Tiny stars/sparkles */}
    <circle cx="250" cy="80" r="2" fill="#fff0a0" opacity="0.6"/>
    <circle cx="680" cy="55" r="1.8" fill="#fff0a0" opacity="0.5"/>
    <circle cx="950" cy="120" r="2" fill="#fff0a0" opacity="0.5"/>
    <circle cx="1100" cy="70" r="1.5" fill="#fff0a0" opacity="0.45"/>
  </svg>
);

// Inline deco for card corner
const DecoCloud = () => (
  <svg width="72" height="38" viewBox="0 0 72 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="36" cy="26" rx="30" ry="12" fill="#b8daf0"/>
    <ellipse cx="22" cy="22" rx="16" ry="14" fill="#b8daf0"/>
    <ellipse cx="48" cy="22" rx="18" ry="13" fill="#b8daf0"/>
    <ellipse cx="36" cy="16" rx="20" ry="14" fill="#cce8f8"/>
  </svg>
);

const DecoSun = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="10" fill="#ffe060" opacity="0.85"/>
    <circle cx="22" cy="22" r="7" fill="#ffd020" opacity="0.9"/>
    {[0,45,90,135,180,225,270,315].map((angle,i) => {
      const rad = angle * Math.PI / 180;
      const x1 = 22 + 12 * Math.cos(rad);
      const y1 = 22 + 12 * Math.sin(rad);
      const x2 = 22 + 17 * Math.cos(rad);
      const y2 = 22 + 17 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffd020" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>;
    })}
  </svg>
);

const DecoButterfly = () => (
  <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="10" cy="12" rx="9" ry="11" fill="#a8d8f0" opacity="0.7" transform="rotate(-20 10 12)"/>
    <ellipse cx="30" cy="12" rx="9" ry="11" fill="#a8d8f0" opacity="0.7" transform="rotate(20 30 12)"/>
    <ellipse cx="10" cy="22" rx="7" ry="8" fill="#c0e4f8" opacity="0.6" transform="rotate(15 10 22)"/>
    <ellipse cx="30" cy="22" rx="7" ry="8" fill="#c0e4f8" opacity="0.6" transform="rotate(-15 30 22)"/>
    <ellipse cx="20" cy="16" rx="2.5" ry="10" fill="#5a8ab0" opacity="0.5"/>
    <path d="M18 6 Q20 4 22 6" stroke="#5a8ab0" strokeWidth="1" fill="none" opacity="0.5"/>
  </svg>
);

export default function App() {
  const [entries, setEntries] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [bgm, setBgm] = useState("");
  const [mood, setMood] = useState("😊");
  const [entryDatetime, setEntryDatetime] = useState(toLocalDatetimeValue(new Date()));
  const [saving, setSaving] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState({});

  useEffect(() => {
    async function init() {
      try { const r = await window.storage.get("notes_entries"); if (r) setEntries(JSON.parse(r.value)); } catch {}
      try {
        const r = await window.storage.get("notes_visitors");
        const vis = r ? JSON.parse(r.value) : [];
        const visit = { id: Date.now(), time: new Date().toISOString(), ua: navigator.userAgent.slice(0,80), device: getDevice(navigator.userAgent), lang: navigator.language||"unknown" };
        const updated = [visit, ...vis].slice(0, 200);
        setVisitors(updated);
        await window.storage.set("notes_visitors", JSON.stringify(updated));
      } catch {}
      setLoaded(true);
    }
    init();
  }, []);

  async function saveEntry() {
    if (!noteText.trim()) return;
    setSaving(true);
    const entry = {
      id: Date.now(),
      date: new Date(entryDatetime).toISOString(),
      text: noteText.trim(), bgm: bgm.trim(), mood
    };
    const updated = [entry, ...entries].sort((a,b) => new Date(b.date) - new Date(a.date));
    setEntries(updated);
    try { await window.storage.set("notes_entries", JSON.stringify(updated)); } catch {}
    setNoteText(""); setBgm(""); setMood("😊");
    setEntryDatetime(toLocalDatetimeValue(new Date()));
    setSaving(false);
  }

  async function deleteEntry(id) {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    try { await window.storage.set("notes_entries", JSON.stringify(updated)); } catch {}
  }

  function toggleDay(key) {
    setCollapsedDays(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const grouped = entries.reduce((acc, e) => {
    const k = dateKey(e.date);
    if (!acc[k]) acc[k] = [];
    acc[k].push(e);
    return acc;
  }, {});
  const dayKeys = Object.keys(grouped).sort((a,b) => b.localeCompare(a));

  function handleAdminLogin() {
    if (pwInput === ADMIN_PASSWORD) { setAdminLoggedIn(true); setPwError(""); }
    else setPwError("密碼錯誤");
  }

  const today = new Date().toDateString();
  const todayVisitors = visitors.filter(v => new Date(v.time).toDateString() === today);

  if (!loaded) return (
    <div style={{minHeight:"100vh",background:"#daeef8",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"serif",color:"#6aaac8",fontSize:"0.9rem",fontStyle:"italic"}}>
      翻開今天…
    </div>
  );

  return (
    <>
      <style>{FONTS}{styles}</style>
      <div className="app">
        <div className="sky-bg"><SkyBg /></div>
        <div className="content">

          <div className="journal-header">
            <h1>Notes</h1>
            <div className="subtitle">發呆區 ☁</div>
            <div className="date-stamp">{formatDate(new Date())}</div>
          </div>

          <div className="new-entry-card">
            <div className="card-deco-img"><DecoCloud /></div>

            {/* Datetime picker */}
            <div className="section-label">
              <span className="pill">time
            </div>
            <div className="datetime-row">
              <input
                type="datetime-local"
                className="datetime-input"
                value={entryDatetime}
                onChange={e => setEntryDatetime(e.target.value)}
              />
              <button
                onClick={() => setEntryDatetime(toLocalDatetimeValue(new Date()))}
                style={{fontSize:"0.78rem",padding:"5px 12px",background:"rgba(100,180,230,0.15)",border:"1px solid rgba(100,180,230,0.3)",borderRadius:"8px",cursor:"pointer",color:"#4a7898",fontFamily:"'Noto Serif TC',serif"}}
              >
                現在
              </button>
            </div>

            <textarea
              className="note-textarea"
              placeholder="To begin with... ✦"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={4}
            />
            <div className="bgm-row">
              <span style={{fontSize:15,color:"#7aaac8"}}>♪</span>
              <input className="bgm-input" placeholder="Today's BGM " value={bgm} onChange={e=>setBgm(e.target.value)} />
              <div className="mood-selector">
                {MOODS.map(m => (
                  <button key={m} className={`mood-btn${mood===m?" active":""}`} onClick={()=>setMood(m)}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginTop:10}}>
              <button className="save-btn" onClick={saveEntry} disabled={saving||!noteText.trim()}>
                {saving ? "記錄中…" : "✦ 打卡"}
              </button>
              {saving && <span className="saving-ind">儲存中…</span>}
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-section">
            <div className="tl-section-title">timeline</div>

            {dayKeys.length === 0 && (
              <div className="empty-state">
                <div style={{marginBottom:12,opacity:0.5,display:"flex",justifyContent:"center",gap:16}}>
                  <DecoSun /><DecoButterfly />
                </div>
                Hello ✦
              </div>
            )}

            {dayKeys.map((key) => {
              const dayEntries = grouped[key];
              const actuallyOpen = collapsedDays[key] === undefined ? true : !collapsedDays[key];
              return (
                <div key={key} className="tl-day-group">
                  <div className="tl-day-header" onClick={()=>toggleDay(key)}>
                    <div className="tl-day-dot" />
                    <span className="tl-day-label">{formatDate(key + "T00:00:00")}</span>
                    <span className="tl-day-count">{dayEntries.length} 則</span>
                    <span className={`tl-day-chevron${actuallyOpen?" open":""}`}>▼</span>
                  </div>
                  <div className={`tl-entries${actuallyOpen?" open":""}`}>
                    {dayEntries.map(entry => (
                      <div key={entry.id} className="tl-entry">
                        <div className="tl-entry-meta">
                          <span className="tl-entry-time">{formatTime(entry.date)}</span>
                          <span className="tl-entry-mood">{entry.mood}</span>
                          <button className="delete-btn" onClick={e=>{e.stopPropagation();deleteEntry(entry.id);}}>✕</button>
                        </div>
                        <div className="tl-entry-body">{entry.text}</div>
                        {entry.bgm && <div className="tl-entry-bgm"><span>♪</span>{entry.bgm}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:"3rem",opacity:0.25}}>
            <DecoSun /><DecoCloud /><DecoButterfly />
          </div>
        </div>

        <div className="nav-admin">
          <button className="admin-toggle-btn" onClick={()=>setShowAdmin(true)} title="後台">⚿</button>
        </div>

        {showAdmin && (
          <div className="admin-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAdmin(false)}}>
            <div className="admin-panel">
              <div className="admin-header">
                <h2>後台 · 訪客紀錄</h2>
                <button className="close-btn" onClick={()=>setShowAdmin(false)}>✕</button>
              </div>
              {!adminLoggedIn ? (
                <div className="login-form">
                  <div style={{textAlign:"center",fontFamily:"'IM Fell English',serif",fontSize:"0.95rem",color:"#4a7898",fontStyle:"italic"}}>請輸入密碼進入後台</div>
                  <input type="password" placeholder="密碼" value={pwInput} onChange={e=>setPwInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()} />
                  {pwError && <div className="login-error">{pwError}</div>}
                  <button onClick={handleAdminLogin}>進入後台</button>
                  <div style={{fontSize:"0.75rem",color:"#80b8d8",textAlign:"center"}}>（預設密碼：for0608）</div>
                </div>
              ) : (
                <>
                  <div className="visitor-stats">
                    <div className="stat-card"><div className="stat-num">{visitors.length}</div><div className="stat-label">總訪客次數</div></div>
                    <div className="stat-card"><div className="stat-num">{todayVisitors.length}</div><div className="stat-label">今日造訪</div></div>
                    <div className="stat-card"><div className="stat-num">{entries.length}</div><div className="stat-label">打卡篇數</div></div>
                  </div>
                  <div style={{marginBottom:8,fontSize:"0.8rem",color:"#6aaac8"}}>最近造訪紀錄</div>
                  <div style={{fontSize:"0.82rem"}}>
                    <div className="vlist-header"><span>日期</span><span>User Agent</span><span>裝置</span><span>語言</span></div>
                    {visitors.slice(0,50).map((v,i)=>(
                      <div key={v.id} className="vlist-row">
                        <span style={{color:"#6aaac8",fontSize:"0.78rem"}}>{formatDate(v.time)}<br/>{formatTime(v.time)}</span>
                        <span style={{fontSize:"0.7rem",color:"#5a7a98",wordBreak:"break-all"}}>{v.ua.slice(0,48)}…</span>
                        <span><span className={`badge${i===0?" new-v":""}`}>{v.device}</span></span>
                        <span style={{fontSize:"0.78rem"}}>{v.lang}</span>
                      </div>
                    ))}
                  </div>
                  <button className="logout-btn" onClick={()=>setAdminLoggedIn(false)}>登出後台</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

