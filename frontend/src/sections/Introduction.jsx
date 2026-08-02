import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Section';
import { introductionAPI } from '../services/api';

export function Introduction() {
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
        content: data.content || 'नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ नेपाली सेनाबाट अवकाश प्राप्त गरेका भूतपूर्व सैनिकहरू र तिनका परिवारहरूको कल्याण र देश र नेपाली भूमिप्रति पूर्ण आस्था र निष्ठा सहित देश र जनताको रक्षा र सेवा गर्ने उद्देश्यले स्थापना भएको हो।',
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-army mt-4 leading-tight">
              {intro.title}
            </h1>
          </div>

          {/* Main Content with Image on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                {intro.content}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gold/5 p-5 rounded-xl text-center border border-gold/10 hover:shadow-md transition-shadow">
                  <p className="text-2xl md:text-3xl font-bold text-army">७०,०००+</p>
                  <p className="text-sm text-gray-500 mt-1">भूतपूर्व सैनिक</p>
                </div>
                <div className="bg-gold/5 p-5 rounded-xl text-center border border-gold/10 hover:shadow-md transition-shadow">
                  <p className="text-2xl md:text-3xl font-bold text-army">४,२०,०००+</p>
                  <p className="text-sm text-gray-500 mt-1">कुल जनसंख्या</p>
                </div>
                <div className="bg-gold/5 p-5 rounded-xl text-center border border-gold/10 hover:shadow-md transition-shadow">
                  <p className="text-2xl md:text-3xl font-bold text-army">६१</p>
                  <p className="text-sm text-gray-500 mt-1">जिल्ला कार्य समिति</p>
                </div>
                <div className="bg-gold/5 p-5 rounded-xl text-center border border-gold/10 hover:shadow-md transition-shadow">
                  <p className="text-2xl md:text-3xl font-bold text-army">२०,५६१</p>
                  <p className="text-sm text-gray-500 mt-1">कुल सदस्य</p>
                </div>
              </div>
            </div>

            {/* Right Side - Image and Additional Info */}
            <div className="space-y-6">
              {/* Image */}
              {intro.image && (
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                  <img 
                    src={intro.image} 
                    alt="Introduction" 
                    className="w-full h-72 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400/1F3D2B/FFFFFF?text=Association';
                    }}
                  />
                </div>
              )}

              {/* World Veterans Federation */}
              <div className="bg-gold/5 p-6 rounded-xl border border-gold/20 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-army text-base md:text-lg">
                  विश्व भूतपूर्व सैनिक महासंघ
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
                  नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ यस महासंघको २०१५ सालमा सदस्य भई हालसम्म 
                  सो महासंघको कार्य प्रक्रियामा योगदान पुर्‍याउँदै आएको छ। यस संघको संरक्षक 
                  रथी श्रीधर शमशेर ज.ब. राणा (अ.प्रा.) उक्त महासंघको आजीवन मानार्थ उपसभापति 
                  (Honorary Vice President) हुनुहुन्छ।
                </p>
              </div>

              {/* Advisory Council */}
              <div>
                <h3 className="font-bold text-army text-base md:text-lg mb-4">
                  संघको सल्लाहकार मण्डल
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm md:text-base text-gray-600">
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• पूर्व प्रधान सेनापति महारथी श्री अजय नरसिंह राणा</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• पूर्व प्रधान सेनापति महारथी श्री प्यारजंग थापा</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• रथी श्री खड्ग राज कार्की (अ.प्रा.)</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• रथी श्री बलानन्द शर्मा (अ.प्रा.)</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• रथी श्री नेपाल भूषण चन्द (अ.प्रा.)</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• मानार्थ रथी श्री यादव बहादुर रायमाझी (अ.प्रा.)</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• प्रा.डा. श्री निर्मल प्रसाद अर्याल (अ.प्रा.)</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• मानार्थ उ.र. श्री उद्धव बहादुर बिष्ट (अ.प्रा.)</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• श्री अर्जुन प्रसाद बाराल</p>
                  <p className="p-2 hover:bg-gray-50 rounded-lg transition-colors">• श्री गणेश विक्रम कार्की – अधिवक्ता</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Leadership Section */}
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-army text-center mb-8">
              वर्तमान केन्द्रीय पदाधिकारीहरू
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-gold-dark font-medium">केन्द्रीय सभापति</p>
                <p className="font-semibold text-army text-sm md:text-base mt-1">स.र. श्री दिवाकर शमशेर ज.ब. राणा (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-gold-dark font-medium">वरिष्ठ उपसभापति</p>
                <p className="font-semibold text-army text-sm md:text-base mt-1">स.र. डा. श्री केशर बहादुर भण्डारी (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-gold-dark font-medium">महासचिव</p>
                <p className="font-semibold text-army text-sm md:text-base mt-1">प्र.से. श्री श्याम सुन्दर घिमिरे (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-gold-dark font-medium">सचिव</p>
                <p className="font-semibold text-army text-sm md:text-base mt-1">ज.म. श्री केशव बहादुर बस्नेत (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-gold-dark font-medium">कोषाध्यक्ष</p>
                <p className="font-semibold text-army text-sm md:text-base mt-1">सु.कृ. श्री केदार बहादुर थापा (अ.प्रा.)</p>
              </div>
            </div>
          </div>

          {/* Central Members */}
          <div className="mt-10">
            <h2 className="font-display text-xl md:text-2xl font-bold text-army mb-6">
              केन्द्रीय सदस्यहरू
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">प्रदेश नं. १</p>
                <p className="text-gray-600 mt-1">श्री धन बहादुर खड्का (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">प्रदेश नं. २</p>
                <p className="text-gray-600 mt-1">ज.म. श्री प्रभु नारायण शिवाकोटी (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">प्रदेश नं. ३</p>
                <p className="text-gray-600 mt-1">प्र.सु. श्री मोहन कुमार थापा (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">प्रदेश नं. ४</p>
                <p className="text-gray-600 mt-1">प्र.से. श्री डिल्लीराम बाराल (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">प्रदेश नं. ५</p>
                <p className="text-gray-600 mt-1">ज.म. श्री इन्द्र बहादुर कुँवर (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">प्रदेश नं. ६</p>
                <p className="text-gray-600 mt-1">अम. श्री बालकृष्ण पौडेल (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">प्रदेश नं. ७</p>
                <p className="text-gray-600 mt-1">प्र.सु. श्री मदन सिंह थापा (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">म.से. श्री विष्णु बहादुर जि.सी. (अ.प्रा.)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-sm md:text-base">
                <p className="font-semibold text-army">सु.क. श्री दया कृष्ण न्यौपाने (अ.प्रा.)</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Introduction;