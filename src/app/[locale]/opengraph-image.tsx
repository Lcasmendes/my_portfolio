import { ImageResponse } from 'next/og';

export const alt = 'Lucas Silva Mendes — Desenvolvedor Full-stack';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Branded 1200×630 social card on the flat navy theme.
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '76px',
          background: '#0a1222',
          color: '#eef1f6',
          fontFamily: 'sans-serif',
        }}
      >
        {/* kicker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            color: '#6ea8dc',
            fontSize: 30,
            letterSpacing: 6,
          }}
        >
          <div style={{ width: 58, height: 3, background: '#6ea8dc' }} />
          PORTFÓLIO
        </div>

        {/* name + role */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 92, fontWeight: 600, lineHeight: 1.02 }}>
            Lucas Silva Mendes
          </div>
          <div style={{ fontSize: 42, color: '#c3cddb', marginTop: 20 }}>
            Desenvolvedor Full-stack · React, Next.js, Python
          </div>
        </div>

        {/* location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            fontSize: 32,
            color: '#8291a8',
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              background: '#6ea8dc',
              transform: 'rotate(45deg)',
            }}
          />
          Cataguases, MG · Brasil
        </div>
      </div>
    ),
    { ...size },
  );
}
