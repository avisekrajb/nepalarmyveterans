import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './ui/Section';
import { useSite } from '../context/SiteContext';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const { footerLogo, contact } = useSite();
  const currentYear = new Date().getFullYear();

  // Company name with individual letters for the scroll animation
  const companyName = "Zero Infinity Technology";
  const letters = companyName.split('');

  return (
    <footer className="bg-gold border-t-2 border-army/20">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <div className="flex items-center gap-3">
              <img 
                src={footerLogo?.logo?.url || 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo'} 
                alt="Footer Logo" 
                className="h-16 w-16 rounded-full object-cover border-2 border-army/30 shadow-md"
              />
              <div>
                <h3 className="font-display font-bold text-lg text-army">Nepal Army</h3>
                <p className="text-xs text-army/60">Ex-Army Association</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-army/70 leading-relaxed">
              Serving the nation through unity, honor, and commitment to social service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-army mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-army/70 hover:text-army transition-colors hover:translate-x-1 inline-block">Home</Link></li>
              <li><Link to="/introduction" className="text-army/70 hover:text-army transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
              <li><Link to="/leadership" className="text-army/70 hover:text-army transition-colors hover:translate-x-1 inline-block">Leadership</Link></li>
              <li><Link to="/gallery" className="text-army/70 hover:text-army transition-colors hover:translate-x-1 inline-block">Gallery</Link></li>
              <li><Link to="/contact" className="text-army/70 hover:text-army transition-colors hover:translate-x-1 inline-block">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-army mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-army/70">
                <MapPin className="h-4 w-4 text-army shrink-0 mt-0.5" />
                <span>{contact?.address || 'Kathmandu, Nepal'}</span>
              </li>
              <li className="flex items-center gap-3 text-army/70">
                <Phone className="h-4 w-4 text-army shrink-0" />
                <span>{contact?.phone || '+977-1-1234567'}</span>
              </li>
              <li className="flex items-center gap-3 text-army/70">
                <Mail className="h-4 w-4 text-army shrink-0" />
                <span>{contact?.email || 'info@nepalarmy.org'}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-army mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="bg-army/10 hover:bg-army text-army hover:text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-army/10 hover:bg-army text-army hover:text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-army/10 hover:bg-army text-army hover:text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom with Scroll Animation */}
        <div className="border-t border-army/20 mt-8 pt-6">
          <div className="text-center">
            <p className="text-sm text-army/40">
              &copy; {currentYear} Nepal National Ex-Army Association. All rights reserved.
            </p>

            {/* Powered By with Scrolling Letters Animation */}
            <div className="mt-3 flex items-center justify-center gap-2 overflow-hidden">
              <span className="text-sm text-army/40">Powered by</span>
              <a
                href="https://zeroinfinitytechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300 hover:underline inline-flex"
              >
                {/* Scrolling letter-by-letter animation */}
                <span className="inline-flex overflow-hidden">
                  {letters.map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block animate-letter-scroll"
                      style={{
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* CSS Animation */}
      <style>{`
        @keyframes letterScroll {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          20% {
            transform: translateY(0);
            opacity: 1;
          }
          80% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        .animate-letter-scroll {
          animation: letterScroll 3s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </footer>
  );
}

export default Footer;