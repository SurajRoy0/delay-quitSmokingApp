export function ButtonLoader({ className }: { className?: string }) {
  return (
    <div className={`flex gap-1 items-center justify-center ${className || ""}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
