import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

// Branded favicon: navy "LM" monogram on an ivory tile, like the header mark.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#eef1f6',
          color: '#0a1222',
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: -1,
          borderRadius: 12,
        }}
      >
        LM
      </div>
    ),
    { ...size },
  );
}
