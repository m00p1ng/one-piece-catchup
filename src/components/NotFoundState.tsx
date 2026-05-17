import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface NotFoundStateProps {
  message: string;
}

export default function NotFoundState({ message }: NotFoundStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-4xl mb-4">🌊</div>
        <p className="text-white/50">{message}</p>
        <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
          <ChevronLeft className="w-4 h-4 inline" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
