const CentralCommittee = require('../models/CentralCommittee');
const cloudinary = require('../config/cloudinary');
const { logActivity } = require('../middleware/logger');

const PROVINCES = [
  { number: 1, nameEn: 'Koshi Province', nameNe: 'कोशी प्रदेश' },
  { number: 2, nameEn: 'Madhesh Province', nameNe: 'मधेश प्रदेश' },
  { number: 3, nameEn: 'Bagmati Province', nameNe: 'बागमती प्रदेश' },
  { number: 4, nameEn: 'Gandaki Province', nameNe: 'गण्डकी प्रदेश' },
  { number: 5, nameEn: 'Lumbini Province', nameNe: 'लुम्बिनी प्रदेश' },
  { number: 6, nameEn: 'Karnali Province', nameNe: 'कर्णाली प्रदेश' },
  { number: 7, nameEn: 'Sudurpashchim Province', nameNe: 'सुदूरपश्चिम प्रदेश' },
];

const getData = async () => {
  let data = await CentralCommittee.findOne();
  if (!data) {
    data = await CentralCommittee.create({ members: [] });
  }
  return data;
};

// GET all members (with optional filters)
const getMembers = async (req, res) => {
  try {
    const { section, province, district, search } = req.query;
    let data = await getData();
    let members = data.members || [];

    if (section) {
      members = members.filter(m => m.section === section);
    }
    if (province) {
      members = members.filter(m => m.province === province);
    }
    if (district) {
      members = members.filter(m => m.district === district);
    }
    if (search) {
      const s = search.toLowerCase();
      members = members.filter(m =>
        (m.name || '').toLowerCase().includes(s) ||
        (m.nameEn || '').toLowerCase().includes(s) ||
        (m.nameNe || '').toLowerCase().includes(s) ||
        (m.role || '').toLowerCase().includes(s) ||
        (m.roleEn || '').toLowerCase().includes(s) ||
        (m.roleNe || '').toLowerCase().includes(s) ||
        (m.province || '').toLowerCase().includes(s) ||
        (m.provinceEn || '').toLowerCase().includes(s) ||
        (m.district || '').toLowerCase().includes(s) ||
        (m.districtEn || '').toLowerCase().includes(s)
      );
    }

    res.json({ members, total: data.members?.length || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all (raw document)
const getAll = async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET provinces list
const getProvinces = async (req, res) => {
  res.json(PROVINCES);
};

// GET districts for a province (77 total districts of Nepal)
const getDistricts = async (req, res) => {
  const { provinceNumber } = req.params;
  const districtMap = {
    // Koshi Province (14 districts)
    1: [
      { nameEn: 'Taplejung', nameNe: 'ताप्लेजुङ' },
      { nameEn: 'Panchthar', nameNe: 'पाँचथर' },
      { nameEn: 'Ilam', nameNe: 'इलाम' },
      { nameEn: 'Jhapa', nameNe: 'झापा' },
      { nameEn: 'Morang', nameNe: 'मोरङ' },
      { nameEn: 'Sunsari', nameNe: 'सुनसरी' },
      { nameEn: 'Dhankuta', nameNe: 'धनकुटा' },
      { nameEn: 'Terhathum', nameNe: 'तेह्रथुम' },
      { nameEn: 'Sankhuwasabha', nameNe: 'संखुवासभा' },
      { nameEn: 'Bhojpur', nameNe: 'भोजपुर' },
      { nameEn: 'Okhaldhunga', nameNe: 'ओखलढुङ्गा' },
      { nameEn: 'Solukhumbu', nameNe: 'सोलुखुम्बु' },
      { nameEn: 'Khotang', nameNe: 'खोटाङ' },
      { nameEn: 'Udayapur', nameNe: 'उदयपुर' },
    ],
    // Madhesh Province (8 districts)
    2: [
      { nameEn: 'Saptari', nameNe: 'सप्तरी' },
      { nameEn: 'Siraha', nameNe: 'सिरहा' },
      { nameEn: 'Dhanusha', nameNe: 'धनुषा' },
      { nameEn: 'Mahottari', nameNe: 'महोत्तरी' },
      { nameEn: 'Sarlahi', nameNe: 'सर्लाही' },
      { nameEn: 'Rautahat', nameNe: 'राउटहट' },
      { nameEn: 'Bara', nameNe: 'बारा' },
      { nameEn: 'Parsa', nameNe: 'पर्सा' },
    ],
    // Bagmati Province (13 districts)
    3: [
      { nameEn: 'Dolakha', nameNe: 'दोलखा' },
      { nameEn: 'Ramechhap', nameNe: 'रामेछाप' },
      { nameEn: 'Sindhuli', nameNe: 'सिन्धुली' },
      { nameEn: 'Kavrepalanchok', nameNe: 'काभ्रेपलाञ्चोक' },
      { nameEn: 'Bhaktapur', nameNe: 'भक्तपुर' },
      { nameEn: 'Kathmandu', nameNe: 'काठमाडौँ' },
      { nameEn: 'Lalitpur', nameNe: 'ललितपुर' },
      { nameEn: 'Nuwakot', nameNe: 'नुवाकोट' },
      { nameEn: 'Rasuwa', nameNe: 'रसुवा' },
      { nameEn: 'Dhading', nameNe: 'धादिङ' },
      { nameEn: 'Makwanpur', nameNe: 'मकवानपुर' },
      { nameEn: 'Chitwan', nameNe: 'चितवन' },
      { nameEn: 'Gorkha', nameNe: 'गोरखा' },
    ],
    // Gandaki Province (11 districts)
    4: [
      { nameEn: 'Manang', nameNe: 'मनाङ' },
      { nameEn: 'Mustang', nameNe: 'मुस्ताङ' },
      { nameEn: 'Myagdi', nameNe: 'म्याग्दी' },
      { nameEn: 'Kaski', nameNe: 'कास्की' },
      { nameEn: 'Lamjung', nameNe: 'लमजुङ' },
      { nameEn: 'Tanahu', nameNe: 'तनहुँ' },
      { nameEn: 'Nawalparasi East', nameNe: 'नवलपरासी पूर्व' },
      { nameEn: 'Syangja', nameNe: 'स्याङजा' },
      { nameEn: 'Palpa', nameNe: 'पाल्पा' },
      { nameEn: 'Gulmi', nameNe: 'गुल्मी' },
      { nameEn: 'Baglung', nameNe: 'बागलुङ' },
    ],
    // Lumbini Province (12 districts)
    5: [
      { nameEn: 'Rupandehi', nameNe: 'रुपन्देही' },
      { nameEn: 'Kapilvastu', nameNe: 'कपिलवस्तु' },
      { nameEn: 'Nawalparasi West', nameNe: 'नवलपरासी पश्चिम' },
      { nameEn: 'Rukum East', nameNe: 'रुकुम पूर्व' },
      { nameEn: 'Rolpa', nameNe: 'रोल्पा' },
      { nameEn: 'Pyuthan', nameNe: 'प्युठान' },
      { nameEn: 'Syanggdia', nameNe: 'स्याङग्दिया' },
      { nameEn: 'Dang', nameNe: 'दाङ' },
      { nameEn: 'Banke', nameNe: 'बाँके' },
      { nameEn: 'Bardiya', nameNe: 'बर्दिया' },
      { nameEn: 'Surkhet', nameNe: 'सुर्खेत' },
      { nameEn: 'Dailekh', nameNe: 'दैलेख' },
    ],
    // Karnali Province (10 districts)
    6: [
      { nameEn: 'Humla', nameNe: 'हुम्ला' },
      { nameEn: 'Mugu', nameNe: 'मुगु' },
      { nameEn: 'Dolpa', nameNe: 'डोल्पा' },
      { nameEn: 'Jumla', nameNe: 'जुम्ला' },
      { nameEn: 'Kalikot', nameNe: 'कलिकोट' },
      { nameEn: 'Jajarkot', nameNe: 'जाजरकोट' },
      { nameEn: 'Rukum West', nameNe: 'रुकुम पश्चिम' },
      { nameEn: 'Salyan', nameNe: 'सल्यान' },
      { nameEn: 'Chhanna', nameNe: 'छान्ना' },
      { nameEn: 'Tribeni', nameNe: 'त्रिवेणी' },
    ],
    // Sudurpashchim Province (9 districts)
    7: [
      { nameEn: 'Bajhang', nameNe: 'बझाङ' },
      { nameEn: 'Bajura', nameNe: 'बाजुरा' },
      { nameEn: 'Achham', nameNe: 'अच्छाम' },
      { nameEn: 'Doti', nameNe: 'डोटी' },
      { nameEn: 'Darchula', nameNe: 'दार्चुला' },
      { nameEn: 'Baitadi', nameNe: 'बैतडी' },
      { nameEn: 'Dadeldhura', nameNe: 'डडेलधुरा' },
      { nameEn: 'Kailali', nameNe: 'कैलाली' },
      { nameEn: 'Kanchanpur', nameNe: 'कञ्चनपुर' },
    ],
  };
  const num = parseInt(provinceNumber);
  const districts = districtMap[num] || [];
  res.json(districts);
};

// ADD member
const addMember = async (req, res) => {
  try {
    const data = await getData();
    const { name, nameEn, nameNe, role, roleEn, roleNe, bio, bioEn, bioNe, section, province, provinceEn, provinceNe, provinceNumber, district, districtEn, districtNe, electionDate } = req.body;

    if (!name && !nameEn && !nameNe) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Election rule: 5 years is the default term, admin may set up to 6 years.
    // A term longer than 6 years is not allowed.
    const termYears = Math.min(Math.max(parseInt(req.body.termYears) || 5, 1), 6);

    const newMember = {
      name: name || nameEn || nameNe || '',
      nameEn: nameEn || nameNe || name || '',
      nameNe: nameNe || nameEn || name || '',
      role: role || roleEn || roleNe || '',
      roleEn: roleEn || roleNe || role || '',
      roleNe: roleNe || roleEn || role || '',
      bio: bio || bioEn || bioNe || '',
      bioEn: bioEn || bioNe || bio || '',
      bioNe: bioNe || bioEn || bio || '',
      image: req.file ? (req.file.path || req.file.secure_url || '') : '',
      publicId: req.file ? (req.file.filename || req.file.public_id || '') : '',
      section: section || 'centralMembers',
      province: province || '',
      provinceEn: provinceEn || province || '',
      provinceNe: provinceNe || province || '',
      provinceNumber: parseInt(provinceNumber) || 0,
      district: district || '',
      districtEn: districtEn || district || '',
      districtNe: districtNe || district || '',
      electionDate: electionDate || null,
      termYears,
      active: req.body.active === 'false' || req.body.active === false ? false : true,
      order: (data.members || []).length,
    };

    data.members.push(newMember);
    await data.save();
    await logActivity({ req, action: 'CREATE', module: 'CENTRAL_COMMITTEE', details: { name: newMember.name } });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE member
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getData();
    const member = data.members.id(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const fields = ['name', 'nameEn', 'nameNe', 'role', 'roleEn', 'roleNe', 'bio', 'bioEn', 'bioNe', 'section', 'province', 'provinceEn', 'provinceNe', 'provinceNumber', 'district', 'districtEn', 'districtNe', 'electionDate', 'order'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        member[f] = req.body[f];
      }
    });

    if (req.body.extended !== undefined) {
      member.extended = req.body.extended === 'true' || req.body.extended === true;
    }
    if (req.body.active !== undefined) {
      const willBeActive = req.body.active === 'true' || req.body.active === true;
      member.active = willBeActive;
      if (willBeActive) {
        member.inactiveReason = '';
        member.inactiveDate = null;
      } else {
        if (req.body.inactiveReason !== undefined) {
          member.inactiveReason = req.body.inactiveReason;
        }
        member.inactiveDate = new Date();
      }
    }
    if (req.body.electionDate !== undefined) {
      member.electionDate = req.body.electionDate ? new Date(req.body.electionDate) : null;
    }
    if (req.body.termYears !== undefined) {
      const parsed = parseInt(req.body.termYears);
      if (!isNaN(parsed)) {
        member.termYears = Math.min(Math.max(parsed, 1), 6);
      }
    }

    if (req.file) {
      if (member.publicId) {
        try { await cloudinary.uploader.destroy(member.publicId); } catch (e) {}
      }
      member.image = req.file.path || req.file.secure_url || '';
      member.publicId = req.file.filename || req.file.public_id || '';
    }

    await data.save();
    await logActivity({ req, action: 'UPDATE', module: 'CENTRAL_COMMITTEE', details: { name: member.name } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE member
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getData();
    const member = data.members.id(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (member.publicId) {
      try { await cloudinary.uploader.destroy(member.publicId); } catch (e) {}
    }

    data.members.pull(id);
    await data.save();
    await logActivity({ req, action: 'DELETE', module: 'CENTRAL_COMMITTEE', details: { name: member.name } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EXTEND member term (+1 year only, once, and only after 4 years have passed)
const extendTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getData();
    const member = data.members.id(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (member.extended) {
      return res.status(400).json({ message: 'Term can only be extended once by one year' });
    }
    if (!member.electionDate) {
      return res.status(400).json({ message: 'Election date is required before extending the term' });
    }
    const yearsPassed = (new Date() - new Date(member.electionDate)) / (1000 * 60 * 60 * 24 * 365);
    if (yearsPassed < 4 || yearsPassed >= 5) {
      return res.status(400).json({ message: 'Term can only be extended by one year after 4 years have been completed' });
    }

    member.extended = true;
    await data.save();
    await logActivity({ req, action: 'EXTEND', module: 'CENTRAL_COMMITTEE', details: { name: member.name } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE term extension (revert the +1 year)
const removeExtension = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getData();
    const member = data.members.id(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (!member.extended) {
      return res.status(400).json({ message: 'This member has no active extension to remove' });
    }

    member.extended = false;
    await data.save();
    await logActivity({ req, action: 'REVERT_EXTENSION', module: 'CENTRAL_COMMITTEE', details: { name: member.name } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BULK update section order
const updateOrder = async (req, res) => {
  try {
    const { members: orderedMembers } = req.body;
    const data = await getData();
    
    if (!Array.isArray(orderedMembers)) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    orderedMembers.forEach(update => {
      const member = data.members.id(update.id);
      if (member) {
        member.order = update.order;
      }
    });

    await data.save();
    await logActivity({ req, action: 'REORDER', module: 'CENTRAL_COMMITTEE', details: { count: orderedMembers.length } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMembers, getAll, getProvinces, getDistricts,
  addMember, updateMember, deleteMember, extendTerm, removeExtension, updateOrder,
};
