
import React, { useState } from 'react';
import { NIKKAH_COLUMNS } from '../constants';
import { Language } from '../types';

interface NikkahNamaMapProps {
  onHotspotClick: (id: number) => void;
  language: Language;
}

const NikkahNamaMap: React.FC<NikkahNamaMapProps> = ({ onHotspotClick, language }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const isUrdu = language === Language.UR;

  const page1Hotspots = [
    { id: 1, top: '15%', left: '50%' },
    { id: 2, top: '23%', left: '50%' },
    { id: 3, top: '31%', left: '50%' },
    { id: 4, top: '39%', left: '50%' },
    { id: 5, top: '47%', left: '50%' },
    { id: 6, top: '55%', left: '50%' },
    { id: 13, top: '63%', left: '50%' },
    { id: 14, top: '71%', left: '50%' },
    { id: 15, top: '79%', left: '50%' },
  ];

  const page2Hotspots = [
    { id: 16, top: '15%', left: '50%' },
    { id: 17, top: '23%', left: '50%', priority: true },
    { id: 18, top: '31%', left: '50%' },
    { id: 19, top: '39%', left: '50%' },
    { id: 20, top: '47%', left: '50%' },
    { id: 21, top: '55%', left: '50%' },
    { id: 22, top: '63%', left: '50%' },
    { id: 24, top: '71%', left: '50%' },
    { id: 25, top: '79%', left: '50%' },
  ];

  const renderHotspots = (spots: { id: number; top: string; left: string; priority?: boolean }[]) => {
    return spots.map((spot) => (
      <div 
        key={spot.id}
        className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2"
        style={{ top: spot.top, left: spot.left }}
      >
        <div 
          className="relative flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setHovered(spot.id)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onHotspotClick(spot.id)}
        >
          {/* Active Glow for Columns */}
          <div className={`absolute w-10 h-10 rounded-full transition-all duration-300 ${
            hovered === spot.id ? 'bg-[#9d174d]/10 scale-125' : 'scale-0'
          }`}></div>
          
          {/* Priority Ping for Column 17 */}
          {spot.priority && (
            <div className="absolute w-10 h-10 rounded-full bg-[#f472b6]/20 animate-ping"></div>
          )}
          
          <button className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative z-10 ${
            spot.priority ? 'bg-[#f472b6]' : 'bg-[#9d174d]'
          } ${hovered === spot.id ? 'scale-110' : ''}`}>
            <span className="text-white text-[10px] font-bold">{spot.id}</span>
          </button>
          
          {hovered === spot.id && (
            <div 
              className={`absolute left-1/2 -translate-x-1/2 bg-[#FFE6EE] p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-pink-100 w-64 z-[100] animate-in fade-in zoom-in duration-200 ${
                parseInt(spot.top) < 40 ? 'top-12' : 'bottom-12'
              }`}
            >
              <div className="flex flex-col gap-3">
                 <div className={`flex items-center justify-between border-b border-pink-100 pb-2 mb-1 ${isUrdu ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] font-black text-pink-300 uppercase tracking-widest">Col {spot.id}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${spot.priority ? 'bg-[#f472b6]' : 'bg-[#9d174d]'} text-white`}>{spot.id}</span>
                 </div>
                 
                 <div className={isUrdu ? 'text-right' : 'text-left'}>
                    <h4 className={`text-lg font-bold text-[#9d174d] leading-tight mb-2 ${isUrdu ? 'urdu-text' : ''}`}>
                      {isUrdu ? NIKKAH_COLUMNS[spot.id]?.urdu : NIKKAH_COLUMNS[spot.id]?.label}
                    </h4>
                    <p className={`text-sm text-slate-600 leading-relaxed bg-white/50 p-4 rounded-2xl border border-pink-100 ${isUrdu ? 'urdu-text' : ''}`}>
                      {isUrdu ? NIKKAH_COLUMNS[spot.id]?.urduDesc : NIKKAH_COLUMNS[spot.id]?.desc}
                    </p>
                 </div>
                 
                 <div className="mt-2 text-center">
                    <div className={`${spot.priority ? 'bg-[#f472b6]' : 'bg-[#9d174d]'} text-white py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-sm`}>
                      {isUrdu ? "تجزیہ کے لیے ٹیپ کریں" : "Tap for Analysis"}
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderBackgroundLines = () => (
    <div className="relative z-10 w-full px-8 mt-12 space-y-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-1/4 h-3 bg-pink-50 rounded-sm"></div>
          <div className="w-3/4 h-3 bg-pink-50 rounded-sm"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#FFE6EE] p-8 md:p-12 rounded-[3rem] shadow-inner flex justify-center items-center">
      <div className="flex flex-row gap-8 items-start">
        {/* PAGE 1 */}
        <div className="relative w-[280px] shrink-0">
          <div className="bg-[#FFE6EE] rounded-[2rem] shadow-2xl aspect-[1/1.4] relative p-8 border border-pink-100">
            <div className="text-center mb-8 border-b border-pink-50 pb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-300">Page 1: 1-15</h4>
            </div>
            {renderBackgroundLines()}
            <div className="absolute inset-0 z-40">{renderHotspots(page1Hotspots)}</div>
          </div>
        </div>

        {/* PAGE 2 */}
        <div className="relative w-[280px] shrink-0">
          <div className="bg-[#FFE6EE] rounded-[2rem] shadow-2xl aspect-[1/1.4] relative p-8 border border-pink-100">
            <div className="text-center mb-8 border-b border-pink-50 pb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-300">Page 2: 16-25</h4>
            </div>
            {renderBackgroundLines()}
            <div className="absolute inset-0 z-40">{renderHotspots(page2Hotspots)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NikkahNamaMap;
