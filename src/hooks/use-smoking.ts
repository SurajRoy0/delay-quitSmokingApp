import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const res = await fetch("/api/user/stats");
      if (!res.ok) throw new Error("Failed to fetch user stats");
      return res.json();
    },
  });
}

export function useLogSmoke() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { reasons: string[]; price?: number }) => {
      const res = await fetch("/api/smoking/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to log smoke event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["activeSession"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useActiveSession() {
  return useQuery({
    queryKey: ["activeSession"],
    queryFn: async () => {
      const res = await fetch("/api/smoking/session");
      if (!res.ok) throw new Error("Failed to fetch active session");
      return res.json();
    },
  });
}

export function useAnalytics(days: number = 30, reason: string = "ALL") {
  return useQuery({
    queryKey: ["analytics", days, reason],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?days=${days}&reason=${reason}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });
}
