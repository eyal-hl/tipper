import { useMemo, useState } from "react";
import { playCurse, playFail, playTap, playWin } from "./audio.js";
import "./App.css";

const STARTING_BILL = 34.4;
const FAIL_CHANCE = 0.32;

const PRESETS = [
  { id: "15", percent: 15, label: "Good" },
  { id: "18", percent: 18, label: "Great" },
  { id: "20", percent: 20, label: "Wow!" },
  { id: "30", percent: 30, label: "Best Service Ever!" },
];

const CURSES = [
  "Your fries will arrive cold, on purpose.",
  "Every charger you own works at exactly one angle.",
  "Your phone battery will live at 9%.",
  "Autocorrect changes \"ok\" into \"20% is fine\".",
  "The next tip screen starts at 30% and judges you.",
  "Your favorite show will buffer during the joke.",
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

  const customAmount = Number.parseFloat(custom);
  const customReady = Number.isFinite(customAmount) && customAmount >= 0;
  const customPercent = customReady && bill > 0 ? (customAmount / bill) * 100 : 0;

  const customRoast = useMemo(() => {
    if (!custom) return "Type a number. The machine is watching.";
    if (!customReady) return "That is not a number. Bold strategy.";
    if (customAmount === 0) return "Zero. The curse department just clocked in.";
    if (customPercent < 15) return `${customPercent.toFixed(0)}%. The reader is already side-eyeing you.`;
    if (customPercent < 18) return "Barely legal generosity. It might bounce.";
    if (customPercent < 25) return "Respectable. The server's eyebrow went up.";
    if (customPercent < 50) return "Oh we are doing philanthropy now.";
    if (customAmount < 200) return "The owner is refreshing the boat listings.";
    return "That is not a tip. That is a down payment.";
  }, [custom, customAmount, customPercent, customReady]);

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
    if (screen !== "select") {
      setScreen("select");
      setResult(null);
      flashNotice("You can leave the screen. You cannot leave the bit.");
      return;
    }
    if (next === 1) {
      bumpShake();
      flashNotice("There is no back. There is only tip.");
      return;
    }
    const fee = next === 2 ? 1 : 1.5;
    setBill((current) => roundMoney(current + fee));
    bumpShake();
    flashNotice(
      next === 2
        ? `Loitering fee added. Bill is now higher. ${money(fee)}.`
        : `Still here. Emotional damage fee ${money(fee)}.`
    );
  }

  function finish(nextResult, sound) {
    setBusy(false);
    setResult(nextResult);
    setScreen("result");
    if (sound === "fail") playFail();
    else if (sound === "curse") playCurse();
    else playWin();
  }

  function charge(kind, amount, percent) {
    if (busy) return;
    playTap();
    setBusy(true);
    setScreen("processing");
    setResult({
      tone: "wait",
      title: "Authorizing generosity",
      lines: [`Holding ${money(amount)} hostage for a second.`],
    });

    window.setTimeout(() => {
      if (kind === "none" || amount <= 0) {
        finish(
          {
            tone: "curse",
            title: "No tip detected",
            lines: [
              "A curse has been placed on your afternoon.",
              ...CURSES,
              "It lifts if you pick a real amount. Allegedly.",
            ],
          },
          "curse"
        );
        return;
      }

      const cheap =
        (kind === "15" && !blocked["15"] && Math.random() < FAIL_CHANCE) ||
        (kind === "custom" && percent < 15) ||
        (kind === "custom" && blocked["15"] && Math.abs(percent - 15) < 0.6);

      if (cheap) {
        if (kind === "15" || (kind === "custom" && Math.abs(percent - 15) < 0.6)) {
          setBlocked((current) => ({ ...current, "15": true }));
        }
        finish(
          {
            tone: "fail",
            title: "Payment failed",
            lines:
              kind === "15"
                ? [
                    "15% was declined for being the cheapest button.",
                    "That amount is grayed out now.",
                    "Pick something the card reader can respect.",
                  ]
                : [
                    `${money(amount)} bounced. The terminal knows a loophole when it sees one.`,
                    "15% is retired. Aim higher.",
                  ],
          },
          "fail"
        );
        return;
      }

      const tip = roundMoney(amount);
      const total = roundMoney(bill + tip);
      finish(receiptFor(kind, percent, tip, total), "win");
    }, 850);
  }

  function receiptFor(kind, percent, tip, total) {
    if (percent >= 100 || tip >= 200) {
      return {
        tone: "legend",
        title: "Security hold",
        lines: [
          `${money(tip)} on a ${money(bill)} bill.`,
          "The owner already left for the boat dealership.",
          `Total theoretically ${money(total)}. Spiritually, you bought the restaurant.`,
        ],
        tip,
        total,
      };
    }
    if (percent >= 30 || kind === "30") {
      return {
        tone: "wow",
        title: "Best service ever",
        lines: [
          `Tip ${money(tip)}. Total ${money(total)}.`,
          "A busser just named a kayak after you.",
          "The terminal wanted to bump this to 45%. You can allow it, if you are that kind of myth.",
        ],
        tip,
        total,
        canUpcharge: true,
      };
    }
    if (percent >= 20) {
      return {
        tone: "wow",
        title: "Wow",
        lines: [
          `Tip ${money(tip)}. Total ${money(total)}.`,
          "You have been removed from the group chat titled bad tippers.",
          "The server practiced this exact face in the walk-in.",
        ],
        tip,
        total,
      };
    }
    if (percent >= 18) {
      return {
        tone: "mid",
        title: "Great",
        lines: [
          `Tip ${money(tip)}. Total ${money(total)}.`,
          "Great is what people say when it is not wow.",
          "The kitchen will describe you as fine.",
        ],
        tip,
        total,
      };
    }
    return {
      tone: "mid",
      title: "Good",
      lines: [
        `Tip ${money(tip)}. Total ${money(total)}.`,
        "It went through. The card reader sighed.",
        "Good, which is the compliment you give a parking spot.",
      ],
      tip,
      total,
    };
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
    if (!result?.tip) return;
    playWin();
    const tip = roundMoney(bill * 0.45);
    const total = roundMoney(bill + tip);
    setUpcharged(true);
    setResult({
      tone: "legend",
      title: "45%. Obviously.",
      lines: [
        `Tip ${money(tip)}. Total ${money(total)}.`,
        "The special is now just your name in ketchup.",
        "A manager is crying in a productive way.",
      ],
      tip,
      total,
    });
  }

  function resetCustomer() {
    playTap();
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
          flashNotice("We already know. We saw you look at No Tip.");
        }}
      >
        clover.com/privacy
      </button>
    </div>
  );
}

export default App;
