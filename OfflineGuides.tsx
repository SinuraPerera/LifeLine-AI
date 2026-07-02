import React, { useState, useEffect, useRef } from 'react';
import { emergencyGuides } from './emergencyGuides';
import { Language } from './types';
import { 
  Heart, 
  Flame, 
  Droplet, 
  Activity, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Play, 
  Square,
  BookOpen
} from 'lucide-react';

interface OfflineGuidesProps {
  language: Language;
}

export default function OfflineGuides({ language }: OfflineGuidesProps) {
  const [selectedGuideId, setSelectedGuideId] = useState<string>('cpr');
  const [metronomeOn, setMetronomeOn] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [metronomeVisualPulse, setMetronomeVisualPulse] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Map icon names to Lucide elements
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Droplet': return <Droplet className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const selectedGuide = emergencyGuides.find(g => g.id === selectedGuideId) || emergencyGuides[0];

  // CPR chest compression metronome audio generator using lightweight browser synthesis
  const playClickSound = () => {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle'; // Pure clean diagnostic sound
      osc.frequency.setValueAtTime(880, ctx.currentTime); // high A pitch, highly audible
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1); // Quick decay

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error('Audio synthesizer failed to click:', e);
    }
  };

  // Metronome effect loop
  useEffect(() => {
    if (metronomeOn && selectedGuide.metronomeBpm) {
      const intervalMs = (60 / selectedGuide.metronomeBpm) * 1000;
      
      metronomeIntervalRef.current = setInterval(() => {
        // Visual flash trigger
        setMetronomeVisualPulse(true);
        playClickSound();
        
        setTimeout(() => {
          setMetronomeVisualPulse(false);
        }, 150);
      }, intervalMs);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
      setMetronomeVisualPulse(false);
    }

    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    };
  }, [metronomeOn, selectedGuideId, soundOn]);

  const toggleMetronome = () => {
    setMetronomeOn(!metronomeOn);
  };

  const translations = {
    title: { en: 'Offline First Aid Handbook', si: 'නොබැඳි (Offline) ප්‍රථමාධාර අත්පොත', ta: 'ஆஃப்லைன் முதலுதவி கையேடு' },
    desc: { en: 'Instant step-by-step guidance. No internet connection required.', si: 'ක්ෂණික පියවරෙන් පියවර උපදෙස්. අන්තර්ජාල සම්බන්ධතාවක් අවශ්‍ය නොවේ.', ta: 'உடனடி படிப்படியான வழிகாட்டுதல். இணைய இணைப்பு தேவையில்லை.' },
    warnings: { en: 'CRITICAL WARNINGS', si: 'අත්‍යවශ්‍ය අනතුරු ඇඟවීම්', ta: 'முக்கியமான எச்சரிக்கைகள்' },
    metronomeTitle: { en: 'Interactive CPR Compressions Pacer', si: 'ක්‍රියාකාරී CPR තෙරපුම් පාලකය', ta: 'ஊடாடும் சிபிஆர் அழுத்த வேகப்படுத்தி' },
    metronomeDesc: { en: 'Compress chest to this beat (110 BPM). Push 2 inches deep.', si: 'පපුව මෙම රිද්මයට තෙරපන්න (මිනිත්තුවකට 110 වාරයක්). අඟල් 2ක් ගැඹුරට තද කරන්න.', ta: 'இந்த வேகத்திற்கு நெஞ்சை அழுத்தவும் (110 BPM). 2 அங்குல ஆழத்தில் அழுத்தவும்.' },
    startPacer: { en: 'Start CPR Pacer', si: 'පාලකය ක්‍රියාත්මක කරන්න', ta: 'வேகப்படுத்தியைத் தொடங்கு' },
    stopPacer: { en: 'Stop CPR Pacer', si: 'පාලකය නතර කරන්න', ta: 'வேகப்படுத்தியை நிறுத்து' },
    sound: { en: 'Sound', si: 'ශබ්දය', ta: 'ஒலி' },
    noMetronome: { en: 'This emergency guide does not require physical pacing.', si: 'මෙම හදිසි පියවර සඳහා රිද්ම පාලනයක් අවශ්‍ය නොවේ.', ta: 'இந்த அவசர வழிகாட்டிக்கு வேகக் கட்டுப்பாடு தேவையில்லை.' }
  };

  return (
    <div id="offline-guides-container" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm transition-colors duration-200">
      <div className="mb-4">
        <h2 className="text-lg font-sans font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-500" />
          {translations.title[language]}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {translations.desc[language]}
        </p>
      </div>

      {/* Guide selector pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {emergencyGuides.map((guide) => (
          <button
            key={guide.id}
            id={`guide-btn-${guide.id}`}
            onClick={() => {
              setSelectedGuideId(guide.id);
              setMetronomeOn(false); // Stop metronome on change
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selectedGuideId === guide.id
                ? 'bg-teal-500 text-slate-950 dark:bg-teal-950/80 dark:text-teal-400 dark:border-teal-900/60 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {renderIcon(guide.icon)}
            <span>{guide.title[language]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Steps */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {selectedGuide.title[language]}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {selectedGuide.description[language]}
            </p>

            {/* Steps Timeline */}
            <div className="space-y-3.5 relative pl-4 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200 dark:before:bg-slate-800">
              {selectedGuide.steps[language].map((step, index) => (
                <div key={index} className="relative flex gap-3 items-start">
                  <span className="absolute -left-4 w-4 h-4 bg-teal-500 text-slate-950 font-mono font-bold text-[9px] rounded-full flex items-center justify-center border border-white dark:border-slate-950 shadow-sm mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: CPR Metronome and Warnings */}
        <div className="lg:col-span-4 space-y-4">
          {/* Metronome Control Panel */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40">
            {selectedGuide.metronomeBpm ? (
              <div className="flex flex-col items-center text-center">
                <span className="bg-teal-500/10 text-teal-500 text-[10px] px-2 py-0.5 rounded-full font-mono border border-teal-500/20 font-bold mb-3 uppercase tracking-wide">
                  LIFE-SAVER PACE CONTROL
                </span>
                
                {/* Pulsing Visual Indicator */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                  {/* Glowing background circles */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-100 ease-out ${
                    metronomeVisualPulse 
                      ? 'bg-teal-500/30 scale-110 shadow-[0_0_25px_rgba(20,184,166,0.4)]' 
                      : 'bg-teal-500/5 scale-100'
                  }`} />
                  
                  {/* Central Button Core */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-100 ${
                    metronomeVisualPulse
                      ? 'bg-teal-400 text-slate-950'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    <Heart className={`w-8 h-8 ${metronomeOn ? 'animate-pulse' : ''}`} />
                  </div>
                </div>

                <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200">
                  {translations.metronomeTitle[language]}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px] mt-1 mb-4">
                  {translations.metronomeDesc[language]}
                </p>

                {/* Controls */}
                <div className="flex items-center gap-2 w-full">
                  <button
                    id="metronome-toggle-btn"
                    onClick={toggleMetronome}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      metronomeOn
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-teal-500 hover:bg-teal-600 text-slate-950'
                    }`}
                  >
                    {metronomeOn ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>{translations.stopPacer[language]}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{translations.startPacer[language]}</span>
                      </>
                    )}
                  </button>

                  <button
                    id="sound-toggle-btn"
                    onClick={() => setSoundOn(!soundOn)}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-slate-200/50 dark:border-slate-700/50"
                    title={translations.sound[language]}
                  >
                    {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Heart className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {translations.noMetronome[language]}
                </p>
              </div>
            )}
          </div>

          {/* Warnings Panel */}
          <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/30 p-4 rounded-xl">
            <h4 className="text-xs font-sans font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              {translations.warnings[language]}
            </h4>
            <ul className="space-y-1.5 list-disc pl-4">
              {selectedGuide.warnings[language].map((warning, index) => (
                <li key={index} className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
