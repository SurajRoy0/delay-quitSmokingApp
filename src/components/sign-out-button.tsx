"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ButtonLoader } from "@/components/button-loader";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
        onError: () => setLoading(false),
      },
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      disabled={loading}
      className="w-full h-12 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 active:scale-95 transition-all font-semibold shadow-sm"
    >
      {loading ? (
        <ButtonLoader className="mr-2" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Sign out
    </Button>
  );
}
