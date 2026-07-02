import React, { useState } from 'react';
import { Hospital, Language } from './types';
import { getHospitalsNear } from './hospitals';
import { 
  MapPin, 
  Phone, 
  Check, 
  AlertCircle, 
  ShieldAlert, 
  Navigation, 
  Hospital as HospIcon,
  Compass
} from 'lucide-react';

interface HospitalFinderProps {
  language: Language;
  userLatitude: number | null;
  userLongitude: number | null;
}

export default function HospitalFinder({ language, userLatitude, userLongitude }: HospitalFinderProps) {
  const [filter, setFilter] = useState<'all' | 'trauma' | 'icu'>('all');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  // Dynamic coordinates fallback for beautiful display
  const activeLat = userLatitude || 6.9197;
  const activeLng = userLongitude || 79.8681;

  // Retrieve nearby hospitals
  const hospitals = getHospitalsNear(userLatitude, userLongitude);

  // Filter hospitals based on parameters
  const filteredHospitals = hospitals.filter(h => {
    if (filter === 'trauma') return h.hasTraumaCenter;
    if (filter === 'icu') return h.hasICU;
    return true;
  });

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || filteredHospitals[0] || hospitals[0];

  const translations = {
    title: { en: 'Hospital Locator & Emergency Beds', si: 'රෝහල් සෙවුම සහ ඇඳන් තොරතුරු', ta: 'மருத்துவமனை இருப்பிடம் மற்றும் அவசர படுக்கைகள்' },
    desc: { en: 'Real-time emergency centers and diagnostic radar relative to your position.', si: 'ඔබ සිටින ස්ථානයට සාපේක්ෂව හදිසි ප්‍රතිකාර මධ්‍යස්ථාන සහ රේඩාර් සිතියම.', ta: 'உங்கள் நிலைக்கு ஒப்பீட்டளவில் அவசரகால மையங்கள் மற்றும் கண்டறியும் ரேடார்.' },
    beds: { en: 'Beds Available', si: 'ඇඳන් ඇත', ta: 'படுக்கைகள் உள்ளன' },
    call: { en: 'Emergency Call', si: 'හදිසි ඇමතුම', ta: 'அவசர அழைப்பு' },
    navigate: { en: 'Navigate', si: 'මාර්ගය සොයන්න', ta: 'வழிசெலுத்து' },
    trauma: { en: 'Trauma Center', si: 'කම්පන මධ්‍යස්ථානය', ta: 'அதிர்ச்சி மையம்' },
    icu: { en: 'ICU Unit', si: 'දැඩි සත්කාර ඒකකය', ta: 'தீவிர சிகிச்சை பிரிவு' },
    filterAll: { en: 'All Centers', si: 'සියල්ල', ta: 'அனைத்து மையங்கள்' },
    filterTrauma: { en: 'Trauma Units', si: 'කම්පන අංශ', ta: 'அதிர்ச்சி அலகுகள்' },
    filterICU: { en: 'ICU Beds', si: 'ICU ඇඳන්', ta: 'ICU படுக்கைகள்' },
    facilities: { en: 'Specialist Units', si: 'විශේෂඥ වෛද්‍ය අංශයන්', ta: 'சிறப்பு அலகுகள்' },
    bearing: { en: 'Diagnostic Sonar Radar', si: 'හදිසි රේඩාර් සිතියම', ta: 'கண்டறியும் சோனார் ரேடார்' }
  };

  return (
    <div id="hospital-finder-container" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm transition-colors duration-200">
      <div className="mb-4">
        <h2 className="text-lg font-sans font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <HospIcon className="w-5 h-5 text-teal-500" />
          {translations.title[language]}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {translations.desc[language]}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800/60 max-w-sm">
        {(['all', 'trauma', 'icu'] as const).map((mode) => (
          <button
            key={mode}
            id={`filter-hosp-${mode}`}
            onClick={() => setFilter(mode)}
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === mode
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {mode === 'all' && translations.filterAll[language]}
            {mode === 'trauma' && translations.filterTrauma[language]}
            {mode === 'icu' && translations.filterICU[language]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Hospital List */}
        <div className="lg:col-span-4 max-h-[380px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              id={`hosp-card-${hosp.id}`}
              onClick={() => setSelectedHospitalId(hosp.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedHospital?.id === hosp.id
                  ? 'bg-teal-500/10 dark:bg-teal-500/5 border-teal-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight pr-2">
                  {hosp.name[language]}
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                  {hosp.distanceKm} km
                </span>
              </div>
              
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[180px]">{hosp.address[language]}</span>
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                  hosp.bedsAvailable > 20 
                    ? 'bg-teal-500/10 text-teal-500 border border-teal-500/10' 
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                }`}>
                  {hosp.bedsAvailable} {translations.beds[language]}
                </span>
                {hosp.hasTraumaCenter && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/10">
                    Trauma
                  </span>
                )}
                {hosp.hasICU && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/10">
                    ICU
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Center Side: Futuristic SVG Sonar Radar */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-950 border border-slate-900 rounded-xl p-4 relative overflow-hidden min-h-[300px]">
          {/* Sonar Title */}
          <div className="absolute top-3 left-3 flex items-center gap-1 text-[9px] text-teal-400 font-mono font-bold tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-teal-400" />
            <span>{translations.bearing[language].toUpperCase()}</span>
          </div>

          <div className="absolute top-3 right-3 text-[9px] text-slate-500 font-mono">
            REF: {activeLat.toFixed(3)}N, {activeLng.toFixed(3)}E
          </div>

          {/* SVG Radar */}
          <div className="relative w-56 h-56 mt-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Sonar Concentric Rings */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="#14b8a6" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#14b8a6" strokeWidth="0.5" strokeOpacity="0.3" />
              <circle cx="100" cy="100" r="45" fill="none" stroke="#14b8a6" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="2 2" />
              <circle cx="100" cy="100" r="20" fill="none" stroke="#14b8a6" strokeWidth="0.5" strokeOpacity="0.4" />
              
              {/* Radar Grid Crosshairs */}
              <line x1="5" y1="100" x2="195" y2="100" stroke="#14b8a6" strokeWidth="0.5" strokeOpacity="0.15" />
              <line x1="100" y1="5" x2="100" y2="195" stroke="#14b8a6" strokeWidth="0.5" strokeOpacity="0.15" />
              
              {/* Rotating Sweep Line */}
              <g className="origin-[100px_100px] animate-[spin_5s_linear_infinite]">
                <line x1="100" y1="100" x2="195" y2="100" stroke="url(#radar-sweep)" strokeWidth="1.5" />
              </g>

              <defs>
                <linearGradient id="radar-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Plot user central pulse */}
              <circle cx="100" cy="100" r="3.5" fill="#ef4444" className="animate-pulse" />
              
              {/* Plot Hospital Targets relative to coordinates */}
              {filteredHospitals.map((h, i) => {
                // Calculate relative position based on mock vector
                const angle = (i * (360 / filteredHospitals.length)) * (Math.PI / 180);
                const maxRange = Math.max(...filteredHospitals.map(ho => ho.distanceKm));
                const radius = 25 + (h.distanceKm / (maxRange || 1)) * 65; // Scaled radius
                const cx = 100 + Math.cos(angle) * radius;
                const cy = 100 + Math.sin(angle) * radius;

                return (
                  <g key={h.id}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill={selectedHospital?.id === h.id ? '#14b8a6' : '#ef4444'}
                      stroke="#0f172a"
                      strokeWidth="1"
                      className="cursor-pointer hover:scale-125 transition-transform animate-ping opacity-30"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill={selectedHospital?.id === h.id ? '#14b8a6' : '#ef4444'}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                      onClick={() => setSelectedHospitalId(h.id)}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="mt-2 text-[10px] text-slate-400 text-center font-mono leading-none">
            {selectedHospital ? (
              <span className="text-teal-400 font-bold">{selectedHospital.name[language]} Selected</span>
            ) : (
              <span>Select radar marker to target unit</span>
            )}
          </div>
        </div>

        {/* Right Side: Detailed View */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 flex flex-col justify-between">
          {selectedHospital ? (
            <div className="space-y-4">
              <div>
                <span className="bg-red-500/10 text-red-500 text-[9px] px-2 py-0.5 rounded-full font-mono border border-red-500/20 font-bold uppercase tracking-wider">
                  SELECTED EMERGENCY FACILITY
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {selectedHospital.name[language]}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {selectedHospital.address[language]}
                </p>
              </div>

              {/* Hospital Key Specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/40 dark:border-slate-800 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400">Trauma Level-1</span>
                  <span className="font-semibold text-slate-800 dark:text-white mt-0.5 flex items-center gap-1">
                    {selectedHospital.hasTraumaCenter ? (
                      <Check className="w-3.5 h-3.5 text-teal-500" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    {translations.trauma[language]}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/40 dark:border-slate-800 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400">ICU Status</span>
                  <span className="font-semibold text-slate-800 dark:text-white mt-0.5 flex items-center gap-1">
                    {selectedHospital.hasICU ? (
                      <Check className="w-3.5 h-3.5 text-teal-500" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    {translations.icu[language]}
                  </span>
                </div>
              </div>

              {/* Facility details list */}
              <div>
                <h4 className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {translations.facilities[language]}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedHospital.facilities[language].map((f, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-200/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Call Action Bar */}
              <div className="flex gap-2 pt-2">
                <a
                  id={`call-hosp-${selectedHospital.id}`}
                  href={`tel:${selectedHospital.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>{translations.call[language]}</span>
                </a>

                <button
                  id={`nav-hosp-${selectedHospital.id}`}
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${selectedHospital.lat},${selectedHospital.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200/50 dark:border-slate-700/50"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{translations.navigate[language]}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ShieldAlert className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2 animate-bounce" />
              <p className="text-xs text-slate-400">Select a hospital on the map or list to target response dispatchers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
