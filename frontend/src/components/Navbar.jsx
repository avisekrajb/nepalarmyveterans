import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, ChevronDown, ChevronRight, 
  Image as ImageIcon, Loader, Type, Minus, Plus, Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from './ui/Section';
import { useSite } from '../context/SiteContext';
import { useSize } from '../context/SizeContext';
import { useLanguage } from '../context/LanguageContext';
import { searchAllContent } from '../services/searchService';

// Navigation configuration
const navConfig = {
  home: {
    labelKey: 'nav.home',
    to: '/',
    dropdown: [
      { labelKey: 'nav.overview', to: '/' },
      { labelKey: 'nav.centralCommittee', to: '/central-committee' },
    ],
  },
  about: {
    labelKey: 'nav.about',
    to: '/introduction',
    dropdown: [
      { labelKey: 'nav.introduction', to: '/introduction' },
      { labelKey: 'nav.mission', to: '/mission' },
      { labelKey: 'nav.leadership', to: '/leadership' },
      { labelKey: 'nav.teamAndTreasury', to: '/treasuryteams' },
      { labelKey: 'nav.historyAndFoundation', to: '/history-foundation' },
    ],
  },
  activities: {
    labelKey: 'nav.activities',
    to: '/task-program',
    dropdown: [{ labelKey: 'nav.taskProgram', to: '/task-program' }],
  },
  publication: {
    labelKey: 'nav.publication',
    to: '/news',
    dropdown: [
      { labelKey: 'nav.news', to: '/news' },
      { labelKey: 'nav.articles', to: '/articles' },
      { labelKey: 'nav.interviews', to: '/interviews' },
    ],
  },
  notices: { labelKey: 'nav.notice', to: '/notices', dropdown: [] },
  events: { labelKey: 'nav.events', to: '/events', dropdown: [] },
  gallery: { labelKey: 'nav.gallery', to: '/gallery', dropdown: [] },
  askme: { labelKey: 'nav.askme', to: '/faqs', dropdown: [{ labelKey: 'nav.faqs', to: '/faqs' }] },
  security: {
    labelKey: 'nav.security',
    to: '/training',
    dropdown: [
      { labelKey: 'nav.training', to: '/training' },
      { labelKey: 'nav.securityRules', to: '/security-rules' },
    ],
  },
  contact: { labelKey: 'nav.contact', to: '/contact', dropdown: [] },
};

// Static pages for search
const staticPages = [
  { label: 'Home', to: '/', category: 'Page', content: 'Welcome to Nepal National Ex-Army Association' },
  { label: 'Central Executive Committee', to: '/central-committee', category: 'Page', content: 'Meet our dedicated leaders' },
  { label: 'Introduction', to: '/introduction', category: 'Page', content: 'Learn about our association' },
  { label: 'Mission', to: '/mission', category: 'Page', content: 'Our mission to serve the nation' },
  { label: 'Leadership', to: '/leadership', category: 'Page', content: 'Meet our leadership team' },
  { label: 'Council', to: '/council', category: 'Page', content: 'Our advisory council' },
  { label: 'History & Foundation', to: '/history-foundation', category: 'Page', content: 'Our journey' },
  { label: 'Task Program', to: '/task-program', category: 'Page', content: 'Our programs and initiatives' },
  { label: 'News', to: '/news', category: 'Page', content: 'Latest news and updates' },
  { label: 'Articles', to: '/articles', category: 'Page', content: 'Articles from our members' },
  { label: 'Interviews', to: '/interviews', category: 'Page', content: 'Exclusive interviews' },
  { label: 'Notices', to: '/notices', category: 'Page', content: 'Important announcements' },
  { label: 'Events', to: '/events', category: 'Page', content: 'Upcoming events' },
  { label: 'Gallery', to: '/gallery', category: 'Page', content: 'Photo gallery' },
  { label: 'FAQs', to: '/faqs', category: 'Page', content: 'Frequently asked questions' },
  { label: 'Training', to: '/training', category: 'Page', content: 'Training programs' },
  { label: 'Security Rules', to: '/security-rules', category: 'Page', content: 'Security guidelines' },
  { label: 'Contact', to: '/contact', category: 'Page', content: 'Get in touch with us' },
];

export function Navbar() {
  const { t } = useTranslation();
  const { headerLogos } = useSite();
  const { fontSize, increaseSize, decreaseSize, MIN_SIZE, MAX_SIZE } = useSize();
  const { language, setLanguage, isNepali } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSizeControls, setShowSizeControls] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const sizeControlRef = useRef(null);
  const langRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        setSearchLoading(false);
      }
      if (sizeControlRef.current && !sizeControlRef.current.contains(event.target)) {
        setShowSizeControls(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileDropdown(null);
    setOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSearchLoading(false);
    setShowSizeControls(false);
    setLangOpen(false);
  }, [location.pathname]);

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      const query = searchQuery.trim();
      if (query.length > 0) {
        setSearchLoading(true);
        
        try {
          const pageResults = staticPages.filter(item => {
            const labelMatch = item.label.toLowerCase().includes(query.toLowerCase());
            const contentMatch = item.content?.toLowerCase().includes(query.toLowerCase());
            return labelMatch || contentMatch;
          }).map(item => ({
            ...item,
            id: `page-${item.label}`,
            title: item.label,
            type: 'page'
          }));

          const dynamicResults = await searchAllContent(query);
          
          let allResults = [...pageResults, ...dynamicResults];
          
          const uniqueResults = [];
          const seen = new Set();
          allResults.forEach(item => {
            const key = `${item.title}-${item.link || item.to}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueResults.push(item);
            }
          });

          uniqueResults.sort((a, b) => {
            const aTitle = a.title?.toLowerCase() || '';
            const bTitle = b.title?.toLowerCase() || '';
            const queryLower = query.toLowerCase();
            
            if (aTitle === queryLower && bTitle !== queryLower) return -1;
            if (bTitle === queryLower && aTitle !== queryLower) return 1;
            
            if (aTitle.startsWith(queryLower) && !bTitle.startsWith(queryLower)) return -1;
            if (bTitle.startsWith(queryLower) && !aTitle.startsWith(queryLower)) return 1;
            
            if (aTitle.includes(queryLower) && !bTitle.includes(queryLower)) return -1;
            if (bTitle.includes(queryLower) && !aTitle.includes(queryLower)) return 1;
            
            return 0;
          });

          setSearchResults(uniqueResults);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      const firstResult = searchResults[0];
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      navigate(firstResult.link || firstResult.to);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleResultClick = (result) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(result.link || result.to);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

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

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    try {
      const parts = text.split(new RegExp(`(${query})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? 
          <span key={i} className="bg-yellow-200 text-yellow-800 px-0.5 rounded">{part}</span> : 
          part
      );
    } catch {
      return text;
    }
  };

  const navItems = Object.entries(navConfig);
  const sizePercentage = Math.round(fontSize * 100);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_2px_rgba(16,24,40,0.08)]' : ''
        }`}
      >
        {/* Top bar */}
        <div className="relative bg-[#FCC202] border-b-2 border-army/20 py-2">
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

            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-army/30 shadow-md">
                  <img
                    src={headerLogos?.rightLogo?.url || 'https://placehold.co/100x100/1F3D2B/FFFFFF?text=Flag'}
                    alt="Nepal flag emblem"
                    className="h-full w-full object-cover"
                  />
                </span>
              </div>

              {/* Mobile Menu Toggle - Only visible on mobile */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="lg:hidden grid h-11 w-11 place-items-center rounded-lg text-army hover:bg-army/10 transition-colors"
                aria-label="Toggle menu"
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </Container>
        </div>

        {/* Desktop Nav - Search + Font Controls Here */}
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
                        {t(config.labelKey)}
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
                              {t(item.labelKey)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Right Controls - Language (Left) + Search + Font Size */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors hover:scale-110 duration-200 flex items-center gap-1"
                  aria-label="Select language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium hidden sm:inline mr-0.5">{isNepali ? 'ने' : 'EN'}</span>
                  <span className="text-sm leading-none">{isNepali ? '🇳🇵' : '🇬🇧'}</span>
                </button>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[9999] min-w-[120px]"
                  >
                    <button
                      onClick={() => { setLanguage('en'); setLangOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-left hover:bg-army hover:text-white transition-colors flex items-center gap-2 ${!isNepali ? 'bg-army/10 text-army font-semibold' : 'text-gray-700'}`}
                    >
                      <span className="text-base leading-none">🇬🇧</span> English
                    </button>
                    <button
                      onClick={() => { setLanguage('ne'); setLangOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-left hover:bg-army hover:text-white transition-colors flex items-center gap-2 ${isNepali ? 'bg-army/10 text-army font-semibold' : 'text-gray-700'}`}
                    >
                      <span className="text-base leading-none">🇳🇵</span> नेपाली
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors hover:scale-110 duration-200"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Font Size Control - Right Side */}
              <div className="relative" ref={sizeControlRef}>
                <button
                  onClick={() => setShowSizeControls(!showSizeControls)}
                  className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors hover:scale-110 duration-200"
                  aria-label="Font size controls"
                  title="Font Size"
                >
                  <Type className="h-4 w-4" />
                </button>

                {showSizeControls && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-[9999] min-w-[160px] backdrop-blur-sm bg-white/95"
                  >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                      <span className="text-xs font-semibold text-gray-600">Font Size</span>
                      <span className="text-xs font-bold text-[#FCC202]">{sizePercentage}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={decreaseSize}
                        disabled={fontSize <= MIN_SIZE}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          fontSize <= MIN_SIZE 
                            ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                            : 'text-army hover:bg-[#FCC202]/10 hover:text-[#FCC202] hover:scale-110'
                        }`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="flex-1 px-2">
                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            className="absolute top-0 left-0 h-full bg-[#FCC202] rounded-full"
                            style={{ 
                              width: `${((fontSize - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100}%`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${((fontSize - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={increaseSize}
                        disabled={fontSize >= MAX_SIZE}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          fontSize >= MAX_SIZE 
                            ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                            : 'text-army hover:bg-[#FCC202]/10 hover:text-[#FCC202] hover:scale-110'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          // Reset to default (100%)
                          const current = fontSize;
                          if (current < 1) increaseSize();
                          if (current > 1) decreaseSize();
                          setShowSizeControls(false);
                        }}
                        className="flex-1 text-[10px] text-gray-400 hover:text-[#FCC202] transition-colors py-1 px-2 rounded-lg hover:bg-[#FCC202]/5"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          // Set to 100%
                          const current = fontSize;
                          if (current < 1) increaseSize();
                          if (current > 1) decreaseSize();
                          setShowSizeControls(false);
                        }}
                        className="flex-1 text-[10px] text-gray-400 hover:text-[#FCC202] transition-colors py-1 px-2 rounded-lg hover:bg-[#FCC202]/5"
                      >
                        Default
                      </button>
                      <button
                        onClick={() => {
                          for (let i = 0; i < 100; i++) {
                            if (fontSize < MAX_SIZE) increaseSize();
                          }
                          setShowSizeControls(false);
                        }}
                        className="flex-1 text-[10px] text-gray-400 hover:text-[#FCC202] transition-colors py-1 px-2 rounded-lg hover:bg-[#FCC202]/5"
                      >
                        Large
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
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
                    {t(config.labelKey)}
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
                                  {t(item.labelKey)}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}

                {/* Mobile Search, Language & Font Controls */}
                <div className="px-4 py-3 border-b border-white/10">
                  {/* Language Selector */}
                  <div className="flex items-center gap-3 mb-2 px-3 py-2 rounded-lg hover:bg-white/5">
                    <Globe className="h-4 w-4 text-white/60" />
                    <span className="text-sm text-white/60">{t('language.selectLanguage')}</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1.5 ${!isNepali ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                      >
                        <span className="text-sm leading-none">🇬🇧</span> EN
                      </button>
                      <button
                        onClick={() => setLanguage('ne')}
                        className={`px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1.5 ${isNepali ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                      >
                        <span className="text-sm leading-none">🇳🇵</span> नेपाली
                      </button>
                    </div>
                  </div>

                  {/* Search */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      setSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Search className="h-5 w-5" />
                    <span className="text-sm font-medium">{t('nav.search')}</span>
                  </button>
                  
                  {/* Font Size Controls */}
                  <div className="flex items-center gap-3 mt-2 px-3 py-2 rounded-lg hover:bg-white/5">
                    <Type className="h-4 w-4 text-white/60" />
                    <span className="text-sm text-white/60">Font Size</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <button
                        onClick={decreaseSize}
                        disabled={fontSize <= MIN_SIZE}
                        className={`p-1 rounded-md transition-colors ${
                          fontSize <= MIN_SIZE 
                            ? 'text-gray-500 cursor-not-allowed' 
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs text-white/60 min-w-[35px] text-center">
                        {sizePercentage}%
                      </span>
                      <button
                        onClick={increaseSize}
                        disabled={fontSize >= MAX_SIZE}
                        className={`p-1 rounded-md transition-colors ${
                          fontSize >= MAX_SIZE 
                            ? 'text-gray-500 cursor-not-allowed' 
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 md:pt-32 px-4"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
              setSearchResults([]);
              setSearchLoading(false);
            }}
          >
            <motion.div
              ref={searchRef}
              initial={{ y: -50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('nav.searchPlaceholder')}
                    className="w-full px-4 py-2 text-lg outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                  {searchLoading && (
                    <Loader className="h-5 w-5 text-[#FCC202] animate-spin ml-2" />
                  )}
                  {searchQuery && !searchLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-[#FCC202] text-army rounded-lg hover:bg-[#e6b002] transition-colors text-sm font-medium"
                  >
                    {t('nav.search')}
                  </button>
                </div>
              </form>

              {searchResults.length > 0 && (
                <div className="max-h-96 overflow-y-auto p-2">
                  <div className="text-xs text-gray-400 px-3 py-2 font-medium uppercase tracking-wider flex items-center justify-between">
                    <span>{t('nav.searchResults')} ({searchResults.length})</span>
                    <span className="text-[#FCC202] text-[10px]">{t('nav.searchAvailable')}</span>
                  </div>
                  {searchResults.map((result, index) => (
                    <motion.button
                      key={result.id || result.to || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.03 }}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FCC202]/10 transition-colors group border-l-2 border-transparent hover:border-[#FCC202]"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {result.image ? (
                          <img
                            src={result.image}
                            alt={result.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/50x50/1F3D2B/FFFFFF?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ImageIcon className="h-5 w-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-army transition-colors">
                            {highlightText(result.title, searchQuery)}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full flex-shrink-0">
                            {result.category || 'Content'}
                          </span>
                        </div>
                        {result.content && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {highlightText(
                              typeof result.content === 'string' ? result.content.substring(0, 100) : '',
                              searchQuery
                            )}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#FCC202] transition-colors flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              )}

              {searchQuery.trim().length > 0 && searchResults.length === 0 && !searchLoading && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-500 font-medium">{t('nav.noResults')}</p>
                  <p className="text-sm text-gray-400 mt-1">{t('nav.tryDifferentKeywords')}</p>
                </div>
              )}

              {searchLoading && (
                <div className="p-8 text-center">
                  <Loader className="h-8 w-8 text-[#FCC202] animate-spin mx-auto" />
                  <p className="text-gray-400 mt-2 text-sm">{t('nav.searchingContent')}</p>
                </div>
              )}

              {!searchQuery && !searchLoading && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔎</div>
                  <p className="text-gray-400">{t('nav.typeToSearch')}</p>
                  <p className="text-xs text-gray-300 mt-1">{t('nav.searchInContent')}</p>
                </div>
              )}

              {!searchQuery && !searchLoading && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium">{t('nav.trySearchingFor')}</p>
                  <div className="flex flex-wrap gap-2">
                    {['News', 'Events', 'Gallery', 'Notices', 'Leadership', 'Training', 'Committee', 'Veterans'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-[#FCC202]/20 text-gray-600 hover:text-army rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}

export default Navbar;