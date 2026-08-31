import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/ui/Section';

export function Mission() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              {t('sections.ourObjectives')}
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              {t('')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gold font-bold text-lg flex-shrink-0">क)</span>
                <p className="text-gray-700 leading-relaxed">
                  नेपाली सेनाबाट अवकाश प्राप्त भूतपूर्व सैनिकहरूलाई संगठित तथा एकताबद्ध गरी देश र जनता प्रति पूर्ण आस्था र निष्ठा सहित यस भूतपूर्व सैनिक शक्तिलाई राष्ट्रिय सुरक्षा तथा सेवामा परिचालन गराउने,
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gold font-bold text-lg flex-shrink-0">ख)</span>
                <p className="text-gray-700 leading-relaxed">
                  भूतपूर्व सैनिक वर्गको हकहित तथा सर्वतोमुखी विकासलाई सदा ध्यानमा राखी उनीहरूलाई अनुशासनशील र आत्मनिर्भर बनाउन क्रियाशील रहने,
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gold font-bold text-lg flex-shrink-0">ग)</span>
                <p className="text-gray-700 leading-relaxed">
                  सैनिक जीवनमा हासिल गरेका विभिन्न सीप तथा दक्षतालाई राष्ट्रनिर्माणको काममा लगाउने,
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gold font-bold text-lg flex-shrink-0">घ)</span>
                <p className="text-gray-700 leading-relaxed">
                  भूतपूर्व सैनिक र उनीहरूको परिवारलाई उनीहरूको योग्यता अनुसार विभिन्न क्रियाकलापद्वारा आर्थिक अवस्था सुधारमा प्रचलन गर्ने,
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gold font-bold text-lg flex-shrink-0">ङ)</span>
                <p className="text-gray-700 leading-relaxed">
                  यसै प्रकारका अन्य सामाजिक संघ संस्थाहरूसँग सम्पर्क राख्दै भूतपूर्व सैनिक तथा तिनका परिवारको कल्याणको लागि काम गर्नुको साथै समाजका विभिन्न कल्याणकारी काममा संलग्न हुने,
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gold font-bold text-lg flex-shrink-0">च)</span>
                <p className="text-gray-700 leading-relaxed">
                  विभिन्न निकायहरूसँग समन्वय भए बमोजिम भूतपूर्व सैनिकहरूलाई सुरक्षा सेवा तथा रोजगारमूलक काममा संलग्न गराउने,
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border-t border-gold/20 pt-4 mt-2">
                <span className="text-gold font-bold text-lg flex-shrink-0">छ)</span>
                <p className="text-gray-700 leading-relaxed font-medium">
                  यो संघ मुनाफा रहित जनहितकारी सामाजिक संस्था हुनेछ।
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Mission;
