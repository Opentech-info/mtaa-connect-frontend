import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Eye, RotateCcw, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import { useMe } from "@/hooks/use-me";

type RequestItem = {
  id: number;
  request_type: "residence" | "nida" | "license";
  status: "approved";
  purpose: string;
  created_at: string;
  citizen_id: number;
  citizen_name: string;
  citizen_phone: string;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const requestTypeLabel = (type: RequestItem["request_type"]) => {
  switch (type) {
    case "residence":
      return "Residence Letter";
    case "nida":
      return "NIDA Verification";
    case "license":
      return "License Verification";
    default:
      return type;
  }
};

const ApprovedRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: me } = useMe();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["approved-requests"],
    queryFn: () => apiFetch<Paginated<RequestItem>>("/api/requests/approved/"),
    enabled: isAuthenticated(),
  });

  const requests = data?.results ?? [];

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

  const handleReopen = async (requestId: number) => {
    try {
      await apiFetch(`/api/requests/${requestId}/reopen/`, { method: "POST" });
      toast({
        title: "Request Reopened",
        description: `Request REQ-${requestId} is back to pending.`,
      });
      refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed.";
      toast({
        title: "Unable to Reopen",
        description: message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

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
              Approved Requests
            </h1>
            <p className="text-muted-foreground">Review approved requests and reopen if needed.</p>
          </div>

          <Card className="shadow-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Approved Letters
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Loading requests...</div>
              ) : isError || requests.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {isError ? "Unable to load approved requests." : "No approved requests yet."}
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-foreground">{request.citizen_name}</span>
                            <Badge variant="secondary">{requestTypeLabel(request.request_type)}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <p><strong>Phone:</strong> {request.citizen_phone || "-"}</p>
                            <p><strong>Request ID:</strong> REQ-{request.id}</p>
                            <p><strong>Purpose:</strong> {request.purpose}</p>
                            <p><strong>Submitted:</strong> {formatDate(request.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(`/citizens/${request.citizen_id}`)}>
                            <Eye className="w-4 h-4" />
                            View Citizen
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleReopen(request.id)}>
                            <RotateCcw className="w-4 h-4" />
                            Reopen
                          </Button>
                        </div>
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

export default ApprovedRequests;
