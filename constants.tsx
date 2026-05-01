
import React from 'react';

export const COLORS = {
  primary: '#064e3b', // Deep Emerald
  secondary: '#f8f9fa', // Warm Gray
  accent: '#b2935b', // Muted Gold
};

export const PAKISTAN_DISTRICTS = [
  "Islamabad (ICT)", "Lahore", "Karachi", "Peshawar", "Quetta", "Multan", "Faisalabad", "Rawalpindi", "Gujranwala", "Hyderabad", "Sialkot", "Swat", "Gilgit", "Muzaffarabad"
];

export const NIKKAH_COLUMNS: { [key: number]: { label: string; urdu: string; desc: string; urduDesc: string } } = {
  1: { 
    label: "Ward/Town/Tehsil", 
    urdu: "وارڈ/ٹاؤن/تحصیل", 
    desc: "Location where the marriage took place.",
    urduDesc: "وہ جگہ جہاں نکاح ہوا (یونین کونسل، وارڈ یا تحصیل)۔"
  },
  2: { 
    label: "Bridegroom Details", 
    urdu: "دولہا کی تفصیلات", 
    desc: "Name, father's name, and residence of the groom.",
    urduDesc: "دولہا کا نام، ولدیت اور مکمل پتہ۔"
  },
  3: { 
    label: "Groom's Age", 
    urdu: "دولہا کی عمر", 
    desc: "Date of birth or age of the bridegroom.",
    urduDesc: "دولہا کی تاریخ پیدائش یا شادی کے وقت عمر۔"
  },
  4: { 
    label: "Bride Details", 
    urdu: "دلہن کی تفصیلات", 
    desc: "Name, father's name, and residence of the bride.",
    urduDesc: "دلہن کا نام، ولدیت اور مکمل پتہ۔"
  },
  5: { 
    label: "Bride's Marital Status", 
    urdu: "دلہن کی حیثیت", 
    desc: "Whether the bride is a virgin, widow, or divorced.",
    urduDesc: "دلہن کی حیثیت (کنواری، بیوہ یا مطلقہ)۔"
  },
  6: { 
    label: "Bride's Age", 
    urdu: "دلہن کی عمر", 
    desc: "Date of birth or age of the bride.",
    urduDesc: "دلہن کی تاریخ پیدائش یا شادی کے وقت عمر۔"
  },
  13: { 
    label: "Total Haq Mehr", 
    urdu: "حق مہر کی کل رقم", 
    desc: "Total amount of dower promised to the bride.",
    urduDesc: "حق مہر کی وہ کل رقم جو نکاح کے وقت طے کی گئی۔"
  },
  14: { 
    label: "Prompt/Deferred Split", 
    urdu: "معجل اور مؤجل کی تقسیم", 
    desc: "How much dower is paid immediately and how much is deferred.",
    urduDesc: "مہر کا کتنا حصہ نکاح کے وقت (معجل) اور کتنا بعد میں (مؤجل) ملے گا۔"
  },
  15: { 
    label: "Paid at Marriage", 
    urdu: "نکاح کے وقت ادائیگی", 
    desc: "Amount of dower paid at the time of the ceremony.",
    urduDesc: "نکاح کے وقت مہر کی ادا کی گئی رقم۔"
  },
  16: { 
    label: "Property in lieu of Mehr", 
    urdu: "مهر کے بدلے جائیداد", 
    desc: "Details of any property given instead of cash dower.",
    urduDesc: "مہر کے بدلے دی گئی کسی جائیداد یا زیور کی تفصیل۔"
  },
  17: { 
    label: "Right to Education/Work", 
    urdu: "تعلیم اور ملازمت کا حق", 
    desc: "Special condition ensuring the bride's right to continue studies or work post-marriage.",
    urduDesc: "دلہن کا شادی کے بعد تعلیم جاری رکھنے یا ملازمت کرنے کا قانونی حق۔"
  },
  18: { 
    label: "Delegation of Divorce", 
    urdu: "حقِ طلاق کی تفویض", 
    desc: "Crucial: Whether the husband gives the wife the right to divorce (Talaq-e-Tafweez).",
    urduDesc: "سب سے اہم: کیا شوہر نے بیوی کو طلاق کا حق (تفویض) دیا ہے؟"
  },
  19: { 
    label: "Husband's Right Curtailed", 
    urdu: "شوہر کے حقِ طلاق پر پابندی", 
    desc: "Any restrictions on the husband's power to divorce.",
    urduDesc: "کیا شوہر کے طلاق دینے کے حق پر کوئی شرائط یا پابندی لگائی گئی ہے؟"
  },
  20: { 
    label: "Maintenance/Documents", 
    urdu: "نان و نفقہ/دستاویزات", 
    desc: "Monthly maintenance (Kharchi) or other related marriage documents.",
    urduDesc: "ماہانہ خرچ (نان و نفقہ) یا دیگر متعلقہ دستاویزات کی تفصیل۔"
  },
  21: { 
    label: "Existing Wives", 
    urdu: "پہلی بیوی کی موجودگی", 
    desc: "Whether the groom already has a wife and has permission for another.",
    urduDesc: "کیا دولہا کی پہلے سے کوئی بیوی ہے؟ اگر ہے، تو کیا اجازت لی گئی؟"
  },
  22: { 
    label: "Arbitration Permission", 
    urdu: "ثالثی کونسل کی اجازت", 
    desc: "Official permission number for a second/subsequent marriage.",
    urduDesc: "دوسری شادی کی صورت میں ثالثی کونسل سے حاصل کردہ اجازت نامہ نمبر۔"
  },
  24: { 
    label: "Date of Registration", 
    urdu: "رجسٹریشن کی تاریخ", 
    desc: "When the marriage was officially recorded.",
    urduDesc: "نکاح کی سرکاری رجسٹریشن کی تاریخ۔"
  },
  25: { 
    label: "Registration Fee", 
    urdu: "رجسٹریشن فیس", 
    desc: "The official fee paid for the marriage certificate.",
    urduDesc: "نکاح نامہ کی سرکاری فیس جو ادا کی گئی۔"
  }
};

export const NGO_DATABASE = [
  { name: "Bedari Helpline", contact: "0300-5251430", focus: "General Support" },
  { name: "Aurat Foundation", contact: "051-2608956", focus: "Legal Aid" },
  { name: "Legal Aid Society", contact: "0800-91010", focus: "Protection" },
  { name: "Shaheed Benazir Bhutto Centers", contact: "1094", focus: "Emergency Shelter" }
];

export const ICONS = {
  profile: <i className="fas fa-id-card"></i>,
  sharia: <i className="fas fa-moon"></i>,
  advocate: <i className="fas fa-balance-scale"></i>,
  health: <i className="fas fa-heartbeat"></i>,
  ngo: <i className="fas fa-hands-helping"></i>,
  arrowRight: <i className="fas fa-arrow-right"></i>,
  chevronLeft: <i className="fas fa-chevron-left"></i>,
  shield: <i className="fas fa-shield-alt"></i>,
  info: <i className="fas fa-info-circle"></i>,
  search: <i className="fas fa-search"></i>,
  file: <i className="fas fa-file-contract"></i>,
  download: <i className="fas fa-download"></i>
};

export const TRANSLATIONS = {
  landing: {
    title: "زینت",
    subheading: "ڈیجیٹل محافظ • حق • حقوق",
    description: "پاکستانی خواتین کے لیے ایک مکمل حفاظتی نظام۔ اپنی شناخت درج کریں اور اپنے حقوق کا مکمل آڈٹ حاصل کریں۔",
    primaryCTA: "اپنی شناخت بنائیں",
  },
  disclaimer: "قانونی نوٹ: یہ زینت-اے آئی ایک معلوماتی نظام ہے، پیشہ ورانہ قانونی مشورہ نہیں ہے۔"
};
