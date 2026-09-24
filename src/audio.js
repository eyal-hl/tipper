let ctx;

function context() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function beep(steps) {
  const audio = context();
  if (!audio) return;
  const now = audio.currentTime;
  steps.forEach((step, index) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = step.type || "sine";
    osc.frequency.value = step.freq;
    gain.gain.setValueAtTime(0.0001, now);
    const start = now + step.at;
    gain.gain.exponentialRampToValueAtTime(step.volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + step.dur);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(start);
    osc.stop(start + step.dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
    void index;
  });
}

export function playTap() {
  beep([{ freq: 520, dur: 0.06, volume: 0.04, at: 0, type: "triangle" }]);
}

export function playFail() {
  beep([
    { freq: 180, dur: 0.18, volume: 0.07, at: 0, type: "square" },
    { freq: 110, dur: 0.28, volume: 0.06, at: 0.16, type: "square" },
  ]);
}

export function playCurse() {
  beep([
    { freq: 320, dur: 0.16, volume: 0.05, at: 0, type: "sawtooth" },
    { freq: 240, dur: 0.16, volume: 0.05, at: 0.14, type: "sawtooth" },
    { freq: 140, dur: 0.34, volume: 0.06, at: 0.28, type: "sawtooth" },
  ]);
}

export function playWin() {
  beep([
    { freq: 523, dur: 0.1, volume: 0.04, at: 0, type: "sine" },
    { freq: 659, dur: 0.1, volume: 0.04, at: 0.09, type: "sine" },
    { freq: 784, dur: 0.18, volume: 0.05, at: 0.18, type: "sine" },
  ]);
}
