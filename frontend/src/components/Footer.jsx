import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './ui/Section';
import { useSite } from '../context/SiteContext';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const { footerLogo, contact } = useSite();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-army-dark text-white/80">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <div className="flex items-center gap-3">
              <img 
                src={footerLogo?.logo?.url || 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo'} 
                alt="Footer Logo" 
                className="h-16 w-16 rounded-full object-cover border-2 border-gold/30"
              />
              <div>
                <h3 className="font-display font-bold text-lg text-white">Nepal Army</h3>
                <p className="text-xs text-white/60">Ex-Army Association</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Serving the nation through unity, honor, and commitment to social service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/introduction" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/leadership" className="hover:text-gold transition-colors">Leadership</Link></li>
              <li><Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>{contact?.address || 'Kathmandu, Nepal'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <span>{contact?.phone || '+977-1-1234567'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <span>{contact?.email || 'info@nepalarmy.org'}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 hover:bg-gold p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-gold p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-gold p-2 rounded-full transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/40">
          &copy; {currentYear} Nepal National Ex-Army Association. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;