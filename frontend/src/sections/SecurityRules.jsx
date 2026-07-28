import React from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

const rules = [
  { rule: 'Maintain confidentiality of sensitive information.', status: 'required' },
  { rule: 'Follow security protocols and procedures at all times.', status: 'required' },
  { rule: 'Report any security concerns immediately.', status: 'required' },
  { rule: 'Keep personal security clearance up to date.', status: 'recommended' },
  { rule: 'Participate in regular security awareness training.', status: 'recommended' },
];

export function SecurityRules() {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Guidelines</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Security Rules
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Important security guidelines for all members and personnel.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-gold" />
              <h2 className="font-display text-xl font-bold text-army">Security Protocols</h2>
            </div>

            <div className="space-y-3">
              {rules.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  {item.status === 'required' ? (
                    <AlertTriangle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-gray-700">{item.rule}</p>
                    <span className={`text-xs font-medium ${item.status === 'required' ? 'text-gold-dark' : 'text-green-600'}`}>
                      {item.status === 'required' ? 'Required' : 'Recommended'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gold/5 rounded-lg border border-gold/20">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gold" />
                <p className="text-sm text-gray-600">
                  For any security concerns, please contact the security department immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SecurityRules;