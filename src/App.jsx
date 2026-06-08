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
