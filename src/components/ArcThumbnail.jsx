export default function ArcThumbnail({ arc, sagaColor, size = "card" }) {
  const isCard = size === "card";

  return (
    <div
      className={`relative overflow-hidden flex-shrink-0 flex items-center justify-center ${
        isCard ? "w-24 h-16 rounded-xl" : "w-full h-48 rounded-2xl"
      }`}
      style={{
        background: `linear-gradient(135deg, ${sagaColor}33 0%, ${sagaColor}18 50%, #050d1a 100%)`,
        border: `1px solid ${sagaColor}33`,
      }}
    >
      {/* Diagonal stripe pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            ${sagaColor}08 8px,
            ${sagaColor}08 16px
          )`,
        }}
      />

      {/* Radial glow behind emoji */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${sagaColor}22 0%, transparent 70%)`,
        }}
      />

      {/* Emoji */}
      <span
        className="relative z-10 select-none"
        style={{
          fontSize: isCard ? "1.8rem" : "4rem",
          filter: `drop-shadow(0 0 8px ${sagaColor}88)`,
        }}
      >
        {arc.thumbnailEmoji}
      </span>

      {/* Episode badge (card only) */}
      {isCard && (
        <div
          className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: sagaColor,
            border: `1px solid ${sagaColor}44`,
          }}
        >
          {arc.count} eps
        </div>
      )}

      {/* Shimmer line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${sagaColor}66, transparent)`,
        }}
      />
    </div>
  );
}
