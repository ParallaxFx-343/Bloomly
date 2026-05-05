import { createAudioPlayer, setAudioModeAsync, AudioPlayer, AudioSource } from 'expo-audio';
import { kvGetBool } from './database';
import type { TimePeriod } from '../constants/Colors';

// ─── Types ───────────────────────────────────────────────

type SfxName = 'tap' | 'plant' | 'celebrate';

// ─── Assets ──────────────────────────────────────────────

const SFX_ASSETS: Record<SfxName, AudioSource> = {
  tap: require('../assets/sounds/tap.wav'),
  plant: require('../assets/sounds/plant.wav'),
  celebrate: require('../assets/sounds/celebrate.wav'),
};

// Ambient layers per time period — each period has 1-2 layers with volume
// Replace these with real field recordings from Pixabay for best quality
interface AmbientLayer {
  asset: AudioSource;
  volume: number;
}

const AMBIENT_BY_PERIOD: Record<TimePeriod, AmbientLayer[]> = {
  dawn: [
    { asset: require('../assets/sounds/birds.mp3'), volume: 0.3 },
    { asset: require('../assets/sounds/wind.mp3'), volume: 0.1 },
  ],
  morning: [
    { asset: require('../assets/sounds/birds.mp3'), volume: 0.25 },
    { asset: require('../assets/sounds/wind.mp3'), volume: 0.08 },
  ],
  afternoon: [
    { asset: require('../assets/sounds/wind.mp3'), volume: 0.2 },
    { asset: require('../assets/sounds/birds.mp3'), volume: 0.1 },
  ],
  sunset: [
    { asset: require('../assets/sounds/wind.mp3'), volume: 0.18 },
    { asset: require('../assets/sounds/crickets.mp3'), volume: 0.06 },
  ],
  night: [
    { asset: require('../assets/sounds/rain.mp3'), volume: 0.2 },
    { asset: require('../assets/sounds/crickets.mp3'), volume: 0.08 },
  ],
};

// ─── State ───────────────────────────────────────────────

const sfxCache: Map<SfxName, AudioPlayer> = new Map();
// Pool: one AudioPlayer per unique asset, reused across period transitions
const ambientPool: Map<AudioSource, AudioPlayer> = new Map();
let activeAmbientPlayers: AudioPlayer[] = [];
let currentAmbientPeriod: TimePeriod | null = null;
let isSoundEnabled = true;

// ─── Init ────────────────────────────────────────────────

export async function initSounds(): Promise<void> {
  await setAudioModeAsync({
    playsInSilentMode: false,
    shouldPlayInBackground: false,
    interruptionMode: 'duckOthers',
  });
  isSoundEnabled = await getSoundEnabled();
}

async function getSoundEnabled(): Promise<boolean> {
  const val = await kvGetBool('sound_enabled');
  const neverSet = !(await kvGetBool('sound_set'));
  return val || neverSet;
}

export async function refreshSoundSetting(): Promise<void> {
  isSoundEnabled = await getSoundEnabled();
  if (!isSoundEnabled) {
    await stopAmbient();
  }
}

// ─── SFX (one-shot sounds) ──────────────────────────────

let lastPlayTime: Record<string, number> = {};
const DEDUP_MS = 80; // Minimum ms between same sound plays

export async function playSound(name: SfxName): Promise<void> {
  if (!isSoundEnabled) return;

  // Deduplicate rapid plays of the same sound
  const now = Date.now();
  if (now - (lastPlayTime[name] ?? 0) < DEDUP_MS) return;
  lastPlayTime[name] = now;

  try {
    let player = sfxCache.get(name);
    if (!player) {
      player = createAudioPlayer(SFX_ASSETS[name]);
      sfxCache.set(name, player);
    }
    await player.seekTo(0);
    player.play();
  } catch (err) {
    console.warn(`Sound ${name} failed:`, err);
  }
}

// ─── Ambient (time-of-day layered loops) ─────────────────

/** Get or create a pooled player for an ambient asset */
function getPooledPlayer(asset: AudioSource): AudioPlayer {
  let player = ambientPool.get(asset);
  if (!player) {
    player = createAudioPlayer(asset);
    player.loop = true;
    ambientPool.set(asset, player);
  }
  return player;
}

/**
 * Play ambient soundscape matching the current time period.
 * Reuses pooled AudioPlayers — pause/play instead of destroy/recreate.
 */
export async function playAmbientForPeriod(period: TimePeriod): Promise<void> {
  if (!isSoundEnabled) return;
  // Already playing this period — skip
  if (currentAmbientPeriod === period && activeAmbientPlayers.length > 0) return;

  // Pause current ambient players (don't destroy — they stay in pool)
  for (const p of activeAmbientPlayers) {
    try { p.pause(); } catch { /* ignore */ }
  }

  try {
    const layers = AMBIENT_BY_PERIOD[period];
    const players: AudioPlayer[] = [];

    for (const layer of layers) {
      const player = getPooledPlayer(layer.asset);
      player.volume = layer.volume;
      players.push(player);
    }

    activeAmbientPlayers = players;
    currentAmbientPeriod = period;
    activeAmbientPlayers.forEach((p) => p.play());
  } catch (err) {
    console.warn('Ambient failed:', err);
  }
}

/** Legacy: play layered ambient (uses afternoon as default) */
export async function playAmbientLayered(): Promise<void> {
  await playAmbientForPeriod('morning');
}

export async function stopAmbient(): Promise<void> {
  for (const p of activeAmbientPlayers) {
    try { p.pause(); } catch { /* ignore */ }
  }
  activeAmbientPlayers = [];
  currentAmbientPeriod = null;
}

export function isAmbientPlaying(): boolean {
  return activeAmbientPlayers.length > 0;
}

// ─── Cleanup ─────────────────────────────────────────────

export async function cleanupSounds(): Promise<void> {
  await stopAmbient();
  // Destroy pooled ambient players
  for (const player of ambientPool.values()) {
    try { player.remove(); } catch { /* ignore */ }
  }
  ambientPool.clear();
  // Destroy SFX players
  for (const player of sfxCache.values()) {
    try { player.remove(); } catch { /* ignore */ }
  }
  sfxCache.clear();
}
