import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  HeartHandshake,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Target,
  Eye,
  CheckCircle2,
  Heart,
  MapPin,
  Phone,
  Mail,
  Send,
  Award,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Container } from "../components/ui/Section";
import { heroAPI, leadershipAPI, galleryAPI, contactAPI, contactMessageAPI } from "../services/api";
import toast from "react-hot-toast";

const iconMap = { Users, HeartHandshake, ShieldCheck };

const FALLBACK_IMG = "https://placehold.co/600x600/1F3D2B/FFFFFF?text=Photo";

const services = [
  { icon: Target, title: "सामाजिक सेवा", desc: "समाजको सेवामा समर्पित" },
  { icon: Award, title: "योगदान", desc: "राष्ट्र निर्माणमा योगदान" },
  { icon: BookOpen, title: "प्रशिक्षण", desc: "आधुनिक क्षमता विकास" },
  { icon: HeartHandshake, title: "सहयोग", desc: "सहयोग र एकता" },
];

const pillars = [
  {
    icon: Target,
    title: "Mission",
    text: "भूपू सैनिकहरूको एकता, कल्याण र समाज सेवामार्फत राष्ट्र निर्माणमा योगदान।",
  },
  {
    icon: Eye,
    title: "Vision",
    text: "मर्यादित, आत्मनिर्भर र सामाजिक जिम्मेवारीयुक्त भूपू सैनिक समुदाय।",
  },
  {
    icon: CheckCircle2,
    title: "Objectives",
    text: "कल्याण, सीप विकास, स्वास्थ्य सेवा, विपद् व्यवस्थापन र सामुदायिक कार्यक्रम।",
  },
  { icon: Heart, title: "Core Values", text: "अनुशासन, इमानदारी, देशभक्ति, सेवा र आपसी सम्मान।" },
];

const timeline = [
  { year: "Foundation", title: "Formation of the Association", desc: "स्थापनाकालमै अवकाशप्राप्त सैनिकहरूको साझा मञ्चको परिकल्पना गरियो।" },
  { year: "Early Years", title: "Chapter Expansion", desc: "देशभरका जिल्लामा शाखा विस्तार र सदस्य दर्ताको सुरुवात।" },
  { year: "Growth", title: "Welfare Programs", desc: "स्वास्थ्य शिविर, राहत वितरण र परिवार सहयोग कार्यक्रमको थालनी।" },
  { year: "Today", title: "Nationwide Presence", desc: "७७ वटै जिल्लामा प्रतिनिधित्व र निरन्तर सामुदायिक सेवा।" },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

export function Hero() {
  const rootRef = useRef(null);
  const [slide, setSlide] = useState(0);
  const [seniorSlide, setSeniorSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoRef = useRef(null);
  const touchRef = useRef(null);
  
  const [heroData, setHeroData] = useState({ carouselImages: [], seniors: [] });
  const [leadershipMembers, setLeadershipMembers] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [contact, setContact] = useState({ address: '', phone: '', email: '', mapEmbed: '' });
  const [loading, setLoading] = useState(true);
  const [showAllLeadership, setShowAllLeadership] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const initialDisplay = 8;

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [heroRes, leadershipRes, galleryRes, contactRes] = await Promise.all([
        heroAPI.getHero(),
        leadershipAPI.getLeadership(),
        galleryAPI.getGallery(),
        contactAPI.getContact()
      ]);
      setHeroData(heroRes.data);
      setLeadershipMembers(leadershipRes.data);
      const images = galleryRes.data.filter(item => item.type !== 'video');
      setGalleryItems(images);
      setContact(contactRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const photos = heroData.carouselImages?.length > 0 
    ? heroData.carouselImages 
    : [
        { url: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1000&h=750&fit=crop", id: 1 },
        { url: "https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=1000&h=750&fit=crop", id: 2 },
        { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&h=750&fit=crop", id: 3 },
      ];

  const personData = heroData.seniors?.length > 0 ? heroData.seniors : [];

  // Carousel navigation
  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlide((p) => (p + 1) % photos.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlide((p) => (p - 1 + photos.length) % photos.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Senior navigation - slide 2 at a time
  const nextSenior = () => {
    const totalSlides = Math.max(1, Math.ceil(personData.length / 2));
    setSeniorSlide((p) => (p + 1) % totalSlides);
  };

  const prevSenior = () => {
    const totalSlides = Math.max(1, Math.ceil(personData.length / 2));
    setSeniorSlide((p) => (p - 1 + totalSlides) % totalSlides);
  };

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (!isDragging && photos.length > 1) autoRef.current = setInterval(next, 4000);
  };

  // Touch handlers for carousel
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setIsDragging(true);
    if (autoRef.current) clearInterval(autoRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diff = startX - touch.clientX;
    setCurrentTranslate(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(currentTranslate) > 50) {
      if (currentTranslate > 0) next();
      else prev();
    }
    setCurrentTranslate(0);
    resetAuto();
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
    if (autoRef.current) clearInterval(autoRef.current);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    setCurrentTranslate(diff);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(currentTranslate) > 50) {
      if (currentTranslate > 0) next();
      else prev();
    }
    setCurrentTranslate(0);
    resetAuto();
  };

  // Senior touch handlers
  const [seniorStartX, setSeniorStartX] = useState(0);
  const [seniorTranslate, setSeniorTranslate] = useState(0);
  const [isSeniorDragging, setIsSeniorDragging] = useState(false);

  const handleSeniorTouchStart = (e) => {
    const touch = e.touches[0];
    setSeniorStartX(touch.clientX);
    setIsSeniorDragging(true);
  };

  const handleSeniorTouchMove = (e) => {
    if (!isSeniorDragging) return;
    const touch = e.touches[0];
    const diff = seniorStartX - touch.clientX;
    setSeniorTranslate(diff);
  };

  const handleSeniorTouchEnd = () => {
    setIsSeniorDragging(false);
    if (Math.abs(seniorTranslate) > 50) {
      if (seniorTranslate > 0) nextSenior();
      else prevSenior();
    }
    setSeniorTranslate(0);
  };

  // Senior mouse drag handlers
  const handleSeniorMouseDown = (e) => {
    setSeniorStartX(e.clientX);
    setIsSeniorDragging(true);
  };

  const handleSeniorMouseMove = (e) => {
    if (!isSeniorDragging) return;
    const diff = seniorStartX - e.clientX;
    setSeniorTranslate(diff);
  };

  const handleSeniorMouseUp = () => {
    setIsSeniorDragging(false);
    if (Math.abs(seniorTranslate) > 50) {
      if (seniorTranslate > 0) nextSenior();
      else prevSenior();
    }
    setSeniorTranslate(0);
  };

  useEffect(() => {
    if (!isDragging && photos.length > 1) autoRef.current = setInterval(next, 4000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [isDragging, photos.length]);

  // GSAP animations for initial load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-title", { y: 50, opacity: 0, duration: 0.9, delay: 0.1 })
        .from(".hero-sub", { y: 30, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".hero-badge", { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.3")
        .from(".about-section", { y: 40, opacity: 0, duration: 0.8 }, "-=0.3")
        .from(".service-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".leadership-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".gallery-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".contact-section", { y: 40, opacity: 0, duration: 0.7 }, "-=0.3");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    try {
      await contactMessageAPI.createMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully!');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const displayedLeadership = showAllLeadership ? leadershipMembers : leadershipMembers.slice(0, initialDisplay);
  const displayedGallery = galleryItems.slice(0, initialDisplay);
  const hasMoreGallery = galleryItems.length > initialDisplay;

  // Get seniors for current slide - show 2 at a time
  const getVisibleSeniors = () => {
    const start = seniorSlide * 2;
    return personData.slice(start, start + 2);
  };

  const visibleSeniors = getVisibleSeniors();
  const totalSeniorSlides = Math.max(1, Math.ceil(personData.length / 2));

  if (loading) {
    return (
      <section ref={rootRef} className="min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"
        />
      </section>
    );
  }

  return (
    <section ref={rootRef} className="bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[100svh] flex flex-col">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=2000&q=80&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,161,91,0.08)_0%,transparent_60%)]" />
        </div>

        <div className="flex-1 flex items-center pt-40 pb-8">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Carousel */}
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
                className="relative w-full max-w-xl mx-auto lg:mr-auto"
              >
                <div
                  ref={touchRef}
                  className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm border border-gray-200"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <motion.div
                    className="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
                    style={{ 
                      transform: `translateX(${-slide * 100 + (currentTranslate / touchRef.current?.offsetWidth || 0) * 100}%)`,
                      transition: isDragging ? 'none' : 'transform 500ms ease-out'
                    }}
                  >
                    {photos.map((p, index) => (
                      <motion.div 
                        key={index} 
                        className="min-w-full aspect-[4/3] relative bg-gray-50"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={p.url}
                          alt=""
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.target.src = FALLBACK_IMG; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
                        <motion.div 
                          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {index + 1} / {photos.length}
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {photos.length > 1 && (
                    <>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: "#C9A227", color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prev} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gold text-gray-700 hover:text-white p-2.5 rounded-full transition-all z-10 border border-gray-200 shadow-md"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: "#C9A227", color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={next} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gold text-gray-700 hover:text-white p-2.5 rounded-full transition-all z-10 border border-gray-200 shadow-md"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {photos.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => { setSlide(i); resetAuto(); }}
                        className={`w-2 h-2 rounded-full transition-all ${slide === i ? "bg-gold w-6" : "bg-white/60 hover:bg-white/80"}`}
                        whileHover={{ scale: 1.3 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Content */}
              <motion.div
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 
                  className="hero-title font-display font-bold text-green-900 text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.1] tracking-tight"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  राष्ट्र सेवाबाट
                  <br />
                  <motion.span 
                    className="text-gold"
                    whileHover={{ color: "#8B2331" }}
                    transition={{ duration: 0.3 }}
                  >
                    समाज सेवातर्फ
                  </motion.span>
                </motion.h1>

                <motion.p 
                  className="hero-sub mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed"
                  variants={fadeInUp}
                >
                  नेपालका भूपू सैनिकहरूको एकता, सम्मान, सेवा र राष्ट्र निर्माणप्रतिको निरन्तर प्रतिबद्धता।
                </motion.p>

                {/* Seniors Slider - 2 at a time with proper sliding */}
                {personData.length > 0 && (
                  <div className="mt-8 relative">
                    <div 
                      className="overflow-hidden"
                      onTouchStart={handleSeniorTouchStart}
                      onTouchMove={handleSeniorTouchMove}
                      onTouchEnd={handleSeniorTouchEnd}
                      onMouseDown={handleSeniorMouseDown}
                      onMouseMove={handleSeniorMouseMove}
                      onMouseUp={handleSeniorMouseUp}
                      onMouseLeave={handleSeniorMouseUp}
                    >
                      <div 
                        className="grid grid-cols-2 gap-3 transition-all duration-500 ease-in-out"
                      >
                        {visibleSeniors.map((p, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 hover:bg-gray-50 transition-all group shadow-sm hover:shadow-md"
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gold/10 border-2 border-gold/30 group-hover:border-gold/60 transition-all group-hover:scale-105">
                                <img 
                                  src={p.image} 
                                  alt={p.name} 
                                  className="w-full h-full object-cover object-top"
                                  onError={(e) => { e.target.style.display = "none"; }}
                                />
                              </div>
                              <h4 className="mt-2 font-semibold text-sm text-blue-600 group-hover:text-blue-700 transition-colors text-center">
                                {p.name}
                              </h4>
                              <p className="text-gray-500 text-xs font-medium text-center">{p.role}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Dots - only if more than 2 seniors */}
                    {personData.length > 2 && (
                      <div className="flex justify-center gap-1.5 mt-3">
                        {Array.from({ length: totalSeniorSlides }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setSeniorSlide(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              seniorSlide === i ? "bg-gold w-4" : "bg-gray-300 hover:bg-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </Container>
        </div>

        {/* Features */}
        <motion.div 
          className="relative pb-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: "Users", title: "Unity & Brotherhood", desc: "Join a community of veterans committed to national unity and social harmony." },
                { icon: "HeartHandshake", title: "Social Service", desc: "Dedicated to serving society through various welfare programs and initiatives." },
                { icon: "ShieldCheck", title: "National Pride", desc: "Continuing our service to the nation with honor, dignity, and commitment." },
              ].map((f) => {
                const Icon = iconMap[f.icon];
                return (
                  <motion.div 
                    key={f.title} 
                    variants={fadeInUp}
                    whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)" }}
                    className="hero-badge rounded-2xl bg-white/95 backdrop-blur border border-gray-200 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-gold/40 transition-all"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-army/10 text-army">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.section 
        className="about-section py-16 pt-8 bg-white border-t border-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Container>
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start">
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                About the Association
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-army leading-[1.2]">
                भूपू सैनिकहरूको साझा मञ्च — <br />
                <span className="text-gold">सम्मान र सेवाको निरन्तरता</span>
              </h2>
              <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
                <p className="text-base md:text-lg">
                  नेपाल भूपू सैनिक संघ अवकाशप्राप्त नेपाली सैनिकहरूको एक स्वयंसेवी सामाजिक संस्था हो। 
                  लामो सैन्य सेवापछि पनि राष्ट्र र समाजप्रतिको जिम्मेवारीलाई निरन्तरता दिँदै यो 
                  संस्थाले एकजुट भूपू सैनिक परिवारको निर्माण गरेको छ।
                </p>
                <p className="text-base md:text-lg">
                  कल्याण, स्वास्थ्य सहयोग, सीप विकास, विपद् प्रतिकार्य, रक्तदान अभियान र सामुदायिक 
                  विकासजस्ता क्षेत्रमा संस्था सक्रिय रहँदै आएको छ। अवकाशप्राप्त सैनिक तथा उनका 
                  परिवारको जीवनयापन मर्यादित बनाउनु र देशको सामाजिक ताँदो थप बलियो बनाउनु हाम्रो 
                  प्राथमिकता हो।
                </p>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {pillars.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)" }}
                      className="bg-white/80 border border-gray-200 p-4 rounded-xl hover:border-gold/40 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold/10 text-gold">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-army">{p.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">{p.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Our Journey
              </div>
              <div className="relative pl-7 border-l-2 border-gold/30">
                {timeline.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ x: 8 }}
                    className="relative pb-6 last:pb-0"
                  >
                    <span className="absolute -left-[33px] top-1 grid h-4 w-4 place-items-center rounded-full bg-white border-2 border-gold">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    </span>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                      {t.year}
                    </div>
                    <h3 className="mt-0.5 text-sm font-semibold text-army">{t.title}</h3>
                    <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">{t.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <Container>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mt-2">सेवाका क्षेत्रहरू</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)" }}
                  className="service-card bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 text-center"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-semibold text-army text-sm">{service.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </motion.section>

      {/* Leadership Section */}
      <motion.section 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <Container>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mt-2">केन्द्रीय सञ्चालन समिति</h2>
            <p className="text-gray-500 text-sm mt-1">नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको नेतृत्व टोली</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayedLeadership.map((member) => (
              <motion.div 
                key={member._id} 
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                className="leadership-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={member.image || 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo'} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-2 text-center">
                  <h3 className="font-semibold text-army text-xs truncate">{member.name}</h3>
                  <p className="text-[10px] text-gold-dark font-medium truncate">{member.role}</p>
                  {member.bio && <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{member.bio}</p>}
                </div>
              </motion.div>
            ))}
          </div>

          {leadershipMembers.length > initialDisplay && (
            <div className="text-center mt-6">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(201, 162, 39, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllLeadership(!showAllLeadership)} 
                className="inline-flex items-center gap-2 bg-gold text-white px-5 py-2 rounded-lg hover:bg-gold-dark transition-all shadow-md hover:shadow-lg text-sm"
              >
                {showAllLeadership ? 'Show Less' : `View All (${leadershipMembers.length})`}
              </motion.button>
            </div>
          )}
        </Container>
      </motion.section>

      {/* Gallery Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <Container>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mt-2">तस्बिर संग्रह</h2>
            <p className="text-gray-500 text-sm mt-1">विभिन्न कार्यक्रम, बैठक र सामुदायिक सेवाका दृश्यहरू।</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayedGallery.map((item) => (
              <motion.div 
                key={item._id} 
                variants={fadeInUp}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)" }}
                className="gallery-card group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <img 
                  src={item.url} 
                  alt={item.title || 'Gallery'} 
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>

          {hasMoreGallery && (
            <div className="text-center mt-6">
              <Link to="/gallery">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(201, 162, 39, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                  View All ({galleryItems.length} photos)
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>
          )}
        </Container>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="contact-section py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-army mt-2">सम्पर्क गर्नुहोस्</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-gold/10 p-2 rounded-lg"><MapPin className="h-4 w-4 text-gold" /></div>
                  <div><h4 className="font-medium text-army text-sm">Address</h4><p className="text-gray-600 text-xs">{contact?.address || 'Kathmandu, Nepal'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-gold/10 p-2 rounded-lg"><Phone className="h-4 w-4 text-gold" /></div>
                  <div><h4 className="font-medium text-army text-sm">Phone</h4><p className="text-gray-600 text-xs">{contact?.phone || '+977-1-1234567'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-gold/10 p-2 rounded-lg"><Mail className="h-4 w-4 text-gold" /></div>
                  <div><h4 className="font-medium text-army text-sm">Email</h4><p className="text-gray-600 text-xs">{contact?.email || 'info@nepalarmy.org'}</p></div>
                </div>

                <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 h-48">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28266.030921880483!2d85.2854008!3d27.7034568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a0b7caa7b%3A0x9a0ccb4aa8c28258!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Location Map"
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      placeholder="Your Name" 
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      placeholder="Your Email" 
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <textarea 
                      value={formData.message} 
                      onChange={(e) => setFormData({...formData, message: e.target.value})} 
                      rows="3" 
                      placeholder="Your Message" 
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm" 
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={sending}
                    className="w-full bg-gold text-white py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </button>
                  {submitted && (
                    <p className="text-green-600 text-xs text-center">
                      ✅ Message sent successfully!
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </Container>
      </motion.section>
    </section>
  );
}

export default Hero;  