import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, FileCheck, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-gradient text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Official Government Service</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
            Mtaa Resident Registration
            <span className="block text-accent mt-2">&amp; Verification System</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Your first point of verification for government services. Request residence letters, 
            NIDA verification, and license approvals from your local Serikali ya Mtaa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="accent" size="xl" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link to="/officer-login">Officer Portal</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-primary-foreground/20 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl md:text-3xl font-bold">5,000+</div>
              <div className="text-sm text-primary-foreground/70">Registered Citizens</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <FileCheck className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl md:text-3xl font-bold">12,000+</div>
              <div className="text-sm text-primary-foreground/70">Letters Issued</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl md:text-3xl font-bold">24hrs</div>
              <div className="text-sm text-primary-foreground/70">Avg. Processing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
