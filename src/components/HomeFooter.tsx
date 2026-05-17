interface HomeFooterProps {
  totalArcs: number;
  totalEps: number;
}

const FOOTER_STATS = [
  { label: "Years Running", value: "25+" },
];

export default function HomeFooter({ totalArcs, totalEps }: HomeFooterProps) {
  const stats = [
    { label: "Arcs Tracked", value: `${totalArcs}` },
    { label: "Episodes", value: `${totalEps}+` },
    ...FOOTER_STATS,
  ];

  return (
    <footer className="mt-16 border-t border-white/5 pt-10 pb-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4" style={{ filter: "drop-shadow(0 0 16px rgba(251,191,36,0.4))" }}>☠️</div>
        <div
          className="text-lg font-black tracking-tight mb-1"
          style={{
            background: "linear-gradient(135deg, #fbbf24, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          The One Piece is Real.
        </div>
        <p className="text-white/30 text-xs">Keep sailing. The adventure never ends.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl py-3 px-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="text-xl font-black" style={{ color: "#fbbf24" }}>{stat.value}</div>
            <div className="text-white/30 text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-white/40 text-xs">
        <span>Built for One Piece fans</span>
        <span>·</span>
        <a
          href="https://github.com/m00p1ng/one-piece-catchup"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-white/40"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
