
import React, { useState } from 'react';
import { Language } from '../types';

interface NikkahFormProps {
  onAnalyze: (data: any) => void;
  language?: Language;
}

const NikkahForm: React.FC<NikkahFormProps> = ({ onAnalyze, language = Language.UR }) => {
  const [formData, setFormData] = useState({
    col13_16: '',
    col17: '', // New Field: Education
    col18: '',
    col19: '',
    col20: '',
    col21: '',
    col22: ''
  });

  const isUrdu = language === Language.UR;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      type: 'Structured Nikkah Nama Audit',
      data: formData
    });
  };

  const labels = {
    title: isUrdu ? "نکاح نامہ کی معلومات" : "Nikkah Nama Information",
    description: isUrdu 
      ? "براہ کرم اپنے نکاح نامہ کی اہم شقوں کی معلومات درج کریں۔ یہ معلومات آپ کے حقوق کو سمجھنے میں مدد کرے گی۔" 
      : "Please enter the key clauses of your marriage certificate. This will help audit your rights.",
    col13_16: isUrdu ? "کالم 13-16: حق مہر" : "Column 13-16: Haq Mehr (Dower)",
    col13_16_p: isUrdu ? "مثلاً: 50,000 روپے فوری، 100,000 روپے مؤخر" : "e.g. 50,000 PKR Prompt, 100,000 PKR Deferred",
    col17: isUrdu ? "کالم 17: تعلیم اور ملازمت کا حق" : "Column 17: Right to Education/Work",
    col17_p: isUrdu ? "کیا یہ حق دیا گیا ہے؟ (ہاں / نہیں)" : "Is this right granted? (Yes / No)",
    col18: isUrdu ? "کالم 18: طلاق تفویض کا حق" : "Column 18: Delegation of Divorce",
    col18_p: isUrdu ? "ہاں / نہیں / کاٹ دیا گیا" : "Yes / No / Stricken out",
    col19: isUrdu ? "کالم 19: کثیر الازدواجی پر پابندی" : "Column 19: Restriction on Polygamy",
    col19_p: isUrdu ? "ہاں / نہیں / شرائط لاگو" : "Yes / No / Conditional",
    col20: isUrdu ? "کالم 20: نان و نفقہ (Maintenance)" : "Column 20: Maintenance (Nafaqah)",
    col20_p: isUrdu ? "تفصیلات درج کریں" : "Enter details",
    col21: isUrdu ? "کالم 21: رہائش کا حق" : "Column 21: Right to Residence",
    col21_p: isUrdu ? "تفصیلات درج کریں" : "Enter details",
    col22: isUrdu ? "کالم 22: رضامندی" : "Column 22: Consent",
    col22_p: isUrdu ? "تفصیلات درج کریں" : "Enter details",
    cta: isUrdu ? "تجزیہ کریں" : "Analyze"
  };

  const inputClass = `w-full bg-[#FFE6EE]/50 border border-pink-200 rounded-xl p-4 focus:ring-2 focus:ring-[#9d174d]/10 outline-none transition-all ${isUrdu ? 'text-right urdu-text' : 'text-left'}`;

  return (
    <div className="bg-[#FFE6EE] p-8 md:p-12 rounded-[3rem] shadow-xl border border-pink-200 fade-in">
      <div className={`space-y-4 mb-10 ${isUrdu ? 'text-right' : 'text-left'}`}>
        <h3 className={`text-2xl font-bold text-[#9d174d] ${isUrdu ? 'urdu-text' : ''}`}>{labels.title}</h3>
        <p className={`text-sm text-slate-500 leading-relaxed ${isUrdu ? 'urdu-text' : ''}`}>
          {labels.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={`space-y-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className={`block text-sm font-bold text-slate-700 ${isUrdu ? 'urdu-text' : ''}`}>{labels.col13_16}</label>
          <input 
            type="text" 
            placeholder={labels.col13_16_p}
            className={inputClass}
            value={formData.col13_16}
            onChange={(e) => setFormData({...formData, col13_16: e.target.value})}
          />
        </div>

        <div className={`space-y-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className={`block text-sm font-bold text-slate-700 ${isUrdu ? 'urdu-text' : ''}`}>{labels.col17}</label>
          <input 
            type="text" 
            placeholder={labels.col17_p}
            className={inputClass}
            value={formData.col17}
            onChange={(e) => setFormData({...formData, col17: e.target.value})}
          />
        </div>

        <div className={`space-y-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className={`block text-sm font-bold text-slate-700 ${isUrdu ? 'urdu-text' : ''}`}>{labels.col18}</label>
          <input 
            type="text" 
            placeholder={labels.col18_p}
            className={inputClass}
            value={formData.col18}
            onChange={(e) => setFormData({...formData, col18: e.target.value})}
          />
        </div>

        <div className={`space-y-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className={`block text-sm font-bold text-slate-700 ${isUrdu ? 'urdu-text' : ''}`}>{labels.col19}</label>
          <input 
            type="text" 
            placeholder={labels.col19_p}
            className={inputClass}
            value={formData.col19}
            onChange={(e) => setFormData({...formData, col19: e.target.value})}
          />
        </div>

        <div className={`space-y-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className={`block text-sm font-bold text-slate-700 ${isUrdu ? 'urdu-text' : ''}`}>{labels.col20}</label>
          <input 
            type="text" 
            placeholder={labels.col20_p}
            className={inputClass}
            value={formData.col20}
            onChange={(e) => setFormData({...formData, col20: e.target.value})}
          />
        </div>

        <div className={`space-y-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className={`block text-sm font-bold text-slate-700 ${isUrdu ? 'urdu-text' : ''}`}>{labels.col21}</label>
          <input 
            type="text" 
            placeholder={labels.col21_p}
            className={inputClass}
            value={formData.col21}
            onChange={(e) => setFormData({...formData, col21: e.target.value})}
          />
        </div>

        <div className={`space-y-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <label className={`block text-sm font-bold text-slate-700 ${isUrdu ? 'urdu-text' : ''}`}>{labels.col22}</label>
          <input 
            type="text" 
            placeholder={labels.col22_p}
            className={inputClass}
            value={formData.col22}
            onChange={(e) => setFormData({...formData, col22: e.target.value})}
          />
        </div>

        <div className={`pt-6 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <button 
            type="submit"
            className={`w-48 bg-[#9d174d] hover:bg-[#831440] text-white py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg ${isUrdu ? 'urdu-text' : ''}`}
          >
            {labels.cta}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NikkahForm;
