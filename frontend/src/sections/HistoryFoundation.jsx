import React from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { Calendar, Flag, Award, Users } from 'lucide-react';

const milestones = [
  { year: '2010', title: 'Foundation Established', description: 'The association was founded with 50 founding members.' },
  { year: '2012', title: 'First National Convention', description: 'First national convention held in Kathmandu with 200+ delegates.' },
  { year: '2015', title: 'Earthquake Relief', description: 'Active participation in earthquake relief and rehabilitation efforts.' },
  { year: '2018', title: 'International Recognition', description: 'Recognized as a leading veterans organization in South Asia.' },
  { year: '2020', title: 'Digital Transformation', description: 'Launched digital initiatives and online presence.' },
  { year: '2023', title: 'Expansion', description: 'Expanded to all 77 districts of Nepal with 5000+ members.' },
];

export function HistoryFoundation() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Our Journey</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              History & Foundation
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Tracing our journey from inception to becoming a leading veterans organization.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h2 className="font-display text-2xl font-bold text-army mb-4">Our Foundation</h2>
            <p className="text-gray-700 leading-relaxed">
              The Nepal National Ex-Army Association was established in 2010 with a vision to unite
              retired army personnel and continue serving the nation. Founded by a group of dedicated
              veterans who recognized the need for a collective voice and support system for ex-army
              personnel, the association has grown to become a respected institution.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our foundation is built on the principles of unity, service, and patriotism. We believe
              that the discipline, dedication, and experience of army personnel should continue to
              benefit society even after active service.
            </p>
          </div>

          <h2 className="font-display text-2xl font-bold text-army mb-6">Key Milestones</h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="bg-gold/10 p-2 rounded-lg flex-shrink-0">
                  <Calendar className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gold-dark">{milestone.year}</span>
                    <span className="text-sm text-gray-400">|</span>
                    <h3 className="font-semibold text-army">{milestone.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gold/5 p-6 rounded-xl text-center">
              <Flag className="h-8 w-8 text-gold mx-auto mb-2" />
              <h4 className="font-semibold text-army">Founded</h4>
              <p className="text-gray-600 text-sm">2010</p>
            </div>
            <div className="bg-gold/5 p-6 rounded-xl text-center">
              <Users className="h-8 w-8 text-gold mx-auto mb-2" />
              <h4 className="font-semibold text-army">Members</h4>
              <p className="text-gray-600 text-sm">5000+</p>
            </div>
            <div className="bg-gold/5 p-6 rounded-xl text-center">
              <Award className="h-8 w-8 text-gold mx-auto mb-2" />
              <h4 className="font-semibold text-army">Districts</h4>
              <p className="text-gray-600 text-sm">77</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HistoryFoundation;