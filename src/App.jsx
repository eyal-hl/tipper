import { useEffect, useMemo, useRef, useState } from "react";
import { playCurse, playFail, playTap, playWin } from "./audio.js";
import {
  BACK_LINES,
  CASES,
  CREEP_LINES,
  DODGE_LINES,
  EIGHTEEN_FAILS,
  PRIVACY_LINES,
  UPCHARGE,
  WORSE,
  drawCase,
  poolForCustom,
  roastFor,
  verdictFor,
} from "./cases.js";
import "./App.css";

const FOOD = { burger: 18, fries: 7.4, drink: 4 };
const START_AUDACITY = 5;
const DESSERT_PRICE = 8.5;
const CREEP_PERCENTS = [
  [15, 18, 20, 30],
  [18, 20, 22, 32],
  [20, 25, 28, 35],
];
const PRESETS = [
  { id: "15", label: "Good" },
  { id: "18", label: "Great" },
  { id: "20", label: "Wow!" },
  { id: "30", label: "Best Service Ever!" },
];
const MEAN_LABELS = {
  "15": "Insulting",
  "18": "Still rude",
  "20": "Cope",
  "30": "You owe this",
};

function money(value) {
  return `$${value.toFixed(2)}`;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function emptyStats() {
  return { tips: [], curses: 0, declines: 0 };
}

function App() {
  const [audacity, setAudacity] = useState(START_AUDACITY);
  const [dessert, setDessert] = useState(0);
  const [round, setRound] = useState(1);
  const [screen, setScreen] = useState("select");
  const [blocked, setBlocked] = useState({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [backPresses, setBackPresses] = useState(0);
  const [result, setResult] = useState(null);
  const [custom, setCustom] = useState("");
  const [shake, setShake] = useState(false);
  const [upcharged, setUpcharged] = useState(false);
  const [creep, setCreep] = useState(0);
  const [poke, setPoke] = useState(0);
  const [checkOpen, setCheckOpen] = useState(false);
  const [noTipFirst, setNoTipFirst] = useState(true);
  const [noTipDodges, setNoTipDodges] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const [stats, setStats] = useState(emptyStats);
  const [report, setReport] = useState(null);
  const decks = useRef({});
  const noticeTimer = useRef(0);
  const stareTimer = useRef(0);
  const dodgeLock = useRef(false);

  const bill = roundMoney(FOOD.burger + FOOD.fries + FOOD.drink + audacity + dessert);
  const mean = Boolean(blocked["15"]);
  const shownPresets = PRESETS.map((preset, index) => ({
    ...preset,
    percent: CREEP_PERCENTS[creep][index],
    label: mean ? MEAN_LABELS[preset.id] : preset.label,
  }));

  const customAmount = Number.parseFloat(custom);
  const customReady = Number.isFinite(customAmount) && customAmount >= 0;
  const customPercent = customReady && bill > 0 ? (customAmount / bill) * 100 : 0;
  const customRoast = useMemo(
    () => roastFor(custom, customAmount, customPercent, customReady),
    [custom, customAmount, customPercent, customReady]
  );

  useEffect(() => {
    document.body.classList.toggle("mean", mean);
    return () => document.body.classList.remove("mean");
  }, [mean]);

  useEffect(() => {
    const query = window.matchMedia("(orientation: portrait)");
    const apply = () => setPortrait(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (screen !== "select" || checkOpen || creep >= 2) return undefined;
    const id = window.setTimeout(() => {
      setCreep((current) => {
        const next = Math.min(2, current + 1);
        return next;
      });
      setNotice(CREEP_LINES[creep]);
      window.clearTimeout(noticeTimer.current);
      noticeTimer.current = window.setTimeout(() => setNotice(""), 2600);
    }, 4500);
    return () => window.clearTimeout(id);
  }, [screen, checkOpen, creep, poke]);

  function flashNotice(text) {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 2600);
  }

  function bumpShake() {
    setShake(true);
    window.setTimeout(() => setShake(false), 420);
  }

  function noteTip(percent, title, tip, tone) {
    setStats((current) => {
      const next = {
        tips: current.tips.slice(),
        curses: current.curses,
        declines: current.declines,
      };
      if (tone === "curse") next.curses += 1;
      else if (tone === "fail") next.declines += 1;
      else next.tips.push({ percent, title, tip });
      return next;
    });
  }

  function goBack() {
    playTap();
    setPoke((value) => value + 1);
    const next = backPresses + 1;
    setBackPresses(next);
    const line = BACK_LINES[(next - 1) % BACK_LINES.length];
    if (screen !== "select") {
      setScreen("select");
      setResult(null);
      setCheckOpen(false);
      flashNotice(line);
      return;
    }
    if (next === 1) {
      bumpShake();
      flashNotice(line);
      return;
    }
    const fee = next % 2 === 0 ? 1 : 1.5;
    setAudacity((current) => roundMoney(current + fee));
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

  function present(drawn, tip, total, percent) {
    const ctx = {
      tipText: money(tip),
      totalText: money(total),
      billText: money(bill),
      percentText: bill > 0 ? `${((tip / bill) * 100).toFixed(0)}%` : "0%",
    };
    if (drawn.gray) setBlocked((current) => ({ ...current, [drawn.gray]: true }));
    if (drawn.tone === "curse" || drawn.tone === "fail") {
      setAudacity((current) => roundMoney(current + 1));
    }
    noteTip(percent, drawn.title, tip, drawn.tone);
    const sound = drawn.tone === "fail" ? "fail" : drawn.tone === "curse" ? "curse" : "win";
    finish(
      {
        tone: drawn.tone,
        title: drawn.title,
        lines: drawn.lines(ctx),
        tip,
        total,
        percent,
        canUpcharge: Boolean(drawn.canUpcharge),
        offerDessert: drawn.tone !== "fail" && drawn.tone !== "curse" && round === 1,
      },
      sound
    );
  }

  function charge(buttonId, amount, percent) {
    if (busy) return;
    playTap();
    setPoke((value) => value + 1);
    setCheckOpen(false);
    setBusy(true);
    setScreen("processing");

    window.setTimeout(() => {
      const tip = roundMoney(Math.max(0, amount));
      const total = roundMoney(bill + tip);
      if (buttonId === "none" || tip <= 0) {
        const pool = round >= 2 ? WORSE : CASES.none;
        const id = round >= 2 ? "worse" : "none";
        present(drawCase(decks.current, id, pool), 0, bill, 0);
        return;
      }
      if (buttonId === "18" && blocked["15"] && Math.random() < 0.45) {
        present(drawCase(decks.current, "18-fail", EIGHTEEN_FAILS), tip, total, percent);
        return;
      }
      if (buttonId === "custom") {
        const pool = poolForCustom(tip, percent);
        present(drawCase(decks.current, pool.id, pool.cases), tip, total, percent);
        return;
      }
      const poolId = percent >= 28 ? "30" : percent >= 20 ? "20" : percent >= 18 ? "18" : "15";
      present(drawCase(decks.current, poolId, CASES[poolId]), tip, total, percent);
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

  function dodgeNoTip() {
    if (dodgeLock.current || noTipDodges >= 3 || busy) return;
    dodgeLock.current = true;
    const next = noTipDodges + 1;
    setNoTipDodges(next);
    setNoTipFirst((current) => !current);
    setAudacity((current) => roundMoney(current + 0.5));
    flashNotice(DODGE_LINES[Math.min(next - 1, DODGE_LINES.length - 1)]);
    window.setTimeout(() => {
      dodgeLock.current = false;
    }, 480);
  }

  function openCustom() {
    if (busy) return;
    playTap();
    setPoke((value) => value + 1);
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
    noteTip(45, drawn.title, tip, drawn.tone);
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
      percent: 45,
      offerDessert: round === 1,
    });
  }

  function serveDessert() {
    playTap();
    setDessert(DESSERT_PRICE);
    setRound(2);
    setResult(null);
    setUpcharged(false);
    setScreen("select");
    flashNotice("Cake hit the table. You have to tip again.");
  }

  function anotherAmount() {
    playTap();
    setResult(null);
    setScreen("select");
  }

  function openReport() {
    playTap();
    setReport(verdictFor({ ...stats, round }));
    setResult(null);
    setScreen("report");
  }

  function resetCustomer() {
    playTap();
    decks.current = {};
    setAudacity(START_AUDACITY);
    setDessert(0);
    setRound(1);
    setBlocked({});
    setBackPresses(0);
    setResult(null);
    setCustom("");
    setUpcharged(false);
    setCreep(0);
    setNoTipFirst(true);
    setNoTipDodges(0);
    setStats(emptyStats());
    setReport(null);
    setCheckOpen(false);
    setScreen("select");
  }

  function startStare(label) {
    window.clearTimeout(stareTimer.current);
    stareTimer.current = window.setTimeout(() => {
      flashNotice(`Two seconds on ${label}. The reader felt that.`);
    }, 2000);
  }

  function endStare() {
    window.clearTimeout(stareTimer.current);
  }

  const noTipButton = (
    <button
      key="none"
      type="button"
      className="tip plain runner"
      style={{ transform: `scale(${1 - noTipDodges * 0.12})` }}
      disabled={busy}
      onPointerEnter={() => {
        if (noTipDodges < 3) dodgeNoTip();
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        if (noTipDodges >= 3) chooseNone();
      }}
    >
      <div className="plain-label">No Tip</div>
    </button>
  );

  const customButton = (
    <button key="custom" type="button" className="tip plain" disabled={busy} onClick={openCustom}>
      <div className="plain-label">Custom</div>
    </button>
  );

  return (
    <div
      className={`terminal ${shake ? "shake" : ""} ${mean ? "mean" : ""}`}
      onPointerDown={() => setPoke((value) => value + 1)}
    >
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
          <div className="title">{round === 2 ? "Tip again" : "Add a Tip"}</div>
          <button type="button" className="bill" onClick={() => { playTap(); setCheckOpen(true); }}>
            YOUR BILL: {money(bill)}
          </button>
        </div>
        <div className="back spacer" />
      </div>

      {notice ? <div className="toast">{notice}</div> : null}

      {screen !== "custom" && screen !== "report" ? (
        <div className={`grid ${busy || screen === "result" || checkOpen ? "locked" : ""}`}>
          {shownPresets.map((preset) => {
            const dead = Boolean(blocked[preset.id]);
            return (
              <button
                key={preset.id}
                type="button"
                className={`tip ${dead ? "dead" : ""}`}
                disabled={dead || busy}
                onPointerDown={() => startStare(`${preset.percent}%`)}
                onPointerUp={endStare}
                onPointerLeave={endStare}
                onPointerCancel={endStare}
                onClick={() => choosePreset(preset)}
              >
                <div className="percent">{preset.percent}%</div>
                <div className="caption">{dead ? "Declined" : preset.label}</div>
              </button>
            );
          })}
          {noTipFirst ? noTipButton : customButton}
          {noTipFirst ? customButton : noTipButton}
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

      {screen === "report" && report ? (
        <div className="result report">
          <div className="result-kicker">REPORT CARD</div>
          <div className="result-title">{report}</div>
          <div className="result-lines">
            <div className="result-line">
              {stats.tips.length
                ? stats.tips.map((tip) => `${tip.percent}% ${tip.title}`).join(" · ")
                : "No successful tip."}
            </div>
            <div className="result-line">
              Curses {stats.curses}. Declines {stats.declines}. Round {round}.
            </div>
          </div>
          <button type="button" className="submit" onClick={resetCustomer}>
            Seat the next table
          </button>
        </div>
      ) : null}

      {busy ? <div className="status">Authorizing generosity…</div> : null}

      {checkOpen ? (
        <div className="scrim">
          <div className="result check">
            <div className="result-kicker">CHECK</div>
            <div className="result-title">The bill</div>
            <div className="result-lines">
              <div className="result-line">Burger {money(FOOD.burger)}</div>
              <div className="result-line">Fries {money(FOOD.fries)}</div>
              <div className="result-line">Drink {money(FOOD.drink)}</div>
              <div className="result-line">The audacity {money(audacity)}</div>
              {dessert > 0 ? <div className="result-line">Cake {money(dessert)}</div> : null}
              <div className="result-line">Total {money(bill)}</div>
            </div>
            <button type="button" className="ghost" onClick={() => setCheckOpen(false)}>
              Back to the buttons
            </button>
          </div>
        </div>
      ) : null}

      {screen === "result" && result ? (
        <div className="scrim">
          <div className={`result ${result.tone}`}>
            <div className="result-kicker">
              {result.tone === "fail" ? "CARD READER" : result.tone === "curse" ? "CURSE APPLIED" : "RECEIPT"}
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
              {result.offerDessert ? (
                <button type="button" className="ghost" onClick={serveDessert}>
                  Dessert landed. Tip again
                </button>
              ) : (
                <button type="button" className="ghost" onClick={anotherAmount}>
                  {result.tone === "fail" || result.tone === "curse" ? "Choose another amount" : "Tip again, worse"}
                </button>
              )}
              <button type="button" className="ghost" onClick={openReport}>
                Next customer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {portrait ? (
        <div className="portrait-gate">
          <div className="result-kicker">WRONG WAY</div>
          <div className="result-title">Put it back on the counter.</div>
          <div className="result-line">Sideways is the only way this machine cooperates.</div>
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
