import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import VoiceInput from './components/VoiceInput';
import NikkahNamaMap from './components/NikkahNamaMap';
import NikkahForm from './components/NikkahForm';
import { runGuardianAnalysis } from './services/geminiService';
import { 
  Language, 
  UserProfile, 
  SwarmResult,
  Message
} from './types';
import { 
  PAKISTAN_DISTRICTS, 
  TRANSLATIONS, 
  ICONS,
  NIKKAH_COLUMNS,
  NGO_DATABASE 
} from './constants';

type AppView = 'landing' | 'profile' | 'guardian' | 'result';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [language, setLanguage] = useState<Language>(Language.UR);
  const [loading, setLoading] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [result, setResult] = useState<SwarmResult | null>(null);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    district: 'Islamabad (ICT)',
    maritalStatus: 'Single',
    childrenCount: 0,
    isEmployed: false
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!navigator.geolocation) {
      setLocationError(isUrdu ? "آپ کا براؤزر لوکیشن کی سہولت نہیں رکھتا۔" : "Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setProfile(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        setLoading(false);
        setView('guardian');
      },
      (error) => {
        setLoading(false);
        setLocationError(isUrdu ? "حفاظتی اقدامات کے لیے نقشہ (Location) تک رسائی ضروری ہے۔ براہ کرم اجازت دیں۔" : "Location access is compulsory for emergency dispatch. Please enable it.");
      }
    );
  };

  const triggerSOS = () => {
    setSosActive(true);
    // In a real app, this would send an API request to the nearest NGO
    setTimeout(() => {
      alert(isUrdu ? "ایس او ایس متحرک ہو گیا ہے! آپ کی لوکیشن قریب ترین این جی او کو بھیج دی گئی ہے۔" : "SOS Triggered! Your location has been sent to the nearest NGO.");
    }, 500);
  };

  const startAnalysis = async (input: string | object) => {
    const isTextInput = typeof input === 'string';
    setLoading(!isTextInput); // Only show overlay for non-text inputs (hotspots/forms)
    
    if (isTextInput) {
      const newUserMsg: Message = { role: 'user', content: input as string };
      setMessages(prev => [...prev, newUserMsg]);
      // Add a placeholder assistant message for typing state
      const typingMsg: Message = { role: 'assistant', content: '...' };
      setMessages(prev => [...prev, typingMsg]);
    }

    try {
      const data = await runGuardianAnalysis(profile, input, language);
      setResult(data);
      
      // Auto-trigger SOS if high risk
      if (data.advocate.riskLevel === 'High') {
        triggerSOS();
      }
      
      if (isTextInput) {
        setMessages(prev => {
          const filtered = prev.filter(m => m.content !== '...');
          const assistantMsg: Message = { 
            role: 'assistant', 
            content: data.helplineExpert?.empathyResponse || (isUrdu ? "آپ کی صورتحال کا جائزہ لے لیا گیا ہے۔" : "I have analyzed your situation."),
            result: data 
          };
          return [...filtered, assistantMsg];
        });
      } else {
        setView('result');
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      if (isTextInput) {
        setMessages(prev => {
          const filtered = prev.filter(m => m.content !== '...');
          const errorMsg: Message = { 
            role: 'assistant', 
            content: isUrdu ? `خرابی: ${err.message || 'نظام مصروف ہے۔'}` : `Error: ${err.message || 'System busy.'}`
          };
          return [...filtered, errorMsg];
        });
      } else {
        alert(language === Language.UR ? "نظام مصروف ہے۔ براہ کرم دوبارہ کوشش کریں۔" : "System busy. Please try again.");
      }
    } finally {
      if (!isTextInput) setLoading(false);
    }
  };

  const isUrdu = language === Language.UR;

  return (
    <div className="min-h-screen bg-[#FFE6EE] selection:bg-[#9d174d] selection:text-white">
      <Header currentLang={language} onLangChange={setLanguage} />
      
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center px-6">
           <div className="w-24 h-24 border-8 border-[#9d174d]/10 border-t-[#9d174d] rounded-full animate-spin mb-12"></div>
           <p className="urdu-text text-4xl text-[#9d174d] font-black leading-loose">
             {isUrdu ? "زینت آپ کے حقوق کا جائزہ لے رہی ہے..." : "Zeenat is auditing your rights..."}
           </p>
           <p className="text-xs text-slate-400 mt-6 font-black uppercase tracking-[0.4em] animate-pulse">Consulting Swarm Experts</p>
        </div>
      )}

      {sosActive && (
        <div className="fixed inset-0 z-[200] bg-red-600 flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-500">
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center animate-ping absolute opacity-20"></div>
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-12 relative z-10 shadow-2xl">
            <span className="text-red-600 text-6xl font-black">{ICONS.shield}</span>
          </div>
          <h2 className="urdu-title text-7xl text-white font-black mb-6">
            {isUrdu ? "ایس او ایس متحرک!" : "SOS ACTIVE!"}
          </h2>
          <p className="urdu-text text-2xl text-white/90 max-w-xl leading-relaxed mb-12">
            {isUrdu 
              ? "آپ کی لائیو لوکیشن قریب ترین این جی او کو بھیج دی گئی ہے۔ مدد راستے میں ہے، براہ کرم محفوظ رہیں۔" 
              : "Your live location has been dispatched to the nearest NGO. Help is on the way, please stay safe."}
          </p>
          <div className="flex gap-4">
             <button 
               onClick={() => setSosActive(false)}
               className="bg-white/20 text-white border border-white/40 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/30"
             >
               {isUrdu ? "منصوخ کریں (Cancel)" : "Cancel Alert"}
             </button>
             <button className="bg-white text-red-600 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">
               {isUrdu ? "ایمرجنسی کال" : "Emergency Call"}
             </button>
          </div>
        </div>
      )}

      <main className="pb-24">
        {/* LANDING VIEW */}
        {view === 'landing' && (
          <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 fade-in">
             <div className="mb-6 flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all font-black text-[8px] uppercase tracking-widest text-[#9d174d]">
               <span>{isUrdu ? "جسٹس فاؤنڈیشنز کے تعاون سے" : "Sponsored by Justice Foundations"}</span>
               <span>•</span>
               <span>{isUrdu ? "لیگل ایڈ پارٹنر 2026" : "Legal Aid Partner 2026"}</span>
             </div>
            <h1 className="urdu-title text-9xl md:text-[12rem] text-[#9d174d] font-bold mb-4 drop-shadow-sm select-none">
              {TRANSLATIONS.landing.title}
            </h1>
            <h2 className={`urdu-text text-3xl md:text-4xl text-[#f472b6] font-medium tracking-[0.2em] mb-12 opacity-80 ${!isUrdu ? 'font-sans italic tracking-normal' : ''}`}>
              {isUrdu ? TRANSLATIONS.landing.subheading : "Digital Guardian • Right • Justice"}
            </h2>
            <p className={`text-xl text-slate-500 max-w-xl mx-auto mb-16 leading-relaxed ${isUrdu ? 'urdu-text' : ''}`}>
              {isUrdu ? TRANSLATIONS.landing.description : "A complete empowerment system for Pakistani women. Create your identity and get a full audit of your rights."}
            </p>
            
            <button 
              onClick={() => setView('profile')}
              className={`bg-[#9d174d] hover:bg-[#831440] text-white px-16 py-6 rounded-full font-bold text-xl shadow-2xl transition-all hover:scale-105 ${isUrdu ? 'urdu-text' : ''}`}
            >
              {isUrdu ? TRANSLATIONS.landing.primaryCTA : "Create Your Profile"}
            </button>

            {/* Partners/Monetization on Landing */}
            <div className="mt-20 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
              <div className="p-6 bg-white/40 rounded-3xl border border-pink-100 text-left hover:opacity-100 transition-all cursor-pointer group">
                <p className="text-[10px] font-black text-pink-400 uppercase mb-2">Featured Lawyer</p>
                <p className="text-sm font-bold text-slate-800">Advocate Sarah Ahmed</p>
                <p className="text-[10px] text-slate-500">Family Law Specialist • Islamabad</p>
              </div>
              <div className="p-6 bg-white/40 rounded-3xl border border-pink-100 text-left hover:opacity-100 transition-all cursor-pointer group">
                <p className="text-[10px] font-black text-pink-400 uppercase mb-2">NGO Partner</p>
                <p className="text-sm font-bold text-slate-800">Women Rights Tech</p>
                <p className="text-[10px] text-slate-500">Digital Empowerment • Karachi</p>
              </div>
              <div className="p-6 bg-white/40 rounded-3xl border border-pink-100 text-left hover:opacity-100 transition-all cursor-pointer group">
                <p className="text-[10px] font-black text-pink-400 uppercase mb-2">Resource Partner</p>
                <p className="text-sm font-bold text-slate-800">Legal Aid Society</p>
                <p className="text-[10px] text-slate-500">Free Consultation Services</p>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE VIEW */}
        {view === 'profile' && (
          <div className="max-w-xl mx-auto px-6 py-20 fade-in">
            <div className="bg-[#FFE6EE] p-12 rounded-[4rem] shadow-2xl border border-pink-100">
              <h3 className={`text-3xl font-bold text-[#9d174d] mb-8 ${isUrdu ? 'urdu-text text-right' : ''}`}>
                {isUrdu ? "آپ کی شناخت (Digital Profile)" : "Your Digital Identity"}
              </h3>
              <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9d174d] uppercase tracking-widest">Age / عمر</label>
                    <input type="number" required value={profile.age} onChange={e => setProfile({...profile, age: parseInt(e.target.value)})} className="w-full bg-[#FFE6EE] border border-pink-200 rounded-2xl p-5 text-lg outline-none focus:ring-2 focus:ring-[#9d174d]/10 text-[#9d174d]"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9d174d] uppercase tracking-widest">District / ضلع</label>
                    <select value={profile.district} onChange={e => setProfile({...profile, district: e.target.value})} className="w-full bg-[#FFE6EE] border border-pink-200 rounded-2xl p-5 text-lg outline-none focus:ring-2 focus:ring-[#9d174d]/10 text-[#9d174d]">
                      {PAKISTAN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {locationError && (
                  <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start gap-4">
                    <div className="text-red-500 text-xl mt-1">{ICONS.info}</div>
                    <p className={`text-sm text-red-800 font-medium ${isUrdu ? 'urdu-text text-right w-full' : ''}`}>
                      {locationError}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#9d174d] uppercase tracking-widest">Status / ازدواجی حیثیت</label>
                  <div className="flex gap-2">
                    {['Single', 'Married', 'Divorced', 'Widow'].map(s => (
                      <button 
                        key={s} type="button" 
                        onClick={() => setProfile({...profile, maritalStatus: s as any})}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-bold transition-all ${profile.maritalStatus === s ? 'bg-[#9d174d] text-white shadow-lg scale-[1.05]' : 'bg-[#FFE6EE] text-pink-400 hover:bg-pink-100 border border-pink-200'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-[#9d174d] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-[1.02]">
                  {isUrdu ? "محفوظ کریں اور آگے بڑھیں" : "Save & Enter Guardian Mode"}
                </button>
              </form>
            </div>

            {/* Promo/Ad space below form */}
            <div className="mt-10 p-8 bg-slate-900 rounded-[3rem] text-white flex items-center justify-between overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all">
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1 italic">Exclusive Partner Offer</p>
                 <h4 className="text-lg font-bold">Free Legal Consultation</h4>
                 <p className="text-[10px] text-slate-400">Sponsored by Advocates Registry Pakistan</p>
               </div>
               <button className="relative z-10 bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-[10px] uppercase shadow-xl group-hover:bg-pink-500 group-hover:text-white transition-all">Claim Now</button>
               <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full group-hover:bg-pink-500/20 transition-all"></div>
            </div>
          </div>
        )}

        {/* GUARDIAN VIEW */}
        {view === 'guardian' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-20 fade-in">
            <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-7 space-y-8">
                <div className="bg-[#FFE6EE] p-8 rounded-[3rem] shadow-sm border border-pink-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-[#9d174d]/10 text-[#9d174d] rounded-xl flex items-center justify-center font-bold text-lg">01</div>
                    <h3 className="text-xs font-black text-[#f472b6] uppercase tracking-[0.3em]">POI Analysis</h3>
                  </div>
                  <h2 className="text-4xl font-bold text-[#9d174d] tracking-tight mb-6">
                    {isUrdu ? "انٹرایکٹو نکاح نامہ" : "Interactive Nikkah Nama"}
                  </h2>
                  <p className={`text-slate-500 mb-10 leading-relaxed text-lg ${isUrdu ? 'urdu-text text-right' : ''}`}>
                    {isUrdu ? "دستاویز پر موجود کسی بھی کالم کو منتخب کریں تاکہ اس کے قانونی اثرات کا جائزہ لیا جا سکے۔ کالم 17 کو خاص طور پر چیک کریں۔" : "Select any column on the document to audit its legal implications. Pay special attention to Column 17."}
                  </p>
                  <NikkahNamaMap 
                    onHotspotClick={(id) => startAnalysis({ action: 'Audit Column', column: NIKKAH_COLUMNS[id] })} 
                    language={language}
                  />
                </div>

                {/* Sidebar Promotions in Guardian Mode */}
                <div className="p-8 bg-white/40 rounded-[3rem] border border-pink-200 space-y-6 shadow-sm">
                  <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Recommended Lawyers in {profile.district}</h4>
                  <div className="space-y-4">
                    {[1, 2].map(id => (
                      <div key={id} className="flex items-center gap-4 group cursor-pointer hover:bg-[#FFE6EE] p-4 rounded-3xl transition-all border border-transparent hover:border-pink-100">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#9d174d] shadow-sm group-hover:scale-110 transition-all text-xl">{ICONS.profile}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Advocate {id === 1 ? 'Faraz' : 'Hina'} Jameel</p>
                          <p className="text-[10px] text-pink-400 font-bold uppercase tracking-tighter">Verified Rights Professional • Top Rated</p>
                        </div>
                        <button className="ml-auto w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs text-[#9d174d] shadow-sm transform group-hover:bg-[#9d174d] group-hover:text-white transition-all">{ICONS.arrowRight}</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 space-y-8">
                <div className="bg-[#FFE6EE] p-8 rounded-[3rem] shadow-sm border border-pink-200 h-[650px] flex flex-col">
                  <div className="flex items-center gap-4 mb-6 shrink-0">
                    <div className="w-10 h-10 bg-[#9d174d]/10 text-[#9d174d] rounded-xl flex items-center justify-center font-bold text-lg">02</div>
                    <h3 className="text-xs font-black text-[#f472b6] uppercase tracking-[0.3em]">AI Rights Helpline</h3>
                  </div>
                  
                  {/* Chat Box */}
                  <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2 scrollbar-hide">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-10">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-2xl">
                           {ICONS.info}
                         </div>
                         <p className={`text-sm font-medium ${isUrdu ? 'urdu-text' : ''}`}>
                           {isUrdu ? "آپ اپنا کوئی بھی مسئلہ یہاں لکھ سکتی ہیں، جیسے 'شوہر مار پیٹ کرتا ہے' یا 'مجھے اپنی تعلیم جاری رکھنی ہے'۔ زینت آپ کی مدد کرے گی۔" : "Describe any issue here, like 'My husband is violent' or 'I want to continue my studies'. Zeenat will help you."}
                         </p>
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                              ? 'bg-[#9d174d] text-white rounded-tr-none' 
                              : 'bg-[#FFE6EE] text-slate-800 rounded-tl-none border border-pink-200'
                          } ${isUrdu ? 'urdu-text text-right' : ''}`}>
                            {msg.content === '...' ? (
                              <div className="flex gap-1 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-[#9d174d] rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-[#9d174d] rounded-full delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-[#9d174d] rounded-full delay-150"></div>
                              </div>
                            ) : msg.content}
                            
                            {msg.role === 'assistant' && msg.result && (
                              <div className="mt-6 pt-6 border-t border-pink-200/50 space-y-4">
                                {msg.result.helplineExpert?.immediateAdvice && (
                                  <div className="bg-white/50 p-4 rounded-2xl border border-white/50">
                                    <h5 className="text-[10px] font-black text-[#9d174d] uppercase tracking-widest mb-2">Immediate Advice</h5>
                                    <p className="text-xs">{msg.result.helplineExpert.immediateAdvice}</p>
                                  </div>
                                )}
                                {msg.result.helplineExpert?.emergencyNumbers && msg.result.helplineExpert.emergencyNumbers.length > 0 && (
                                   <div className="flex flex-wrap gap-2">
                                     {msg.result.helplineExpert.emergencyNumbers.map((num, idx) => (
                                       <span key={idx} className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">{num}</span>
                                     ))}
                                   </div>
                                 )}
                                <button 
                                  onClick={() => {
                                    setResult(msg.result!);
                                    setView('result');
                                  }}
                                  className="w-full bg-[#9d174d]/10 text-[#9d174d] py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#9d174d]/20 transition-all"
                                >
                                  View Full Analysis Report
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="relative shrink-0">
                    <textarea 
                      placeholder={isUrdu ? "اپنی صورتحال بیان کریں..." : "Describe your situation..."}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className={`w-full bg-[#FFE6EE]/60 border border-pink-200 rounded-[2rem] p-6 text-sm focus:ring-2 focus:ring-[#9d174d]/10 transition-all outline-none placeholder:text-pink-300 resize-none h-32 ${isUrdu ? 'text-right' : ''}`}
                      onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if(textInput.trim()) {
                            startAnalysis(textInput);
                            setTextInput('');
                          }
                        }
                      }}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-3">
                      <VoiceInput 
                        onTranscript={(t) => setTextInput(prev => prev ? prev + ' ' + t : t)} 
                        language={language}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest shrink-0">
                    {ICONS.info} <span>Guardian Engine Online</span>
                  </div>

                  {/* Advertisement Slot */}
                  <div className="mt-6 w-full bg-white/20 h-24 rounded-[2rem] border-2 border-dashed border-pink-200 flex items-center justify-center text-pink-300 text-[10px] font-black uppercase tracking-[0.5em] select-none hover:bg-white/40 transition-all cursor-pointer">
                    Sponsored Content Slot
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-4xl mx-auto pb-20">
               <div className="flex items-center gap-4 mb-10 justify-center">
                  <div className="w-12 h-12 bg-[#9d174d] text-white rounded-2xl flex items-center justify-center font-bold text-xl">03</div>
                  <h3 className="text-xl font-black text-[#9d174d] uppercase tracking-[0.3em]">
                    {isUrdu ? "مکمل معاہدہ آڈٹ" : "Full Contract Audit"}
                  </h3>
               </div>
               <NikkahForm onAnalyze={(data) => startAnalysis(data)} language={language} />
            </section>
          </div>
        )}

        {/* RESULT VIEW */}
        {view === 'result' && (
          <div className="max-w-6xl mx-auto px-6 py-20 fade-in space-y-16">
            <div className="flex items-center justify-between border-b border-slate-100 pb-12">
              <div className={isUrdu ? 'text-right w-full' : ''}>
                <div className={`flex items-center gap-3 mb-2 ${isUrdu ? 'justify-end' : ''}`}>
                  <span className="text-[10px] font-black bg-[#9d174d]/10 text-[#9d174d] px-3 py-1 rounded-full uppercase tracking-tighter">
                    {isUrdu ? "تصدیق شدہ تجزیہ" : "Verified Analysis"}
                  </span>
                  <span className="text-[10px] font-black text-pink-300 uppercase tracking-widest">Guardian Report</span>
                </div>
                <h2 className={`text-5xl font-bold text-[#9d174d] tracking-tighter ${isUrdu ? 'urdu-text' : ''}`}>
                  {isUrdu ? "آپ کی حفاظت کا راستہ" : "Your Roadmap to Safety"}
                </h2>
              </div>
              <button onClick={() => setView('guardian')} className="bg-[#9d174d] text-white px-10 py-4 rounded-full font-bold text-xs shadow-xl transition-all hover:scale-105 shrink-0 ml-4">
                {isUrdu ? "نیا تجزیہ" : "New Analysis"}
              </button>
            </div>

            {/* ACTIONABLE OUTPUT: DRAFTED DOCUMENT */}
            {result?.helplineExpert && (
              <section className="bg-red-50 border-2 border-red-100 p-12 rounded-[4rem] shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                   <div className="shrink-0 w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center text-3xl">
                     {ICONS.shield}
                   </div>
                   <div className="flex-1 space-y-6">
                     <h3 className={`text-3xl font-black text-red-900 ${isUrdu ? 'urdu-text text-right' : ''}`}>
                       {isUrdu ? "فوری حفاظتی مشورہ" : "Immediate Safety Guidance"}
                     </h3>
                     <p className={`text-lg text-red-800 leading-relaxed font-bold ${isUrdu ? 'urdu-text opacity-90' : ''}`}>
                       {result.helplineExpert.empathyResponse}
                     </p>
                     <div className="bg-white p-8 rounded-3xl border border-red-200">
                        <p className={`text-slate-700 leading-relaxed ${isUrdu ? 'urdu-text' : ''}`}>
                          {result.helplineExpert.immediateAdvice}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                           {result.helplineExpert.emergencyNumbers.map((num, idx) => (
                             <div key={idx} className="bg-red-600 text-white px-6 py-2 rounded-full font-black text-xs animate-pulse">
                                CALL: {num}
                             </div>
                           ))}
                        </div>
                     </div>
                   </div>
                </div>
              </section>
            )}

            {result?.draftedDocument && (
              <section className="bg-pink-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[100%]"></div>
                <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                  <div className="shrink-0 w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-4xl">
                    {ICONS.file}
                  </div>
                  <div className="flex-1 space-y-6">
                    <h3 className={`text-3xl font-black tracking-tight ${isUrdu ? 'urdu-text text-right' : ''}`}>
                      {result.draftedDocument.title}
                    </h3>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {result.draftedDocument.content}
                    </div>
                    <div className="flex gap-4">
                      <button className="bg-white text-pink-900 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                        {ICONS.download} {isUrdu ? "ڈاؤن لوڈ کریں" : "Download Draft"}
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(result.draftedDocument!.content);
                          alert(isUrdu ? "کاپی ہو گیا" : "Copied to clipboard");
                        }}
                        className="bg-pink-800 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest border border-white/20 hover:bg-pink-700 transition-all">
                        {isUrdu ? "کاپی کریں" : "Copy Text"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 ${isUrdu ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:col-span-2 space-y-12">
                {/* Advocate Report */}
                <section className={`bg-[#FFE6EE] p-12 rounded-[4rem] shadow-sm border border-pink-100 relative overflow-hidden ${isUrdu ? 'text-right' : ''}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-[4rem]"></div>
                  <h4 className={`text-3xl font-bold text-[#9d174d] mb-10 flex items-center gap-4 ${isUrdu ? 'justify-end' : ''}`}>
                     {isUrdu ? `وکیل کی رائے (Advocate Brief) ` : 'The Advocate\'s Brief '} {ICONS.advocate}
                  </h4>
                  <p className={`text-xl text-slate-700 leading-relaxed mb-10 ${isUrdu ? 'urdu-text' : ''}`}>{result?.advocate.analysis}</p>
                  
                  <div className="bg-white/40 p-8 rounded-[3rem] border border-pink-100 mb-10">
                     <h5 className={`text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mb-4 ${isUrdu ? 'text-right' : ''}`}>
                       {isUrdu ? `ضلعی بصیرت: ${profile.district}` : `District Insight: ${profile.district}`}
                     </h5>
                     <p className={`text-sm text-slate-600 italic leading-relaxed ${isUrdu ? 'text-right urdu-text' : ''}`}>"{result?.advocate.stats}"</p>
                  </div>

                  <div className="space-y-4 mb-10">
                     <h5 className={`text-xs font-black text-pink-400 uppercase tracking-widest ${isUrdu ? 'text-right' : ''}`}>
                       {isUrdu ? "قانونی کارروائی کا منصوبہ" : "Legal Action Plan"}
                     </h5>
                     {result?.advocate.legalRoadmap.map((step, i) => (
                       <div key={i} className={`flex gap-4 p-5 bg-white/50 border border-pink-100 rounded-2xl shadow-sm transition-all hover:translate-x-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                         <div className="w-8 h-8 rounded-full bg-[#9d174d] text-white flex items-center justify-center font-bold text-xs shrink-0">{i+1}</div>
                         <p className={`text-sm text-slate-800 w-full ${isUrdu ? 'text-right urdu-text' : ''}`}>{step}</p>
                       </div>
                     ))}
                  </div>

                  {result?.advocate.breachedLaws && result.advocate.breachedLaws.length > 0 && (
                    <div className="space-y-4">
                      <h5 className={`text-xs font-black text-red-500 uppercase tracking-widest ${isUrdu ? 'text-right' : ''}`}>
                        {isUrdu ? "ممکنہ قانونی خلاف ورزیاں" : "Potential Legal Breaches Detected"}
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        {result.advocate.breachedLaws.map((law, idx) => (
                          <div key={idx} className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-[10px] font-bold border border-red-100 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {law}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result?.advocate.validityAudit && (
                    <div className="mt-8 p-8 bg-white/40 rounded-[3rem] border border-pink-100">
                      <div className="flex items-center justify-between mb-6">
                        <h5 className={`text-xs font-black text-slate-800 uppercase tracking-widest ${isUrdu ? 'text-right' : ''}`}>
                          {isUrdu ? "قانونی حیثیت کی جانچ" : "Legal Validity Audit"}
                        </h5>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${result.advocate.validityAudit.isValid ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {result.advocate.validityAudit.isValid ? (isUrdu ? "درست" : "Valid") : (isUrdu ? "غیر واضح / مشکوک" : "Unclear / Invalid")}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {result.advocate.validityAudit.reasons.map((reason, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] shadow-sm shrink-0">{idx+1}</div>
                            <p className={`text-sm text-slate-600 ${isUrdu ? 'urdu-text text-right w-full' : ''}`}>{reason}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-pink-50 flex flex-wrap gap-2">
                        {result.advocate.validityAudit.legalCitations.map((cite, idx) => (
                          <span key={idx} className="text-[10px] font-medium text-slate-400 italic">[{cite}]</span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Empowerment Section expansion */}
                <section className="bg-white/60 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border-2 border-pink-50 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-pink-100/50 transition-all"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
                    <div>
                      <h4 className={`text-3xl font-black text-slate-900 mb-2 ${isUrdu ? 'text-right' : ''}`}>
                         {isUrdu ? "اختیارات اور حقوق" : "Empowerment & Rights"} {ICONS.shield}
                      </h4>
                      <p className={`text-sm text-slate-500 font-medium ${isUrdu ? 'text-right' : ''}`}>
                        {isUrdu ? "تعلیم، کام اور نقل مکانی کے حقوق" : "Your rights to education, work & movement"}
                      </p>
                    </div>
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] text-center group cursor-help relative">
                      <div className="text-2xl font-black">{result?.empowermentAudit.independenceScore}%</div>
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Independence Score</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 p-4 bg-slate-800 text-white text-[9px] font-medium leading-relaxed rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl border border-white/10">
                        {isUrdu ? "یہ سکور آپ کے فیصلوں کے اختیار (کام، تعلیم اور سماجی حقوق) کی شرح کو ظاہر کرتا ہے۔" : "Represents your agency over life choices: Includes right to work, education, and legal delegation of divorce rights."}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Education Right</p>
                      <p className={`text-lg text-slate-800 font-bold ${isUrdu ? 'urdu-text text-right' : ''}`}>{result?.empowermentAudit.educationRightStatus}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Right to Work</p>
                      <p className={`text-lg text-slate-800 font-bold ${isUrdu ? 'urdu-text text-right' : ''}`}>{result?.empowermentAudit.workRightStatus}</p>
                    </div>
                  </div>

                  {result?.empowermentAudit.mobilityGuidance && (
                    <div className="mt-10 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                      <h5 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ${isUrdu ? 'text-right' : ''}`}>
                        {isUrdu ? "نقل مکانی اور سفر کی آزادی" : "Guidance on Mobility & Freedom of Movement"}
                      </h5>
                      <p className={`text-base text-slate-700 leading-relaxed ${isUrdu ? 'urdu-text text-right' : ''}`}>
                        {result.empowermentAudit.mobilityGuidance}
                      </p>
                    </div>
                  )}

                  <div className="mt-10 pt-10 border-t border-pink-50">
                    <p className={`text-sm text-slate-600 italic leading-loose ${isUrdu ? 'urdu-text text-right' : ''}`}>
                      {result?.empowermentAudit.remedialAction}
                    </p>
                  </div>
                </section>

                {/* Sharia Expert */}
                <section className={`bg-[#FFE6EE] p-12 rounded-[4rem] shadow-sm border border-pink-100 ${isUrdu ? 'text-right' : ''}`}>
                  <h4 className={`text-3xl font-bold text-[#9d174d] mb-10 flex items-center gap-4 ${isUrdu ? 'justify-end' : ''}`}>
                     {isUrdu ? `شرعی تناظر (Sharia Context) ` : 'Sharia Context '} {ICONS.sharia}
                  </h4>
                  <p className={`text-lg text-slate-600 leading-loose mb-10 ${isUrdu ? 'urdu-text' : ''}`}>{result?.shariaExpert.context}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                     {result?.shariaExpert.principles.map((p, i) => (
                       <div key={i} className={`p-6 bg-white/40 rounded-3xl border border-pink-100 text-[#9d174d] text-sm font-medium ${isUrdu ? 'urdu-text text-right' : ''}`}>
                         {p}
                       </div>
                     ))}
                  </div>

                  {result?.shariaExpert.inheritanceSpecifics && (
                    <div className="bg-white/60 p-8 rounded-[3rem] border-2 border-emerald-100 space-y-6">
                      <h5 className={`text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                        {ICONS.shield} {isUrdu ? "وراثت میں خواتین کا حصہ (تعلیمی مقصد)" : "Female Inheritance Rights (Educational)"}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Wife's Share / بیوہ کا حصہ</p>
                          <p className={`text-sm text-slate-700 leading-relaxed ${isUrdu ? 'urdu-text' : ''}`}>{result.shariaExpert.inheritanceSpecifics.wife}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Daughter's Share / بیٹی کا حصہ</p>
                          <p className={`text-sm text-slate-700 leading-relaxed ${isUrdu ? 'urdu-text' : ''}`}>{result.shariaExpert.inheritanceSpecifics.daughter}</p>
                        </div>
                      </div>
                      <p className={`text-[10px] text-emerald-600 font-bold italic pt-4 border-t border-emerald-100 ${isUrdu ? 'text-right' : ''}`}>
                        {isUrdu ? "حوالہ:" : "Source:"} {result.shariaExpert.inheritanceSpecifics.shariaSource}
                      </p>
                    </div>
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-12">
                <div className="bg-[#9d174d] text-white p-12 rounded-[4rem] shadow-2xl text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                     <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="50" r="40" stroke="currentColor" fill="none" strokeWidth="1"/></svg>
                   </div>
                   <h5 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-12 flex items-center justify-center gap-2 group">
                     {isUrdu ? "حفاظتی سکور" : "Protection Score"}
                     <div className="relative inline-block">
                       {ICONS.info}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[8px] font-medium leading-relaxed rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-xl">
                         {isUrdu ? "یہ سکور آپ کی جسمانی، جذباتی اور قانونی حفاظت کی سطح کو ظاہر کرتا ہے۔" : "Measures your level of physical, emotional, and legal security based on the current situation."}
                       </div>
                     </div>
                   </h5>
                   <div className="text-7xl font-black mb-4">{result?.advocate.safetyScore}%</div>
                   <p className={`text-[10px] uppercase font-black px-4 py-2 rounded-full inline-block ${
                     result?.advocate.riskLevel === 'Low' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 
                     result?.advocate.riskLevel === 'Medium' ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'
                   }`}>
                     {result?.advocate.riskLevel} {isUrdu ? "خطرہ" : "Risk"}
                   </p>
                </div>

                {/* NGO Referral Bridge - Revenue Generation via Featured Partners */}
                <div className="bg-[#FFE6EE] p-10 rounded-[3.5rem] shadow-sm border-4 border-pink-200 animate-in zoom-in duration-500 delay-300">
                   <div className={`flex gap-4 items-center mb-8 ${isUrdu ? 'flex-row-reverse text-right' : ''}`}>
                     <div className="w-12 h-12 bg-pink-100 text-[#9d174d] rounded-2xl flex items-center justify-center text-xl font-black italic">!Ad</div>
                     <div>
                       <h5 className="text-[10px] font-black text-[#9d174d] uppercase tracking-widest">{isUrdu ? "تصدیق شدہ پیشہ ورانہ تعاون" : "Verified Professional Support"}</h5>
                       <p className="text-[8px] text-pink-400 font-bold">Priority Connection Activated</p>
                     </div>
                   </div>
                   <div className="space-y-6">
                      <div className={`bg-white/60 p-6 rounded-3xl border border-pink-100 group hover:border-[#9d174d] transition-all cursor-pointer ${isUrdu ? 'text-right' : ''}`}>
                         <div className="flex justify-between items-start mb-2">
                            <h6 className="font-black text-slate-800 text-sm">{result?.ngoBridge.recommendedNgo.name}</h6>
                            <span className="text-[8px] bg-[#9d174d] text-white px-2 py-0.5 rounded-full uppercase">Featured</span>
                         </div>
                         <p className="text-[10px] text-[#9d174d] font-bold mb-4">{result?.ngoBridge.recommendedNgo.contact}</p>
                         <p className={`text-xs text-slate-500 leading-relaxed italic ${isUrdu ? 'urdu-text' : ''}`}>"{result?.ngoBridge.recommendedNgo.reason}"</p>
                         <div className="mt-4 pt-4 border-t border-pink-100 flex items-center justify-center text-[8px] font-black uppercase text-pink-300 tracking-[0.2em]">Contact for Priority Callback</div>
                      </div>
                      <button className="w-full py-5 rounded-2xl bg-[#9d174d] text-white font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-pink-200 hover:scale-[1.03] active:scale-95 transition-all">
                        {isUrdu ? "ابھی رابطہ کریں" : "Contact Now"}
                      </button>
                   </div>
                </div>

                {/* Promotional Advertisement */}
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative shadow-xl">
                   <div className="relative z-10">
                     <p className="text-[8px] font-black text-pink-400 uppercase tracking-widest mb-1 italic">Resource Promotion</p>
                     <h4 className="text-sm font-bold">Free Legal Aid Workshop</h4>
                     <p className="text-[9px] text-slate-400 mb-4 leading-relaxed">Join experts next Sunday at Islamabad Community Center.</p>
                     <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-[8px] uppercase">Register Free</button>
                   </div>
                   <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 blur-2xl rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {['guardian', 'result'].includes(view) && (
        <SOSButton onClick={triggerSOS} isUrdu={isUrdu} />
      )}

      {view !== 'landing' && (
        <footer className="py-24 border-t border-pink-100 bg-white/20">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 opacity-30">
             <div className="text-xs font-black tracking-widest text-[#9d174d]">ZEENAT AI | 360 GUARDIAN ENGINE</div>
             <p className="text-[9px] text-slate-400 max-w-sm text-center md:text-right italic leading-relaxed">
               {isUrdu ? TRANSLATIONS.disclaimer : "LEGAL NOTE: This is an informational system, not professional legal advice."}
             </p>
          </div>
        </footer>
      )}
    </div>
  );
};

const SOSButton: React.FC<{ onClick: () => void, isUrdu: boolean }> = ({ onClick, isUrdu }) => (
  <button 
    onClick={onClick}
    className="fixed bottom-10 right-10 z-[80] group flex items-center gap-4 flex-row-reverse"
  >
    <div className={`bg-white px-6 py-3 rounded-2xl shadow-xl border border-pink-50 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 ${isUrdu ? 'urdu-text' : ''}`}>
      <p className="text-xs font-black text-[#9d174d] uppercase tracking-widest">
        {isUrdu ? "فوری مدد (Emergency SOS)" : "Emergency SOS"}
      </p>
    </div>
    <div className="w-20 h-20 bg-[#9d174d] rounded-full flex items-center justify-center text-white text-3xl shadow-[0_20px_50px_rgba(157,23,77,0.4)] hover:scale-110 active:scale-95 transition-all">
      {ICONS.shield}
    </div>
  </button>
);

export default App;
