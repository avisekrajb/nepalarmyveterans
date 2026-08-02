import React, { useState } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { 
  Shield, Award, Users, Target, BookOpen, 
  Clock, CheckCircle, ChevronRight, Calendar,
  MapPin, Phone, Mail, ExternalLink
} from 'lucide-react';

const trainingPrograms = [
  {
    id: 1,
    icon: Shield,
    title: 'Security & Surveillance Training',
    description: 'Comprehensive training in modern security protocols, surveillance techniques, and threat assessment.',
    duration: '3 Months',
    eligibility: 'Ex-army personnel',
    location: 'Kathmandu',
    status: 'Ongoing',
    features: [
      'CCTV & Surveillance Systems',
      'Threat Assessment & Risk Management',
      'Security Protocol Implementation',
      'Emergency Response Planning'
    ]
  },
  {
    id: 2,
    icon: Target,
    title: 'Leadership Development Program',
    description: 'Advanced leadership and management skills training for veterans transitioning to civilian leadership roles.',
    duration: '2 Months',
    eligibility: 'Officers and Senior NCOs',
    location: 'Kathmandu',
    status: 'Starting Soon',
    features: [
      'Strategic Leadership',
      'Team Building & Management',
      'Decision Making Skills',
      'Conflict Resolution'
    ]
  },
  {
    id: 3,
    icon: Users,
    title: 'Community Engagement & Social Work',
    description: 'Training on community outreach, social work methodologies, and humanitarian assistance.',
    duration: '1.5 Months',
    eligibility: 'All veterans',
    location: 'Kathmandu',
    status: 'Enrolling',
    features: [
      'Community Development',
      'Social Work Methods',
      'Humanitarian Assistance',
      'Public Speaking & Communication'
    ]
  },
  {
    id: 4,
    icon: Award,
    title: 'Skills Enhancement Program',
    description: 'Vocational training and professional skills development for career transition and entrepreneurship.',
    duration: '4 Months',
    eligibility: 'All veterans',
    location: 'Kathmandu',
    status: 'Upcoming',
    features: [
      'Entrepreneurship Skills',
      'Digital Literacy',
      'Financial Management',
      'Career Development'
    ]
  },
  {
    id: 5,
    icon: BookOpen,
    title: 'Mental Health & Wellbeing',
    description: 'Program focused on mental health awareness, PTSD management, and psychological wellbeing for veterans.',
    duration: '1 Month',
    eligibility: 'All veterans',
    location: 'Kathmandu',
    status: 'Ongoing',
    features: [
      'Mental Health Awareness',
      'PTSD Management',
      'Counseling Skills',
      'Stress Management'
    ]
  },
  {
    id: 6,
    icon: Clock,
    title: 'Physical Fitness & Wellness',
    description: 'Physical fitness programs tailored for veterans, focusing on health, wellness, and active lifestyle.',
    duration: 'Ongoing',
    eligibility: 'All veterans',
    location: 'Kathmandu',
    status: 'Open',
    features: [
      'Physical Fitness Assessment',
      'Exercise Programs',
      'Health & Wellness Education',
      'Recreational Activities'
    ]
  }
];

function Training() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Programs' },
    { id: 'Ongoing', label: 'Ongoing' },
    { id: 'Starting Soon', label: 'Starting Soon' },
    { id: 'Enrolling', label: 'Enrolling' },
    { id: 'Open', label: 'Open' },
  ];

  const filteredPrograms = activeFilter === 'all' 
    ? trainingPrograms 
    : trainingPrograms.filter(p => p.status === activeFilter);

  const getStatusColor = (status) => {
    const colors = {
      'Ongoing': 'bg-green-500',
      'Starting Soon': 'bg-yellow-500',
      'Enrolling': 'bg-blue-500',
      'Upcoming': 'bg-purple-500',
      'Open': 'bg-gold',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
     
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Training & Development
            </h1>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Equipping our veterans with skills for continued service, personal development, and successful transition to civilian life.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Training Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <div
                  key={program.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gold/10 p-3 rounded-xl group-hover:bg-gold/20 transition-colors">
                        <Icon className="h-6 w-6 text-gold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-display text-lg font-bold text-army">
                            {program.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(program.status)}`}>
                            {program.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">{program.description}</p>
                        
                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {program.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {program.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {program.eligibility}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedProgram(program)}
                          className="mt-4 text-gold hover:text-gold-dark text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No training programs found for this filter.</p>
            </div>
          )}
        </div>
      </Container>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <button
                className="float-right text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                onClick={() => setSelectedProgram(null)}
              >
                ×
              </button>
              <h2 className="font-display text-2xl font-bold text-army">{selectedProgram.title}</h2>
              
              <div className="flex flex-wrap gap-3 mt-3">
                <span className={`text-xs px-3 py-1 rounded-full text-white ${getStatusColor(selectedProgram.status)}`}>
                  {selectedProgram.status}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  {selectedProgram.duration}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  {selectedProgram.location}
                </span>
              </div>

              <div className="mt-4 prose max-w-none">
                <p className="text-gray-700">{selectedProgram.description}</p>
                <h4 className="font-semibold text-army mt-4">Program Features:</h4>
                <ul className="space-y-1">
                  {selectedProgram.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-4 bg-gold/5 rounded-lg border border-gold/20">
                  <p className="text-sm text-gray-600">
                    <strong>Eligibility:</strong> {selectedProgram.eligibility}
                  </p>
                </div>
              </div>

              <button
                className="mt-6 w-full bg-gold text-white py-2 rounded-lg hover:bg-gold-dark transition-colors"
                onClick={() => setSelectedProgram(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Training;