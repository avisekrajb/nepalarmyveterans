import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/ui/Section';
import { motion } from 'framer-motion';

export function HistoryFoundation() {
  const { t } = useTranslation();
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
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

  return (
    <motion.section 
      className="py-20 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-14"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-army mt-4">
              {t('sections.historyTitle')}
            </h1>
            <motion.div 
              className="w-20 h-1 bg-gold mx-auto mt-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('sections.historySubtitle')}
            </p>
          </motion.div>

          {/* Foundation Section */}
          <motion.div 
            className="rounded-2xl p-8 mb-8 hover:border-2 hover:border-gold transition-all duration-300"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold text-army mb-4">{t('sections.ourEstablishment')}</h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
              नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको स्थापना २०४७ सालमा भएको हो। यस संघको 
              उद्देश्य भूतपूर्व सैनिकहरूलाई संगठित गरी देश र जनताप्रति पूर्ण आस्था र निष्ठाका 
              साथ राष्ट्रिय सेवामा परिचालन गराउनु हो। यो संघ मुनाफा रहित जनहितकारी सामाजिक 
              संस्था हो।
            </p>
          </motion.div>

          {/* Historical Messages Section */}
          <motion.div 
            className="rounded-2xl p-8 mb-8 hover:border-2 hover:border-gold transition-all duration-300"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold text-army mb-6">{t('sections.historicMessages')}</h2>
            
            <div className="space-y-6">
              {/* King Mahendra's Message */}
              <motion.div 
                className="p-6 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-bold text-army text-lg mb-3">श्री ५ महाराजाधिराज महेन्द्र वीर विक्रम शाहदेवको सन्देश</h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
                  "खुसीको कुरा छ कि आज नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको उद्घाटन हुँदैछ। 
                  विरक्ताप्राप्त भूतपूर्व अफिसर तथा सैनिक जवानहरूको निमित्तको सोभियत निवृत्ति 
                  संघको गौरव एवं ज्ञान राख्ने उद्देश्य राखिएको छ। नजीकताका अगाडि रही देश सेवा 
                  गर्ने सैनिक जवानहरूको मूल मन्त्र हो। हाम्रा फौजी जवानहरूको अनुशासन, इमान्दारी 
                  तथा बहादुरीको ख्याति विश्वव्यापी छ। भूतपूर्व सैनिक अफिसर तथा जवानहरूको भलाइको 
                  निमित्त एउटा सामाजिक संस्था हुनु आवश्यक कुरा हो। आशा छ यस संस्थाले अवकाश प्राप्त 
                  भूतपूर्व सैनिक जवानहरूको सुव्यवस्थित परिचयको कायम गर्नाका लागि सैनिक अनुशासनमा 
                  रही आफ्नो कर्तव्य परायणतामा अग्रसर भई काम गर्नेछन्।"
                </p>
                <div className="mt-3 text-sm text-gold-dark font-medium">
                  प्रमुख संरक्षक: श्री ५ महाराजाधिराज महेन्द्र वीर विक्रम शाहदेव
                </div>
              </motion.div>

              {/* Prime Minister's Address */}
              <motion.div 
                className="p-6 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-bold text-army text-lg mb-3">प्रधानमन्त्री दा. के. आई. सिंहको सम्बोधन</h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
                  "नेपाल सेनाले आफ्नो कर्तव्यको सदा सचेतिकासाथ पालन गर्दै आएको छ भन्ने कुरा 
                  इतिहासमा एउटा सावित तथ्यको रूपमा मानिएको छ। यसको लागि हाम्रो देश संसारमा 
                  विख्यात छ। सैनिक राष्ट्रको एक अंग मात्र हुन् भन्ने कुरा सर्वविदित छ र राष्ट्रप्रति 
                  कुनै विपत्ति आइपरेमा उनको कर्तव्य तुरुन्त कि देश भक्तिको परिचय दिई राखेको छ। 
                  जहाँसम्म सम्भव छ, सरकारले भूतपूर्व सैनिकहरूको भलाइको लागि प्रयत्न गर्छ र 
                  पञ्चवर्षीय योजना तथा अन्य योजनाहरूमा उनीहरूलाई यथासम्भव स्थान दिनेछ।"
                </p>
              </motion.div>

              {/* King Birendra's Message */}
              <motion.div 
                className="p-6 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-bold text-army text-lg mb-3">राजा वीरेन्द्र वीर विक्रम शाहको प्रमुख संरक्षकत्व ग्रहण सन्देश</h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
                  "निःस्वार्थ र कडा सैनिक जीवन बिताएर अवकाश प्राप्त गर्ने सैनिकहरूलाई पेन्सन पुगेपछि 
                  रमाइलो हुन्छ र यस्तै पनि होइन होला। यस संघका सदस्यहरूले आफूले प्राप्त गरेको 
                  सैनिकजीवनको ठूलो अनुभव र अनुशासनको अमूल्य शिक्षासाथ लिएर आउने हुँदा देशभक्तिको 
                  जगमा प्रत्येक सदस्यबाट कम्तीमा एउटा इँटा अवश्य थपिने छ भन्ने आशा लाग्नु स्वाभाविकै 
                  छ। परम्परागत देशभक्तिका लागि प्रकट गरिएका उदाहरणहरू सराहनीय छन्।"
                </p>
                <div className="mt-3 text-sm text-gold-dark font-medium">
                  प्रमुख संरक्षक: राजा वीरेन्द्र वीर विक्रम शाह
                </div>
              </motion.div>

              {/* Chief of Army Staff */}
              <motion.div 
                className="p-6 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-bold text-army text-lg mb-3">प्रधान सेनापति जनरल तोरण शमशेर ज.ब. राणाको उद्गार</h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg text-justify">
                  "देशभक्ति नेपाली सेनाको रगत रगतमा भएकोले यो संघको भविष्य उज्ज्वल छ।"
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div 
            className="rounded-2xl p-8 mb-8 hover:border-2 hover:border-gold transition-all duration-300"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold text-army mb-6">{t('sections.ourObjectives')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-lg mb-3">{t('sections.serviceAndUnity')}</h3>
                <ul className="text-gray-600 space-y-2 text-base">
                  <li>• भूतपूर्व सैनिकहरूलाई संगठित तथा एकताबद्ध गर्ने</li>
                  <li>• राष्ट्रिय सुरक्षा तथा सेवामा परिचालन गराउने</li>
                  <li>• देश र जनताप्रति पूर्ण आस्था र निष्ठा राख्ने</li>
                </ul>
              </motion.div>
              <motion.div 
                className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-lg mb-3">{t('sections.welfareAndDevelopment')}</h3>
                <ul className="text-gray-600 space-y-2 text-base">
                  <li>• भूतपूर्व सैनिक वर्गको हकहितमा क्रियाशील रहने</li>
                  <li>• आत्मनिर्भर बनाउन विभिन्न सीप तथा दक्षता विकास</li>
                  <li>• आर्थिक अवस्था सुधारमा प्रचलन गर्ने</li>
                </ul>
              </motion.div>
              <motion.div 
                className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-lg mb-3">{t('sections.socialService')}</h3>
                <ul className="text-gray-600 space-y-2 text-base">
                  <li>• अन्य सामाजिक संघ संस्थाहरूसँग सम्पर्क राख्ने</li>
                  <li>• समाजका विभिन्न कल्याणकारी काममा संलग्न हुने</li>
                  <li>• सुरक्षा सेवा तथा रोजगारमूलक काममा संलग्न गराउने</li>
                </ul>
              </motion.div>
              <motion.div 
                className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-lg mb-3">{t('sections.organizationalStructure')}</h3>
                <ul className="text-gray-600 space-y-2 text-base">
                  <li>• केन्द्रीय प्रतिनिधि सभा</li>
                  <li>• केन्द्रीय समिति र सञ्चालक समिति</li>
                  <li>• जिल्ला, क्षेत्रीय र इकाई कार्य समितिहरू</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Committee Structure - Modern Layout with Title Left, Content Right */}
          <motion.div 
            className="rounded-2xl p-8 mb-8 hover:border-2 hover:border-gold transition-all duration-300"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Title on Left */}
              <motion.div 
                className="lg:col-span-1 flex flex-col items-start justify-center"
                variants={fadeInLeft}
              >
                <div className="relative">
                  <div className="w-16 h-1 bg-gold mb-4 rounded-full"></div>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-army leading-tight">
                    संघको <br />संगठनात्मक <br />संरचना
                  </h2>
                  <p className="text-sm text-gray-400 mt-3">Organizational Structure</p>
                </div>
              </motion.div>

              {/* Content on Right */}
              <motion.div 
                className="lg:col-span-4"
                variants={fadeInRight}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div 
                    className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <h3 className="font-semibold text-army text-center text-lg mb-3">केन्द्रीय समिति</h3>
                    <div className="space-y-1 text-gray-600 text-base">
                      <p>• सभापति - १</p>
                      <p>• वरिष्ठ उप सभापति - १</p>
                      <p>• उप सभापति - १</p>
                      <p>• महासचिव - १</p>
                      <p>• सचिव - २</p>
                      <p>• कोषाध्यक्ष - १</p>
                      <p>• सह कोषाध्यक्ष - १</p>
                      <p>• सदस्यहरू - १०</p>
                      <p className="font-semibold text-gold mt-2 text-lg">कुल - १८ जना</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <h3 className="font-semibold text-army text-center text-lg mb-3">जिल्ला कार्य समिति</h3>
                    <div className="space-y-1 text-gray-600 text-base">
                      <p>• सभापति - १</p>
                      <p>• उप सभापति - १</p>
                      <p>• सचिव - १</p>
                      <p>• सह सचिव - १</p>
                      <p>• कोषाध्यक्ष - १</p>
                      <p>• सदस्यहरू - (आवश्यकतानुसार)</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <h3 className="font-semibold text-army text-center text-lg mb-3">क्षेत्रीय/इकाई कार्य समिति</h3>
                    <div className="space-y-1 text-gray-600 text-base">
                      <p>• सभापति - १</p>
                      <p>• उप सभापति - १</p>
                      <p>• सचिव - १</p>
                      <p>• सह सचिव - १</p>
                      <p>• कोषाध्यक्ष - १</p>
                      <p>• सदस्यहरू - १०</p>
                      <p className="font-semibold text-gold mt-2 text-lg">कुल - १५ जना</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <h3 className="font-semibold text-army text-center text-lg mb-3">पदावधि</h3>
                    <div className="space-y-1 text-gray-600 text-base">
                      <p>• सबै तहको पदावधि - ५ वर्ष</p>
                      <p>• सदस्यता अवधि - ५ वर्ष</p>
                      <p>• नवीकरण शुल्क - रु. १,०००/-</p>
                      <p>• आजीवन सदस्यता - केन्द्रीय स्वीकृतिबाट</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Membership Section */}
          <motion.div 
            className="rounded-2xl p-8 mb-8 hover:border-2 hover:border-gold transition-all duration-300"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold text-army mb-6">{t('sections.membershipSystem')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300 text-center"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-lg">साधारण सदस्य</h3>
                <p className="text-gray-600 mt-2 text-base">रु. १,०००/- (५ वर्ष)</p>
                <p className="text-sm text-gray-400 mt-1">नवीकरण शुल्क समान</p>
              </motion.div>
              <motion.div 
                className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300 text-center"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-lg">आजीवन सदस्य</h3>
                <p className="text-gray-600 mt-2 text-base">केन्द्रीय स्वीकृतिबाट</p>
                <p className="text-sm text-gray-400 mt-1">विशेष अधिकार सहित</p>
              </motion.div>
              <motion.div 
                className="p-5 rounded-xl hover:border-2 hover:border-gold transition-all duration-300 text-center"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-lg">मानार्थ सदस्य</h3>
                <p className="text-gray-600 mt-2 text-base">विशेष योगदानको आधारमा</p>
                <p className="text-sm text-gray-400 mt-1">मतदान अधिकार हुनेछैन</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              variants={fadeInUp}
              className="p-6 rounded-xl text-center hover:border-2 hover:border-gold transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <h4 className="font-semibold text-army text-lg">स्थापना वर्ष</h4>
              <p className="text-gold text-2xl font-bold mt-2">२०४७</p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="p-6 rounded-xl text-center hover:border-2 hover:border-gold transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <h4 className="font-semibold text-army text-lg">प्रमुख संरक्षक</h4>
              <p className="text-gold text-lg font-bold mt-2">श्री ५ महाराजाधिराज</p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="p-6 rounded-xl text-center hover:border-2 hover:border-gold transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <h4 className="font-semibold text-army text-lg">सदस्य संख्या</h4>
              <p className="text-gold text-2xl font-bold mt-2">५,०००+</p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="p-6 rounded-xl text-center hover:border-2 hover:border-gold transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <h4 className="font-semibold text-army text-lg">जिल्ला विस्तार</h4>
              <p className="text-gold text-2xl font-bold mt-2">७७</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}

export default HistoryFoundation;