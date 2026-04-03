// ============================================================
// SOUND SYSTEM — Web Audio API tones
// ============================================================

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function resumeAudio() {
  try {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
  } catch (e) {}
}

function tone(freq, dur, type = "sine", vol = 0.03, when = 0) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime + when;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  } catch (e) {}
}

export const sounds = {
  click: () => tone(520, 0.05, "triangle", 0.02),
  correct: () => {
    tone(523, 0.1, "triangle", 0.05, 0);
    tone(659, 0.1, "triangle", 0.05, 0.08);
    tone(784, 0.14, "triangle", 0.05, 0.16);
  },
  wrong: () => {
    tone(320, 0.12, "sawtooth", 0.03, 0);
    tone(240, 0.14, "sawtooth", 0.03, 0.1);
  },
  unlock: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, "triangle", 0.04, i * 0.09));
  },
  rankUp: () => {
    [440, 554, 659, 880].forEach((f, i) => tone(f, 0.15, "triangle", 0.05, i * 0.08));
  },
};
