import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

export type MeResponse = {
  user: {
    id: number;
    email: string;
    full_name: string;
    role: "citizen" | "officer" | "admin";
  };
  profile:
    | {
        phone?: string;
        gender?: string;
        age?: number;
        address?: string;
        nida_number?: string;
        position?: string;
        office?: string;
      }
    | null;
};

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<MeResponse>("/api/me/"),
    enabled: isAuthenticated(),
    retry: false,
  });
