import React, { createContext, useState, useContext, useEffect } from 'react';
import chatbotData from '../data/chatbot.json';
import { noticesAPI } from '../services/api';
import { useSite } from '../context/SiteContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// ---------- Knowledge helpers (real data only, short & sweet) ----------

const HELLO_MESSAGE =
  'Hello! 👋 I\'m the Nepal Army Ex-Army Association assistant.\nAsk me about: Sewaharu, Leadership, Notices, Membership, Contact 😊\n\n🇳🇵 नमस्ते! म नेपाल भूपू सैनिक संघको सहायक हुँ।\nसेवाहरू, नेतृत्व, सूचना, सदस्यता, सम्पर्कबारे सोध्नुहोस् 😊';

// All leaders flattened for name search (supports both English & Nepali)
const buildLeaderList = () => {
  const leaders = [];
  const L = chatbotData.leadership;

  L.centralCommittee.positions.forEach((p) =>
    leaders.push({ name: p.name, nameEn: p.nameEn || p.name, nameNe: p.nameNe || p.name, role: p.title, roleEn: p.titleEn || p.title, roleNe: p.titleNe || p.title })
  );
  ['districtCommittee', 'regionalCommittee', 'unitCommittee', 'provincialCoordinators', 'centralMembers', 'advisoryCouncil'].forEach(
    (key) => {
      L[key]?.members?.forEach((m) =>
        leaders.push({ name: m.name, nameEn: m.nameEn || m.name, nameNe: m.nameNe || m.name, role: m.role === '-----' ? `${L[key].title} सदस्य` : m.role, roleEn: m.roleEn || m.role, roleNe: m.roleNe || m.role })
      );
    }
  );
  L.currentLeadership.members.forEach((m) =>
    leaders.push({ name: m.name, nameEn: m.nameEn || m.name, nameNe: m.nameNe || m.name, role: m.title, roleEn: m.titleEn || m.title, roleNe: m.titleNe || m.title })
  );
  L.centralMembersList.members.forEach((m) =>
    leaders.push({ name: m.name, nameEn: m.nameEn || m.name, nameNe: m.nameNe || m.name, role: m.province ? `केन्द्रीय सदस्य – ${m.province}` : 'केन्द्रीय सदस्य', roleEn: m.roleEn || m.role || 'Central Member', roleNe: m.roleNe || m.role || 'केन्द्रीय सदस्य' })
  );

  return leaders;
};

const leaderList = buildLeaderList();

const findLeader = (msg) => {
  const clean = msg.toLowerCase().replace(/को बारेमा|को बारे|who is|को हो|role of|about|बारे|तपाईं|सँग|गर्नुहोस्/g, '').trim();
  if (!clean || clean.length < 2) return null;

  let best = null;
  let bestScore = 0;
  for (const leader of leaderList) {
    const nameLower = leader.name.toLowerCase();
    const nameEnLower = (leader.nameEn || '').toLowerCase();
    const nameNeLower = (leader.nameNe || '').toLowerCase();
    const roleLower = (leader.role || '').toLowerCase();
    const roleEnLower = (leader.roleEn || '').toLowerCase();
    const roleNeLower = (leader.roleNe || '').toLowerCase();

    // Full name match
    if (clean.includes(nameLower) || clean.includes(nameEnLower) || clean.includes(nameNeLower)) return leader;

    // Partial token matching across all name variants
    const allNames = [nameLower, nameEnLower, nameNeLower].filter(Boolean);
    const allRoles = [roleLower, roleEnLower, roleNeLower].filter(Boolean);
    let score = 0;

    allNames.forEach((nameStr) => {
      const tokens = nameStr.split(/\s+/).filter((t) => t.length >= 3);
      tokens.forEach((t) => {
        if (clean.includes(t)) score += 2;
      });
    });

    allRoles.forEach((roleStr) => {
      const tokens = roleStr.split(/\s+/).filter((t) => t.length >= 3);
      tokens.forEach((t) => {
        if (clean.includes(t)) score++;
      });
    });

    if (score > bestScore && score >= 2) {
      bestScore = score;
      best = leader;
    }
  }
  return best;
};

// Keyword rules -> short response builders
const RULES = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'नमस्ते', 'हेलो', 'नमस्कार', 'greetings', 'नमस्कार छ', 'कस्तो छ'],
    answer: () => 'Hello! 👋 How can I help you today?\nनमस्ते! म तपाईंलाई कसरी सहयोग गर्न सक्छु?',
  },
  {
    keywords: [
      'who created', 'who made', 'who developed', 'who built', 'creator', 'developer',
      'developed by', 'made by', 'created by', 'built by', 'बनायो', 'विकासकर्ता',
      'zero infinity', 'zeroinfinity', 'abhishek', 'कसले बनायो', 'कसले बनाएको',
    ],
    answer: () =>
      '💜 Powered by Zero Infinity Technology\n👨‍💻 Developer: Abhishek Rajbanshi\n🌐 zeroinfinitytechnologies.com',
  },
  {
    keywords: ['contact', 'phone', 'email', 'call', 'number', 'सम्पर्क', 'फोन', 'इमेल', 'फोन नम्बर', 'सम्पर्क नम्बर', 'कल गर्नुस्'],
    answer: (ctx) => ({
      text: `📍 ${ctx.headquarters}\n📞 ${ctx.phone}\n📧 ${ctx.email}`,
      action: { type: 'call', phone: ctx.phone },
    }),
    isContact: true,
  },
  {
    keywords: ['where', 'location', 'address', 'office', 'located', 'ठेगाना', 'कहाँ', 'कार्यालय', 'पुल्चोक', 'pulchowk', 'pulchok', 'कहाँ छ', 'कुन ठाउँमा', 'स्थान'],
    answer: (ctx) => `📍 ${ctx.headquarters}\n🕐 ${chatbotData.websiteInfo.officeHours}`,
  },
  {
    keywords: ['notice', 'notices', 'announcement', 'सूचना', 'सुचना', 'घोषणा', 'सूचनाहरू', 'नोटिस'],
    dynamic: async () => {
      try {
        const res = await noticesAPI.getNotices();
        const items = Array.isArray(res.data) ? res.data : res.data?.notices || [];
        if (!items.length) return '📭 No notices published right now.\nअहिले कुनै सूचना प्रकाशित छैन।';
        const lines = items.slice(0, 4).map((n) => `📢 ${n.title}`);
        return `📌 Latest Notices:\n${lines.join('\n')}\n\n💡 Visit /notices for more`;
      } catch {
        return '📢 Please check the Notices page for the latest updates.\nकृपया नवीनतम अपडेटका लागि सूचना पृष्ठ हेर्नुहोस्।';
      }
    },
  },
  {
    keywords: ['sewa', 'sewaharu', 'service', 'services', 'सेवा', 'सेवाहरू', 'के के सेवा', 'सेवाको बारेमा'],
    answer: () =>
      `🛎️ Sewaharu:\n${chatbotData.services.map((s) => `• ${s.name}`).join('\n')}\n\n🇳🇵 सेवाहरू:\n${chatbotData.services.map((s) => `• ${s.description}`).join('\n')}`,
  },
  {
    keywords: ['leader', 'leadership', 'committee', 'president', 'sabhapati', 'नेतृत्व', 'सभापति', 'समिति', 'अध्यक्ष', 'केन्द्रीय समिति', 'नेता'],
    answer: () =>
      `👥 Central Committee:\n${chatbotData.leadership.centralCommittee.positions
        .map((p) => `• ${p.title}: ${p.name}`)
        .join('\n')}\n\n💡 Tip: type any name for details\nटिप: कुनै पनि नाम टाइप गर्नुहोस्`,
  },
  {
    keywords: ['about', 'association', 'organization', 'introduction', 'बारे', 'संघ', 'परिचय', 'के हो', 'संस्थाको बारेमा', 'संघको बारेमा'],
    answer: () =>
      `🏛️ ${chatbotData.websiteInfo.name}\n(${chatbotData.websiteInfo.nepaliName})\n📅 Est. ${chatbotData.websiteInfo.established} · Registered ${chatbotData.websiteInfo.registered}\nWelfare & unity of retired army personnel.\n\n🇳🇵 अवकाशप्राप्त सैनिकहरूको कल्याण र एकता।`,
  },
  {
    keywords: ['mission', 'vision', 'goal', 'objective', 'उद्देश्य', 'लक्ष्य', 'दृष्टिकोण', 'मिसन', 'भिजन'],
    answer: () =>
      `🎯 Mission: ${chatbotData.missionVision.mission}\n👁️ Vision: ${chatbotData.missionVision.vision}`,
  },
  {
    keywords: ['membership', 'member', 'join', 'register', 'सदस्य', 'सदस्यता', 'सदस्य बन्न', 'सदस्यता लिन'],
    answer: () =>
      '📋 Membership:\n1️⃣ General – Rs. 1,000 (5 yrs)\n2️⃣ Lifetime – Central Committee approval\n3️⃣ Honorary – Special contribution\n✅ Retired Nepali Army personnel\n\n🇳🇵 सदस्यता:\n१. साधारण – रु. १,००० (५ वर्ष)\n२. आजीवन – केन्द्रीय समिति अनुमोदन\n३. मानद – विशेष योगदान',
  },
  {
    keywords: ['fee', 'cost', 'price', 'charge', 'शुल्क', 'खर्च', 'कति', 'कति पैसा', 'शुल्क कति'],
    answer: () => '💰 General membership: Rs. 1,000 (5 years)\n🔄 Renewal: Rs. 1,000\n\n🇳🇵 साधारण सदस्यता: रु. १,००० (५ वर्ष)\n🔄 नवीकरण: रु. १,०००',
  },
  {
    keywords: ['training', 'talim', 'course', 'skill', 'तालिम', 'प्रशिक्षण', 'सीप', 'तालिमको', 'सीप विकास'],
    answer: () =>
      `🎓 Trainings:\n${chatbotData.trainingPrograms.map((t) => `• ${t.name} (${t.duration})`).join('\n')}`,
  },
  {
    keywords: ['event', 'program', 'ceremony', 'कार्यक्रम', 'समारोह', 'कार्यक्रमहरू', 'आयोजना'],
    answer: () =>
      '📅 Events:\n• Annual General Meeting\n• Veterans Day Celebration\n• Health Camps\n• Scholarship Programs\n\n🇳🇵 कार्यक्रमहरू:\n• वार्षिक साधारण सभा\n• वयतान दिवस मनाउने\n• स्वास्थ्य शिविर\n• छात्रवृत्ति कार्यक्रम',
  },
  {
    keywords: ['history', 'foundation', 'established', 'इतिहास', 'स्थापना', 'कब स्थापना', 'कसरी सुरु भयो'],
    answer: () =>
      `📜 Established ${chatbotData.history.founded} as a social organization, formally registered ${chatbotData.history.registered}.\n\n🇳🇵 सामाजिक संस्थाको रूपमा स्थापना, औपचारिक रूपमा दर्ता।`,
  },
  {
    keywords: ['statistic', 'statistics', 'total', 'numbers', 'तथ्यांक', 'संख्या', 'कति सदस्य', 'कति जिल्ला'],
    answer: () =>
      `📊 Ex-Army: ${chatbotData.statistics.totalExArmy}\n👨‍👩‍👧 Dependents: ${chatbotData.statistics.totalDependents}\n🗺️ Districts: ${chatbotData.statistics.districtsCovered} · Committees: ${chatbotData.statistics.districtCommittees}\n\n🇳🇵 भूपू सैनिक: ${chatbotData.statistics.totalExArmy}\nआश्रित: ${chatbotData.statistics.totalDependents}\nजिल्ला: ${chatbotData.statistics.districtsCovered}`,
  },
  {
    keywords: ['footer', 'website detail', 'site detail', 'फुटर', 'वेबसाइट'],
    answer: (ctx) =>
      `🔗 Footer:\n• Nepal Army – Ex-Army Association\n• 📞 ${ctx.phone}\n• 📧 ${ctx.email}\n• Socials: Facebook, Twitter, Instagram, LinkedIn`,
  },
  {
    keywords: ['help', 'what can you do', 'सहयोग', 'मद्दत', 'के गर्न सक्छ', 'विकल्प'],
    answer: () =>
      'I can answer about: About 🏛️, Sewaharu 🛎️, Leadership 👥, Notices 📢, Membership 📋, Training 🎓, Contact 📞\n\n🇳🇵 म यी विषयमा उत्तर दिन सक्छु: परिचय, सेवाहरू, नेतृत्व, सूचना, सदस्यता, तालिम, सम्पर्क 😊',
  },
];

const DEFAULT_RESPONSE =
  '😊 I can help with: About, Sewaharu, Leadership, Notices, Membership, Contact.\nType "help" to see all topics.\n\n🇳🇵 म परिचय, सेवाहरू, नेतृत्व, सूचना, सदस्यता, सम्पर्कबारे सहयोग गर्न सक्छु।\nसबै विषय हेर्न "help" टाइप गर्नुहोस्।';

export const ChatProvider = ({ children }) => {
  const { contact } = useSite();

  const phone = contact?.phone || '9824380896';
  const email = contact?.email || 'nepalisena@gmail.com';
  const headquarters = chatbotData.websiteInfo.headquarters;

  const responseCtx = { phone, email, headquarters };

  // All chats cleared at start - nothing restored from localStorage
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Wipe any old persisted chats once at startup
  useEffect(() => {
    try {
      localStorage.removeItem('chatMessages');
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Greet exactly ONE time - the very first time the chat opens
  const greetOnce = () => {
    setHasGreeted((greeted) => {
      if (greeted) return greeted;
      setMessages([
        {
          id: Date.now(),
          text: HELLO_MESSAGE,
          sender: 'bot',
          timestamp: new Date().toLocaleString(),
        },
      ]);
      return true;
    });
  };

  // Find best rule match
  const findRule = (msg) => {
    const lowerMsg = msg.toLowerCase();
    let best = null;
    let maxScore = 0;
    for (const rule of RULES) {
      let score = 0;
      for (const kw of rule.keywords) {
        if (lowerMsg.includes(kw)) score += kw.includes(' ') ? 2 : 1;
      }
      if (score > maxScore) {
        maxScore = score;
        best = rule;
      }
    }
    return maxScore > 0 ? best : null;
  };

  const buildResponse = async (text) => {
    // 1) Leader name search has top priority
    const leader = findLeader(text);
    if (leader) {
      return { text: `👤 ${leader.name}\n📌 Role: ${leader.role}` };
    }

    // 2) Keyword rules
    const rule = findRule(text);
    if (rule) {
      if (rule.dynamic) {
        const result = await rule.dynamic(responseCtx);
        return typeof result === 'string' ? { text: result } : result;
      }
      const result = rule.answer(responseCtx);
      return typeof result === 'string' ? { text: result } : result;
    }

    // 3) Data-only fallback
    return { text: DEFAULT_RESPONSE };
  };

  // Send a message
  const sendMessage = (text) => {
    if (!text || !text.trim()) return;
    const trimmedText = text.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmedText,
        sender: 'user',
        timestamp: new Date().toLocaleString(),
      },
    ]);

    setIsTyping(true);
    const delay = 400 + Math.random() * 500;
    setTimeout(async () => {
      const response = await buildResponse(trimmedText);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: response.text,
          action: response.action,
          sender: 'bot',
          timestamp: new Date().toLocaleString(),
        },
      ]);
      setIsTyping(false);
    }, delay);
  };

  // Clear everything - empty chat
  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem('chatMessages');
    } catch (e) {
      /* ignore */
    }
  };

  const toggleChat = () => {
    setIsOpen((open) => {
      const next = !open;
      if (next) greetOnce();
      return next;
    });
  };

  const openChat = () => {
    setIsOpen(true);
    greetOnce();
  };

  const closeChat = () => setIsOpen(false);

  const value = {
    messages,
    isOpen,
    isTyping,
    sendMessage,
    clearChat,
    toggleChat,
    openChat,
    closeChat,
    setIsOpen,
    setIsTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
