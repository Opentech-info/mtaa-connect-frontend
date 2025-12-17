import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  Mtaa System
                </h3>
                <p className="text-xs text-muted-foreground">Serikali ya Mtaa</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering local governance through digital verification services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Citizen Portal
              </Link>
              <Link to="/officer-login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Officer Portal
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Ofisi ya Serikali ya Mtaa</p>
              <p>Dar es Salaam, Tanzania</p>
              <p>support@mtaasystem.go.tz</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mtaa Resident Registration System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
