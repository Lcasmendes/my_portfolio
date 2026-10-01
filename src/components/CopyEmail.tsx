'use client';

import { useRef, useState } from 'react';

// Contact row that copies the e-mail address; falls back to selecting it.
export default function CopyEmail({
  email,
  label,
  copy,
  copied,
}: {
  email: string;
  label: string;
  copy: string;
  copied: string;
}) {
  const [done, setDone] = useState(false);
  const valueRef = useRef<HTMLSpanElement>(null);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      window.setTimeout(() => setDone(false), 1800);
    } catch {
      const el = valueRef.current;
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  return (
    <button type="button" className="link" onClick={onClick}>
      <span className="k">{label}</span>
      <span className="v" ref={valueRef}>
        {email}
      </span>
      <span className="a" aria-live="polite">
        {done ? copied : copy}
      </span>
    </button>
  );
}
