import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  CreditCard, 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Download,
  Eye
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import { useMe } from "@/hooks/use-me";

type RequestItem = {
  id: number;
  request_type: "residence" | "nida" | "license";
  status: "pending" | "approved" | "rejected";
  purpose: string;
  rejection_reason: string;
  created_at: string;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const letterTypes = [
  {
    icon: Home,
    title: "Residence Letter",
    description: "Proof of residence for various applications",
    href: "/new-request?type=residence",
  },
  {
    icon: CreditCard,
    title: "NIDA Verification",
    description: "Support letter for NIDA registration",
    href: "/new-request?type=nida",
  },
  {
    icon: FileText,
    title: "License Verification",
    description: "Character verification for licenses",
    href: "/new-request?type=license",
  },
];

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

const getStatusBadge = (status: RequestItem["status"]) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-success text-success-foreground">Approved</Badge>;
    case "pending":
      return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getStatusIcon = (status: RequestItem["status"]) => {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    case "pending":
      return <Clock className="w-5 h-5 text-warning" />;
    case "rejected":
      return <XCircle className="w-5 h-5 text-destructive" />;
    default:
      return null;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["requests"],
    queryFn: () => apiFetch<Paginated<RequestItem>>("/api/requests/"),
    enabled: isAuthenticated(),
  });

  const requests = data?.results ?? [];

  const handleLogout = () => {
    clearTokens();
    navigate("/");
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header isLoggedIn={true} userRole={me?.user.role || "citizen"} onLogout={handleLogout} />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Welcome{me?.user?.full_name ? `, ${me.user.full_name}` : ""}
            </h1>
            <p className="text-muted-foreground">
              Manage your verification letter requests from your dashboard.
            </p>
          </div>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Request a Letter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {letterTypes.map((type, index) => (
                <Card 
                  key={type.title} 
                  className="hover:shadow-elevated transition-all duration-300 cursor-pointer group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(type.href)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <type.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Requests */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Requests</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/requests">View All</Link>
              </Button>
            </div>

            <Card className="shadow-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">Loading requests...</p>
                  </div>
                ) : isError || requests.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">
                      {isError ? "Unable to load requests" : "No requests yet"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isError ? "Please try again later." : "Start by requesting your first verification letter."}
                    </p>
                    {!isError && (
                      <Button asChild>
                        <Link to="/new-request">Create Request</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(request.status)}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-foreground">
                                  {requestTypeLabel(request.request_type)}
                                </span>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                REQ-{request.id} - Created {formatDate(request.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.status === "approved" && (
                              <Button variant="outline" size="sm" className="gap-1">
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </div>
                        </div>
                        {request.status === "rejected" && request.rejection_reason && (
                          <div className="mt-2 p-2 bg-destructive/10 rounded-md">
                            <p className="text-sm text-destructive">
                              <strong>Reason:</strong> {request.rejection_reason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
