// Shared layout builder for all Open Graph images.
// Used by opengraph-image.tsx files via next/og's ImageResponse.
// Satori (the renderer) requires inline styles and a subset of CSS —
// no Tailwind, no external stylesheets.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG      = "#18181a";
const GOLD    = "#c9952a";
const TEXT    = "#f0ead6";
const MUTED   = "rgba(240,234,214,0.5)";

// 8-period sine wave across 1200 px wide, 40 px tall, centered at y=20, amplitude ±14
const WAVE =
  "M 0 20 C 37.5 6,37.5 6,75 20 C 112.5 34,112.5 34,150 20 " +
  "C 187.5 6,187.5 6,225 20 C 262.5 34,262.5 34,300 20 " +
  "C 337.5 6,337.5 6,375 20 C 412.5 34,412.5 34,450 20 " +
  "C 487.5 6,487.5 6,525 20 C 562.5 34,562.5 34,600 20 " +
  "C 637.5 6,637.5 6,675 20 C 712.5 34,712.5 34,750 20 " +
  "C 787.5 6,787.5 6,825 20 C 862.5 34,862.5 34,900 20 " +
  "C 937.5 6,937.5 6,975 20 C 1012.5 34,1012.5 34,1050 20 " +
  "C 1087.5 6,1087.5 6,1125 20 C 1162.5 34,1162.5 34,1200 20";

interface OgCardProps {
  headline: string;
  subtitle: string;
  badge?: string;
}

export function OgCard({ headline, subtitle, badge }: OgCardProps) {
  // Scale headline font down for longer titles so it doesn't overflow
  const headlineFontSize = headline.length > 40 ? 58 : headline.length > 25 ? 68 : 78;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1200px",
        height: "630px",
        backgroundColor: BG,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ── Content area (padded) ─────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "52px 72px 32px",
        }}
      >
        {/* Top bar: brand + optional badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Brand mark */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: GOLD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: BG,
                fontWeight: 800,
              }}
            >
              ♩
            </div>
            <span
              style={{
                color: GOLD,
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Advance Bass
            </span>
          </div>

          {/* Badge */}
          {badge && (
            <div
              style={{
                border: `1.5px solid ${GOLD}`,
                borderRadius: "999px",
                padding: "6px 20px",
                color: GOLD,
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "0.07em",
              }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* Center: headline + subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: `${headlineFontSize}px`,
              fontWeight: 800,
              color: TEXT,
              lineHeight: 1.1,
              maxWidth: "980px",
              letterSpacing: "-0.02em",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: "28px",
              color: MUTED,
              maxWidth: "720px",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            color: MUTED,
            fontSize: "17px",
            letterSpacing: "0.05em",
          }}
        >
          advancebass.com
        </div>
      </div>

      {/* ── Full-width sine wave decoration ───────────────────── */}
      <svg
        width="1200"
        height="40"
        viewBox="0 0 1200 40"
        style={{ display: "block" }}
      >
        {/* Wide soft glow */}
        <path d={WAVE} fill="none" stroke={GOLD} strokeWidth="10" opacity="0.06" />
        {/* Main line */}
        <path d={WAVE} fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.25" />
      </svg>
    </div>
  );
}
