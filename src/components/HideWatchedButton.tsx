import { Eye, EyeOff } from "lucide-react";

interface HideWatchedButtonProps {
  hideWatched: boolean;
  onToggle: () => void;
  rounded?: "full" | "lg";
}

export default function HideWatchedButton({ hideWatched, onToggle, rounded = "full" }: HideWatchedButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 text-xs px-3 py-1.5 ${
        rounded === "full" ? "rounded-full" : "rounded-lg"
      } border transition-all duration-150 font-semibold`}
      style={
        hideWatched
          ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24", borderColor: "rgba(251,191,36,0.3)" }
          : { color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.1)" }
      }
    >
      {hideWatched ? (
        <>
          <Eye className="h-4 w-4" />
          Show
        </>
      ) : (
        <>
          <EyeOff className="h-4 w-4" />
          Hide
        </>
      )}
    </button>
  );
}
