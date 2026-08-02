import React from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { Calendar, Flag, Award, Users, FileText, Shield, Heart, Target } from 'lucide-react';

export function HistoryFoundation() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>हाम्रो यात्रा</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              इतिहास र स्थापना
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              स्थापनादेखि अग्रणी भूतपूर्व सैनिक संस्था बन्ने हाम्रो यात्रा
            </p>
          </div>

          {/* Foundation Section */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-100">
            <h2 className="font-display text-2xl font-bold text-army mb-4">हाम्रो स्थापना</h2>
            <p className="text-gray-700 leading-relaxed">
              नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको स्थापना २०४७ सालमा भएको हो। यस संघको 
              उद्देश्य भूतपूर्व सैनिकहरूलाई संगठित गरी देश र जनताप्रति पूर्ण आस्था र निष्ठाका 
              साथ राष्ट्रिय सेवामा परिचालन गराउनु हो। यो संघ मुनाफा रहित जनहितकारी सामाजिक 
              संस्था हो।
            </p>
          </div>

          {/* Historical Messages Section */}
          <div className="bg-gold/5 rounded-2xl p-8 mb-8 border border-gold/20">
            <h2 className="font-display text-2xl font-bold text-army mb-4">ऐतिहासिक सन्देशहरू</h2>
            
            <div className="space-y-6">
              {/* King Mahendra's Message */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-army text-lg mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gold" />
                  श्री ५ महाराजाधिराज महेन्द्र वीर विक्रम शाहदेवको सन्देश
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  "खुसीको कुरा छ कि आज नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको उद्घाटन हुँदैछ। 
                  विरक्ताप्राप्त भूतपूर्व अफिसर तथा सैनिक जवानहरूको निमित्तको सोभियत निवृत्ति 
                  संघको गौरव एवं ज्ञान राख्ने उद्देश्य राखिएको छ। नजीकताका अगाडि रही देश सेवा 
                  गर्ने सैनिक जवानहरूको मूल मन्त्र हो। हाम्रा फौजी जवानहरूको अनुशासन, इमान्दारी 
                  तथा बहादुरीको ख्याति विश्वव्यापी छ। भूतपूर्व सैनिक अफिसर तथा जवानहरूको भलाइको 
                  निमित्त एउटा सामाजिक संस्था हुनु आवश्यक कुरा हो। आशा छ यस संस्थाले अवकाश प्राप्त 
                  भूतपूर्व सैनिक जवानहरूको सुव्यवस्थित परिचयको कायम गर्नाका लागि सैनिक अनुशासनमा 
                  रही आफ्नो कर्तव्य परायणतामा अग्रसर भई काम गर्नेछन्।"
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <strong>प्रमुख संरक्षक:</strong> श्री ५ महाराजाधिराज महेन्द्र वीर विक्रम शाहदेव
                </div>
              </div>

              {/* Prime Minister's Address */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-army text-lg mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-gold" />
                  प्रधानमन्त्री दा. के. आई. सिंहको सम्बोधन
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  "नेपाल सेनाले आफ्नो कर्तव्यको सदा सचेतिकासाथ पालन गर्दै आएको छ भन्ने कुरा 
                  इतिहासमा एउटा सावित तथ्यको रूपमा मानिएको छ। यसको लागि हाम्रो देश संसारमा 
                  विख्यात छ। सैनिक राष्ट्रको एक अंग मात्र हुन् भन्ने कुरा सर्वविदित छ र राष्ट्रप्रति 
                  कुनै विपत्ति आइपरेमा उनको कर्तव्य तुरुन्त कि देश भक्तिको परिचय दिई राखेको छ। 
                  जहाँसम्म सम्भव छ, सरकारले भूतपूर्व सैनिकहरूको भलाइको लागि प्रयत्न गर्छ र 
                  पञ्चवर्षीय योजना तथा अन्य योजनाहरूमा उनीहरूलाई यथासम्भव स्थान दिनेछ।"
                </p>
              </div>

              {/* King Birendra's Message */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-army text-lg mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gold" />
                  राजा वीरेन्द्र वीर विक्रम शाहको प्रमुख संरक्षकत्व ग्रहण सन्देश
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  "निःस्वार्थ र कडा सैनिक जीवन बिताएर अवकाश प्राप्त गर्ने सैनिकहरूलाई पेन्सन पुगेपछि 
                  रमाइलो हुन्छ र यस्तै पनि होइन होला। यस संघका सदस्यहरूले आफूले प्राप्त गरेको 
                  सैनिकजीवनको ठूलो अनुभव र अनुशासनको अमूल्य शिक्षासाथ लिएर आउने हुँदा देशभक्तिको 
                  जगमा प्रत्येक सदस्यबाट कम्तीमा एउटा इँटा अवश्य थपिने छ भन्ने आशा लाग्नु स्वाभाविकै 
                  छ। परम्परागत देशभक्तिका लागि प्रकट गरिएका उदाहरणहरू सराहनीय छन्।"
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <strong>प्रमुख संरक्षक:</strong> राजा वीरेन्द्र वीर विक्रम शाह
                </div>
              </div>

              {/* Chief of Army Staff */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-army text-lg mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold" />
                  प्रधान सेनापति जनरल तोरण शमशेर ज.ब. राणाको उद्गार
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  "देशभक्ति नेपाली सेनाको रगत रगतमा भएकोले यो संघको भविष्य उज्ज्वल छ।"
                </p>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-100">
            <h2 className="font-display text-2xl font-bold text-army mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-gold" />
              हाम्रो उद्देश्य
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-army mb-2">सेवा र एकता</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• भूतपूर्व सैनिकहरूलाई संगठित तथा एकताबद्ध गर्ने</li>
                  <li>• राष्ट्रिय सुरक्षा तथा सेवामा परिचालन गराउने</li>
                  <li>• देश र जनताप्रति पूर्ण आस्था र निष्ठा राख्ने</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-army mb-2">कल्याण र विकास</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• भूतपूर्व सैनिक वर्गको हकहितमा क्रियाशील रहने</li>
                  <li>• आत्मनिर्भर बनाउन विभिन्न सीप तथा दक्षता विकास</li>
                  <li>• आर्थिक अवस्था सुधारमा प्रचलन गर्ने</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-army mb-2">सामाजिक सेवा</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• अन्य सामाजिक संघ संस्थाहरूसँग सम्पर्क राख्ने</li>
                  <li>• समाजका विभिन्न कल्याणकारी काममा संलग्न हुने</li>
                  <li>• सुरक्षा सेवा तथा रोजगारमूलक काममा संलग्न गराउने</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-army mb-2">संगठनात्मक संरचना</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• केन्द्रीय प्रतिनिधि सभा</li>
                  <li>• केन्द्रीय समिति र सञ्चालक समिति</li>
                  <li>• जिल्ला, क्षेत्रीय र इकाई कार्य समितिहरू</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Committee Structure */}
          <div className="bg-gold/5 rounded-2xl p-8 mb-8 border border-gold/20">
            <h2 className="font-display text-2xl font-bold text-army mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-gold" />
              संघको संगठनात्मक संरचना
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-army text-center mb-3">केन्द्रीय समिति</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• सभापति - १</p>
                  <p>• वरिष्ठ उप सभापति - १</p>
                  <p>• उप सभापति - १</p>
                  <p>• महासचिव - १</p>
                  <p>• सचिव - २</p>
                  <p>• कोषाध्यक्ष - १</p>
                  <p>• सह कोषाध्यक्ष - १</p>
                  <p>• सदस्यहरू - १०</p>
                  <p className="font-semibold text-gold mt-1">कुल - १८ जना</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-army text-center mb-3">जिल्ला कार्य समिति</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• सभापति - १</p>
                  <p>• उप सभापति - १</p>
                  <p>• सचिव - १</p>
                  <p>• सह सचिव - १</p>
                  <p>• कोषाध्यक्ष - १</p>
                  <p>• सदस्यहरू - (आवश्यकतानुसार)</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-army text-center mb-3">क्षेत्रीय/इकाई कार्य समिति</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• सभापति - १</p>
                  <p>• उप सभापति - १</p>
                  <p>• सचिव - १</p>
                  <p>• सह सचिव - १</p>
                  <p>• कोषाध्यक्ष - १</p>
                  <p>• सदस्यहरू - १०</p>
                  <p className="font-semibold text-gold mt-1">कुल - १५ जना</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-army text-center mb-3">पदावधि</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• सबै तहको पदावधि - ५ वर्ष</p>
                  <p>• सदस्यता अवधि - ५ वर्ष</p>
                  <p>• नवीकरण शुल्क - रु. १,०००/-</p>
                  <p>• आजीवन सदस्यता - केन्द्रीय स्वीकृतिबाट</p>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Section */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-100">
            <h2 className="font-display text-2xl font-bold text-army mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-gold" />
              सदस्यता व्यवस्था
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-army">साधारण सदस्य</h3>
                <p className="text-sm text-gray-600 mt-2">रु. १,०००/- (५ वर्ष)</p>
                <p className="text-xs text-gray-400 mt-1">नवीकरण शुल्क समान</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-army">आजीवन सदस्य</h3>
                <p className="text-sm text-gray-600 mt-2">केन्द्रीय स्वीकृतिबाट</p>
                <p className="text-xs text-gray-400 mt-1">विशेष अधिकार सहित</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                <h3 className="font-semibold text-army">मानार्थ सदस्य</h3>
                <p className="text-sm text-gray-600 mt-2">विशेष योगदानको आधारमा</p>
                <p className="text-xs text-gray-400 mt-1">मतदान अधिकार हुनेछैन</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gold/5 p-6 rounded-xl text-center border border-gold/10">
              <Calendar className="h-8 w-8 text-gold mx-auto mb-2" />
              <h4 className="font-semibold text-army">स्थापना वर्ष</h4>
              <p className="text-gray-600 text-lg font-bold">२०४७</p>
            </div>
            <div className="bg-gold/5 p-6 rounded-xl text-center border border-gold/10">
              <Flag className="h-8 w-8 text-gold mx-auto mb-2" />
              <h4 className="font-semibold text-army">प्रमुख संरक्षक</h4>
              <p className="text-gray-600 text-sm">श्री ५ महाराजाधिराज</p>
            </div>
            <div className="bg-gold/5 p-6 rounded-xl text-center border border-gold/10">
              <Users className="h-8 w-8 text-gold mx-auto mb-2" />
              <h4 className="font-semibold text-army">सदस्य संख्या</h4>
              <p className="text-gray-600 text-lg font-bold">५,०००+</p>
            </div>
            <div className="bg-gold/5 p-6 rounded-xl text-center border border-gold/10">
              <Award className="h-8 w-8 text-gold mx-auto mb-2" />
              <h4 className="font-semibold text-army">जिल्ला विस्तार</h4>
              <p className="text-gray-600 text-lg font-bold">७७</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HistoryFoundation;