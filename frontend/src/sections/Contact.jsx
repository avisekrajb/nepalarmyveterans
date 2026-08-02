import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { contactAPI, contactMessageAPI } from '../services/api';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export function Contact() {
  const [contact, setContact] = useState({ address: '', phone: '', email: '', mapEmbed: '' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
         
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              हामीलाई सम्पर्क गर्नुहोस्
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              कुनै पनि प्रश्न वा सहायताको लागि हामीलाई सम्पर्क गर्नुहोस्।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-medium text-army">Address</h4>
                  <p className="text-gray-600 text-sm">{contact?.address || 'Kathmandu, Nepal'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-medium text-army">Phone</h4>
                  <p className="text-gray-600 text-sm">{contact?.phone || '+977-1-1234567'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-medium text-army">Email</h4>
                  <p className="text-gray-600 text-sm">{contact?.email || 'info@nepalarmy.org'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <Clock className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-medium text-army">Office Hours</h4>
                  <p className="text-gray-600 text-sm">Mon-Fri: 10:00 AM - 5:00 PM</p>
                </div>
              </div>

              {/* Map */}
              {contact?.mapEmbed ? (
                <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 h-64">
                  <iframe
                    src={contact.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Location Map"
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28266.030921880483!2d85.2854008!3d27.7034568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a0b7caa7b%3A0x9a0ccb4aa8c28258!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Location Map"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-display text-xl font-bold text-army mb-4 text-center">
                पठाउनुहोस् सन्देश
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" 
                    required 
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" 
                    required 
                  />
                </div>
                <div>
                  <textarea 
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                    rows="5" 
                    placeholder="Your Message" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={sending}
                  className="w-full bg-gold text-white py-3 rounded-lg hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </button>
                {submitted && (
                  <p className="text-green-600 text-sm text-center">✅ Message sent successfully!</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Contact;