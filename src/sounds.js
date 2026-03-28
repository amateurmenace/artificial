// Sound Effects System - Web Audio API (no dependencies)
// Programmatic tones for game events

let audioCtx = null;
let initialized = false;

export const initAudio = () => {
  if (initialized) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    initialized = true;
  } catch (e) {
    console.warn('[Sound] Web Audio API not supported:', e.message);
  }
};

export const isMuted = () => localStorage.getItem('sound_muted') === 'true';
export const setMuted = (muted) => localStorage.setItem('sound_muted', String(muted));
export const toggleMute = () => { setMuted(!isMuted()); return !isMuted(); };

const haptic = (pattern = [50]) => {
  try { navigator.vibrate?.(pattern); } catch {}
};

const ensureContext = () => {
  if (!audioCtx) initAudio();
  if (!audioCtx) return null;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

// Ascending two-tone ding (voting close, phase transitions)
export const playDing = () => {
  if (isMuted()) return;
  const ctx = ensureContext();
  if (!ctx) return;
  haptic();

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(800, now);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1200, now + 0.1);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + 0.15);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.4);
};

// Filtered noise sweep (villain appearances, dramatic moments)
export const playWhoosh = () => {
  if (isMuted()) return;
  const ctx = ensureContext();
  if (!ctx) return;
  haptic([30, 50, 30]);

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);
  filter.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.3);
};

// Arpeggiated celebration chord (awards, results)
export const playCelebration = () => {
  if (isMuted()) return;
  const ctx = ensureContext();
  if (!ctx) return;
  haptic([50, 30, 50, 30, 100]);

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = i === 3 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const start = now + i * 0.08;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, start + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.5);
  });
};

// Short tick (timer countdown last 10 seconds)
export const playTick = () => {
  if (isMuted()) return;
  const ctx = ensureContext();
  if (!ctx) return;
  haptic([20]);

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(1000, now);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
};
