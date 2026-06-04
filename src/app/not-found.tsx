import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
          <Flame className="w-8 h-8 text-brand" />
        </div>
        <div>
          <h2 className="text-4xl font-bold mb-2">404</h2>
          <p className="text-sm text-muted-foreground">
            This page doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
        </div>
        <Link href="/home">
          <Button className="rounded-full gap-2">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
