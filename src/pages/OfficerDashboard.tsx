import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Mock pending requests
const mockPendingRequests = [
  {
    id: "REQ-004",
    citizenName: "Jane Smith",
    citizenPhone: "+255 755 123 456",
    type: "Residence Letter",
    purpose: "Bank account opening",
    createdAt: "2024-01-19",
    address: "Plot 123, Kinondoni District",
  },
  {
    id: "REQ-005",
    citizenName: "John Mwangi",
    citizenPhone: "+255 712 987 654",
    type: "NIDA Verification",
    purpose: "National ID registration",
    createdAt: "2024-01-18",
    address: "Block B, Ilala District",
  },
  {
    id: "REQ-006",
    citizenName: "Mary Joseph",
    citizenPhone: "+255 784 555 333",
    type: "License Verification",
    purpose: "Business license application",
    createdAt: "2024-01-17",
    address: "Street 45, Temeke District",
  },
];

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState(mockPendingRequests);

  const handleLogout = () => {
    navigate("/");
  };

  const handleApprove = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    toast({
      title: "Request Approved",
      description: `Request ${requestId} has been approved and the letter is ready for download.`,
    });
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    toast({
      title: "Request Rejected",
      description: `Request ${requestId} has been rejected. The citizen will be notified.`,
      variant: "destructive",
    });
  };

  const stats = [
    { label: "Pending Requests", value: requests.length, icon: Clock, color: "text-warning" },
    { label: "Approved Today", value: 12, icon: CheckCircle2, color: "text-success" },
    { label: "Total Citizens", value: 1284, icon: Users, color: "text-primary" },
    { label: "Letters Issued", value: 3456, icon: FileText, color: "text-accent-foreground" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header isLoggedIn={true} userRole="officer" onLogout={handleLogout} />
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
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
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
              {requests.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">
                    No pending requests at the moment.
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
                            <span className="font-semibold text-foreground">{request.citizenName}</span>
                            <Badge variant="secondary">{request.type}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <p><strong>Phone:</strong> {request.citizenPhone}</p>
                            <p><strong>Request ID:</strong> {request.id}</p>
                            <p><strong>Purpose:</strong> {request.purpose}</p>
                            <p><strong>Submitted:</strong> {request.createdAt}</p>
                            <p className="md:col-span-2"><strong>Address:</strong> {request.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-4 h-4" />
                            Details
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
