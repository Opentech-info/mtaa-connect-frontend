import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Download, Eye, FileText, RotateCcw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, downloadRequestPdf } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import { useMe } from "@/hooks/use-me";

type RequestDetailResponse = {
  id: number;
  request_type: "residence" | "nida" | "license";
  status: "pending" | "approved" | "rejected";
  purpose: string;
  additional_info: string;
  urgency: string;
  metadata?: Record<string, string>;
  rejection_reason: string;
  created_at: string;
  citizen_id: number;
  citizen_name: string;
  citizen_phone: string;
  citizen_address: string;
  citizen_email: string;
  citizen_gender: string;
  citizen_age: number;
  citizen_nida: string;
};

const requestTypeLabel = (type: RequestDetailResponse["request_type"]) => {
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

const OfficerRequestReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const { data: me } = useMe();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["officer-request", id],
    queryFn: () => apiFetch<RequestDetailResponse>(`/api/requests/${id}/`),
    enabled: isAuthenticated() && !!id,
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

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  const formatValue = (value: string | undefined, fallback = "........................") => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : fallback;
  };

  const titleCase = (value: string | undefined) => {
    const trimmed = value?.trim();
    if (!trimmed) {
      return "........................";
    }
    return trimmed
      .toLowerCase()
      .split(" ")
      .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
      .join(" ");
  };

  const subjectMap: Record<RequestDetailResponse["request_type"], string> = {
    residence: "UTAMBULISHO WA MKAZI",
    nida: "UTAMBULISHO WA NIDA",
    license: "UTAMBULISHO WA LESENI",
  };

  const handleApprove = async () => {
    if (!data) {
      return;
    }
    try {
      await apiFetch(`/api/requests/${data.id}/approve/`, { method: "POST" });
      toast({
        title: "Request Approved",
        description: `Request REQ-${data.id} has been approved and the citizen will be notified.`,
      });
      refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Approval failed.";
      toast({
        title: "Approval Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!data) {
      return;
    }
    try {
      const reasonInput =
        window.prompt("Provide a clear reason for rejection:", "Incomplete information") || "";
      const reason = reasonInput.trim() || "No reason provided.";
      await apiFetch(`/api/requests/${data.id}/reject/`, {
        method: "POST",
        body: { reason },
      });
      toast({
        title: "Request Rejected",
        description: `REQ-${data.id} rejected. Reason: ${reason}. The citizen will be notified.`,
        variant: "destructive",
      });
      refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Rejection failed.";
      toast({
        title: "Rejection Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleReopen = async () => {
    if (!data) {
      return;
    }
    try {
      await apiFetch(`/api/requests/${data.id}/reopen/`, { method: "POST" });
      toast({
        title: "Request Reopened",
        description: `REQ-${data.id} is back in the pending queue.`,
      });
      refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reopen request.";
      toast({
        title: "Unable to Reopen",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header isLoggedIn={true} userRole={me?.user.role || "officer"} onLogout={handleLogout} />
        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-6xl text-sm text-muted-foreground">
            Loading request...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header isLoggedIn={true} userRole={me?.user.role || "officer"} onLogout={handleLogout} />
        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card className="shadow-card">
              <CardContent className="p-6 text-sm text-muted-foreground">
                Unable to load this request. Please try again later.
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = data.metadata || {};

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header isLoggedIn={true} userRole={me?.user.role || "officer"} onLogout={handleLogout} />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-1"
            onClick={() => navigate("/pending-requests")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </Button>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Review Request</CardTitle>
                <CardDescription>
                  REQ-{data.id} • {requestTypeLabel(data.request_type)} • Submitted {formatDate(data.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={data.status === "approved" ? "default" : data.status === "pending" ? "secondary" : "destructive"}>
                    {data.status.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Urgency: {data.urgency}</span>
                </div>

                {data.status === "rejected" && (
                  <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm">
                    <p className="font-semibold text-destructive">Request rejected</p>
                    <p className="text-muted-foreground">Reason: {data.rejection_reason || "No reason provided."}</p>
                  </div>
                )}

                <div className="rounded-lg border border-border/70 bg-muted/40 p-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <FileText className="w-4 h-4" />
                    Request Summary
                  </div>
                  <p><span className="font-semibold text-foreground">Purpose:</span> {data.purpose}</p>
                  {data.additional_info && (
                    <p><span className="font-semibold text-foreground">Additional Info:</span> {data.additional_info}</p>
                  )}
                </div>

                <div className="rounded-lg border border-border/70 bg-muted/40 p-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Eye className="w-4 h-4" />
                    Citizen Profile
                  </div>
                  <p><span className="font-semibold text-foreground">Name:</span> {data.citizen_name}</p>
                  <p><span className="font-semibold text-foreground">Email:</span> {data.citizen_email || "-"}</p>
                  <p><span className="font-semibold text-foreground">Phone:</span> {data.citizen_phone || "-"}</p>
                  <p><span className="font-semibold text-foreground">Address:</span> {data.citizen_address || "-"}</p>
                  <p><span className="font-semibold text-foreground">Gender:</span> {data.citizen_gender || "-"}</p>
                  <p><span className="font-semibold text-foreground">Age:</span> {data.citizen_age ?? "-"}</p>
                  <p><span className="font-semibold text-foreground">NIDA:</span> {data.citizen_nida || "-"}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate(`/citizens/${data.citizen_id}`)}
                  >
                    View Full Profile
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {data.status === "approved" && (
                    <Button variant="outline" className="gap-2" onClick={() => downloadRequestPdf(data.id)}>
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  )}
                  {data.status !== "pending" && (
                    <Button variant="outline" className="gap-2" onClick={handleReopen}>
                      <RotateCcw className="w-4 h-4" />
                      Reopen to Pending
                    </Button>
                  )}
                  {data.status === "pending" && (
                    <>
                      <Button variant="outline" className="gap-2 text-destructive" onClick={handleReject}>
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button variant="success" className="gap-2" onClick={handleApprove}>
                        <Check className="w-4 h-4" />
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="font-display text-xl">Letter Preview</CardTitle>
                <CardDescription>Verify the submitted letter details before approval.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-[11px] leading-relaxed text-slate-900 shadow-sm">
                  <div className="text-center uppercase font-semibold tracking-wide">
                    <div>Jamhuri ya Muungano wa Tanzania</div>
                    <div>Ofisi ya Rais</div>
                    <div>Tawala za Mikoa na Serikali za Mitaa</div>
                    <div>Halmashauri ya Manispaa ya Musoma</div>
                  </div>

                  <div className="my-3 h-px bg-slate-200" />

                  <div className="flex flex-wrap gap-4">
                    <div className="h-32 w-24 border border-slate-400 flex items-center justify-center text-[10px] text-slate-500">
                      BANDIKA<br />PICHA<br />HAPA
                    </div>
                    <div className="text-[10px] leading-4">
                      <div>OFISI YA SERIKALI ZA MTAA,</div>
                      <div>MTAA WA {titleCase(meta.mtaa)}</div>
                      <div>KATA {titleCase(meta.ward)}</div>
                      <div>WILAYA {titleCase(meta.district)}</div>
                      <div>MKOA {titleCase(meta.region)}</div>
                      <div>TAREHE: {formatValue(meta.letter_date, "__/__/____")}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px]">
                    <div className="font-semibold">
                      KUMBUKUMBU NA: {formatValue(meta.reference_no, "SM/SN/KN/____")}
                    </div>
                    <div>KWA: {formatValue(meta.to, "Husika / Yeyote Anayehusika")}</div>
                  </div>

                  <div className="mt-3 text-center font-semibold">
                    YAH: {subjectMap[data.request_type]}
                  </div>

                  <div className="mt-3 space-y-2">
                    <p>Husika na kichwa cha habari tajwa hapo juu.</p>
                    <p>Naomba kutambulisha na kumthibitisha ya kwamba ndugu:</p>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Jina</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {formatValue(data.citizen_name)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Amezaliwa</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {formatValue(meta.birth_date, "__/__/____")}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Namba ya simu</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {formatValue(data.citizen_phone)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Kazi</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {formatValue(meta.occupation)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Anaishi</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {formatValue(data.citizen_address)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Mtaa</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">{titleCase(meta.mtaa)}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Kata</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">{titleCase(meta.ward)}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Wilaya</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">{titleCase(meta.district)}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Mkoa</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">{titleCase(meta.region)}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Nyumba No</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {formatValue(meta.house_no)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Muda wa Makazi</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {formatValue(meta.stay_duration)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    Sababu ya barua: {formatValue(data.purpose, "________________")}
                  </div>

                  <div className="mt-3 space-y-1">
                    <div>Maelezo hayo hapo juu ni sahihi kwa kadri ya taarifa tulizonazo.</div>
                    <div>Hivyo basi naomba apatiwe huduma anayoiomba.</div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div>Imesainiwa na: ________________________________ Mhuri: ______________</div>
                    <div>Jina la Afisa: ________________________________ Saini: ______________</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OfficerRequestReview;
