import React, { createContext, useState, useContext, useEffect } from 'react';
import { logoAPI, contactAPI, introductionAPI, settingsAPI } from '../services/api';

const SiteContext = createContext();

export const useSite = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
  const [headerLogos, setHeaderLogos] = useState({ leftLogo: { url: '' }, rightLogo: { url: '' } });
  const [footerLogo, setFooterLogo] = useState({ logo: { url: '' } });
  const [contact, setContact] = useState({ address: '', phone: '', email: '', mapEmbed: '' });
  const [introduction, setIntroduction] = useState({ title: '', content: '', image: '' });
  const [settings, setSettings] = useState({ siteName: '', siteDescription: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSiteData();
  }, []);

  const loadSiteData = async () => {
    try {
      const [logosRes, footerRes, contactRes, introRes, settingsRes] = await Promise.all([
        logoAPI.getHeaderLogos(),
        logoAPI.getFooterLogo(),
        contactAPI.getContact(),
        introductionAPI.getIntroduction(),
        settingsAPI.getSettings(),
      ]);

      setHeaderLogos(logosRes.data);
      setFooterLogo(footerRes.data);
      setContact(contactRes.data);
      setIntroduction(introRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error loading site data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSiteData = loadSiteData;

  return (
    <SiteContext.Provider value={{
      headerLogos,
      footerLogo,
      contact,
      introduction,
      settings,
      loading,
      refreshSiteData,
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export default SiteContext;