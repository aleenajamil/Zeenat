
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';

interface VoiceInputProps {
  onTranscript?: (text: string) => void;
  language?: Language;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, language = Language.UR }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === Language.UR ? 'ur-PK' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onTranscript) onTranscript(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onTranscript, language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        // Update language just before starting to ensure sync
        recognitionRef.current.lang = language === Language.UR ? 'ur-PK' : 'en-US';
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    }
  };

  const isUrdu = language === Language.UR;

  return (
    <div className="relative group">
      <button 
        onClick={toggleListening}
        title={isUrdu ? "بولیے (Speak)" : "Speak"}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border-4 border-[#FFE6EE] ${
          isListening ? 'bg-red-500 scale-110 animate-pulse' : 'bg-[#9d174d] hover:bg-[#831440]'
        }`}
      >
        <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-white text-xl`}></i>
      </button>
      
      {isListening && (
        <div className="absolute bottom-20 right-0 bg-[#FFE6EE] p-4 rounded-3xl shadow-2xl border border-pink-200 w-64 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex-1 h-8 bg-pink-200 rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}}></div>
            ))}
          </div>
          <p className={`text-xs font-bold text-[#9d174d] text-center ${isUrdu ? 'urdu-text' : ''}`}>
            {isUrdu ? "بولنا شروع کریں..." : "Start speaking..."}
          </p>
          <p className="text-[8px] text-pink-400 text-center mt-2 uppercase tracking-widest font-black">
            {isUrdu ? "Listening for Urdu" : "Listening for English"}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
