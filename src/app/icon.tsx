import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

// Branded favicon: cyan "LM" monogram on the navy theme.
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
          background: 'linear-gradient(145deg, #101a32 0%, #0a1124 100%)',
          color: '#7ee0ee',
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
