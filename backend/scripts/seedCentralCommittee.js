const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/nepal-army';

const memberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  nameEn: { type: String, default: '' },
  nameNe: { type: String, default: '' },
  role: { type: String, default: '' },
  roleEn: { type: String, default: '' },
  roleNe: { type: String, default: '' },
  bio: { type: String, default: '' },
  bioEn: { type: String, default: '' },
  bioNe: { type: String, default: '' },
  image: { type: String, default: '' },
  publicId: { type: String, default: '' },
  section: {
    type: String,
    enum: ['supervisors', 'advisors', 'centralCommittee', 'centralMembers', 'provinceCoordinators', 'districtCommittee'],
    required: true,
  },
  province: { type: String, default: '' },
  provinceEn: { type: String, default: '' },
  provinceNe: { type: String, default: '' },
  provinceNumber: { type: Number, default: 0 },
  district: { type: String, default: '' },
  districtEn: { type: String, default: '' },
  districtNe: { type: String, default: '' },
  electionDate: { type: Date, default: null },
  termYears: { type: Number, default: 5 },
  extended: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const centralCommitteeSchema = new mongoose.Schema({
  members: [memberSchema],
}, { timestamps: true });

const CentralCommittee = mongoose.model('CentralCommittee', centralCommitteeSchema);

const seedData = [
  { section: 'supervisors', name: 'रथी श्री सम्शेर ज.ब.र. (अ.प्र.)', nameEn: 'Rathi Shri Samsher J.B.R. (Retd.)', nameNe: 'रथी श्री सम्शेर ज.ब.र. (अ.प्र.)', role: 'सङ्रक्षक', roleEn: 'Supervisor', roleNe: 'सङ्रक्षक' },
  { section: 'supervisors', name: 'महारथी श्री प्यार जंग थापा (अ.प्र.)', nameEn: 'Maharathi Shri Pyar Jung Thapa (Retd.)', nameNe: 'महारथी श्री प्यार जंग थापा (अ.प्र.)', role: 'सङ्रक्षक', roleEn: 'Supervisor', roleNe: 'सङ्रक्षक' },
  { section: 'advisors', name: 'रथी श्री सुशील राज कार्की', nameEn: 'Rathi Shri Sushil Raj Karki', nameNe: 'रथी श्री सुशील राज कार्की', role: 'सल्लाहकार', roleEn: 'Advisor', roleNe: 'सल्लाहकार' },
  { section: 'advisors', name: 'रथी श्री बालानन्द शर्मा', nameEn: 'Rathi Shri Bala Nand Sharma', nameNe: 'रथी श्री बालानन्द शर्मा', role: 'सल्लाहकार', roleEn: 'Advisor', roleNe: 'सल्लाहकार' },
  { section: 'advisors', name: 'रथी श्री नेपाल भूषण चन्द', nameEn: 'Rathi Shri Nepal Bhushan Chand', nameNe: 'रथी श्री नेपाल भूषण चन्द', role: 'सल्लाहकार', roleEn: 'Advisor', roleNe: 'सल्लाहकार' },
  { section: 'advisors', name: 'मा.रथी श्री यादव बहादुर रायमाझी', nameEn: 'Ma. Rathi Shri Yadav Bahadur Rayamajhi', nameNe: 'मा.रथी श्री यादव बहादुर रायमाझी', role: 'सल्लाहकार', roleEn: 'Advisor', roleNe: 'सल्लाहकार' },
  { section: 'advisors', name: 'प्र.उ.र.श्री निरेन्द्र प्रसाद अर्याल', nameEn: 'Pr.U.R. Shri Nirendra Prasad Aryal', nameNe: 'प्र.उ.र.श्री निरेन्द्र प्रसाद अर्याल', role: 'सल्लाहकार', roleEn: 'Advisor', roleNe: 'सल्लाहकार' },
  { section: 'advisors', name: 'अधिवक्ता गणेश विक्रम थापा', nameEn: 'Advocate Ganesh Vikram Thapa', nameNe: 'अधिवक्ता गणेश विक्रम थापा', role: 'सल्लाहकार', roleEn: 'Advisor', roleNe: 'सल्लाहकार' },
  { section: 'advisors', name: 'आर.ए पदम प्रसाद अधिकारी', nameEn: 'R.A. Padam Prasad Adhikari', nameNe: 'आर.ए पदम प्रसाद अधिकारी', role: 'सल्लाहकार', roleEn: 'Advisor', roleNe: 'सल्लाहकार' },
  { section: 'centralCommittee', name: 'स.रा.डा. केशर बहादुर भण्डारी', nameEn: 'S.Ra.Da. Keshar Bahadur Bhandari', nameNe: 'स.रा.डा. केशर बहादुर भण्डारी', role: 'केन्द्रीय सभापति', roleEn: 'Central President', roleNe: 'केन्द्रीय सभापति' },
  { section: 'centralCommittee', name: 'मा.प्र.उ.रा. उधव विष्ट', nameEn: 'Ma.Pr.U.Ra. Udhav Bist', nameNe: 'मा.प्र.उ.रा. उधव विष्ट', role: 'वरिष्ठ उपसभापति', roleEn: 'Senior Vice President', roleNe: 'वरिष्ठ उपसभापति' },
  { section: 'centralCommittee', name: 'प्र.स.श्याम सुन्दर घिमिरे', nameEn: 'Pr.S. Shyam Sundar Ghimire', nameNe: 'प्र.स.श्याम सुन्दर घिमिरे', role: 'उपसभापति', roleEn: 'Vice President', roleNe: 'उपसभापति' },
  { section: 'centralCommittee', name: 'स.रा.लुव कुमार रायमाझी', nameEn: 'S.Ra. Luw Kumar Rayamajhi', nameNe: 'स.रा.लुव कुमार रायमाझी', role: 'महासचिव', roleEn: 'General Secretary', roleNe: 'महासचिव' },
  { section: 'centralCommittee', name: 'दुई सदस्य', nameEn: 'Two Members', nameNe: 'दुई सदस्य', role: 'सचिव', roleEn: 'Secretary', roleNe: 'सचिव' },
  { section: 'centralCommittee', name: 'मा.उ.से.प्रेम पाण्डे', nameEn: 'Ma.U.Se. Prem Pandey', nameNe: 'मा.उ.से.प्रेम पाण्डे', role: 'कोषाध्यक्ष', roleEn: 'Treasurer', roleNe: 'कोषाध्यक्ष' },
  { section: 'centralCommittee', name: 'खाली', nameEn: 'Vacant', nameNe: 'खाली', role: 'सहकोषाध्यक्ष', roleEn: 'Co-Treasurer', roleNe: 'सहकोषाध्यक्ष' },
  { section: 'centralMembers', name: 'उ.रा. काजी बहादुर खत्री', nameEn: 'U.Ra. Kaji Bahadur Khatri', nameNe: 'उ.रा. काजी बहादुर खत्री', role: 'केन्द्रीय सदस्य', roleEn: 'Central Member', roleNe: 'केन्द्रीय सदस्य' },
  { section: 'centralMembers', name: 'मा.से. नवाजिवन महरा', nameEn: 'Ma.Se. Nawajivan Mahara', nameNe: 'मा.से. नवाजिवन महरा', role: 'केन्द्रीय सदस्य', roleEn: 'Central Member', roleNe: 'केन्द्रीय सदस्य' },
  { section: 'centralMembers', name: 'मा.उ.से. प्रेम कुमार कार्की', nameEn: 'Ma.U.Se. Prem Kumar Karki', nameNe: 'मा.उ.से. प्रेम कुमार कार्की', role: 'केन्द्रीय सदस्य', roleEn: 'Central Member', roleNe: 'केन्द्रीय सदस्य' },
  { section: 'provinceCoordinators', name: 'हुद्दा(सगत) थाम बहादुर राई (अ.प्र.)', nameEn: 'Hudda (Sagat) Tham Bahadur Rai (Retd.)', nameNe: 'हुद्दा(सगत) थाम बहादुर राई (अ.प्र.)', role: 'प्रदेश संयोजक', roleEn: 'Province Coordinator', roleNe: 'प्रदेश संयोजक', province: 'Koshi Province', provinceEn: 'Koshi Province', provinceNe: 'कोशी प्रदेश', provinceNumber: 1 },
  { section: 'provinceCoordinators', name: 'जम प्रम नारायण सिवाकोटी (अ.प्र.)', nameEn: 'Jam Pram Narayan Sivakoti (Retd.)', nameNe: 'जम प्रम नारायण सिवाकोटी (अ.प्र.)', role: 'प्रदेश संयोजक', roleEn: 'Province Coordinator', roleNe: 'प्रदेश संयोजक', province: 'Madhesh Province', provinceEn: 'Madhesh Province', provinceNe: 'मधेश प्रदेश', provinceNumber: 2 },
  { section: 'provinceCoordinators', name: 'प्र.सु.राजु सिग्देल (अ.प्र.)', nameEn: 'Pr.Su. Raju Sigdel (Retd.)', nameNe: 'प्र.सु.राजु सिग्देल (अ.प्र.)', role: 'प्रदेश संयोजक', roleEn: 'Province Coordinator', roleNe: 'प्रदेश संयोजक', province: 'Bagmati Province', provinceEn: 'Bagmati Province', provinceNe: 'बागमती प्रदेश', provinceNumber: 3 },
  { section: 'provinceCoordinators', name: 'शैतानी देवी प्रसाद भुपाल (अ.प्र.)', nameEn: 'Shaitani Devi Prasad Bhupal (Retd.)', nameNe: 'शैतानी देवी प्रसाद भुपाल (अ.प्र.)', role: 'प्रदेश संयोजक', roleEn: 'Province Coordinator', roleNe: 'प्रदेश संयोजक', province: 'Gandaki Province', provinceEn: 'Gandaki Province', provinceNe: 'गण्डकी प्रदेश', provinceNumber: 4 },
  { section: 'provinceCoordinators', name: 'खाली', nameEn: 'Vacant', nameNe: 'खाली', role: 'प्रदेश संयोजक', roleEn: 'Province Coordinator', roleNe: 'प्रदेश संयोजक', province: 'Lumbini Province', provinceEn: 'Lumbini Province', provinceNe: 'लुम्बिनी प्रदेश', provinceNumber: 5 },
  { section: 'provinceCoordinators', name: 'अम. बालकृष्ण पौडेल (अ.प्र.)', nameEn: 'Am. Balkrishna Paudel (Retd.)', nameNe: 'अम. बालकृष्ण पौडेल (अ.प्र.)', role: 'प्रदेश संयोजक', roleEn: 'Province Coordinator', roleNe: 'प्रदेश संयोजक', province: 'Karnali Province', provinceEn: 'Karnali Province', provinceNe: 'कर्णाली प्रदेश', provinceNumber: 6 },
  { section: 'provinceCoordinators', name: 'शु. केशव दत्त महत (अ.प्र.)', nameEn: 'Shu. Keshav Datt Mahat (Retd.)', nameNe: 'शु. केशव दत्त महत (अ.प्र.)', role: 'प्रदेश संयोजक', roleEn: 'Province Coordinator', roleNe: 'प्रदेश संयोजक', province: 'Sudurpashchim Province', provinceEn: 'Sudurpashchim Province', provinceNe: 'सुदूरपश्चिम प्रदेश', provinceNumber: 7 },
  { section: 'districtCommittee', name: 'सु.का. बासुदेव श्रेष्ठ (अ.प्र.)', nameEn: 'Su.Ka. Basudev Shrestha (Retd.)', nameNe: 'सु.का. बासुदेव श्रेष्ठ (अ.प्र.)', role: 'सभापति', roleEn: 'Chairperson', roleNe: 'सभापति', province: 'Koshi Province', provinceEn: 'Koshi Province', provinceNe: 'कोशी प्रदेश', provinceNumber: 1, district: 'Ilam', districtEn: 'Ilam', districtNe: 'इलाम' },
  { section: 'districtCommittee', name: 'जय कृष्ण बहादुर मोक्तान (अ.प्र.)', nameEn: 'Jay Krishna Bahadur Moktan (Retd.)', nameNe: 'जय कृष्ण बहादुर मोक्तान (अ.प्र.)', role: 'सभापति', roleEn: 'Chairperson', roleNe: 'सभापति', province: 'Koshi Province', provinceEn: 'Koshi Province', provinceNe: 'कोशी प्रदेश', provinceNumber: 1, district: 'Panchthar', districtEn: 'Panchthar', districtNe: 'पाँचथर' },
  { section: 'districtCommittee', name: 'जय घनश्याम खड्का (अ.प्र.)', nameEn: 'Jay Ghanashyam Khadka (Retd.)', nameNe: 'जय घनश्याम खड्का (अ.प्र.)', role: 'सभापति', roleEn: 'Chairperson', roleNe: 'सभापति', province: 'Koshi Province', provinceEn: 'Koshi Province', provinceNe: 'कोशी प्रदेश', provinceNumber: 1, district: 'Taplejung', districtEn: 'Taplejung', districtNe: 'ताप्लेजुङ' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await CentralCommittee.deleteMany({});
    console.log('Cleared existing data');

    const members = seedData.map((m, i) => ({ ...m, image: '', publicId: '', bio: '', bioEn: '', bioNe: '', order: i }));

    const doc = await CentralCommittee.create({ members });
    console.log('Seeded', doc.members.length, 'members:');

    const sections = {};
    doc.members.forEach(m => { sections[m.section] = (sections[m.section] || 0) + 1; });
    Object.entries(sections).forEach(([k, v]) => console.log('  ' + k + ': ' + v));

    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
