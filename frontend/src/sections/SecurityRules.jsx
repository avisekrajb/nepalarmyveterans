import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '../components/ui/Section';
import { useSite } from '../context/SiteContext';
import { securityRulesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/ui/Loader';
import {
  ShieldCheck,
  CreditCard,
  ClipboardList,
  UserCheck,
  Siren,
  Wallet,
  Lock,
  HeartPulse,
  Megaphone,
  Phone,
} from 'lucide-react';

const ruleIcons = [CreditCard, ClipboardList, UserCheck, Siren, Wallet, Lock, HeartPulse, Megaphone];

const fallbackRules = [
  {
    icon: CreditCard,
    titleKey: 'sections.membershipIdRequired',
    descKey: 'sections.membershipIdDesc',
  },
  {
    icon: ClipboardList,
    titleKey: 'sections.visitorRegistration',
    descKey: 'sections.visitorRegistrationDesc',
  },
  {
    icon: UserCheck,
    titleKey: 'sections.eventDiscipline',
    descKey: 'sections.eventDisciplineDesc',
  },
  {
    icon: Siren,
    titleKey: 'sections.emergencyResponse',
    descKey: 'sections.emergencyResponseDesc',
  },
  {
    icon: Wallet,
    titleKey: 'sections.financialSafety',
    descKey: 'sections.financialSafetyDesc',
  },
  {
    icon: Lock,
    titleKey: 'sections.informationSecurity',
    descKey: 'sections.informationSecurityDesc',
  },
  {
    icon: HeartPulse,
    titleKey: 'sections.healthFirstAid',
    descKey: 'sections.healthFirstAidDesc',
  },
  {
    icon: Megaphone,
    titleKey: 'sections.reportSuspicious',
    descKey: 'sections.reportSuspiciousDesc',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

export function SecurityRules() {
  const { t } = useTranslation();
  const { isNepali } = useLanguage();
  const { contact } = useSite();
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);
  const phone = contact?.phone || '9824380896';
  const email = contact?.email || 'nepalisena@gmail.com';

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await securityRulesAPI.getSecurityRules();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = [...data].sort((a, b) => (a.order || 0) - (b.order || 0)).map((rule, i) => ({
            icon: ruleIcons[i % ruleIcons.length],
            title: isNepali ? (rule.titleNe || rule.titleEn || rule.title || '') : (rule.titleEn || rule.titleNe || rule.title || ''),
            desc: isNepali ? (rule.descriptionNe || rule.descriptionEn || rule.description || '') : (rule.descriptionEn || rule.descriptionNe || rule.description || ''),
          }));
          if (mapped.length > 0) {
            setRules(mapped);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to load security rules:', error);
      }
      setRules(fallbackRules);
      setLoading(false);
    };
    load();
  }, [isNepali]);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gray-50 flex items-center justify-center min-h-[50vh]">
        <Loader label="Loading Security Rules" />
      </section>
    );
  }

  const resolveTitle = (rule) => (rule.titleKey ? t(rule.titleKey) : rule.title);
  const resolveDesc = (rule) => (rule.descKey ? t(rule.descKey) : rule.desc);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-green-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('sections.associationGuidelines')}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              {t('sections.securityRules')}
            </h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              {t('sections.securityRulesSubtitle')}
            </p>
          </motion.div>

          {/* Rules grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rules.map((rule, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-xl border-2 border-green-500/60 hover:border-gold p-5 transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <div className="w-11 h-11 rounded-lg bg-green-50 group-hover:bg-gold/10 grid place-items-center transition-colors duration-300 mb-4">
                  <rule.icon className="h-5 w-5 text-green-600 group-hover:text-gold-dark transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                  Rule {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-semibold text-army mt-1">{resolveTitle(rule)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mt-2">{resolveDesc(rule)}</p>
              </motion.div>
            ))}
          </div>

          {/* Emergency strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 rounded-2xl border-2 border-red-200 bg-white p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between"
          >
            <div className="flex items-start gap-3">
              <Siren className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-army">{t('sections.securityEmergency')}</h4>
                <p className="text-sm text-gray-500">
                  {t('sections.contactCentralOffice')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${String(phone).replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="text-sm font-medium text-army underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-dark"
              >
                {email}
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default SecurityRules;
