import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/ui/Section';
import { motion } from 'framer-motion';

export function TreasuryTeams() {
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
      className="py-20 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-army mt-4">
              {t('sections.teamsAndTreasury')}
            </h1>
            <p className="text-gray-600 mt-4 text-lg md:text-xl">
              {t('sections.treasurySubtitle')}
            </p>
            <motion.div 
              className="w-24 h-1 bg-gold mx-auto mt-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          {/* Financial System */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              {t('sections.treasurySystem')}
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold text-army">{t('sections.treasury')} :</span> संघको कोषलाई ने.रु. ५५,५५,५५५ सम्मको कोष भनिनेछ।
                </p>
              </div>

              <div>
                <p className="font-semibold text-army text-lg mb-3">संघको कोषमा देहायका रकमहरू हाल्न बाधिनेछन् :</p>
                <ul className="space-y-2 text-gray-700 leading-relaxed text-base md:text-lg pl-6">
                  <li>• सदस्यताबाट प्राप्त शुल्क,</li>
                  <li>• विभिन्न व्यक्ति, संघ, संस्था वा सरकारी सहयोगबाट प्राप्त हुने रकम,</li>
                  <li>• अन्य धन्दाबाट प्राप्त वा संघले विभिन्न व्यवसाय र कार्यक्रम गरी आर्जन गरेको रकम,</li>
                  <li>• वैदेशिक सहयोग प्राप्त हुने भएमा समाज कल्याण परिषद्को पूर्व स्वीकृति लिनुपर्नेछ।</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mt-3">
                  भ्रातृ एवं मैत्री संस्थाहरूको कल्याणको निमित्त संघले कुनै पनि विदेशी राष्ट्रिय संघ संस्थाहरूसँग सम्बन्ध कायम गरी सहयोग प्राप्त गर्न सक्ने छ। आफ्नो उद्देश्यहरू परिपूर्तिको निमित्त संघले वित्तीय संस्थाहरूबाट ऋण प्राप्त गर्न सक्नेछ।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Types of Funds */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              {t('sections.treasuryTypes')}
            </h2>
            <p className="text-gray-600 text-center mb-6 text-base md:text-lg">संघको कोष चार प्रकारको हुनेछ :</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="bg-gold/5 p-5 rounded-lg border border-gold/20 hover:shadow-lg transition-all"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-xl">{t('sections.akshayFund')}</h3>
                <p className="text-base text-gray-600 mt-1">"नेपाल राष्ट्रिय गणेश भण्डारी स्मृति अक्षय कोष"</p>
                <ul className="text-base text-gray-700 mt-3 space-y-1.5 pl-4">
                  <li>• आजीवन सदस्यबाट प्राप्त रकम</li>
                  <li>• अक्षय कोषको लागि भनी तोकिएर प्राप्त भएको रकम</li>
                  <li>• केन्द्रीय कार्य समितिको निर्णय बमोजिम अक्षय कोषमा राख्ने भनी तोकिएको रकम</li>
                </ul>
              </motion.div>
              <motion.div 
                className="bg-gold/5 p-5 rounded-lg border border-gold/20 hover:shadow-lg transition-all"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-xl">{t('sections.mainFund')}</h3>
                <ul className="text-base text-gray-700 mt-3 space-y-1.5 pl-4">
                  <li>• सम्पत्ति लगानीबाट आर्जन गरेको रकम</li>
                  <li>• दान दातव्य, अनुदान</li>
                  <li>• विभिन्न कार्यक्रम गरी आर्जन गरेको रकम</li>
                  <li>• अक्षय कोषबाट आर्जन भएको ब्याजको रकम</li>
                </ul>
              </motion.div>
              <motion.div 
                className="bg-gold/5 p-5 rounded-lg border border-gold/20 hover:shadow-lg transition-all"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-xl">{t('sections.generalFund')}</h3>
                <ul className="text-base text-gray-700 mt-3 space-y-1.5 pl-4">
                  <li>• विनियोजित बजेटको रकम</li>
                  <li>• दैनिक कार्यक्रम सञ्चालन</li>
                  <li>• महासचिव, कोषाध्यक्षको संयुक्त दस्तखत</li>
                </ul>
              </motion.div>
              <motion.div 
                className="bg-gold/5 p-5 rounded-lg border border-gold/20 hover:shadow-lg transition-all"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-semibold text-army text-xl">{t('sections.welfareFund')}</h3>
                <ul className="text-base text-gray-700 mt-3 space-y-1.5 pl-4">
                  <li>• भूतपूर्व सैनिक कल्याण</li>
                  <li>• सामाजिक कार्यक्रम</li>
                  <li>• विशेष सहायता कार्यक्रम</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Akshay Fund Details */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              अक्षय कोष सञ्चालन तथा नियन्त्रण
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">अक्षय कोष कहिलै पनि मास्न पाउने छैन।</span> अक्षय कोषको वार्षिक ब्याजबाट आएको २५% रकम पुनः अक्षय कोषमा नै राखिनेछ र ७५% रकम मूल कोषमा राखी अन्य कार्यक्रम खर्च गर्न सकिनेछ।
                </p>
              </div>

              <div>
                <p className="font-semibold text-army text-lg mb-3">अक्षय कोषको सञ्चालन उपसमिति :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600">केन्द्रीय सभापति</p>
                    <p className="font-semibold text-army text-lg">१</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600">केन्द्रीय वरिष्ठ उप-सभापति / उप-सभापति मध्ये</p>
                    <p className="font-semibold text-army text-lg">१</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600">केन्द्रीय महासचिव</p>
                    <p className="font-semibold text-army text-lg">१</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600">केन्द्रीय कोषाध्यक्ष</p>
                    <p className="font-semibold text-army text-lg">१</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 md:col-span-2">
                    <p className="text-sm text-gray-600">सभापतिद्वारा केन्द्रीय सदस्यबाट मनोनीत सदस्य</p>
                    <p className="font-semibold text-army text-lg">१</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gold/5 rounded-lg border border-gold/20">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">द्रष्टव्य :</span> खाता सञ्चालन सभापति, वरिष्ठ उप-सभापति / उप-सभापति मध्ये–१ र कोषाध्यक्षको अनिवार्य दस्तखतबाट संयुक्त दस्तखतद्वारा सञ्चालन हुनेछ।
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assets and Audit */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              चल अचल सम्पत्ति र लेखापरीक्षण
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">सम्पत्ति :</span> ने.रा.भू.पू. सैनिक संघ केन्द्रीय कार्यालय, पुल्चोक, ललितपुरस्थित सैनिक स्मारक स्थलमा कार्यालय भवन, विश्राम गृह, सभागृह, सैनिक स्मारक, आवास गृह तथा निर्धारित प्रयोजनका लागि दिइएको स्थल समेतले ओगटेको कम्पाउण्ड तथा जिन्सी मालसामानहरू संघको सम्पत्ति रहनेछन्।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">लेखापरीक्षण :</span> संघको आय व्ययको आन्तरिक लेखा परीक्षण गराई त्यसको प्रतिवेदन केन्द्रीय साधारण सभामा प्रस्तुत गरी अनुमोदन गराइनेछ।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Election and Rules */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              निर्वाचन, नियम र अन्य व्यवस्था
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">निर्वाचन :</span> संघको निर्वाचन सम्बन्धी व्यवस्था केन्द्रीय सञ्चालक समितिले निर्धारण गरी नियममा उल्लेख भए बमोजिम हुनेछ।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Resignation Authority */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              राजीनामा स्वीकृत गर्ने अधिकार
            </h2>
            
            <div className="space-y-3">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  संघको क्षेत्रीय/इकाई का.स.मा रहेको सभापति बाहेक अन्य पदाधिकारी वा सदस्यहरूले राजीनामा दिएमा सम्बन्धित समितिको सभापतिले राजीनामा स्वीकृत गर्न सक्नेछ र सोको सूचना जिल्ला का.स.लाई दिनेछ।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  क्षेत्रीय/इकाई कार्य समितिका कोषाध्यक्षको राजीनामा तथा जिल्ला कार्य समितिका पदाधिकारी तथा सदस्यहरूको राजीनामा सम्बन्धित जिल्ला सभापतिले स्वीकृत गर्नेछ।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  जिल्ला सभापतिको राजीनामा केन्द्रीय सभापतिले स्वीकृत गर्नेछ। केन्द्रीय सभापतिको राजीनामा केन्द्रीय कार्य समितिले स्वीकृत गर्नेछ।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Amendment and Rules */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              विधान संशोधन र नियम निर्माण
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">विधान संशोधन :</span> समयानुसार संघको विधान संशोधन गर्नुपरेमा केन्द्रीय साधारण सभामा संशोधन प्रस्ताव पेश गरी सो सभामा उपस्थित सदस्यहरूको दुई तिहाइ सदस्यहरूबाट सो प्रस्ताव पारित भएमा विधान संशोधन गर्न सकिनेछ। केन्द्रीय साधारण सभाले आफूमा रहेको विधान संशोधन गर्ने अधिकार केन्द्रीय समिति वा केन्द्रीय सञ्चालक समितिलाई प्रदान गर्न सक्नेछ, सोको अनुमोदन केन्द्रीय साधारण सभाले गर्नेछ।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">नियम र विनियम :</span> केन्द्रीय सञ्चालक समितिले आवश्यक नियम, विनियम तथा निर्देशिका बनाउन सक्नेछ।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Advisory and Legal */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              प्रमुख संरक्षक, संरक्षक, सल्लाहकार र अन्य समिति
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  केन्द्रीय समितिले भूतपूर्व सैनिकहरूको कल्याणको निमित्त प्रशंसनीय रूपमा काम गरेका पदाधिकारी तथा सदस्यहरूलाई उनीहरूको योगदानको कदर स्वरूप माथिल्लो एक तह बढुवा मानार्थ पद उनीहरूको निर्णय सम्बन्धित निकायको सिफारिस गर्न सक्नेछ।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  यस संघको विकास, सुदृढीकरण तथा भूतपूर्व सैनिकहरूको कल्याणको निमित्त आवश्यकताअनुसार प्रमुख संरक्षक, संरक्षक, सल्लाहकार समिति तथा उप समितिहरू केन्द्रीय सञ्चालक समितिको निर्णय अनुसार रहने छन्।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">कानुनी सल्लाहकार :</span> नेपाल राष्ट्रिय भूतपूर्व सैनिक संघलाई कानुनी परामर्श दिन तथा यस संघको कसैको विरुद्धमा मुद्दा गर्न वा यसका विरुद्ध परेका मुद्दाको प्रतिवाद गर्न १ (एक) जना कानुनी सल्लाहकार राख्न सक्नेछ।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Term and Election */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              सभापतिको पदको अवधि र निर्वाचन
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">सभापतिको पदको अवधि :</span> संघको कुनै पनि तहको सभापतिले लगातार २ पदावधि भन्दा बढी सभापतिको उम्मेदवार हुन पाउने छैन तर बिचमा पदावधिको अन्तरपछि पुनः सभापतिको पदमा उम्मेदवार हुन पाउने छ। जिल्ला, क्षेत्र/इकाई कार्य समितिको सभापतिमा भने सम्बन्धित कार्य समितिको ठोस सिफारिसमा केन्द्रीय समितिले निजको १ वर्ष पदावधि थप गर्न सकिनेछ।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">पदाधिकारीहरूको निर्वाचन :</span> कुनै पनि तहका सभापति निर्वाचित हुन र सभापतिद्वारा पदाधिकारीहरू मनोनयन हुन राजनीतिक दलको सदस्य नभएको हुनु पर्नेछ।
                </p>
              </div>
            </div>
          </motion.div>

          {/* Savings Clause */}
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-8 border border-gray-100"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army mb-6 text-center">
              बचाउ व्यवस्था
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">क)</span> यो विधान तथा नियम र विनियम लागू हुनुभन्दा अघि भएका काम कारवाही यसै विधान, नियम र विनियम अन्तर्गत भए गरेको मानिनेछ।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">ख)</span> यो विधान तथा नियम र विनियममा लेखिएर बाँकी रहेका कुराहरूको हकमा यस प्रकारका अन्य संघ संस्थाले अपनाएका सर्वमान्य सिद्धान्त बमोजिम गरिनेछ।
                </p>
              </div>
              <div className="bg-gold/5 p-4 rounded-lg border border-gold/20">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  <span className="font-semibold">ग)</span> नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ कुनै कारणले खारेज भएमा यस संघको नाममा रहेको सम्पूर्ण जायजेथा नेपाल सरकारको हुनेछ।
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}

export default TreasuryTeams;