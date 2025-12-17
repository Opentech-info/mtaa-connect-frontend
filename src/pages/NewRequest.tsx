import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate request submission
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Request Submitted",
        description: "Your letter request has been submitted successfully. You will be notified once it's processed.",
      });
      navigate("/dashboard");
    }, 1500);
  };

  const handleLogout = () => {
    navigate("/");
  };

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
