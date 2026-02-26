import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import { useMe } from "@/hooks/use-me";

type ProfilePayload = {
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  age?: number;
  address?: string;
  nida_number?: string;
  position?: string;
  office?: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: me, refetch } = useMe();
  const [isSaving, setIsSaving] = useState(false);

  const initialData = useMemo(() => {
    return {
      full_name: me?.user.full_name || "",
      email: me?.user.email || "",
      phone: me?.profile?.phone || "",
      gender: me?.profile?.gender || "",
      age: me?.profile?.age ? String(me.profile.age) : "",
      address: me?.profile?.address || "",
      nida_number: me?.profile?.nida_number || "",
      position: me?.profile?.position || "",
      office: me?.profile?.office || "",
    };
  }, [me]);

  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    clearTokens();
    navigate("/");
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) {
      return;
    }

    const payload: ProfilePayload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    if (me.user.role === "citizen") {
      payload.gender = form.gender || undefined;
      payload.age = form.age ? Number(form.age) : undefined;
      payload.address = form.address.trim();
      payload.nida_number = form.nida_number.trim();
    } else {
      payload.position = form.position.trim();
      payload.office = form.office.trim();
    }

    setIsSaving(true);
    try {
      await apiFetch("/api/profile/", {
        method: "PUT",
        body: payload,
      });
      await refetch();
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed.";
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header isLoggedIn={true} userRole={me?.user.role || "citizen"} onLogout={handleLogout} />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Profile</CardTitle>
              <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              {!me ? (
                <div className="py-6 text-sm text-muted-foreground">Loading profile...</div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={form.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>

                  {me?.user.role === "citizen" ? (
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={form.gender} onValueChange={(value) => handleChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
                </div>

                {me?.user.role === "citizen" ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          min="18"
                          max="120"
                          value={form.age}
                          onChange={(e) => handleChange("age", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nida_number">NIDA Number</Label>
                        <Input
                          id="nida_number"
                          value={form.nida_number}
                          onChange={(e) => handleChange("nida_number", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={form.position}
                          onChange={(e) => handleChange("position", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="office">Office</Label>
                        <Input
                          id="office"
                          value={form.office}
                          onChange={(e) => handleChange("office", e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
