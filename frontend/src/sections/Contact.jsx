import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { contactAPI } from '../services/api';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';

export function Contact() {
  const [contact, setContact] = useState({ address: '', phone: '', email: '', mapEmbed: '' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Get in Touch</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Contact Us
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              We'd love to hear from you. Reach out to us for any inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-army">Address</h3>
                    <p className="text-gray-600 text-sm mt-1">{contact.address || 'Kathmandu, Nepal'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <Phone className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-army">Phone</h3>
                    <p className="text-gray-600 text-sm mt-1">{contact.phone || '+977-1-1234567'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-army">Email</h3>
                    <p className="text-gray-600 text-sm mt-1">{contact.email || 'info@nepalarmy.org'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-gold/10 p-3 rounded-lg">
                    <Clock className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-army">Office Hours</h3>
                    <p className="text-gray-600 text-sm mt-1">Mon-Fri: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-army text-lg mb-4">Send a Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gold text-white py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                  {submitted && (
                    <p className="text-green-600 text-sm text-center">Message sent successfully!</p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {contact.mapEmbed && (
            <div className="mt-8 rounded-xl overflow-hidden shadow-md">
              <iframe
                src={contact.mapEmbed}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Location Map"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Contact;