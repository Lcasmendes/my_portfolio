'use client';

import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = { pt: 'PT', en: 'EN' };

export default function LocaleSwitcher({ collapsed }: { collapsed: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className={`flex items-center gap-2 ${
        collapsed ? 'flex-col' : 'justify-start'
      }`}
    >
      <Globe size={16} className="shrink-0 text-frost-dim" />
      <div className={`flex gap-1 ${collapsed ? 'flex-col' : ''}`}>
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            disabled={isPending}
            onClick={() => switchTo(loc)}
            aria-current={loc === locale}
            className={`rounded-sm px-2 py-1 text-xs font-medium tracking-widest transition-all ${
              loc === locale
                ? 'bg-frost/15 text-white shadow-glow'
                : 'text-frost-dim hover:text-frost-soft'
            } disabled:opacity-50`}
          >
            {LABELS[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}
