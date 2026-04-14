import { Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Hotel className="h-6 w-6 text-primary" />
              <span className="font-heading text-lg font-bold">Grand Haven</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Experience luxury and comfort at its finest. Your perfect stay awaits.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground">Quick Links</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/rooms" className="hover:text-primary transition-colors">Rooms</Link>
              <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground">Contact</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <p>123 Luxury Avenue, New York</p>
              <p>+1 (555) 123-4567</p>
              <p>info@grandhaven.com</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 Grand Haven Hotel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
