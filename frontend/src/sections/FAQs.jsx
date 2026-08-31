import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/ui/Section';
import { faqAPI, faqConfigAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/ui/Loader';
import {
  ChevronDown, Search, HelpCircle, Users,
  Shield, Award, BookOpen, Heart, Mail, Phone,
  MapPin, Clock, ExternalLink, MessageSquare
} from 'lucide-react';

const FALLBACK_FAQ_CATEGORIES = [
  {
    id: 'general',
    label: 'General',
    icon: HelpCircle,
    questions: [
      { q: 'What is the Nepal National Ex-Army Association?', a: 'The Nepal National Ex-Army Association is a premier organization dedicated to the welfare and unity of retired army personnel. Established with the vision of serving the nation beyond active service, we bring together veterans who have dedicated their lives to protecting Nepal\'s sovereignty.' },
      { q: 'When was the association established?', a: 'The association was established in 2010 with 50 founding members. Since then, we have grown to become a leading veterans organization with members across all 77 districts of Nepal.' },
      { q: 'What is the mission of the association?', a: 'Our mission is to serve the nation and society by leveraging the experience and dedication of ex-army personnel, engage in social welfare activities, provide support to veterans and their families, and contribute to national security awareness.' },
    ]
  },
  {
    id: 'membership',
    label: 'Membership',
    icon: Users,
    questions: [
      { q: 'Who can join the association?', a: 'Any retired army personnel who has served in the Nepalese Army or its equivalent forces, and is of good character, can apply for membership. We welcome veterans from all ranks and branches of service.' },
      { q: 'What are the benefits of membership?', a: 'Members enjoy access to support services, welfare programs, networking opportunities, participation in association activities and events, health camps, skills development programs, and a strong community of fellow veterans.' },
      { q: 'How can I apply for membership?', a: 'You can apply for membership by visiting our office, filling out the membership form, or submitting an online application through our website. Our membership team will guide you through the process.' },
      { q: 'Is there a membership fee?', a: 'Yes, there is a nominal membership fee that helps support the association\'s activities and programs. The fee structure varies based on membership type and is reviewed periodically.' },
    ]
  },
  {
    id: 'services',
    label: 'Services & Programs',
    icon: Shield,
    questions: [
      { q: 'What services does the association provide?', a: 'We provide social welfare programs, veteran assistance, disaster response, skills development, awareness programs, health camps, educational support, and community development initiatives.' },
      { q: 'Do you provide financial assistance to veterans?', a: 'Yes, we provide financial assistance to veterans and their families in need through our welfare programs. This includes support for medical treatment, educational expenses, and emergency situations.' },
      { q: 'What training programs are available?', a: 'We offer various training programs including security training, leadership development, community engagement, skills enhancement, mental health awareness, and physical fitness programs.' },
      { q: 'How can I participate in association activities?', a: 'You can participate by becoming a member, volunteering for our programs, attending events, or contributing to our initiatives. Check our events page for upcoming activities.' },
    ]
  },
  {
    id: 'support',
    label: 'Support & Assistance',
    icon: Heart,
    questions: [
      { q: 'How can I contribute to the association?', a: 'You can contribute through membership, volunteering, donations, participating in our programs, spreading awareness about our work, or providing professional expertise to our initiatives.' },
      { q: 'How is the association governed?', a: 'The association is governed by an elected Central Executive Committee, with an Advisory Council providing strategic guidance. All decisions are made through democratic processes.' },
      { q: 'Where can I get help as a veteran?', a: 'You can reach out to our office directly, contact our helpline, or visit us during office hours. We have dedicated staff to assist veterans with their needs and concerns.' },
    ]
  }
];

const QUICK_LINKS = [
  { icon: 'phone', labelEn: 'Call Us', labelNe: 'हामीलाई फोन गर्नुहोस्', valueEn: '+977-1-1234567', valueNe: '+९७७-१-१२३४५६७', action: 'tel:+97711234567' },
  { icon: 'mail', labelEn: 'Email Us', labelNe: 'हामीलाई इमेल गर्नुहोस्', valueEn: 'info@nepalarmy.org', valueNe: 'info@nepalarmy.org', action: 'mailto:info@nepalarmy.org' },
  { icon: 'map', labelEn: 'Visit Us', labelNe: 'हामीलाई भेट्नुहोस्', valueEn: 'Kathmandu, Nepal', valueNe: 'काठमाडौँ, नेपाल', action: '/contact' },
  { icon: 'clock', labelEn: 'Office Hours', labelNe: 'कार्यालय समय', valueEn: 'Mon-Fri: 10:00 AM - 5:00 PM', valueNe: 'आइत-शुक्र: बिहान १० - बेलुका ५', action: '' },
];

const LINK_ICON_MAP = {
  phone: Phone,
  mail: Mail,
  map: MapPin,
  clock: Clock,
  help: HelpCircle,
  message: MessageSquare,
};

const FALLBACK_SUPPORT = {
  titleEn: 'Need Personalized Support?',
  titleNe: 'व्यक्तिगत सहयोग चाहिन्छ?',
  textEn: 'Our team is here to help you with any specific questions or concerns.',
  textNe: 'कुनै विशेष प्रश्न वा चिन्तामा सहयोग गर्न हाम्रो टोली यहाँ छ।',
  buttonEn: 'Contact Us',
  buttonNe: 'सम्पर्क गर्नुहोस्',
  action: '/contact',
};

const iconForCategory = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('member')) return Users;
  if (n.includes('service') || n.includes('program')) return Shield;
  if (n.includes('support') || n.includes('assist') || n.includes('help')) return Heart;
  if (n.includes('award') || n.includes('recognition')) return Award;
  if (n.includes('train')) return BookOpen;
  if (n.includes('general')) return HelpCircle;
  return HelpCircle;
};

export function FAQs() {
  const { t } = useTranslation();
  const { isNepali } = useLanguage();
  const [faqCategories, setFaqCategories] = useState(null);
  const [faqConfig, setFaqConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFaqs();
    loadFaqConfig();
  }, []);

  const loadFaqConfig = async () => {
    try {
      const { data } = await faqConfigAPI.getConfig();
      setFaqConfig(data);
    } catch (error) {
      console.error('Failed to load FAQ config:', error);
      setFaqConfig(null);
    }
  };

  const loadFaqs = async () => {
    try {
      const { data } = await faqAPI.getFaqs();
      if (Array.isArray(data) && data.length > 0) {
        const groups = {};
        data.forEach((faq) => {
          const en = faq.categoryEn || faq.category || 'General';
          const ne = faq.categoryNe || faq.category || 'General';
          const key = en;
          if (!groups[key]) groups[key] = { id: key, label: en, labelNe: ne, icon: iconForCategory(en), questions: [] };
          groups[key].questions.push({
            qEn: faq.questionEn || faq.questionNe || faq.question || '',
            qNe: faq.questionNe || faq.questionEn || faq.question || '',
            aEn: faq.answerEn || faq.answerNe || faq.answer || '',
            aNe: faq.answerNe || faq.answerEn || faq.answer || '',
          });
        });
        setFaqCategories(Object.values(groups));
        setActiveCategory(Object.values(groups)[0]?.id || '');
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    }
    setFaqCategories(FALLBACK_FAQ_CATEGORIES);
    setActiveCategory(FALLBACK_FAQ_CATEGORIES[0].id);
    setLoading(false);
  };

  // Re-derived localized views whenever the language changes, without re-fetching.
  const localizedCategories = useMemo(() => {
    if (!faqCategories) return faqCategories;
    return faqCategories.map((category) => ({
      ...category,
      label: isNepali && category.labelNe ? category.labelNe : category.label,
      questions: (category.questions || []).map((question) => {
        const qEn = question.qEn || question.q || '';
        const qNe = question.qNe || question.q || '';
        const aEn = question.aEn || question.a || '';
        const aNe = question.aNe || question.a || '';
        return {
          _key: qEn + qNe + aEn + aNe,
          q: isNepali ? (qNe || qEn || '') : (qEn || qNe || ''),
          a: isNepali ? (aNe || aEn || '') : (aEn || aNe || ''),
        };
      }),
    }));
  }, [faqCategories, isNepali]);

  const currentCategory = useMemo(
    () => (localizedCategories || []).find(c => c.id === activeCategory),
    [localizedCategories, activeCategory]
  );
  const questions = currentCategory?.questions || [];

  const configLinks = useMemo(() => {
    const links = (faqConfig && Array.isArray(faqConfig.quickLinks) ? faqConfig.quickLinks : [])
      .map((l) => ({
        icon: l.icon || 'help',
        label: isNepali ? (l.labelNe || l.labelEn || '') : (l.labelEn || l.labelNe || ''),
        value: isNepali ? (l.valueNe || l.valueEn || '') : (l.valueEn || l.valueNe || ''),
        action: l.action || '',
      }));
    return links.length > 0 ? links : QUICK_LINKS.map((l) => ({
      icon: l.icon,
      label: isNepali ? l.labelNe : l.labelEn,
      value: isNepali ? l.valueNe : l.valueEn,
      action: l.action,
    }));
  }, [faqConfig, isNepali]);

  const support = useMemo(() => {
    if (!faqConfig) return FALLBACK_SUPPORT;
    return {
      title: isNepali ? (faqConfig.supportTitleNe || FALLBACK_SUPPORT.titleNe) : (faqConfig.supportTitleEn || FALLBACK_SUPPORT.titleEn),
      text: isNepali ? (faqConfig.supportTextNe || FALLBACK_SUPPORT.textNe) : (faqConfig.supportTextEn || FALLBACK_SUPPORT.textEn),
      button: isNepali ? (faqConfig.supportButtonNe || FALLBACK_SUPPORT.buttonNe) : (faqConfig.supportButtonEn || FALLBACK_SUPPORT.buttonEn),
      action: faqConfig.supportButtonAction || FALLBACK_SUPPORT.action,
    };
  }, [faqConfig, isNepali]);

  const filteredQuestions = searchQuery
    ? questions.filter(q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : questions;

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex items-center justify-center min-h-screen">
        <Loader label="Loading FAQs" />
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              {t('sections.faqTitle')}
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              {t('sections.faqSubtitle')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('sections.searchFaqs')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {(localizedCategories || []).map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenIndex(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-gold text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {filteredQuestions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredQuestions.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div key={faq._key || index} className="transition-all">
                      <button
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        onClick={() => toggleQuestion(index)}
                      >
                        <span className={`font-medium ${isOpen ? 'text-gold' : 'text-army'}`}>
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gold transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`px-6 overflow-hidden transition-all duration-300 ${
                          isOpen ? 'pb-4' : 'max-h-0'
                        }`}
                      >
                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No FAQs found for your search.</p>
              </div>
            )}
          </div>

          {/* Quick Help Links */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-army text-center mb-6">
              {faqConfig && (isNepali ? faqConfig.titleNe : faqConfig.titleEn)
                ? (isNepali ? faqConfig.titleNe : faqConfig.titleEn)
                : t('sections.stillHaveQuestions')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {configLinks.map((link, index) => {
                const Icon = LINK_ICON_MAP[link.icon] || HelpCircle;
                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center"
                  >
                    <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                    <h4 className="font-medium text-army text-sm">{link.label}</h4>
                    {link.action ? (
                      <a
                        href={link.action}
                        className="text-gold text-sm hover:text-gold-dark transition-colors flex items-center justify-center gap-1 mt-1"
                      >
                        {link.value}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm mt-1">{link.value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 bg-gold/5 p-6 rounded-2xl border border-gold/20 text-center">
            <h3 className="font-display text-xl font-bold text-army">{support.title}</h3>
            <p className="text-gray-600 mt-2">
              {support.text}
            </p>
            <a
              href={support.action}
              className="inline-block mt-4 bg-gold text-white px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors"
            >
              {support.button}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FAQs;