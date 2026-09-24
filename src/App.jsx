import { useMemo, useRef, useState } from "react";
import { playCurse, playFail, playTap, playWin } from "./audio.js";
import {
  BACK_LINES,
  CASES,
  PRIVACY_LINES,
  UPCHARGE,
  drawCase,
  poolForCustom,
  roastFor,
} from "./cases.js";
import "./App.css";

const STARTING_BILL = 34.4;

const PRESETS = [
  { id: "15", percent: 15, label: "Good" },
  { id: "18", percent: 18, label: "Great" },
  { id: "20", percent: 20, label: "Wow!" },
  { id: "30", percent: 30, label: "Best Service Ever!" },
];

function money(value) {
  return `$${value.toFixed(2)}`;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function App() {
  const [bill, setBill] = useState(STARTING_BILL);
  const [screen, setScreen] = useState("select");
  const [blocked, setBlocked] = useState({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [backPresses, setBackPresses] = useState(0);
  const [result, setResult] = useState(null);
  const [custom, setCustom] = useState("");
  const [shake, setShake] = useState(false);
  const [upcharged, setUpcharged] = useState(false);
  const decks = useRef({});

  const customAmount = Number.parseFloat(custom);
  const customReady = Number.isFinite(customAmount) && customAmount >= 0;
  const customPercent = customReady && bill > 0 ? (customAmount / bill) * 100 : 0;

  const customRoast = useMemo(
    () => roastFor(custom, customAmount, customPercent, customReady),
    [custom, customAmount, customPercent, customReady]
  );

  function flashNotice(text) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2400);
  }

  function bumpShake() {
    setShake(true);
    window.setTimeout(() => setShake(false), 420);
  }

  function goBack() {
    playTap();
    const next = backPresses + 1;
    setBackPresses(next);
    const line = BACK_LINES[(next - 1) % BACK_LINES.length];
    if (screen !== "select") {
      setScreen("select");
      setResult(null);
      flashNotice(line);
      return;
    }
    if (next === 1) {
      bumpShake();
      flashNotice(line);
      return;
    }
    const fee = next % 2 === 0 ? 1 : 1.5;
    setBill((current) => roundMoney(current + fee));
    bumpShake();
    flashNotice(`${line} Fee ${money(fee)}.`);
  }

  function finish(nextResult, sound) {
    setBusy(false);
    setResult(nextResult);
    setScreen("result");
    if (sound === "fail") playFail();
    else if (sound === "curse") playCurse();
    else playWin();
  }

  function present(drawn, tip, total) {
    const ctx = {
      tipText: money(tip),
      totalText: money(total),
      billText: money(bill),
      percentText: bill > 0 ? `${((tip / bill) * 100).toFixed(0)}%` : "0%",
    };
    if (drawn.gray) {
      setBlocked((current) => ({ ...current, [drawn.gray]: true }));
    }
    const sound = drawn.tone === "fail" ? "fail" : drawn.tone === "curse" ? "curse" : "win";
    finish(
      {
        tone: drawn.tone,
        title: drawn.title,
        lines: drawn.lines(ctx),
        tip,
        total,
        canUpcharge: Boolean(drawn.canUpcharge),
      },
      sound
    );
  }

  function charge(kind, amount, percent) {
    if (busy) return;
    playTap();
    setBusy(true);
    setScreen("processing");

    window.setTimeout(() => {
      const tip = roundMoney(Math.max(0, amount));
      const total = roundMoney(bill + tip);
      if (kind === "none" || tip <= 0) {
        present(drawCase(decks.current, "none", CASES.none), 0, bill);
        return;
      }
      if (kind === "custom") {
        const pool = poolForCustom(tip, percent);
        present(drawCase(decks.current, pool.id, pool.cases), tip, total);
        return;
      }
      present(drawCase(decks.current, kind, CASES[kind]), tip, total);
    }, 700);
  }

  function choosePreset(preset) {
    if (blocked[preset.id] || busy) return;
    const tip = roundMoney(bill * (preset.percent / 100));
    charge(preset.id, tip, preset.percent);
  }

  function chooseNone() {
    if (busy) return;
    charge("none", 0, 0);
  }

  function openCustom() {
    if (busy) return;
    playTap();
    setCustom("");
    setScreen("custom");
  }

  function submitCustom() {
    if (!customReady) {
      bumpShake();
      playFail();
      return;
    }
    charge("custom", roundMoney(customAmount), customPercent);
  }

  function pushKey(key) {
    playTap();
    setCustom((current) => {
      if (key === "del") return current.slice(0, -1);
      if (key === "." && current.includes(".")) return current;
      if (current.replace(".", "").length >= 6) return current;
      if (current === "0" && key !== ".") return key;
      return `${current}${key}`;
    });
  }

  function allowUpcharge() {
    playWin();
    const tip = roundMoney(bill * 0.45);
    const total = roundMoney(bill + tip);
    const drawn = drawCase(decks.current, "upcharge", UPCHARGE);
    setUpcharged(true);
    setResult({
      tone: drawn.tone,
      title: drawn.title,
      lines: drawn.lines({
        tipText: money(tip),
        totalText: money(total),
        billText: money(bill),
        percentText: "45%",
      }),
      tip,
      total,
    });
  }

  function resetCustomer() {
    playTap();
    decks.current = {};
    setBill(STARTING_BILL);
    setBlocked({});
    setBackPresses(0);
    setResult(null);
    setCustom("");
    setUpcharged(false);
    setScreen("select");
  }

  function anotherAmount() {
    playTap();
    setResult(null);
    setScreen("select");
  }

  return (
    <div className={`terminal ${shake ? "shake" : ""}`}>
      <div className="topbar">
        <button className="back" type="button" onClick={goBack} aria-label="Back">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M14.5 5.5 8 12l6.5 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="heading">
          <div className="title">Add a Tip</div>
          <div className="bill">YOUR BILL: {money(bill)}</div>
        </div>
        <div className="back spacer" />
      </div>

      {notice ? <div className="toast">{notice}</div> : null}

      {screen !== "custom" ? (
        <div className={`grid ${busy || screen === "result" ? "locked" : ""}`}>
          {PRESETS.map((preset) => {
            const dead = Boolean(blocked[preset.id]);
            return (
              <button
                key={preset.id}
                type="button"
                className={`tip ${dead ? "dead" : ""}`}
                disabled={dead || busy}
                onClick={() => choosePreset(preset)}
              >
                <div className="percent">{preset.percent}%</div>
                <div className="caption">{dead ? "Declined" : preset.label}</div>
              </button>
            );
          })}
          <button type="button" className="tip plain" disabled={busy} onClick={chooseNone}>
            <div className="plain-label">No Tip</div>
          </button>
          <button type="button" className="tip plain" disabled={busy} onClick={openCustom}>
            <div className="plain-label">Custom</div>
          </button>
        </div>
      ) : null}

      {screen === "custom" ? (
        <div className="custom">
          <div className={`amount ${shake ? "bad" : ""}`}>{custom ? money(customAmount || 0) : "$0.00"}</div>
          <div className="roast">{customRoast}</div>
          <div className="keys">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"].map((key) => (
              <button key={key} type="button" className="key" onClick={() => pushKey(key)}>
                {key === "del" ? "⌫" : key}
              </button>
            ))}
          </div>
          <button type="button" className="submit" onClick={submitCustom}>
            Tip this amount
          </button>
        </div>
      ) : null}

      {busy ? <div className="status">Authorizing generosity…</div> : null}

      {screen === "result" && result ? (
        <div className="scrim">
        <div className={`result ${result.tone}`}>
          <div className="result-kicker">
            {result.tone === "fail"
              ? "CARD READER"
              : result.tone === "curse"
                ? "CURSE APPLIED"
                : "RECEIPT"}
          </div>
          <div className="result-title">{result.title}</div>
          <div className="result-lines">
            {result.lines.map((line) => (
              <div key={line} className="result-line">
                {line}
              </div>
            ))}
          </div>
          {result.canUpcharge && !upcharged ? (
            <button type="button" className="submit" onClick={allowUpcharge}>
              Fine, make it 45%
            </button>
          ) : null}
          <div className="result-actions">
            <button type="button" className="ghost" onClick={anotherAmount}>
              {result.tone === "fail" || result.tone === "curse"
                ? "Choose another amount"
                : "Tip again, worse"}
            </button>
            <button type="button" className="ghost" onClick={resetCustomer}>
              Next customer
            </button>
          </div>
        </div>
        </div>
      ) : null}

      <button
        type="button"
        className="privacy"
        onClick={() => {
          playTap();
          flashNotice(PRIVACY_LINES[Math.floor(Math.random() * PRIVACY_LINES.length)]);
        }}
      >
        clover.com/privacy
      </button>
    </div>
  );
}

export default App;
