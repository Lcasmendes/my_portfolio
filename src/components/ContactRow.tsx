'use client';

import {
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  type LucideIcon,
} from 'lucide-react';
import { useSound } from './sound/SoundProvider';

// Icon components can't be passed from a Server Component, so map by key here.
const ICONS: Record<string, LucideIcon> = {
  email: Mail,
  phone: Phone,
  linkedin: Linkedin,
  github: Github,
  location: MapPin,
};

export type ContactIconKey = keyof typeof ICONS;

interface ContactRowProps {
  iconKey: ContactIconKey;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  index: number;
}

// FFXV "SKILLS" list banner: a double-pointed bar with a brand icon in a
// circle at the left (where the game shows the slot number).
const CLIP =
  'polygon(0 50%, 1.5rem 0, calc(100% - 1.6rem) 0, 100% 50%, calc(100% - 1.6rem) 100%, 1.5rem 100%)';

export default function ContactRow({
  iconKey,
  label,
  value,
  href,
  external,
  index,
}: ContactRowProps) {
  const { play } = useSound();
  const Icon = ICONS[iconKey];

  const inner = (
    <>
      {/* outline layer */}
      <span
        aria-hidden
        className="absolute inset-0 bg-frost/25 transition-colors duration-300 group-hover:bg-frost/60"
        style={{ clipPath: CLIP }}
      />
      {/* fill layer */}
      <span
        aria-hidden
        className="absolute inset-[1.5px] bg-gradient-to-r from-[rgba(40,58,98,0.5)] via-[rgba(28,42,76,0.5)] to-[rgba(20,32,60,0.55)] transition-all duration-300 group-hover:from-[rgba(74,104,156,0.55)] group-hover:via-[rgba(40,60,104,0.55)] group-hover:to-[rgba(26,40,74,0.6)]"
        style={{ clipPath: CLIP }}
      />

      {/* icon circle */}
      <span className="absolute left-0 top-1/2 z-20 flex h-[3.4rem] w-[3.4rem] -translate-y-1/2 items-center justify-center rounded-full border-2 border-frost/45 bg-midnight text-frost shadow-glow transition-colors duration-300 group-hover:border-frost group-hover:text-frost-bright">
        <span className="absolute inset-1 rounded-full border border-frost/20" />
        <Icon size={22} />
      </span>

      {/* text */}
      <div className="relative z-10 flex h-full flex-col justify-center pl-[4.6rem] pr-9">
        <span className="text-[0.62rem] uppercase tracking-widest2 text-frost-dim">
          {label}
        </span>
        <span className="truncate text-sm text-frost-soft group-hover:text-white sm:text-[0.95rem]">
          {value}
        </span>
      </div>

      {external && (
        <ExternalLink
          size={14}
          className="absolute right-7 top-1/2 z-10 -translate-y-1/2 text-frost-dim opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
    </>
  );

  const className =
    'group relative block h-[4.25rem] transition-transform duration-300 hover:translate-x-1.5';
  const style = { animation: `fade-up 0.5s ease-out ${index * 0.06}s both` };

  if (!href) {
    return (
      <div className={className} style={style}>
        {inner}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={`${label}: ${value}`}
      onMouseEnter={() => play('hover')}
      onClick={() => play('select')}
      className={className}
      style={style}
    >
      {inner}
    </a>
  );
}
