import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from './ui/Section';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  ArrowUp,
} from 'lucide-react';

const quickLinks = [
  { labelKey: 'nav.home', to: '/' },
  { labelKey: 'nav.about', to: '/introduction' },
  { labelKey: 'nav.leadership', to: '/leadership' },
  { labelKey: 'nav.gallery', to: '/gallery' },
  { labelKey: 'nav.notice', to: '/notices' },
  { labelKey: 'nav.contact', to: '/contact' },
];

const socials = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', classes: 'bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/30 hover:shadow-lg hover:shadow-[#1877F2]/50' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', classes: 'bg-black text-white shadow-md shadow-black/25 hover:shadow-lg hover:shadow-black/40' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', classes: 'bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#F56040] text-white shadow-md shadow-[#E1306C]/35 hover:shadow-lg hover:shadow-[#E1306C]/50' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', classes: 'bg-[#0A66C2] text-white shadow-md shadow-[#0A66C2]/30 hover:shadow-lg hover:shadow-[#0A66C2]/50' },
];

export function Footer() {
  const { t } = useTranslation();
  const { footerLogo, contact } = useSite();
  const { isNepali, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const companyName = isNepali ? 'जेरो इन्फिनिटी टेक्नोलोजी' : 'Zero Infinity Technology';
  const letters = companyName.split('');

  const handlePhoneClick = () => {
    const phone = isNepali ? (contact?.phoneNe || contact?.phone || '9824380896') : (contact?.phoneEn || contact?.phone || '9824380896');
    window.location.href = `tel:${phone}`;
  };

  const handleEmailClick = () => {
    const email = isNepali ? (contact?.emailNe || contact?.email || 'nepalisena@gmail.com') : (contact?.emailEn || contact?.email || 'nepalisena@gmail.com');
    window.location.href = `mailto:${email}`;
  };

  const handleAddressClick = () => {
    const address = isNepali
      ? (contact?.addressNe || contact?.address || 'सैनिक स्मृति स्थल, पुलचोक, ललितपुर, नेपाल')
      : (contact?.addressEn || contact?.address || 'Sainik Smriti Sthal, Pulchowk, Lalitpur, Nepal');
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 overflow-hidden bg-white text-gray-800">
      {/* Top hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

      <Container className="relative pb-8 pt-16">
        {/* Brand band */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-gray-200 pb-12 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="group relative shrink-0 rounded-full p-[2px]">
              <span className="absolute inset-0 rounded-full border border-gray-200 transition-colors duration-500 group-hover:border-gold" />
              <img
                src={footerLogo?.logo?.url || 'https://placehold.co/88x88/EFEDE6/1F3D2B?text=Logo'}
                alt="Footer Logo"
                className="h-[4.5rem] w-[4.5rem] rounded-full border border-gray-200 object-cover"
              />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-army md:text-3xl">
                {t('footer.nepalArmy')}
              </h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.35em] text-gold-dark">
                {t('footer.exArmyAssociation')}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                {t('footer.servingNation')}
              </p>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">
              {t('footer.followUs')}
            </span>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label, classes }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`grid h-11 w-11 place-items-center rounded-xl transition-all duration-300 hover:-translate-y-1 ${classes}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Links */}
          <div>
            <h4 className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-800">
              {t('footer.quickLinks')} <span className="h-px flex-1 bg-gray-200" />
            </h4>
            <ul className="grid grid-cols-2 gap-x-6">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group/link relative inline-block py-1.5 text-sm text-gray-500 transition-colors duration-300 hover:text-army"
                  >
                    {t(link.labelKey)}
                    <span className="absolute bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover/link:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - underline grows gold on hover, no bg change */}
          <div>
            <h4 className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-800">
              {t('footer.contactUs')} <span className="h-px flex-1 bg-gray-200" />
            </h4>
            <ul className="space-y-4">
              <li onClick={handleAddressClick} className="group/item cursor-pointer">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                  <span className="relative text-sm leading-snug text-gray-500 transition-colors duration-300 group-hover/item:text-army">
                    {isNepali
                      ? (contact?.addressNe || contact?.address || 'सैनिक स्मृति स्थल, पुलचोक, ललितपुर, नेपाल')
                      : (contact?.addressEn || contact?.address || 'Sainik Smriti Sthal, Pulchowk, Lalitpur, Nepal')}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover/item:scale-x-100" />
                  </span>
                </div>
              </li>
              <li onClick={handlePhoneClick} className="group/item cursor-pointer">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold-dark" />
                  <span className="relative text-sm text-gray-500 transition-colors duration-300 group-hover/item:text-army">
                    {isNepali
                      ? (contact?.phoneNe || contact?.phone || '9824380896')
                      : (contact?.phoneEn || contact?.phone || '9824380896')}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover/item:scale-x-100" />
                  </span>
                </div>
              </li>
              <li onClick={handleEmailClick} className="group/item cursor-pointer break-all">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                  <span className="relative text-sm text-gray-500 transition-colors duration-300 group-hover/item:text-army">
                    {isNepali
                      ? (contact?.emailNe || contact?.email || 'nepalisena@gmail.com')
                      : (contact?.emailEn || contact?.email || 'nepalisena@gmail.com')}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover/item:scale-x-100" />
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Office hours */}
          <div>
            <h4 className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-800">
              {t('footer.officeHours')} <span className="h-px flex-1 bg-gray-200" />
            </h4>
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-gray-200 px-4 py-3 transition-colors duration-300 hover:border-gold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: '#22c55e' }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              </span>
              <span className="text-sm text-gray-600">{t('footer.officeHoursTime')}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {t('footer.visitUs')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-7 text-center md:flex-row md:text-left">
          <p className="text-xs tracking-wide text-gray-400">
            &copy; {currentYear} {isNepali ? 'नेपाल राष्ट्रिय पूर्व सैनिक संघ' : 'Nepal National Ex-Army Association'}. {t('footer.allRightsReserved')}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
              {t('footer.poweredBy')}
            </span>
            <a
              href="https://zeroinfinitytechnologies.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center overflow-hidden text-sm font-bold tracking-wider"
            >
              <span className="inline-flex">
                {letters.map((letter, index) => (
                  <span
                    key={index}
                    className="animate-letter-scroll inline-block"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </span>
              <span className="absolute bottom-0 left-0 h-px w-full scale-x-0 bg-gradient-to-r from-violet-400 to-purple-500 transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          </div>
        </div>
      </Container>

      {/* Scroll to Top - outline style on light theme */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group fixed bottom-8 right-8 z-50 grid h-12 w-12 place-items-center rounded-full border border-army/30 bg-army/90 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-army-dark hover:border-army"
      >
        <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>

      {/* CSS Animations */}
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
          background: linear-gradient(to right, #8b5cf6, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
