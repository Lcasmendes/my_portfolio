import { ImageResponse } from 'next/og';

export const alt = 'Lucas Silva Mendes — Desenvolvedor Full-stack';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Branded 1200×630 social card on the navy/cyan theme.
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
          background:
            'linear-gradient(145deg, #0a1124 0%, #101a32 55%, #0b1530 100%)',
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
            color: '#7ee0ee',
            fontSize: 30,
            letterSpacing: 6,
          }}
        >
          <div style={{ width: 58, height: 3, background: '#4fc3d6' }} />
          PORTFÓLIO
        </div>

        {/* name + role */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 92, fontWeight: 600, lineHeight: 1.02 }}>
            Lucas Silva Mendes
          </div>
          <div style={{ fontSize: 42, color: '#aebccd', marginTop: 20 }}>
            Desenvolvedor Full-stack · Engenheiro de Dados
          </div>
        </div>

        {/* location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            fontSize: 32,
            color: '#9aa6b8',
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              background: '#4fc3d6',
              transform: 'rotate(45deg)',
            }}
          />
          São Carlos, SP · Cataguases, MG — Brasil
        </div>
      </div>
    ),
    { ...size },
  );
}
