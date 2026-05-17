import type { Arc, Landmark } from "../types";

interface EpisodePreviewCardProps {
  label: string;
  episode: number;
  arc: Arc | null;
  landmark: Landmark | null;
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  onClick: () => void;
}

export default function EpisodePreviewCard({
  label,
  episode,
  arc,
  landmark,
  accentColor,
  backgroundColor,
  borderColor,
  onClick,
}: EpisodePreviewCardProps) {
  return (
    <button
      type="button"
      className="rounded-2xl p-4 flex flex-col cursor-pointer active:scale-95 transition-transform text-left"
      style={{ background: backgroundColor, border: `1px solid ${borderColor}` }}
      onClick={onClick}
      disabled={!arc}
    >
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: `${accentColor}80` }}>
            {label}
          </span>
        </div>
        <div>
          <div className="font-black text-2xl leading-none" style={{ color: accentColor }}>
            Ep {episode}
          </div>
          {arc && <div className="text-white/35 text-xs mt-1 truncate">{arc.name}</div>}
        </div>
      </div>
      <div className="h-16 pt-2 mt-2 border-t overflow-hidden" style={{ borderColor }}>
        {landmark && (
          <>
            <div className="text-white/70 text-xs leading-snug line-clamp-2">{landmark.title}</div>
            {landmark.note && (
              <div className="text-xs mt-1 truncate" style={{ color: `${accentColor}80` }}>
                {landmark.note}
              </div>
            )}
          </>
        )}
      </div>
    </button>
  );
}
