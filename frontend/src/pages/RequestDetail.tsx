import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Edit3 } from "lucide-react";
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
  citizen_name: string;
  citizen_phone: string;
  citizen_address: string;
  citizen_email: string;
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

const RequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: me } = useMe();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["request-detail", id],
    queryFn: () => apiFetch<RequestDetailResponse>(`/api/requests/${id}/`),
    enabled: isAuthenticated() && !!id,
  });

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
    new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatValue = (
    value: string | undefined,
    fallback = "........................",
  ) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header
          isLoggedIn={true}
          userRole={me?.user.role || "citizen"}
          onLogout={handleLogout}
        />
        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-sm text-muted-foreground">
              Loading request...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header
          isLoggedIn={true}
          userRole={me?.user.role || "citizen"}
          onLogout={handleLogout}
        />
        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-4xl">
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
      <Header
        isLoggedIn={true}
        userRole={me?.user.role || "citizen"}
        onLogout={handleLogout}
      />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-1"
            onClick={() => navigate("/requests")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </Button>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] items-start">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="font-display text-2xl">
                  {requestTypeLabel(data.request_type)}
                </CardTitle>
                <CardDescription>
                  Request REQ-{data.id} • Submitted{" "}
                  {formatDate(data.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      data.status === "approved"
                        ? "default"
                        : data.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {data.status.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Urgency: {data.urgency}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-foreground">
                      Purpose:
                    </span>{" "}
                    {data.purpose}
                  </p>
                  {data.additional_info && (
                    <p>
                      <span className="font-semibold text-foreground">
                        Additional Info:
                      </span>{" "}
                      {data.additional_info}
                    </p>
                  )}
                </div>

                {data.status === "rejected" && (
                  <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm">
                    <p className="font-semibold text-destructive">
                      Request rejected
                    </p>
                    <p className="text-muted-foreground">
                      Reason: {data.rejection_reason || "No reason provided."}
                    </p>
                    <p className="text-muted-foreground">
                      Update your information and resubmit when ready.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {data.status === "approved" && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => downloadRequestPdf(data.id)}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  )}
                  {data.status === "pending" && me?.user.role === "citizen" && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => navigate(`/new-request?edit=${data.id}`)}
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Request
                    </Button>
                  )}
                  {data.status === "rejected" && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() =>
                        navigate(`/new-request?resubmit=${data.id}`)
                      }
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit & Resubmit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="font-display text-xl">
                  Letter Preview
                </CardTitle>
                <CardDescription>
                  Preview the official letter layout.
                </CardDescription>
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
                      BANDIKA
                      <br />
                      PICHA
                      <br />
                      HAPA
                    </div>
                    <div className="text-[10px] leading-4">
                      <div>OFISI YA SERIKALI ZA MTAA,</div>
                      <div>MTAA WA {titleCase(meta.mtaa)}</div>
                      <div>KATA {titleCase(meta.ward)}</div>
                      <div>WILAYA {titleCase(meta.district)}</div>
                      <div>MKOA {titleCase(meta.region)}</div>
                      <div>
                        TAREHE: {formatValue(meta.letter_date, "__/__/____")}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px]">
                    <div className="font-semibold">
                      KUMBUKUMBU NA:{" "}
                      {formatValue(meta.reference_no, "SM/SN/KN/____")}
                    </div>
                    <div>
                      KWA: {formatValue(meta.to, "Husika / Yeyote Anayehusika")}
                    </div>
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
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {titleCase(meta.mtaa)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Kata</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {titleCase(meta.ward)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Wilaya</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {titleCase(meta.district)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                      <span className="font-semibold">Mkoa</span>
                      <span className="border-b border-dotted border-slate-400 pb-0.5">
                        {titleCase(meta.region)}
                      </span>
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
                    Sababu ya barua:{" "}
                    {formatValue(data.purpose, "________________")}
                  </div>

                  <div className="mt-3 space-y-1">
                    <div>
                      Maelezo hayo hapo juu ni sahihi kwa kadri ya taarifa
                      tulizonazo.
                    </div>
                    <div>Hivyo basi naomba apatiwe huduma anayoiomba.</div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div>
                      Imesainiwa na: ________________________________ Mhuri:
                      ______________
                    </div>
                    <div>
                      Jina la Afisa: ________________________________ Saini:
                      ______________
                    </div>
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

export default RequestDetail;
