import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import { useMe } from "@/hooks/use-me";
import { useToast } from "@/hooks/use-toast";

type CitizenItem = {
  id: number;
  email: string;
  full_name: string;
  role: "citizen" | "officer" | "admin";
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const Citizens = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { toast } = useToast();
  const { data: me } = useMe();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["citizens"],
    queryFn: () => apiFetch<Paginated<CitizenItem>>("/api/citizens/"),
    enabled: isAuthenticated(),
  });

  const citizens = data?.results ?? [];

  const handleLogout = () => {
    clearTokens();
    navigate("/");
  };

  const filteredCitizens = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return citizens;
    return citizens.filter((citizen) =>
      [citizen.full_name, citizen.email, String(citizen.id)].some((value) =>
        value.toLowerCase().includes(q),
      ),
    );
  }, [citizens, query]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/officer-login");
      return;
    }
    if (me && me.user.role !== "officer" && me.user.role !== "admin") {
      clearTokens();
      navigate("/officer-login");
      toast({
        title: "Access Denied",
        description: "Officer access is required.",
        variant: "destructive",
      });
    }
  }, [me, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header isLoggedIn={true} userRole={me?.user.role || "officer"} onLogout={handleLogout} />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-1"
            onClick={() => navigate("/officer-dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="mb-6 animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Citizens
            </h1>
            <p className="text-muted-foreground">Search and review registered citizens.</p>
          </div>

          <Card className="shadow-card animate-slide-up">
            <CardHeader className="space-y-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Citizen Directory
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email, or ID"
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Loading citizens...</div>
              ) : isError || filteredCitizens.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {isError ? "Unable to load citizens." : "No citizens match your search."}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredCitizens.map((citizen) => (
                    <div key={citizen.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{citizen.full_name}</span>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p><strong>ID:</strong> CIT-{citizen.id}</p>
                          <p><strong>Email:</strong> {citizen.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/citizens/${citizen.id}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Citizens;
