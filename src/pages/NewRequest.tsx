import { useEffect, useState } from "react";
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

const NewRequest = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "";
  
  const [formData, setFormData] = useState({
    letterType: initialType,
    purpose: "",
    additionalInfo: "",
    urgency: "normal",
  });
  const [residence, setResidence] = useState({
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResidenceChange = (field: keyof typeof residence, value: string) => {
    setResidence((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const metadata =
        formData.letterType === "residence"
          ? {
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
            }
          : {};

      await apiFetch("/api/requests/", {
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
        title: "Request Submitted",
        description: "Your letter request has been submitted successfully. You will be notified once it's processed.",
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

  const selectedTypeInfo = formData.letterType ? letterTypeInfo[formData.letterType as keyof typeof letterTypeInfo] : null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header isLoggedIn={true} userRole="citizen" onLogout={handleLogout} />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <Card className="shadow-elevated animate-scale-in">
            <CardHeader>
              <CardTitle className="font-display text-2xl">New Letter Request</CardTitle>
              <CardDescription>
                Fill in the details below to request a verification letter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Letter Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="letterType">Letter Type *</Label>
                  <Select 
                    value={formData.letterType} 
                    onValueChange={(value) => handleChange("letterType", value)}
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

                {/* Selected Type Info */}
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

                {/* Purpose */}
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

                {formData.letterType === "residence" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                      Resident Letter Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reference_no">Kumbukumbu Na.</Label>
                        <Input
                          id="reference_no"
                          placeholder="SM/SN/KN/____"
                          value={residence.reference_no}
                          onChange={(e) => handleResidenceChange("reference_no", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to">KWA (Anayehusika)</Label>
                        <Input
                          id="to"
                          placeholder="Husika / Yeyote Anayehusika"
                          value={residence.to}
                          onChange={(e) => handleResidenceChange("to", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="letter_date">Tarehe ya Barua</Label>
                        <Input
                          id="letter_date"
                          type="date"
                          value={residence.letter_date}
                          onChange={(e) => handleResidenceChange("letter_date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ward">Kata</Label>
                        <Input
                          id="ward"
                          placeholder="Mfano: Nyakato"
                          value={residence.ward}
                          onChange={(e) => handleResidenceChange("ward", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mtaa">Mtaa</Label>
                        <Input
                          id="mtaa"
                          placeholder="Mfano: Mtaa wa Nyakato"
                          value={residence.mtaa}
                          onChange={(e) => handleResidenceChange("mtaa", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Mkoa</Label>
                        <Input
                          id="region"
                          placeholder="Mfano: Mara"
                          value={residence.region}
                          onChange={(e) => handleResidenceChange("region", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">Wilaya</Label>
                        <Input
                          id="district"
                          placeholder="Mfano: Musoma"
                          value={residence.district}
                          onChange={(e) => handleResidenceChange("district", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="house_no">Nyumba No.</Label>
                        <Input
                          id="house_no"
                          placeholder="Nyumba No"
                          value={residence.house_no}
                          onChange={(e) => handleResidenceChange("house_no", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birth_date">Tarehe ya Kuzaliwa</Label>
                        <Input
                          id="birth_date"
                          type="date"
                          value={residence.birth_date}
                          onChange={(e) => handleResidenceChange("birth_date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupation">Kazi</Label>
                        <Input
                          id="occupation"
                          placeholder="Kazi"
                          value={residence.occupation}
                          onChange={(e) => handleResidenceChange("occupation", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stay_duration">Muda wa Makazi</Label>
                        <Input
                          id="stay_duration"
                          placeholder="Mfano: Miaka 3"
                          value={residence.stay_duration}
                          onChange={(e) => handleResidenceChange("stay_duration", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Urgency */}
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select 
                    value={formData.urgency} 
                    onValueChange={(value) => handleChange("urgency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (2-3 business days)</SelectItem>
                      <SelectItem value="urgent">Urgent (1 business day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Information */}
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

                {/* Terms */}
                <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
                  <input type="checkbox" id="confirm" className="mt-1 rounded border-border" required />
                  <label htmlFor="confirm" className="text-sm text-muted-foreground">
                    I confirm that all information provided is accurate and I understand that 
                    providing false information may result in rejection of my request.
                  </label>
                </div>

                {/* Submit Button */}
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
                    disabled={isLoading || !formData.letterType}
                  >
                    {isLoading ? "Submitting..." : "Submit Request"}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewRequest;
