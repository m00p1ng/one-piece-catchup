import cn from "classnames";
import type { Arc } from "../types";

interface ArcThumbnailProps {
  arc: Arc;
  sagaColor: string;
  size?: "card" | "detail";
}

export default function ArcThumbnail({ arc, sagaColor, size = "card" }: ArcThumbnailProps) {
  const isCard = size === "card";

  return (
    <div
      className={cn(
        "relative overflow-hidden shrink-0 flex items-center justify-center",
        isCard ? "w-full h-full rounded-xl" : "w-full h-48 rounded-2xl"
      )}
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
        className="relative z-0 select-none"
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
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none z-20 whitespace-nowrap"
          style={{
            background: "rgba(0,0,0,0.72)",
            color: sagaColor,
            border: `1px solid ${sagaColor}44`,
          }}
        >
          {arc.count} ep
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
