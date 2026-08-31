import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '../components/ui/Section';
import chatbotData from '../data/chatbot.json';
import { trainingAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/ui/Loader';
import {
  GraduationCap,
  Clock,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  Users,
  HeartHandshake,
  Laptop,
  Brain,
  Dumbbell,
} from 'lucide-react';

const programIcons = [ShieldCheck, Users, HeartHandshake, Laptop, Brain, Dumbbell];

const fallbackTrainingPrograms = chatbotData.trainingPrograms || [];

const cardColors = [
  'border-green-500/60',
  'border-gold/60',
  'border-green-500/60',
  'border-gold/60',
  'border-green-500/60',
  'border-gold/60',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

function Training() {
  const { t } = useTranslation();
  const { isNepali } = useLanguage();
  const [programs, setPrograms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await trainingAPI.getTrainings();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = [...data].sort((a, b) => (a.order || 0) - (b.order || 0)).map((p) => ({
            name: isNepali ? (p.nameNe || p.nameEn || p.name || '') : (p.nameEn || p.nameNe || p.name || ''),
            duration: p.duration || '',
            eligibility: isNepali ? (p.eligibilityNe || p.eligibilityEn || p.eligibility || '') : (p.eligibilityEn || p.eligibilityNe || p.eligibility || ''),
            features: (p.features || []).map((f) => (isNepali ? (f.ne || f.en) : (f.en || f.ne))).filter(Boolean),
          }));
          if (mapped.length > 0) {
            setPrograms(mapped);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to load trainings:', error);
      }
      setPrograms(fallbackTrainingPrograms);
      setLoading(false);
    };
    load();
  }, [isNepali]);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white flex items-center justify-center min-h-[50vh]">
        <Loader label="Loading Training Programs" />
      </section>
    );
  }

  const trainingPrograms = programs || [];

  return (
    <section className="py-16 md:py-20 bg-white">
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
              <GraduationCap className="h-3.5 w-3.5" />
              {t('sections.forAllVeterans')}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              {t('sections.trainingPrograms')}
            </h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              {t('sections.trainingSubtitle')}
            </p>
          </motion.div>

          {/* Programs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trainingPrograms.map((program, i) => {
              const Icon = programIcons[i % programIcons.length];
              return (
                <motion.div
                  key={program.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  className={`group flex flex-col bg-white rounded-2xl border-2 ${cardColors[i % cardColors.length]} hover:border-gold p-6 transition-all duration-300 shadow-sm hover:shadow-lg`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 group-hover:bg-gold/10 grid place-items-center transition-colors duration-300">
                      <Icon className="h-6 w-6 text-green-600 group-hover:text-gold-dark transition-colors duration-300" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-army px-3 py-1 text-[11px] font-semibold text-white">
                      <Clock className="h-3 w-3" />
                      {program.duration}
                    </span>
                  </div>

                  <h3 className="font-semibold text-army leading-snug">{program.name}</h3>

                  {/* Eligibility */}
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-400">
                    <UserCheck className="h-3.5 w-3.5" />
                    {t('sections.eligibility')}: {program.eligibility}
                  </p>

                  {/* Features */}
                  <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 flex-1">
                    {(program.features || []).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* How to join strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 rounded-2xl border-2 border-green-200 bg-gray-50 p-6 md:p-8 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                step: '01',
                titleKey: 'sections.registerInterest',
                descKey: 'sections.registerInterestDesc',
              },
              {
                step: '02',
                titleKey: 'sections.getScheduled',
                descKey: 'sections.getScheduledDesc',
              },
              {
                step: '03',
                titleKey: 'sections.trainAndCertify',
                descKey: 'sections.trainAndCertifyDesc',
              },
            ].map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <span className="font-display text-3xl font-bold text-gold">{step.step}</span>
                <div>
                  <h4 className="font-semibold text-army">{t(step.titleKey)}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed mt-1">{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default Training;
