import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Home, CreditCard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import { useMe } from "@/hooks/use-me";

const letterTypeInfo = {
  residence: {
    icon: Home,
    title: "Residence Letter",
    description: "Official proof of residence for government and private sector applications.",
  },
  nida: {
    icon: CreditCard,
    title: "NIDA Verification Letter",
    description: "Verification letter to support your National ID registration process.",
  },
  license: {
    icon: FileText,
    title: "License Verification Letter",
    description: "Character verification letter for business and professional license applications.",
  },
};

type ResidenceData = {
  reference_no: string;
  to: string;
  ward: string;
  mtaa: string;
  region: string;
  district: string;
  house_no: string;
  birth_date: string;
  occupation: string;
  stay_duration: string;
  letter_date: string;
};

type RequestDetailResponse = {
  id: number;
  request_type: "residence" | "nida" | "license";
  status: "pending" | "approved" | "rejected";
  purpose: string;
  additional_info?: string;
  urgency?: string;
  metadata?: Partial<ResidenceData>;
};

const requiredLetterFields: (keyof ResidenceData)[] = [
  "reference_no",
  "to",
  "ward",
  "mtaa",
  "region",
  "district",
  "house_no",
  "birth_date",
  "occupation",
  "stay_duration",
  "letter_date",
];

const letterFieldLabels: Record<keyof ResidenceData, string> = {
  reference_no: "Kumbukumbu Na.",
  to: "KWA (Anayehusika)",
  ward: "Kata",
  mtaa: "Mtaa",
  region: "Mkoa",
  district: "Wilaya",
  house_no: "Nyumba No.",
  birth_date: "Tarehe ya Kuzaliwa",
  occupation: "Kazi",
  stay_duration: "Muda wa Makazi",
  letter_date: "Tarehe ya Barua",
};

const subjectMap: Record<"residence" | "nida" | "license", string> = {
  residence: "UTAMBULISHO WA MKAZI",
  nida: "UTAMBULISHO WA NIDA",
  license: "UTAMBULISHO WA LESENI",
};

const NewRequest = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const resubmitId = searchParams.get("resubmit");
  const { data: me } = useMe();

  const [formData, setFormData] = useState({
    letterType: initialType,
    purpose: "",
    additionalInfo: "",
    urgency: "normal",
  });
  const [residence, setResidence] = useState<ResidenceData>({
    reference_no: "",
    to: "",
    ward: "",
    mtaa: "",
    region: "",
    district: "",
    house_no: "",
    birth_date: "",
    occupation: "",
    stay_duration: "",
    letter_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(false);
  const [resubmitStatus, setResubmitStatus] = useState<RequestDetailResponse["status"] | null>(
    null
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResidenceChange = (field: keyof ResidenceData, value: string) => {
    setResidence((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!resubmitId) {
      return;
    }

    let isActive = true;

    const loadRequest = async () => {
      setIsPrefilling(true);
      try {
        const data = await apiFetch<RequestDetailResponse>(`/api/requests/${resubmitId}/`);
        if (!isActive) {
          return;
        }
        setResubmitStatus(data.status);
        setFormData({
          letterType: data.request_type,
          purpose: data.purpose || "",
          additionalInfo: data.additional_info || "",
          urgency: data.urgency || "normal",
        });
        setResidence((prev) => ({
          ...prev,
          reference_no: data.metadata?.reference_no || "",
          to: data.metadata?.to || "",
          ward: data.metadata?.ward || "",
          mtaa: data.metadata?.mtaa || "",
          region: data.metadata?.region || "",
          district: data.metadata?.district || "",
          house_no: data.metadata?.house_no || "",
          birth_date: data.metadata?.birth_date || "",
          occupation: data.metadata?.occupation || "",
          stay_duration: data.metadata?.stay_duration || "",
          letter_date: data.metadata?.letter_date || "",
        }));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load request.";
        toast({
          title: "Unable to Load Request",
          description: message,
          variant: "destructive",
        });
      } finally {
        if (isActive) {
          setIsPrefilling(false);
        }
      }
    };

    loadRequest();
    return () => {
      isActive = false;
    };
  }, [resubmitId, toast]);

  const missingLetterFields = useMemo(
    () => requiredLetterFields.filter((field) => !residence[field].trim()),
    [residence]
  );

  const isLetterSelected = Boolean(formData.letterType);
  const isResubmitting = Boolean(resubmitId);
  const resubmitLocked = isResubmitting && resubmitStatus && resubmitStatus !== "rejected";
  const isFormValid =
    !!formData.letterType &&
    !!formData.purpose.trim() &&
    (!isLetterSelected || missingLetterFields.length === 0) &&
    !resubmitLocked;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.letterType) {
      toast({
        title: "Select Letter Type",
        description: "Choose the type of letter you are requesting.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.purpose.trim()) {
      toast({
        title: "Purpose Required",
        description: "Please provide the purpose of your request.",
        variant: "destructive",
      });
      return;
    }

    if (isLetterSelected && missingLetterFields.length > 0) {
      const missingLabels = missingLetterFields.map((field) => letterFieldLabels[field]).join(", ");
      toast({
        title: "Complete Required Fields",
        description: `Please fill in: ${missingLabels}.`,
        variant: "destructive",
      });
      return;
    }

    if (resubmitLocked) {
      toast({
        title: "Cannot Resubmit",
        description: "Only rejected requests can be edited and resubmitted.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const metadata = {
        reference_no: residence.reference_no,
        to: residence.to,
        ward: residence.ward,
        mtaa: residence.mtaa,
        region: residence.region,
        district: residence.district,
        house_no: residence.house_no,
        birth_date: residence.birth_date,
        occupation: residence.occupation,
        stay_duration: residence.stay_duration,
        letter_date: residence.letter_date,
      };

      const endpoint = isResubmitting ? `/api/requests/${resubmitId}/resubmit/` : "/api/requests/";
      await apiFetch(endpoint, {
        method: "POST",
        body: {
          request_type: formData.letterType,
          purpose: formData.purpose,
          additional_info: formData.additionalInfo,
          urgency: formData.urgency,
          metadata,
        },
      });
      toast({
        title: isResubmitting ? "Request Resubmitted" : "Request Submitted",
        description: isResubmitting
          ? "Your updated request has been sent for review. You will be notified once it's processed."
          : "Your letter request has been submitted successfully. You will be notified once it's processed.",
      });
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed.";
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    navigate("/");
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const selectedTypeInfo = formData.letterType
    ? letterTypeInfo[formData.letterType as keyof typeof letterTypeInfo]
    : null;

  const previewName = formatValue(me?.user.full_name);
  const previewPhone = formatValue(me?.profile?.phone);
  const previewAddress = formatValue(me?.profile?.address);
  const previewWard = titleCase(residence.ward);
  const previewMtaa = titleCase(residence.mtaa);
  const previewRegion = titleCase(residence.region);
  const previewDistrict = titleCase(residence.district);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header isLoggedIn={true} userRole="citizen" onLogout={handleLogout} />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          {isResubmitting && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">Editing rejected request REQ-{resubmitId}</p>
              <p className="text-amber-800">
                Update the form below and submit again. Only rejected requests can be resubmitted.
              </p>
              {isPrefilling && (
                <p className="mt-2 text-amber-700">Loading your previous request details...</p>
              )}
              {resubmitLocked && (
                <p className="mt-2 text-amber-700">
                  This request is not rejected, so it cannot be edited here.
                </p>
              )}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <Card className="shadow-elevated animate-scale-in">
              <CardHeader>
                <CardTitle className="font-display text-2xl">New Letter Request</CardTitle>
                <CardDescription>
                  Fill in the details below to request a verification letter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="letterType">Letter Type *</Label>
                  <Select
                    value={formData.letterType}
                    onValueChange={(value) => handleChange("letterType", value)}
                    disabled={isResubmitting || isPrefilling}
                  >
                      <SelectTrigger>
                        <SelectValue placeholder="Select letter type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residence">Residence Letter</SelectItem>
                        <SelectItem value="nida">NIDA Verification Letter</SelectItem>
                        <SelectItem value="license">License Verification Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTypeInfo && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <selectedTypeInfo.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{selectedTypeInfo.title}</h4>
                          <p className="text-sm text-muted-foreground">{selectedTypeInfo.description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Request *</Label>
                    <Input
                      id="purpose"
                      placeholder="e.g., Bank account opening, Job application..."
                      value={formData.purpose}
                      onChange={(e) => handleChange("purpose", e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Briefly describe why you need this letter
                    </p>
                  </div>

                  {isLetterSelected && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                        Letter Details
                      </h3>

                      <div className="rounded-lg border border-border/70 bg-muted/40 p-4 space-y-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Office Header</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="reference_no">Kumbukumbu Na. *</Label>
                            <Input
                              id="reference_no"
                              placeholder="SM/SN/KN/____"
                              value={residence.reference_no}
                              onChange={(e) => handleResidenceChange("reference_no", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="to">KWA (Anayehusika) *</Label>
                            <Input
                              id="to"
                              placeholder="Husika / Yeyote Anayehusika"
                              value={residence.to}
                              onChange={(e) => handleResidenceChange("to", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="letter_date">Tarehe ya Barua *</Label>
                            <Input
                              id="letter_date"
                              type="date"
                              value={residence.letter_date}
                              onChange={(e) => handleResidenceChange("letter_date", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border/70 bg-muted/40 p-4 space-y-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Location Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ward">Kata *</Label>
                            <Input
                              id="ward"
                              placeholder="Mfano: Nyakato"
                              value={residence.ward}
                              onChange={(e) => handleResidenceChange("ward", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mtaa">Mtaa *</Label>
                            <Input
                              id="mtaa"
                              placeholder="Mfano: Mtaa wa Nyakato"
                              value={residence.mtaa}
                              onChange={(e) => handleResidenceChange("mtaa", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="region">Mkoa *</Label>
                            <Input
                              id="region"
                              placeholder="Mfano: Mara"
                              value={residence.region}
                              onChange={(e) => handleResidenceChange("region", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="district">Wilaya *</Label>
                            <Input
                              id="district"
                              placeholder="Mfano: Musoma"
                              value={residence.district}
                              onChange={(e) => handleResidenceChange("district", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="house_no">Nyumba No. *</Label>
                            <Input
                              id="house_no"
                              placeholder="Nyumba No"
                              value={residence.house_no}
                              onChange={(e) => handleResidenceChange("house_no", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="birth_date">Tarehe ya Kuzaliwa *</Label>
                            <Input
                              id="birth_date"
                              type="date"
                              value={residence.birth_date}
                              onChange={(e) => handleResidenceChange("birth_date", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="occupation">Kazi *</Label>
                            <Input
                              id="occupation"
                              placeholder="Kazi"
                              value={residence.occupation}
                              onChange={(e) => handleResidenceChange("occupation", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stay_duration">Muda wa Makazi *</Label>
                            <Input
                              id="stay_duration"
                              placeholder="Mfano: Miaka 3"
                              value={residence.stay_duration}
                              onChange={(e) => handleResidenceChange("stay_duration", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={formData.urgency} onValueChange={(value) => handleChange("urgency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal (2-3 business days)</SelectItem>
                        <SelectItem value="urgent">Urgent (1 business day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Any additional details that might help process your request..."
                      value={formData.additionalInfo}
                      onChange={(e) => handleChange("additionalInfo", e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
                    <input type="checkbox" id="confirm" className="mt-1 rounded border-border" required />
                    <label htmlFor="confirm" className="text-sm text-muted-foreground">
                      I confirm that all information provided is accurate and I understand that
                      providing false information may result in rejection of my request.
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || isPrefilling || !isFormValid}
                    >
                      {isLoading ? "Submitting..." : "Submit Request"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="font-display text-xl">Letter Preview</CardTitle>
                <CardDescription>Preview the official letter layout before submitting.</CardDescription>
              </CardHeader>
              <CardContent>
                {!isLetterSelected ? (
                  <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Select a letter type to see a detailed preview of the official letter format.
                  </div>
                ) : (
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
                        <div>MTAA WA {previewMtaa}</div>
                        <div>KATA {previewWard}</div>
                        <div>WILAYA {previewDistrict}</div>
                        <div>MKOA {previewRegion}</div>
                        <div>TAREHE: {formatValue(residence.letter_date, "__/__/____")}</div>
                      </div>
                    </div>

                    <div className="mt-3 text-[11px]">
                      <div className="font-semibold">
                        KUMBUKUMBU NA: {formatValue(residence.reference_no, "SM/SN/KN/____")}
                      </div>
                      <div>KWA: {formatValue(residence.to, "Husika / Yeyote Anayehusika")}</div>
                    </div>

                    <div className="mt-3 text-center font-semibold">
                      YAH: {subjectMap[formData.letterType as "residence" | "nida" | "license"]}
                    </div>

                    <div className="mt-3 space-y-2">
                      <p>Husika na kichwa cha habari tajwa hapo juu.</p>
                      <p>Naomba kutambulisha na kumthibitisha ya kwamba ndugu:</p>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Jina</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">{previewName}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Amezaliwa</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">
                          {formatValue(residence.birth_date, "__/__/____")}
                        </span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Namba ya simu</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">{previewPhone}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Kazi</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">
                          {formatValue(residence.occupation)}
                        </span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Anaishi</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">{previewAddress}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Mtaa</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">{previewMtaa}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Kata</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">{previewWard}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Wilaya</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">{previewDistrict}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Mkoa</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">{previewRegion}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Nyumba No</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">
                          {formatValue(residence.house_no)}
                        </span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2 items-end">
                        <span className="font-semibold">Muda wa Makazi</span>
                        <span className="border-b border-dotted border-slate-400 pb-0.5">
                          {formatValue(residence.stay_duration)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      Sababu ya barua: {formatValue(formData.purpose, "________________")}
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewRequest;
