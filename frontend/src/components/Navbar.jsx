import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { Container } from './ui/Section';
import { useSite } from '../context/SiteContext';

// Navigation configuration
export const navConfig = {
  home: { label: 'Home', to: '/', dropdown: [
    { label: 'Overview', to: '/' },
    { label: 'Central Executive Committee', to: '/central-committee' },
  ]},
  about: { label: 'About Us', to: '/introduction', dropdown: [
    { label: 'Introduction', to: '/introduction' },
    { label: 'Mission', to: '/mission' },
    { label: 'Leadership', to: '/leadership' },
    { label: 'Council', to: '/council' },
    { label: 'History & Foundation', to: '/history-foundation' },
  ]},
  activities: { label: 'Activities', to: '/task-program', dropdown: [
    { label: 'Task Program', to: '/task-program' },
  ]},
  publication: { label: 'Publication', to: '/news', dropdown: [
    { label: 'News', to: '/news' },
    { label: 'Articles', to: '/articles' },
    { label: 'Interviews', to: '/interviews' },
  ]},
  notices: { label: 'Notice', to: '/notices', dropdown: [] },
  events: { label: 'Events', to: '/events', dropdown: [] },
  gallery: { label: 'Gallery', to: '/gallery', dropdown: [] },
  askme: { label: 'AskME', to: '/faqs', dropdown: [{ label: 'FAQs', to: '/faqs' }] },
  security: { label: 'Security', to: '/training', dropdown: [
    { label: 'Training', to: '/training' },
    { label: 'Security Rules', to: '/security-rules' },
  ]},
  contact: { label: 'Contact', to: '/contact', dropdown: [] },
};

export function Navbar() {
  const { headerLogos } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileDropdown(null);
    setOpen(false);
  }, [location.pathname]);

  const isItemActive = (config) =>
    location.pathname === config.to ||
    config.dropdown?.some((d) => d.to === location.pathname);

  const handleNavClick = (key, config, e) => {
    e.preventDefault();
    if (config.dropdown && config.dropdown.length > 0) {
      setActiveDropdown(activeDropdown === key ? null : key);
    } else {
      navigate(config.to);
    }
  };

  const navItems = Object.entries(navConfig);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_2px_rgba(16,24,40,0.08)]' : ''
      }`}
    >
      <div className="relative bg-gold border-b-2 border-army/20 py-2">
        <Container className="flex h-24 items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full overflow-hidden bg-white ring-2 ring-army/30 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:ring-army/60">
              <img 
                src={headerLogos?.leftLogo?.url || 'https://placehold.co/100x100/1F3D2B/FFFFFF?text=Logo'} 
                alt="Association logo" 
                className="h-full w-full object-cover" 
              />
            </span>
            <div className="min-w-0">
              <div className="font-display font-extrabold text-xl md:text-2xl leading-tight tracking-tight text-army">
                नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ
              </div>
              <div className="font-display font-semibold text-sm md:text-base leading-snug text-army/80">
                Nepal National Ex-Army Association
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-army/30 shadow-md">
                <img 
                  src={headerLogos?.rightLogo?.url || 'https://placehold.co/100x100/1F3D2B/FFFFFF?text=Flag'} 
                  alt="Nepal flag emblem" 
                  className="h-full w-full object-cover" 
                />
              </span>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden grid h-11 w-11 place-items-center rounded-lg text-army hover:bg-army/10 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </Container>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden lg:block bg-army shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-visible">
        <Container className="flex items-center justify-between overflow-visible">
          <div className="flex items-center gap-1 overflow-visible no-scrollbar flex-1">
            {navItems.map(([key, config]) => (
              <div
                key={key}
                className="relative group flex-shrink-0"
                onMouseEnter={() => {
                  if (config.dropdown && config.dropdown.length > 0) setActiveDropdown(key);
                }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={(e) => handleNavClick(key, config, e)}
                  className={`relative px-3 py-2.5 text-sm font-medium text-white/90 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 rounded-md hover:bg-white/10 ${
                    isItemActive(config) ? 'text-white bg-white/10' : ''
                  }`}
                >
                  {config.label}
                  {config.dropdown && config.dropdown.length > 0 && (
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        activeDropdown === key ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {config.dropdown && config.dropdown.length > 0 && (
                  <AnimatePresence>
                    {activeDropdown === key && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-[calc(100%-2px)] w-64 bg-white rounded-b-lg shadow-xl border border-gray-200 overflow-hidden z-[9999]"
                      >
                        {config.dropdown.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-4 py-2.5 text-sm text-gray-700 hover:bg-army hover:text-white transition-colors ${
                              location.pathname === item.to ? 'bg-army text-white' : ''
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="relative px-3 py-2.5 text-white/90 hover:text-white transition-colors flex-shrink-0 rounded-md hover:bg-white/10"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </Container>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-army overflow-hidden max-h-[80vh] overflow-y-auto relative z-[9999]"
          >
            <Container className="py-4 flex flex-col gap-1">
              {navItems.map(([key, config]) => {
                const isMobileOpen = mobileDropdown === key;
                return (
                  <div key={key} className="border-b border-white/10 last:border-0">
                    <button
                      onClick={() => {
                        if (config.dropdown && config.dropdown.length > 0) {
                          setMobileDropdown(isMobileOpen ? null : key);
                        } else {
                          navigate(config.to);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-between"
                    >
                      {config.label}
                      {config.dropdown && config.dropdown.length > 0 && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isMobileOpen ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {config.dropdown && config.dropdown.length > 0 && (
                      <AnimatePresence>
                        {isMobileOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1 pb-2"
                          >
                            {config.dropdown.map((item) => (
                              <Link
                                key={item.to}
                                to={item.to}
                                className="block px-4 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => {
                  setOpen(false);
                  setSearchOpen(true);
                }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.header>
  );
}

export default Navbar;