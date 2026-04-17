import { motion } from "framer-motion";

function PirateShip() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: 120, bottom: "7vw" }}
      animate={{ x: ["-160px", "110vw"] }}
      transition={{ duration: 40, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      >
        <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="120">
          {/* Hull */}
          <path d="M10 52 Q60 68 110 52 L100 64 Q60 76 20 64 Z" fill="#4a2c0a" />
          <path d="M20 64 Q60 74 100 64 L95 70 Q60 78 25 70 Z" fill="#3a200a" />
          {/* Deck */}
          <rect x="18" y="48" width="84" height="6" rx="2" fill="#6b3d12" />
          {/* Main mast */}
          <rect x="57" y="10" width="4" height="40" rx="1" fill="#5a3a10" />
          {/* Fore mast */}
          <rect x="35" y="18" width="3" height="32" rx="1" fill="#5a3a10" />
          {/* Main sail */}
          <path d="M61 12 L90 22 L90 42 L61 42 Z" fill="rgba(220,200,160,0.9)" stroke="rgba(180,150,100,0.5)" strokeWidth="0.5" />
          {/* Fore sail */}
          <path d="M38 20 L60 26 L60 44 L38 44 Z" fill="rgba(220,200,160,0.85)" stroke="rgba(180,150,100,0.5)" strokeWidth="0.5" />
          {/* Jolly Roger flag */}
          <path d="M61 4 L80 1 L80 14 L61 14 Z" fill="#1a1a1a" />
          {/* Skull head */}
          <ellipse cx="70" cy="7" rx="3.5" ry="3" fill="white" />
          {/* Skull jaw */}
          <rect x="67.5" y="9" width="5" height="2" rx="0.5" fill="white" />
          {/* Skull eyes */}
          <circle cx="68.5" cy="6.5" r="1" fill="#1a1a1a" />
          <circle cx="71.5" cy="6.5" r="1" fill="#1a1a1a" />
          {/* Crossbones */}
          <line x1="66" y1="11.5" x2="74" y2="13.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
          <line x1="74" y1="11.5" x2="66" y2="13.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
          {/* Crow's nest */}
          <rect x="54" y="20" width="10" height="5" rx="1" fill="#5a3a10" />
          {/* Cannon ports */}
          <circle cx="30" cy="56" r="2" fill="#2a1a05" />
          <circle cx="50" cy="57" r="2" fill="#2a1a05" />
          <circle cx="70" cy="57" r="2" fill="#2a1a05" />
          <circle cx="90" cy="56" r="2" fill="#2a1a05" />
          {/* Wake */}
          <path d="M100 66 Q108 64 118 66" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M105 70 Q112 68 120 70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

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

      {/* Pirate ship */}
      <PirateShip />

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
