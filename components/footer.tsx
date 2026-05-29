import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold">Ajabu Beads</h3>
            <p className="text-sm text-primary-foreground/90">
              Handcrafted beads and bracelets celebrating African and Indian artistry with ethical practices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:underline text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-primary-foreground/90">+254 712 345 678</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-primary-foreground/90">hello@ajubeads.com</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-primary-foreground/90">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>&copy; 2024 Ajabu Beads. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary-foreground transition-colors">
                Instagram
              </Link>
              <Link href="#" className="hover:text-primary-foreground transition-colors">
                Facebook
              </Link>
              <Link href="#" className="hover:text-primary-foreground transition-colors">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
