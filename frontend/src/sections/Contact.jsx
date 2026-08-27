import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../components/ui/Loader';
import { Container } from '../components/ui/Section';
import { contactAPI, contactMessageAPI } from '../services/api';
import { 
  MapPin, Phone, Mail, Send, Clock, 
  Building2, ArrowRight, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function Contact() {
  const { t } = useTranslation();
  const [contact, setContact] = useState({ address: '', phone: '', email: '', mapEmbed: '' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const { data } = await contactAPI.getContact();
      setContact(data);
    } catch (error) {
      console.error('Failed to load contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      await contactMessageAPI.createMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully!');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Send message error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center min-h-screen">
        <Loader label={t('sections.loadingContact')} />
      </section>
    );
  }

  const contactItems = [
    { 
      icon: Building2, 
      label: t('sections.organization'), 
      value: 'नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ',
      detail: 'Nepal National Ex-Army Association',
      action: null
    },
    { 
      icon: MapPin, 
      label: 'Address', 
      value: 'Pulchowk, Lalitpur, Nepal',
      detail: 'Kathmandu Valley',
      action: 'https://maps.google.com/maps?q=Pulchowk+Lalitpur+Nepal'
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: contact?.phone || '+977-1-1234567',
      detail: 'Available 24/7 for emergencies',
      action: `tel:${contact?.phone || '+977-1-1234567'}`
    },
    { 
      icon: Mail, 
      label: 'Email', 
      value: contact?.email || 'info@nepalarmy.org',
      detail: 'We reply within 24 hours',
      action: `mailto:${contact?.email || 'info@nepalarmy.org'}`
    },
    { 
      icon: Clock, 
      label: t('sections.officeHours'), 
      value: t('sections.officeHoursValue'),
      detail: t('sections.closedOnHolidays'),
      action: null
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-army mb-4 leading-tight">
              {t('sections.contactUs')}
            </h1>
            
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('sections.contactSubtitle')}
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form Section - First on mobile */}
            <div className="lg:col-span-3 order-1 lg:order-1">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-500 hover:border-green-600 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-army">
                      {t('sections.sendMessage')}
                    </h3>
                    <p className="text-sm text-gray-500">{t('sections.fillFormBelow')}</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-army text-sm font-medium">
                        {t('sections.fullName')} <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder={t('sections.enterName')}
                        className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-army placeholder-gray-400 transition-all duration-300 ${
                          focused === 'name' 
                            ? 'border-green-500 ring-4 ring-green-500/10 bg-white' 
                            : 'border-gray-200 hover:border-green-500/50'
                        }`}
                        required 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-army text-sm font-medium">
                        {t('sections.emailAddress')} <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder={t('sections.enterEmail')}
                        className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-army placeholder-gray-400 transition-all duration-300 ${
                          focused === 'email' 
                            ? 'border-green-500 ring-4 ring-green-500/10 bg-white' 
                            : 'border-gray-200 hover:border-green-500/50'
                        }`}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-army text-sm font-medium">
                      {t('sections.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      value={formData.message} 
                      onChange={(e) => setFormData({...formData, message: e.target.value})} 
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      rows="5" 
                      placeholder={t('sections.writeMessage')}
                      className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-army placeholder-gray-400 transition-all duration-300 resize-none ${
                        focused === 'message' 
                          ? 'border-green-500 ring-4 ring-green-500/10 bg-white' 
                          : 'border-gray-200 hover:border-green-500/50'
                      }`}
                      required 
                    />
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-500 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p>{t('sections.secureInfo')}</p>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={sending}
                    className="group w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 rounded-xl hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                  >
                    {sending ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 group-hover:scale-110 transition-transform" /> 
                        Send Message
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  {submitted && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center animate-fadeIn">
                      <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">
                        ✅ Message sent successfully! We'll get back to you soon.
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Contact Info & Map - Last on mobile */}
            <div className="lg:col-span-2 order-2 lg:order-2 space-y-6">
              {/* Contact Cards - Clickable */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-green-500 hover:border-green-600 hover:bg-green-50 transition-all duration-300">
                <h4 className="text-army font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-700 rounded-full"></span>
                  {t('sections.contactInformation')}
                </h4>
                <div className="space-y-3">
                  {contactItems.map((item, index) => {
                    const isClickable = item.action !== null;
                    const Component = isClickable ? 'a' : 'div';
                    
                    return (
                      <Component
                        key={index}
                        href={item.action || '#'}
                        target={isClickable ? '_blank' : undefined}
                        rel={isClickable ? 'noopener noreferrer' : undefined}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group border-2 ${
                          isClickable 
                            ? 'cursor-pointer hover:bg-white hover:border-green-500/30 hover:shadow-md' 
                            : 'cursor-default border-transparent'
                        }`}
                        onClick={(e) => {
                          if (!isClickable) e.preventDefault();
                        }}
                      >
                        <div className={`p-3 rounded-xl transition-colors flex-shrink-0 ${
                          isClickable 
                            ? 'bg-green-50 group-hover:bg-green-100' 
                            : 'bg-green-50'
                        }`}>
                          <item.icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                            {item.label}
                          </h4>
                          <p className={`text-army font-semibold text-sm mt-0.5 ${
                            isClickable ? 'group-hover:text-green-700' : ''
                          }`}>
                            {item.value}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {item.detail}
                          </p>
                          {isClickable && (
                            <div className="mt-1">
                              <span className="text-[10px] text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to {item.label === 'Address' ? 'view on map' : item.label === 'Phone' ? 'call' : 'email'}
                              </span>
                            </div>
                          )}
                        </div>
                        {isClickable && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </Component>
                    );
                  })}
                </div>
              </div>

              {/* Map - Pulchowk, Lalitpur */}
              <div className="bg-white rounded-3xl shadow-2xl p-3 border-2 border-green-500 hover:border-green-600 hover:bg-green-50 transition-all duration-300">
                <div className="rounded-xl overflow-hidden h-48 md:h-56 lg:h-48">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.325124425803!2d85.3180275!3d27.684815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b3a9bf48c5%3A0x8f8f2a8f8f8f8f8f!2sPulchowk%2C%20Lalitpur%2044600%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Pulchowk Location Map"
                    className="w-full h-full"
                  />
                </div>
                <div className="p-3 text-center bg-green-50 rounded-lg mt-2">
                  <p className="text-xs text-gray-600 flex items-center justify-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Pulchowk, Lalitpur, Kathmandu, Nepal
                  </p>
                  <p className="text-xs text-green-700 font-semibold mt-1">
                    नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ
                  </p>
                  <p className="text-xs text-gray-500">
                    Nepal National Ex-Army Association
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}

export default Contact;