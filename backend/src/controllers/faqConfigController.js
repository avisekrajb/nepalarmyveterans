const FaqConfig = require('../models/FaqConfig');
const { logActivity } = require('../middleware/logger');

const DEFAULT_CONFIG = {
  titleEn: '',
  titleNe: '',
  quickLinks: [
    { key: 'callUs', labelEn: '', labelNe: '', valueEn: '+977-1-1234567', valueNe: '+९७७-१-१२३४५६७', action: 'tel:+97711234567', icon: 'phone' },
    { key: 'emailUs', labelEn: '', labelNe: '', valueEn: 'info@nepalarmy.org', valueNe: 'info@nepalarmy.org', action: 'mailto:info@nepalarmy.org', icon: 'mail' },
    { key: 'visitUs', labelEn: '', labelNe: '', valueEn: 'Kathmandu, Nepal', valueNe: 'काठमाडौँ, नेपाल', action: '/contact', icon: 'map' },
    { key: 'officeHours', labelEn: '', labelNe: '', valueEn: 'Mon-Fri: 10:00 AM - 5:00 PM', valueNe: 'आइत-शुक्र: बिहान १० - बेलुका ५', action: '', icon: 'clock' },
  ],
  supportTitleEn: '',
  supportTitleNe: '',
  supportTextEn: '',
  supportTextNe: '',
  supportButtonEn: '',
  supportButtonNe: '',
  supportButtonAction: '/contact',
};

const getFaqConfig = async (req, res) => {
  try {
    let config = await FaqConfig.findOne();
    if (!config) {
      config = await FaqConfig.create(DEFAULT_CONFIG);
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFaqConfig = async (req, res) => {
  try {
    let config = await FaqConfig.findOne();
    if (!config) {
      config = new FaqConfig(DEFAULT_CONFIG);
    }

    const {
      titleEn, titleNe,
      quickLinks,
      supportTitleEn, supportTitleNe,
      supportTextEn, supportTextNe,
      supportButtonEn, supportButtonNe, supportButtonAction,
    } = req.body;

    if (titleEn !== undefined) config.titleEn = titleEn;
    if (titleNe !== undefined) config.titleNe = titleNe;
    if (quickLinks !== undefined) config.quickLinks = quickLinks;
    if (supportTitleEn !== undefined) config.supportTitleEn = supportTitleEn;
    if (supportTitleNe !== undefined) config.supportTitleNe = supportTitleNe;
    if (supportTextEn !== undefined) config.supportTextEn = supportTextEn;
    if (supportTextNe !== undefined) config.supportTextNe = supportTextNe;
    if (supportButtonEn !== undefined) config.supportButtonEn = supportButtonEn;
    if (supportButtonNe !== undefined) config.supportButtonNe = supportButtonNe;
    if (supportButtonAction !== undefined) config.supportButtonAction = supportButtonAction;

    await config.save();
    await logActivity({ req, action: 'UPDATE', module: 'FAQ_CONFIG', details: { title: config.titleEn } });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFaqConfig, updateFaqConfig };
