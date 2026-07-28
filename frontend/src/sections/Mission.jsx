import React from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { Target, Heart, Users, Shield, Award, Globe } from 'lucide-react';

const missionPoints = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To serve the nation and society by leveraging the experience and dedication of ex-army personnel.'
  },
  {
    icon: Heart,
    title: 'Social Welfare',
    description: 'Engage in social welfare activities, disaster relief, and community development programs.'
  },
  {
    icon: Users,
    title: 'Veteran Support',
    description: 'Provide support, guidance, and assistance to ex-army personnel and their families.'
  },
  {
    icon: Shield,
    title: 'National Security',
    description: 'Contribute to national security awareness and disaster preparedness initiatives.'
  },
  {
    icon: Award,
    title: 'Recognition',
    description: 'Honor the sacrifices and contributions of army personnel to the nation.'
  },
  {
    icon: Globe,
    title: 'Global Outreach',
    description: 'Build international connections with similar organizations worldwide.'
  }
];

export function Mission() {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Eyebrow>Our Purpose</Eyebrow>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
            Mission & Vision
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Guided by our core values and commitment to service, we strive to make a meaningful impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missionPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-semibold text-army text-lg">{point.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{point.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default Mission;