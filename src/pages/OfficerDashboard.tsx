import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import { useMe } from "@/hooks/use-me";

type RequestItem = {
  id: number;
  request_type: "residence" | "nida" | "license";
  status: "pending" | "approved" | "rejected";
  purpose: string;
  created_at: string;
  citizen_id: number;
  citizen_name: string;
  citizen_phone: string;
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

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type OfficerStats = {
  pending_requests: number;
  approved_today: number;
  total_citizens: number;
  letters_issued: number;
};

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: me } = useMe();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: () => apiFetch<Paginated<RequestItem>>("/api/requests/pending/"),
    enabled: isAuthenticated(),
  });
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["officer-stats"],
    queryFn: () => apiFetch<OfficerStats>("/api/stats/officer/"),
    enabled: isAuthenticated(),
  });

  const requests = data?.results ?? [];

  const handleLogout = () => {
    clearTokens();
    navigate("/");
  };

  const handleApprove = async (requestId: number) => {
    try {
      await apiFetch(`/api/requests/${requestId}/approve/`, { method: "POST" });
      toast({
        title: "Request Approved",
        description: `Request REQ-${requestId} has been approved.`,
      });
      await Promise.all([refetch(), refetchStats()]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Approval failed.";
      toast({
        title: "Approval Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      const reason = window.prompt("Provide a reason for rejection:", "Incomplete information") || "";
      await apiFetch(`/api/requests/${requestId}/reject/`, {
        method: "POST",
        body: { reason: reason.trim() || "Rejected by officer." },
      });
      toast({
        title: "Request Rejected",
        description: `Request REQ-${requestId} has been rejected.`,
        variant: "destructive",
      });
      await Promise.all([refetch(), refetchStats()]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Rejection failed.";
      toast({
        title: "Rejection Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      label: "Pending Requests",
      value: statsData?.pending_requests ?? requests.length,
      icon: Clock,
      color: "text-warning",
      href: "/pending-requests",
    },
    {
      label: "Approved Today",
      value: statsData?.approved_today ?? "-",
      icon: CheckCircle2,
      color: "text-success",
      href: "/approved-requests",
    },
    {
      label: "Total Citizens",
      value: statsData?.total_citizens ?? "-",
      icon: Users,
      color: "text-primary",
      href: "/citizens",
    },
    {
      label: "Letters Issued",
      value: statsData?.letters_issued ?? "-",
      icon: FileText,
      color: "text-accent-foreground",
      href: "/approved-requests",
    },
  ];

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

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header isLoggedIn={true} userRole={me?.user.role || "officer"} onLogout={handleLogout} />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Officer Dashboard
            </h1>
            <p className="text-muted-foreground">
              Review and process citizen verification requests.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card 
                key={stat.label} 
                className="animate-slide-up cursor-pointer hover:shadow-elevated transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(stat.href)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(stat.href);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending Requests */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">Loading requests...</p>
                </div>
              ) : isError || requests.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">
                    {isError ? "Unable to load requests." : "No pending requests at the moment."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div 
                      key={request.id} 
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => navigate(`/citizens/${request.citizen_id}`)}
                          >
                            <Eye className="w-4 h-4" />
                            View Citizen
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1 text-destructive hover:text-destructive"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </Button>
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="w-4 h-4" />
                            Approve
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

export default OfficerDashboard;
