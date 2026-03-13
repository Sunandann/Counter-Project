import { useState, useRef } from "react";

const MIN = -99;
const MAX = 99;
const STEPS = [1, 5, 10];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

  body {
    background: #0d0d14 !important;
    font-family: 'Space Grotesk', system-ui, sans-serif !important;
    margin: 0 !important;
  }
  #root {
    width: 100% !important;
    max-width: 100% !important;
    border: none !important;
    text-align: left !important;
    background: transparent !important;
    display: block !important;
    min-height: unset !important;
  }

  .ctr-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #0d0d14;
    position: relative;
    overflow: hidden;
  }
  .orb1, .orb2 {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
  }
  .orb1 {
    top: -150px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 65%);
  }
  .orb2 {
    bottom: -100px; right: -80px;
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%);
  }

  .ctr-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 390px;
    background: rgba(18, 18, 30, 0.92);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 28px;
    padding: 36px 30px 30px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.025), 0 40px 80px rgba(0,0,0,0.65), 0 0 80px rgba(56,189,248,0.04);
    animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes cardIn {
    from { opacity:0; transform: translateY(24px) scale(0.97); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }

  /* TOP BAR */
  .ctr-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  .ctr-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(56,189,248,0.65);
  }
  .ctr-range {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 99px;
    padding: 4px 10px;
  }

  /* NUMBER */
  .ctr-display { text-align: center; margin-bottom: 24px; }
  .ctr-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 96px;
    font-weight: 300;
    letter-spacing: -6px;
    line-height: 1;
    color: #f1f5f9;
    display: inline-block;
    padding: 0 8px;
    transition: color 0.25s ease;
  }
  .ctr-num.pos { color: #86efac; }
  .ctr-num.neg { color: #fca5a5; }
  .ctr-num.up   { animation: numUp   0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .ctr-num.down { animation: numDown 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .ctr-num.rst  { animation: numRst  0.32s ease; }
  @keyframes numUp   { 0%{transform:translateY(0) scale(1)} 45%{transform:translateY(-14px) scale(1.08)} 100%{transform:translateY(0) scale(1)} }
  @keyframes numDown { 0%{transform:translateY(0) scale(1)} 45%{transform:translateY(12px) scale(0.93)} 100%{transform:translateY(0) scale(1)} }
  @keyframes numRst  { 0%{transform:scale(1);opacity:1} 35%{transform:scale(0.7);opacity:0.1} 100%{transform:scale(1);opacity:1} }

  /* TRACK */
  .ctr-track-row { display:flex; align-items:center; gap:9px; margin-top:10px; }
  .ctr-track-lbl { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(255,255,255,0.18); width:22px; text-align:center; }
  .ctr-track { flex:1; height:3px; background:rgba(255,255,255,0.06); border-radius:99px; position:relative; overflow:visible; }
  .ctr-track-fill { height:100%; border-radius:99px; transition: width 0.38s cubic-bezier(0.22,1,0.36,1), background 0.3s; position:relative; }
  .ctr-track-dot { position:absolute; right:-4px; top:50%; transform:translateY(-50%); width:8px; height:8px; border-radius:50%; }

  /* STEP */
  .ctr-section { margin-bottom:18px; }
  .ctr-slabel { font-size:10px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.18); margin-bottom:9px; display:block; }
  .ctr-steps { display:flex; gap:7px; }
  .ctr-step {
    flex:1; font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:500;
    padding:10px 0; border-radius:10px; border:1px solid rgba(255,255,255,0.07);
    background:rgba(255,255,255,0.03); color:rgba(255,255,255,0.3); cursor:pointer;
    transition:all 0.16s ease;
  }
  .ctr-step:hover { background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.65); }
  .ctr-step.on { background:rgba(56,189,248,0.1); border-color:rgba(56,189,248,0.35); color:#38bdf8; box-shadow:0 0 14px rgba(56,189,248,0.1); }

  /* BUTTONS */
  .ctr-btns { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; }
  .ctr-btn {
    font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:600;
    padding:18px 12px; border-radius:14px; border:1px solid transparent;
    cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:5px;
    transition:all 0.18s cubic-bezier(0.22,1,0.36,1);
  }
  .ctr-btn .ico { font-size:22px; font-weight:300; line-height:1; }
  .ctr-btn:active:not(:disabled) { transform:scale(0.95) !important; }
  .ctr-btn:disabled { opacity:0.2; cursor:not-allowed; transform:none !important; box-shadow:none !important; }

  .inc { background:rgba(134,239,172,0.08); border-color:rgba(134,239,172,0.18); color:#86efac; }
  .inc:hover:not(:disabled) { background:rgba(134,239,172,0.15); border-color:rgba(134,239,172,0.38); transform:translateY(-3px); box-shadow:0 8px 24px rgba(134,239,172,0.1); }

  .dec { background:rgba(252,165,165,0.08); border-color:rgba(252,165,165,0.18); color:#fca5a5; }
  .dec:hover:not(:disabled) { background:rgba(252,165,165,0.15); border-color:rgba(252,165,165,0.38); transform:translateY(-3px); box-shadow:0 8px 24px rgba(252,165,165,0.1); }

  .rst-btn {
    grid-column:1/-1; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500;
    letter-spacing:0.04em; padding:13px; border-radius:12px;
    border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.03);
    color:rgba(255,255,255,0.28); cursor:pointer; transition:all 0.16s;
    display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .rst-btn:hover:not(:disabled) { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); }
  .rst-btn:disabled { opacity:0.2; cursor:not-allowed; }

  /* HISTORY */
  .ctr-hist { margin-top:22px; border-top:1px solid rgba(255,255,255,0.06); padding-top:16px; }
  .hist-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
  .hist-clr { font-family:'Space Grotesk',sans-serif; font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; background:none; border:none; color:rgba(255,255,255,0.18); cursor:pointer; transition:color 0.15s; }
  .hist-clr:hover { color:#fca5a5; }
  .hist-list { display:flex; flex-direction:column; gap:4px; max-height:148px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.08) transparent; }
  .hist-row { display:flex; justify-content:space-between; align-items:center; padding:7px 10px; background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.04); border-radius:8px; animation:hIn 0.17s ease both; }
  @keyframes hIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  .hist-op { font-family:'JetBrains Mono',monospace; font-size:12px; color:rgba(255,255,255,0.28); }
  .hist-v { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:500; }
  .hist-v.p { color:#86efac; }
  .hist-v.n { color:#fca5a5; }
  .hist-v.z { color:rgba(255,255,255,0.22); }
  .hist-empty { text-align:center; font-family:'JetBrains Mono',monospace; font-size:11px; color:rgba(255,255,255,0.14); padding:10px 0; letter-spacing:0.05em; }
`;

export default function App() {
  const [count,   setCount]   = useState(0);
  const [step,    setStep]    = useState(1);
  const [history, setHistory] = useState([]);
  const [anim,    setAnim]    = useState("");
  const timer = useRef(null);

  const fire = (type) => {
    clearTimeout(timer.current);
    setAnim("");
    requestAnimationFrame(() => {
      setAnim(type);
      timer.current = setTimeout(() => setAnim(""), 360);
    });
  };

  const log = (op, val) =>
    setHistory(h => [{ op, val, id: Date.now() + Math.random() }, ...h].slice(0, 12));

  const inc = () => {
    const n = Math.min(count + step, MAX);
    if (n === count) return;
    setCount(n); fire("up"); log(`+${step}`, n);
  };
  const dec = () => {
    const n = Math.max(count - step, MIN);
    if (n === count) return;
    setCount(n); fire("down"); log(`−${step}`, n);
  };
  const rst = () => {
    if (!count) return;
    setCount(0); fire("rst"); log("reset", 0);
  };

  const pct = ((count - MIN) / (MAX - MIN)) * 100;
  const fill = count > 0 ? "#86efac" : count < 0 ? "#fca5a5" : "rgba(255,255,255,0.14)";
  const nc = count > 0 ? "pos" : count < 0 ? "neg" : "";

  return (
    <>
      <style>{css}</style>
      <div className="ctr-shell">
        <div className="orb1" /><div className="orb2" />

        <div className="ctr-card">
          <div className="ctr-topbar">
            <span className="ctr-title">Counter</span>
            <span className="ctr-range">{MIN} → {MAX}</span>
          </div>

          <div className="ctr-display">
            <span className={`ctr-num ${nc} ${anim}`}>{count}</span>
            <div className="ctr-track-row">
              <span className="ctr-track-lbl">{MIN}</span>
              <div className="ctr-track">
                <div className="ctr-track-fill" style={{ width:`${pct}%`, background: fill }}>
                  <div className="ctr-track-dot" style={{ background: fill, boxShadow:`0 0 7px ${fill}` }} />
                </div>
              </div>
              <span className="ctr-track-lbl">{MAX}</span>
            </div>
          </div>

          <div className="ctr-section">
            <span className="ctr-slabel">Step Size</span>
            <div className="ctr-steps">
              {STEPS.map(s => (
                <button key={s} className={`ctr-step ${step===s?"on":""}`} onClick={()=>setStep(s)}>
                  ×{s}
                </button>
              ))}
            </div>
          </div>

          <div className="ctr-btns">
            <button className="ctr-btn inc" onClick={inc} disabled={count >= MAX}>
              <span className="ico">＋</span>Increment
            </button>
            <button className="ctr-btn dec" onClick={dec} disabled={count <= MIN}>
              <span className="ico">－</span>Decrement
            </button>
            <button className="rst-btn" onClick={rst} disabled={!count}>
              ↺ Reset to zero
            </button>
          </div>

          <div className="ctr-hist">
            <div className="hist-head">
              <span className="ctr-slabel" style={{marginBottom:0}}>History</span>
              {history.length > 0 && (
                <button className="hist-clr" onClick={()=>setHistory([])}>Clear</button>
              )}
            </div>
            <div className="hist-list">
              {history.length === 0
                ? <p className="hist-empty">— no actions yet —</p>
                : history.map(h => (
                    <div key={h.id} className="hist-row">
                      <span className="hist-op">{h.op}</span>
                      <span className={`hist-v ${h.val>0?"p":h.val<0?"n":"z"}`}>
                        {h.val > 0 ? `+${h.val}` : h.val}
                      </span>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}