import React from 'react';
import { Container, Eyebrow } from '../components/ui/Section';

const councilMembers = [
  { name: 'Gen. (Retd.) Rajendra Chhetri', position: 'Chairperson', expertise: 'Strategic Planning' },
  { name: 'Lt. Gen. (Retd.) Bikram Shah', position: 'Vice Chairperson', expertise: 'Defense Strategy' },
  { name: 'Maj. Gen. (Retd.) Sushil Thapa', position: 'Secretary', expertise: 'Administration' },
  { name: 'Brig. Gen. (Retd.) Manoj Gurung', position: 'Treasurer', expertise: 'Finance' },
  { name: 'Col. (Retd.) Hemanta Rai', position: 'Member', expertise: 'Legal Affairs' },
  { name: 'Lt. Col. (Retd.) Prakash Rana', position: 'Member', expertise: 'Public Relations' },
];

export function Council() {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Eyebrow>Governing Body</Eyebrow>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
            Advisory Council
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Our distinguished council members provide strategic guidance and oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {councilMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-army/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-army font-bold text-lg">{member.name.charAt(0)}</span>
              </div>
              <h3 className="font-semibold text-army">{member.name}</h3>
              <p className="text-sm text-gold-dark font-medium">{member.position}</p>
              <p className="text-sm text-gray-500 mt-2">Expertise: {member.expertise}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Council;