import { FileText, CreditCard, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Home,
    title: "Residence Letter",
    description: "Official proof of residence for various government and private applications.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CreditCard,
    title: "NIDA Verification",
    description: "Verification letter supporting your National ID registration process.",
    color: "bg-success/10 text-success",
  },
  {
    icon: FileText,
    title: "License Verification",
    description: "Character verification for business and professional license applications.",
    color: "bg-accent/10 text-accent-foreground",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
            Our Verification Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Serikali ya Mtaa provides essential verification documents to support citizens 
            in accessing government and private sector services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {service.description}
              </p>
              <Link
                to="/register"
                className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                Request Now
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
