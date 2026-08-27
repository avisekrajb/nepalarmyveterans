import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/ui/Section';

export function TaskProgram() {
  const { t } = useTranslation();

  const programs = [
    {
      title: t('sections.socialWelfare'),
      description: t('sections.socialWelfareDesc')
    },
    {
      title: t('sections.veteransAssistance'),
      description: t('sections.veteransAssistanceDesc')
    },
    {
      title: t('sections.disasterResponse'),
      description: t('sections.disasterResponseDesc')
    },
    {
      title: t('sections.skillsDevelopment'),
      description: t('sections.skillsDevelopmentDesc')
    },
    {
      title: t('sections.awarenessPrograms'),
      description: t('sections.awarenessProgramsDesc')
    },
    {
      title: t('sections.recognitionEvents'),
      description: t('sections.recognitionEventsDesc')
    }
  ];
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
            {t('sections.taskPrograms')}
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            {t('sections.taskProgramsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-transparent hover:border-2 hover:border-green-500"
            >
              <h3 className="font-semibold text-army text-lg">{program.title}</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-army/5 rounded-2xl p-8 border border-transparent hover:border-2 hover:border-green-500 transition-all">
          <h2 className="font-display text-2xl font-bold text-army text-center mb-4">
            {t('sections.getInvolved')}
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            {t('sections.getInvolvedDesc')}
          </p>
        </div>
      </Container>
    </section>
  );
}

export default TaskProgram;