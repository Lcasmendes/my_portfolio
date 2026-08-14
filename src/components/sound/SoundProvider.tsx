'use client';

import { createContext, useCallback, useContext, useRef } from 'react';

type SoundType = 'hover' | 'select';

interface SoundContextValue {
  play: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextValue>({ play: () => {} });

// Menu SFX are always on. The AudioContext is created lazily and resumed on
// the first user interaction (browsers unlock audio on click/tap/keydown).
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((type: SoundType) => {
    if (typeof window === 'undefined') return;
    try {
      if (!ctxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctxRef.current = new Ctx();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      if (type === 'hover') {
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.03, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else {
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(1020, now + 0.1);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.055, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch {
      /* audio not available — ignore */
    }
  }, []);

  return (
    <SoundContext.Provider value={{ play }}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
