import { Flame } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand to-brand-light flex items-center justify-center animate-pulse">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
