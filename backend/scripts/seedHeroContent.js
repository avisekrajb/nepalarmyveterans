/* Seed the default hero homepage content so that all text on the homepage
   is editable by the admin from /admin/hero in both languages. */

require('dotenv').config();
const mongoose = require('mongoose');
const Hero = require('../src/models/Hero');

const LAN = (en, ne) => ({ en, ne });

const defaultContent = {
  heroTitle: LAN(
    'From Serving the Nation\nto Serving the Society',
    'राष्ट्र सेवाबाट\nसमाज सेवातर्फ'
  ),
  heroSubtitle: LAN(
    'A continuing commitment to the unity, honor, service, and nation-building of Nepal\u2019s ex-army personnel.',
    'नेपालका भूपू सैनिकहरूको एकता, सम्मान, सेवा र राष्ट्र निर्माणप्रतिको निरन्तर प्रतिबद्धता।'
  ),
  aboutLabel: LAN('About the Association', 'संघको बारेमा'),
  aboutHeading: LAN('A Common Platform for Ex-Soldiers', 'भूपू सैनिकहरूको साझा मञ्च'),
  aboutSubHeading: LAN('Continuity of Honor and Service', 'सम्मान र सेवाको निरन्तरता'),
  aboutParagraphs: [
    LAN(
      'The Nepal Ex-Army Association is a voluntary social organization of retired Nepali soldiers. Continuing its responsibility toward the nation and society even after long military service, the association has built a united ex-soldier family.',
      'नेपाल भूपू सैनिक संघ अवकाशप्राप्त नेपाली सैनिकहरूको एक स्वयंसेवी सामाजिक संस्था हो। लामो सैन्य सेवापछि पनि राष्ट्र र समाजप्रतिको जिम्मेवारीलाई निरन्तरता दिँदै यो संस्थाले एकजुट भूपू सैनिक परिवारको निर्माण गरेको छ।'
    ),
    LAN(
      'The association remains active in welfare, health support, skill development, disaster response, blood donation drives, and community development. Making the lives of retired soldiers and their families dignified and strengthening the nation\u2019s social fabric are our priorities.',
      'कल्याण, स्वास्थ्य सहयोग, सीप विकास, विपद् प्रतिकार्य, रक्तदान अभियान र सामुदायिक विकासजस्ता क्षेत्रमा संस्था सक्रिय रहँदै आएको छ। अवकाशप्राप्त सैनिक तथा उनका परिवारको जीवनयापन मर्यादित बनाउनु र देशको सामाजिक ताँदो थप बलियो बनाउनु हाम्रो प्राथमिकता हो।'
    ),
  ],
  pillars: [
    { title: LAN('Mission', 'मिसन'), text: LAN('Contributing to nation-building through the unity, welfare, and social service of ex-soldiers.', 'भूपू सैनिकहरूको एकता, कल्याण र समाज सेवामार्फत राष्ट्र निर्माणमा योगदान।') },
    { title: LAN('Vision', 'भिजन'), text: LAN('A dignified, self-reliant, and socially responsible ex-soldier community.', 'मर्यादित, आत्मनिर्भर र सामाजिक जिम्मेवारीयुक्त भूपू सैनिक समुदाय।') },
    { title: LAN('Objectives', 'उद्देश्यहरू'), text: LAN('Welfare, skill development, health services, disaster management, and community programs.', 'कल्याण, सीप विकास, स्वास्थ्य सेवा, विपद् व्यवस्थापन र सामुदायिक कार्यक्रम।') },
    { title: LAN('Core Values', 'मूल मान्यता'), text: LAN('Discipline, honesty, patriotism, service, and mutual respect.', 'अनुशासन, इमानदारी, देशभक्ति, सेवा र आपसी सम्मान।') },
  ],
  services: [
    { title: LAN('Community Welfare', 'सामुदायिक कल्याण'), desc: LAN('Ongoing programs for the welfare of the local community.', 'स्थानीय समुदायको कल्याणका लागि निरन्तर कार्यक्रम।') },
    { title: LAN('Veteran Support', 'भूपू सैनिक सहयोग'), desc: LAN('Direct support to ex-soldiers and dependent families.', 'भूपू सैनिक र आश्रित परिवारलाई प्रत्यक्ष सहयोग।') },
    { title: LAN('Medical Assistance', 'स्वास्थ्य सहायता'), desc: LAN('Health camps and financial aid for medical treatment.', 'स्वास्थ्य शिविर र औषधोपचारमा आर्थिक सहायता।') },
    { title: LAN('Training Programs', 'तालिम कार्यक्रम'), desc: LAN('Skill development and rehabilitation training.', 'सीप विकास र पुनःस्थापना तालिम।') },
    { title: LAN('Emergency Response', 'आपत्कालीन प्रतिकार्य'), desc: LAN('Rapid response teams during emergencies.', 'विपद्को समयमा द्रुत प्रतिकार्य समूह।') },
    { title: LAN('Blood Donation', 'रक्तदान'), desc: LAN('Regular blood donation drive.', 'नियमित रक्तदान अभियानको संचालन।') },
    { title: LAN('Disaster Relief', 'विपद् राहत'), desc: LAN('Distribution of relief supplies to disaster victims.', 'प्रकोप प्रभावितलाई राहत सामग्री वितरण।') },
    { title: LAN('Family Support', 'परिवार सहयोग'), desc: LAN('Support to families of martyrs and retired soldiers.', 'सहिद तथा अवकाशप्राप्त सैनिक परिवारलाई सहयोग।') },
  ],
  journeyLabel: LAN('Our Journey', 'हाम्रो यात्रा'),
  timeline: [
    { year: LAN('Foundation', 'स्थापना'), title: LAN('Formation of the Association', 'संघको स्थापना'), desc: LAN('The vision of a common platform for retired soldiers was conceived right from its founding.', 'स्थापनाकालमै अवकाशप्राप्त सैनिकहरूको साझा मञ्चको परिकल्पना गरियो।') },
    { year: LAN('Early Years', 'प्रारम्भिक वर्ष'), title: LAN('Chapter Expansion', 'शाखा विस्तार'), desc: LAN('Expansion of chapters and start of member registration across the country\u2019s districts.', 'देशभरका जिल्लामा शाखा विस्तार र सदस्य दर्ताको सुरुवात।') },
    { year: LAN('Growth', 'विकास'), title: LAN('Welfare Programs', 'कल्याण कार्यक्रम'), desc: LAN('Launch of health camps, relief distribution, and family support programs.', 'स्वास्थ्य शिविर, राहत वितरण र परिवार सहयोग कार्यक्रमको थालनी।') },
    { year: LAN('Today', 'आज'), title: LAN('Nationwide Presence', 'राष्ट्रव्यापी उपस्थिति'), desc: LAN('Representation in all 77 districts and continuous community service.', '७७ वटै जिल्लामा प्रतिनिधित्व र निरन्तर सामुदायिक सेवा।') },
  ],
};

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }
    await mongoose.connect(process.env.MONGODB_URI);

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({
        content: defaultContent,
        carouselImages: [],
        seniors: [],
      });
      console.log('Created new Hero document with default content.');
    } else {
      hero.content = hero.content || {};
      hero.content = {
        ...defaultContent,
        ...hero.content,
        heroTitle: hero.content.heroTitle || defaultContent.heroTitle,
        heroSubtitle: hero.content.heroSubtitle || defaultContent.heroSubtitle,
        aboutLabel: hero.content.aboutLabel || defaultContent.aboutLabel,
        aboutHeading: hero.content.aboutHeading || defaultContent.aboutHeading,
        aboutSubHeading: hero.content.aboutSubHeading || defaultContent.aboutSubHeading,
        aboutParagraphs: hero.content.aboutParagraphs?.length ? hero.content.aboutParagraphs : defaultContent.aboutParagraphs,
        pillars: hero.content.pillars?.length ? hero.content.pillars : defaultContent.pillars,
        services: hero.content.services?.length ? hero.content.services : defaultContent.services,
        journeyLabel: hero.content.journeyLabel || defaultContent.journeyLabel,
        timeline: hero.content.timeline?.length ? hero.content.timeline : defaultContent.timeline,
      };
      await hero.save();
      console.log('Updated existing Hero document with default content.');
    }

    console.log('Hero content seeded successfully.');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
