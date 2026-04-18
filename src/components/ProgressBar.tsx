import { motion } from "framer-motion";

interface ProgressBarProps {
  pct: number;
  color: string;
}

export default function ProgressBar({ pct, color }: ProgressBarProps) {
  return (
    <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
