/**
 * Robust Audio & Speech Synthesis utilities for Faseeh Arabic App
 * Supports Web Speech API with Arabic voice detection + HTML5 Audio fallback
 */

// Cached Audio element for fallback TTS
let fallbackAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let voicesLoaded = false;
let arabicVoicesCache: SpeechSynthesisVoice[] = [];

// Preload and cache available speech synthesis voices
function initVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesLoaded = true;
    arabicVoicesCache = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('ar') ||
        v.lang.toLowerCase().includes('ar-') ||
        v.lang.toLowerCase().includes('ara') ||
        v.name.toLowerCase().includes('arabic') ||
        v.name.toLowerCase().includes('maged') ||
        v.name.toLowerCase().includes('tarik') ||
        v.name.toLowerCase().includes('laila') ||
        v.name.toLowerCase().includes('zeina') ||
        v.name.toLowerCase().includes('salma') ||
        v.name.toLowerCase().includes('hoda') ||
        v.name.toLowerCase().includes('naayf')
    );
  }
  return arabicVoicesCache;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  initVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    initVoices();
  };
}

/**
 * Remove diacritics / tashkeel for clean fallback audio URLs if needed
 */
export function stripTashkeel(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
}

/**
 * Stop any current playing audio or speech
 */
export function stopAudio(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (fallbackAudio) {
      fallbackAudio.pause();
      fallbackAudio.currentTime = 0;
    }
  } catch (e) {
    console.warn('Error stopping audio', e);
  }
}

/**
 * Play Arabic audio stream using online TTS fallback
 */
function playOnlineTtsFallback(text: string, rate: number = 1.0): Promise<void> {
  return new Promise((resolve) => {
    try {
      stopAudio();
      const cleaned = text.trim();
      if (!cleaned) {
        resolve();
        return;
      }

      // Encode text for Google TTS endpoint
      const encoded = encodeURIComponent(cleaned);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encoded}`;

      if (!fallbackAudio) {
        fallbackAudio = new Audio();
      }

      fallbackAudio.src = url;
      fallbackAudio.playbackRate = Math.max(0.7, Math.min(rate, 1.5));

      const cleanup = () => {
        if (fallbackAudio) {
          fallbackAudio.onended = null;
          fallbackAudio.onerror = null;
        }
        resolve();
      };

      fallbackAudio.onended = cleanup;
      fallbackAudio.onerror = () => {
        // As a secondary audio stream fallback, try VoiceRSS or generic audio chime
        console.warn('Online TTS failed, resolving gracefully');
        cleanup();
      };

      const playPromise = fallbackAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Fallback audio play blocked or failed:', err);
          cleanup();
        });
      }
    } catch {
      resolve();
    }
  });
}

/**
 * Primary Speak Arabic Function with multi-tier fallback:
 * 1. Web Speech API (with native Arabic Voice if available)
 * 2. Web Speech API with ar-SA generic lang
 * 3. Online HTML5 Audio TTS fallback
 */
export function speakArabic(text: string, rate: number = 0.88, isSlow: boolean = false): Promise<void> {
  return new Promise((resolve) => {
    const adjustedRate = isSlow ? 0.65 : rate;
    const trimmed = text.trim();
    if (!trimmed) {
      resolve();
      return;
    }

    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Try SpeechSynthesis if supported
    if ('speechSynthesis' in window) {
      try {
        // Resume synthesis if paused
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const voices = initVoices();
        const hasArabicVoice = voices.length > 0;

        // If no native Arabic voice is installed on the OS, directly use online fallback for high fidelity
        if (!hasArabicVoice && navigator.onLine) {
          playOnlineTtsFallback(trimmed, adjustedRate).then(resolve);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(trimmed);
        utterance.rate = adjustedRate;
        utterance.pitch = 1.0;
        utterance.lang = 'ar-SA';

        if (hasArabicVoice) {
          utterance.voice = voices[0];
        }

        let finished = false;
        const done = () => {
          if (!finished) {
            finished = true;
            currentUtterance = null;
            resolve();
          }
        };

        utterance.onend = done;
        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error, switching to online TTS fallback:', e);
          if (!finished) {
            finished = true;
            currentUtterance = null;
            playOnlineTtsFallback(trimmed, adjustedRate).then(resolve);
          }
        };

        currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);

        // Safety timeout in case speechSynthesis hangs without firing onend
        setTimeout(() => {
          if (!finished && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            done();
          }
        }, 12000);
        return;
      } catch (err) {
        console.warn('SpeechSynthesis invocation failed:', err);
        playOnlineTtsFallback(trimmed, adjustedRate).then(resolve);
        return;
      }
    }

    // Fallback if speechSynthesis is not in window
    playOnlineTtsFallback(trimmed, adjustedRate).then(resolve);
  });
}

// Play pleasant synthesizer sound effects (Victory Chime, Tap, Error)
export function playSoundEffect(type: 'correct' | 'wrong' | 'levelup' | 'tap' | 'streak') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'levelup' || type === 'streak') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.24);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.36);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'tap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Ignore audio context errors silently
  }
}
