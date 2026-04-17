export default function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050d1a]">
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 60 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 4 + "s",
            }}
          />
        ))}
      </div>

      {/* Deep ocean gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050d1a] via-[#071829] to-[#0a2040]" />

      {/* Moon glow */}
      <div
        className="absolute top-16 right-24 w-20 h-20 rounded-full bg-amber-100 opacity-80"
        style={{
          boxShadow: "0 0 60px 30px rgba(254,243,199,0.15), 0 0 120px 60px rgba(254,243,199,0.07)",
        }}
      />

      {/* Wave layers */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 200"
          className="w-full"
          style={{ animation: "wave1 8s ease-in-out infinite" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C240,160 480,40 720,100 C960,160 1200,40 1440,100 L1440,200 L0,200 Z"
            fill="rgba(6,52,99,0.5)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 180"
          className="w-full absolute bottom-0"
          style={{ animation: "wave2 6s ease-in-out infinite" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C360,140 720,20 1080,80 C1260,110 1380,60 1440,80 L1440,180 L0,180 Z"
            fill="rgba(7,65,126,0.4)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 160"
          className="w-full absolute bottom-0"
          style={{ animation: "wave3 9s ease-in-out infinite reverse" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C180,110 360,10 540,60 C720,110 900,10 1080,60 C1260,110 1380,30 1440,60 L1440,160 L0,160 Z"
            fill="rgba(8,82,155,0.35)"
          />
        </svg>
      </div>
    </div>
  );
}
