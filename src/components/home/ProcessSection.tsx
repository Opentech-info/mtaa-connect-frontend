import { UserPlus, FileEdit, Clock, Download } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register Account",
    description: "Create your citizen account with basic personal information.",
  },
  {
    icon: FileEdit,
    step: "02",
    title: "Submit Request",
    description: "Choose the type of verification letter you need and provide details.",
  },
  {
    icon: Clock,
    step: "03",
    title: "Await Approval",
    description: "Local officers review your request and verify your information.",
  },
  {
    icon: Download,
    step: "04",
    title: "Download Letter",
    description: "Once approved, download your official verification letter as PDF.",
  },
];

const ProcessSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting your verification letter is simple and straightforward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              {/* Step Number */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-card shadow-card border border-border mb-4">
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full hero-gradient text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
