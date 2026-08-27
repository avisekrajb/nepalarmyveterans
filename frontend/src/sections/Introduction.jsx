import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Container } from '../components/ui/Section';
import { introductionAPI } from '../services/api';
import Loader from '../components/ui/Loader';
import { motion } from 'framer-motion';

export function Introduction() {
  const { t } = useTranslation();
  const { getLocalizedField } = useLanguage();
  const [intro, setIntro] = useState({ 
    title: 'नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ – एक परिचय', 
    content: '', 
    image: '' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntroduction();
  }, []);

  const loadIntroduction = async () => {
    try {
      const { data } = await introductionAPI.getIntroduction();
      console.log('Introduction data:', data);
      setIntro({
        title: data.title || 'नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ – एक परिचय',
        content: data.content || '',
        image: data.image || ''
      });
    } catch (error) {
      console.error('Failed to load introduction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center min-h-screen">
        <Loader label={t('sections.loading')} />
      </section>
    );
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Full content with proper paragraphs
  const fullContent = `नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ नेपाली सेनाबाट अवकाश प्राप्त गरेका भूतपूर्व सैनिकहरू र तिनका परिवारहरूको कल्याण र देश र सेना प्रति पूर्ण आस्था र निष्ठा सहित र परिआएको समयमा देश र जनताको रक्षा र सेवा जस्तो मूलभूत आदर्श र लक्ष्य सहित २०४७ सालमा एक विशुद्ध सामाजिक संस्थाको रूपमा स्थापना भई २०७५ सालमा विधिवत् दर्ता भएको हो।

यो संघ सन २०१५ सालबाट करिब ६० वर्षदेखि विश्व भूतपूर्व सैनिक महासंघ (World Veterans Federation) को सदस्य रही सो महासंघको कार्य पद्धतिमा योगदान पुर्‍याउँदै आएको छ। नेपाल सरकार, रक्षा मन्त्रालय अन्तर्गत रहेका र नेपाली सेनाबाट मान्यता प्राप्त यस संघले आफ्नो स्थापना कालदेखि आफ्नो स्रोत, साधन र क्षमताले भ्याएसम्म आफ्ना सदस्यहरूको कल्याण र देश र जनताको रक्षा र सेवाको निमित्त प्रयासरत रही आएको छ।

नेपाल भूतपूर्व सैनिक संगठनको रूपमा २०७१ सालमा प्रजातान्त्रिक व्यवस्था अन्तर्गत लागू भएको संविधान बमोजिम यो संघ वर्गीय संगठनको एक हिस्सा अनुरूप संघको नाम "नेपाल भूतपूर्व सैनिक संगठन" रहन गएको थियो। वर्गीय संगठनको नियम बमोजिम यो संघमा नेपाली सेना, भारतीय सेना र ब्रिटिश सेनामा सेवा गरी अवकाश प्राप्त गरेका सैनिकहरू पनि समावेश थिए।

२०७७ सालमा बहुदलीय प्रजातान्त्रिक व्यवस्था प्रारम्भ भए पछि पञ्चायती व्यवस्थाकालमा गठित सम्पूर्ण वर्गीय संगठनहरू खारेज हुन गएको कारणले फलस्वरूप नेपाली भूतपूर्व सैनिकहरूले पनि विश्वका अन्य राष्ट्रहरू जस्तै इन्डियन आर्मी र ब्रिटिश आर्मीका भूतपूर्व गोर्खा सैनिकहरूले आ–आफ्नै निजी भूतपूर्व सैनिक संगठनहरू स्थापना गरे।

नेपाली सेनाबाट अवकाश प्राप्त भूतपूर्व सैनिकहरूको सम्बन्धमा तत्कालीन राष्ट्र प्रमुख, राज्य प्रमुख र संघको केन्द्रीय नेतृत्वको पहलमा सोच विचार भई आफ्नो मातृभूमिको रक्षा र सेवाको निमित्त नेपाली सेनामा सेवा गरी अवकाश प्राप्त भूतपूर्व सैनिकहरूलाई परिस्थितिको समयमै देशको रक्षाको निमित्त उनीहरूलाई एकताबद्धरूपमा संगठित गरी राज्यको एक सहयोगी शक्तिको रूपमा परिचालनको व्यवस्था गर्नुपर्ने आवश्यकता परेको।

साथै राष्ट्रप्रति निःस्वार्थभाव र जीवनभर सैनिक कल्याणकारी सेवासुविधाहरू प्राप्त गर्दै जाने भूतपूर्व सैनिकहरूको पनि आफ्नो देश र जनताको सेवा र रक्षाको निमित्त नैतिक दायित्व भएको हुँदा राज्य र सेनाद्वारा संरक्षित नेपाली सेनाबाट अवकाश प्राप्त भूतपूर्व सैनिकहरूको एक संगठनको आवश्यकता देखिएकोले नेपाल सरकार रक्षा मन्त्रालय अन्तर्गत रहने गरी नेपाली सेनाबाट मान्यता प्राप्त "नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ" २०४७ सालमा स्थापना भएको हो।

हालसम्म नेपाली सेनामा सेवा गरी अवकाश प्राप्त गरेका भूतपूर्व सैनिकहरूको संख्या करिब ७०,००० रहेको र तिनका आश्रित परिवारहरूको संख्या ३५०,००० गरी सम्पूर्ण भूतपूर्व सैनिकहरू र परिवारहरूको संख्या ४२०,००० रहेको छ।`;

  return (
    <motion.section 
      className="py-20 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Main Title */}
          <motion.div 
            className="text-center mb-14"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-army leading-tight">
              {getLocalizedField(intro, 'title') || intro.title || t('sections.introductionTitle')}
            </h1>
            <motion.div 
              className="w-24 h-1 bg-gold mx-auto mt-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          {/* Main Content with Image on Right */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content - Full Text */}
            <motion.div className="flex flex-col" variants={fadeInUp}>
              <div className="text-gray-700 leading-relaxed text-base md:text-lg text-justify whitespace-pre-line">
                {getLocalizedField(intro, 'content') || intro.content || fullContent}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <motion.div 
                  className="bg-green-50 p-5 rounded-xl text-center border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  <p className="text-2xl md:text-3xl font-bold text-army">७०,०००+</p>
                  <p className="text-sm text-gray-500 mt-1">भूतपूर्व सैनिक</p>
                </motion.div>
                <motion.div 
                  className="bg-green-50 p-5 rounded-xl text-center border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  <p className="text-2xl md:text-3xl font-bold text-army">३,५०,०००+</p>
                  <p className="text-sm text-gray-500 mt-1">आश्रित परिवार</p>
                </motion.div>
                <motion.div 
                  className="bg-green-50 p-5 rounded-xl text-center border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  <p className="text-2xl md:text-3xl font-bold text-army">४,२०,०००+</p>
                  <p className="text-sm text-gray-500 mt-1">कुल जनसंख्या</p>
                </motion.div>
                <motion.div 
                  className="bg-green-50 p-5 rounded-xl text-center border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  <p className="text-2xl md:text-3xl font-bold text-army">२०,५६१</p>
                  <p className="text-sm text-gray-500 mt-1">कुल सदस्य</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Image and Additional Info - Text Justified */}
            <motion.div className="flex flex-col space-y-6" variants={fadeInUp}>
              {/* Image */}
              {intro.image && (
                <motion.div 
                  className="rounded-xl overflow-hidden shadow-lg border-2 border-green-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={intro.image} 
                    alt="Introduction" 
                    className="w-full h-80 md:h-[420px] object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400/1F3D2B/FFFFFF?text=Association';
                    }}
                  />
                </motion.div>
              )}

              {/* World Veterans Federation */}
              <motion.div 
                className="bg-green-50 p-6 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-bold text-army text-lg md:text-xl">
                  {t('sections.worldVeteransFederation')}
                </h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-3 text-justify">
                  नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ यस महासंघको २०१५ सालमा सदस्य भई हालसम्म 
                  सो महासंघको कार्य प्रक्रियामा योगदान पुर्‍याउँदै आएको छ। यस संघको संरक्षक 
                  रथी श्रीधर शमशेर ज.ब. राणा (अ.प्रा.) उक्त महासंघको आजीवन मानार्थ उपसभापति 
                  (Honorary Vice President) हुनुहुन्छ।
                </p>
              </motion.div>

              {/* Advisory Council - Text Justified */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold text-army text-lg md:text-xl mb-4">
                  {t('sections.advisoryCouncil')}
                </h3>
                <div className="space-y-2 text-base md:text-lg text-gray-600">
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    पूर्व प्रधान सेनापति महारथी श्री अजय नरसिंह राणा
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    पूर्व प्रधान सेनापति महारथी श्री प्यारजंग थापा
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    रथी श्री खड्ग राज कार्की (अ.प्रा.)
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    रथी श्री बलानन्द शर्मा (अ.प्रा.)
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    रथी श्री नेपाल भूषण चन्द (अ.प्रा.)
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    मानार्थ रथी श्री यादव बहादुर रायमाझी (अ.प्रा.)
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    प्रा.डा. श्री निर्मल प्रसाद अर्याल (अ.प्रा.)
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    मानार्थ उ.र. श्री उद्धव बहादुर बिष्ट (अ.प्रा.)
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    श्री अर्जुन प्रसाद बाराल
                  </motion.p>
                  <motion.p 
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-gold text-justify"
                    whileHover={{ x: 5 }}
                  >
                    श्री गणेश विक्रम कार्की – अधिवक्ता
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Current Leadership Section */}
          <motion.div 
            className="mt-16 pt-10 border-t-2 border-green-200"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-army text-center mb-8">
              {t('sections.currentOfficials')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <motion.div 
                className="bg-green-50 p-5 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <p className="text-sm text-gold-dark font-medium">केन्द्रीय सभापति</p>
                <p className="font-semibold text-army text-base md:text-lg mt-1">स.र. श्री दिवाकर शमशेर ज.ब. राणा (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-5 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <p className="text-sm text-gold-dark font-medium">वरिष्ठ उपसभापति</p>
                <p className="font-semibold text-army text-base md:text-lg mt-1">स.र. डा. श्री केशर बहादुर भण्डारी (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-5 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <p className="text-sm text-gold-dark font-medium">महासचिव</p>
                <p className="font-semibold text-army text-base md:text-lg mt-1">प्र.से. श्री श्याम सुन्दर घिमिरे (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-5 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <p className="text-sm text-gold-dark font-medium">सचिव</p>
                <p className="font-semibold text-army text-base md:text-lg mt-1">ज.म. श्री केशव बहादुर बस्नेत (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-5 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <p className="text-sm text-gold-dark font-medium">कोषाध्यक्ष</p>
                <p className="font-semibold text-army text-base md:text-lg mt-1">सु.कृ. श्री केदार बहादुर थापा (अ.प्रा.)</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Central Members */}
          <motion.div 
            className="mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6">
              {t('sections.centralMembers')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">प्रदेश नं. १</p>
                <p className="text-gray-600 mt-1 text-justify">श्री धन बहादुर खड्का (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">प्रदेश नं. २</p>
                <p className="text-gray-600 mt-1 text-justify">ज.म. श्री प्रभु नारायण शिवाकोटी (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">प्रदेश नं. ३</p>
                <p className="text-gray-600 mt-1 text-justify">प्र.सु. श्री मोहन कुमार थापा (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">प्रदेश नं. ४</p>
                <p className="text-gray-600 mt-1 text-justify">प्र.से. श्री डिल्लीराम बाराल (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">प्रदेश नं. ५</p>
                <p className="text-gray-600 mt-1 text-justify">ज.म. श्री इन्द्र बहादुर कुँवर (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">प्रदेश नं. ६</p>
                <p className="text-gray-600 mt-1 text-justify">अम. श्री बालकृष्ण पौडेल (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">प्रदेश नं. ७</p>
                <p className="text-gray-600 mt-1 text-justify">प्र.सु. श्री मदन सिंह थापा (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">म.से. श्री विष्णु बहादुर जि.सी. (अ.प्रा.)</p>
              </motion.div>
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-2 border-green-200 hover:shadow-lg transition-all hover:border-gold"
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <p className="font-semibold text-army">सु.क. श्री दया कृष्ण न्यौपाने (अ.प्रा.)</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}

export default Introduction;