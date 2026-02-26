import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api";

export const useHealth = () =>
  useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: 30_000,
    retry: 1,
  });
