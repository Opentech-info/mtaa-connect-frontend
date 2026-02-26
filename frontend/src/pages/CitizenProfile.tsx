import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import { useMe } from "@/hooks/use-me";
import { ArrowLeft, User } from "lucide-react";

type CitizenProfileResponse = {
  user: {
    id: number;
    full_name: string;
    email: string;
    role: "citizen";
  };
  profile: {
    phone: string;
    gender: string;
    age: number;
    address: string;
    nida_number: string;
  } | null;
};

const CitizenProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { data: me } = useMe();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["citizen", id],
    queryFn: () => apiFetch<CitizenProfileResponse>(`/api/citizens/${id}/`),
    enabled: isAuthenticated() && Boolean(id),
  });

  const handleLogout = () => {
    clearTokens();
    navigate("/");
  };

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
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-1"
            onClick={() => navigate("/citizens")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Citizens
          </Button>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Citizen Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-sm text-muted-foreground">Loading profile...</div>
              ) : isError || !data ? (
                <div className="py-6 text-sm text-muted-foreground">
                  Unable to load citizen profile.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="text-base font-semibold text-foreground">{data.user.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-base font-semibold text-foreground">{data.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-base font-semibold text-foreground">{data.profile?.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="text-base font-semibold text-foreground">{data.profile?.gender || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="text-base font-semibold text-foreground">{data.profile?.age ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">NIDA</p>
                      <p className="text-base font-semibold text-foreground">{data.profile?.nida_number || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-base font-semibold text-foreground">{data.profile?.address || "-"}</p>
                  </div>
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

export default CitizenProfile;
