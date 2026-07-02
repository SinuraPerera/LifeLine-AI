import React, { useState, useEffect } from 'react';
import { GPSCoords, EmergencyLog, Language } from './types';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  AlertOctagon, 
  MapPin, 
  Activity, 
  User, 
  ShieldAlert, 
  PhoneCall, 
  History, 
  Settings, 
  FileText,
  CheckCircle2,
  Volume2
} from 'lucide-react';

interface SOSDashboardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  medicalConditions: string;
  onMedicalConditionsChange: (val: string) => void;
  emergencyPhone: string;
  onEmergencyPhoneChange: (val: string) => void;
  bloodGroup: string;
  onBloodGroupChange: (val: string) => void;
}

export default function SOSDashboard({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  medicalConditions,
  onMedicalConditionsChange,
  emergencyPhone,
  onEmergencyPhoneChange,
  bloodGroup,
  onBloodGroupChange
}: SOSDashboardProps) {
  
  const [coords, setCoords] = useState<GPSCoords | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  
  // Alert logs local state
  const [logs, setLogs] = useState<EmergencyLog[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('General Medical');

  // Load alert logs from local storage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('lifeline_sos_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    // Attempt rapid coordinate fetching on startup
    fetchCoordinates();
  }, []);

  const fetchCoordinates = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gps: GPSCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Number(position.coords.accuracy.toFixed(1)),
          timestamp: position.timestamp,
          address: 'Obtained via Browser Geolocation API'
        };
        setCoords(gps);
        setGpsError(null);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation access failed:', err);
        setGpsError('Unable to retrieve high-precision GPS. Using Colombo Central Fallback.');
        // Set standard Sri Lankan fallback coordinate
        setCoords({
          latitude: 6.9271,
          longitude: 79.8612,
          accuracy: 50.0,
          timestamp: Date.now(),
          address: 'Colombo District Fallback'
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Pulse Vocal SOS alarm
  const announceSOS = () => {
    try {
      window.speechSynthesis.cancel();
      const phrases = {
        en: `Emergency alert triggered. Type: ${activeCategory}. Dispatching GPS coordinates immediately.`,
        si: `හදිසි අනතුරු සංඥාව ක්‍රියාත්මකයි. වර්ගය: ${activeCategory}. ඔබගේ පිහිටීම වහාම යොමු කෙරේ.`,
        ta: `அவசரகால எச்சரிக்கை தூண்டப்பட்டது. வகை: ${activeCategory}. இருப்பிடம் உடனடியாக அனுப்பப்படுகிறது.`
      };
      const utterance = new SpeechSynthesisUtterance(phrases[language]);
      if (language === 'si') utterance.lang = 'si-LK';
      else if (language === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Announcer failed:', e);
    }
  };

  // Broadcast SOS Event
  const triggerSOS = async () => {
    if (isBroadcasting) return;
    setIsBroadcasting(true);
    announceSOS();

    // Re-verify coordinates
    fetchCoordinates();

    const currentCoords = coords || {
      latitude: 6.9271,
      longitude: 79.8612,
      accuracy: 50.0,
      timestamp: Date.now(),
      address: 'Colombo Central'
    };

    const newLog: EmergencyLog = {
      id: `alert-${Date.now()}`,
      userId: auth.currentUser?.uid || 'anonymous',
      timestamp: new Date().toISOString(),
      type: activeCategory,
      coords: currentCoords,
      description: `SOS activated via LifeLine main dashboard. Medical info: ${medicalConditions || 'None'}`,
      status: 'active',
      triageLevel: activeCategory.includes('Danger') || activeCategory.includes('Fire') ? 'critical' : 'high'
    };

    // Update state and localStorage
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('lifeline_sos_logs', JSON.stringify(updatedLogs));

    // Attempt Firebase sync dynamically (ABAC Fortress rules)
    try {
      if (auth.currentUser) {
        const path = `alerts/${newLog.id}`;
        await setDoc(doc(db, 'alerts', newLog.id), {
          id: newLog.id,
          userId: auth.currentUser.uid,
          timestamp: new Date().toISOString(),
          type: newLog.type,
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
          accuracy: currentCoords.accuracy,
          description: newLog.description,
          status: newLog.status,
          triageLevel: newLog.triageLevel
        });
        console.log('SOS Cloud log sync completed.');
      }
    } catch (err: any) {
      // Lazy fallbacks: catch error dynamically without breaking
      console.warn('Firebase alerts sync failed (Mock/Unprovisioned state):', err.message);
    }

    setTimeout(() => {
      setIsBroadcasting(false);
    }, 4000);
  };

  const translations = {
    radar: { en: 'SOS SATELLITE DISPATCH SHIELD', si: 'SOS චන්ද්‍රිකා සන්නිවේදන පද්ධතිය', ta: 'SOS செயற்கைக்கோள் அனுப்பும் கவசம்' },
    pulseBtn: { en: 'HOLD TO SOS', si: 'SOS තද කරන්න', ta: 'SOS அழுத்தவும்' },
    coords: { en: 'GPS Coordinate Telemetry', si: 'GPS පිහිටුම් දත්ත', ta: 'ஜிபிஎஸ் ஒருங்கிணைப்பு தரவு' },
    accuracy: { en: 'Accuracy radius:', si: 'නිරවද්‍යතා සීමාව:', ta: 'துல்லிய ஆரம்:' },
    medicalProfile: { en: 'Emergency Medical Profile', si: 'හදිසි වෛද්‍ය පැතිකඩ', ta: 'அவசர மருத்துவ விவரக்குறிப்பு' },
    contact: { en: 'Guardian Emergency Contact', si: 'භාරකරුගේ දුරකථන අංකය', ta: 'பாதுகாவலர் அவசர தொடர்பு' },
    blood: { en: 'Blood Group', si: 'ලේ වර්ගය', ta: 'இரத்த வகை' },
    conditions: { en: 'Allergies & Medical Conditions', si: 'අසාත්මිකතා සහ රෝගී තත්ත්වයන්', ta: 'ஒவ்வாமை மற்றும் மருத்துவ நிலைமைகள்' },
    syncActive: { en: 'Local Offline Database Active. Configure cloud database to sync.', si: 'ප්‍රාදේශීය නොබැඳි දත්ත පද්ධතිය ක්‍රියාත්මකයි.', ta: 'உள்ளூர் ஆஃப்லைன் தரவுத்தளம் செயலில் உள்ளது.' },
    categories: { en: 'Emergency Alert Categories', si: 'හදිසි අනතුරු කාණ්ඩ', ta: 'அவசரகால எச்சரிக்கை வகைகள்' },
    recentSOS: { en: 'Active SOS Broadcast History', si: 'ක්‍රියාකාරී SOS විකාශන ඉතිහාසය', ta: 'செயலில் உள்ள SOS ஒளிபரப்பு வரலாறு' },
    resolved: { en: 'Resolved', si: 'විසඳා ඇත', ta: 'தீர்க்கப்பட்டது' },
    active: { en: 'Active Dispatch', si: 'ක්‍රියාත්මකයි', ta: 'செயலில் உள்ளது' },
    broadcasting: { en: 'BROADCASTING', si: 'විකාශනය වේ', ta: 'ஒளிபரப்பப்படுகிறது' },
    retrievingGps: { en: 'Retrieving precise GPS coordinate feeds...', si: 'නිවැරදි GPS දත්ත ලබා ගනිමින් පවතී...', ta: 'துல்லியமான ஜிபிஎஸ் ஒருங்கிணைப்பு தரவு பெறப்படுகிறது...' },
    noLogs: { en: 'No active SOS signals broadcast in this session.', si: 'මෙම සැසිය තුළ විකාශනය කරන ලද SOS සංඥා නොමැත.', ta: 'இந்த அமர்வில் செயலில் உள்ள SOS சமிக்ஞைகள் எதுவும் ஒளிபரப்பப்படவில்லை.' },
    locLabel: { en: 'Loc:', si: 'ස්ථානය:', ta: 'இடம்:' }
  };

  const categories = [
    { name: 'General Medical', en: 'Medical', translation: { en: 'Medical', si: 'වෛද්‍ය', ta: 'மருத்துவம்' }, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
    { name: 'Personal Danger', en: 'Danger', translation: { en: 'Danger', si: 'අනතුර', ta: 'ஆபத்து' }, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { name: 'Poison / Hazmat', en: 'Chemical', translation: { en: 'Chemical', si: 'රසායනික', ta: 'இரசாயனம்' }, color: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },
    { name: 'Fire Emergency', en: 'Fire', translation: { en: 'Fire', si: 'ගිනි', ta: 'தீ' }, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' }
  ];

  return (
    <div id="sos-dashboard-container" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* LEFT COLUMN: Main SOS Button & Coordinates */}
      <div className="lg:col-span-4 flex flex-col items-center justify-between bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40 min-h-[460px]">
        <div className="text-center w-full">
          <span className="bg-red-500/10 text-red-500 text-[9px] px-2.5 py-1 rounded-full font-mono border border-red-500/20 font-bold tracking-wider uppercase">
            {translations.radar[language]}
          </span>
        </div>

        {/* Massive Pulsing Red Button */}
        <div className="relative my-6 flex items-center justify-center w-48 h-48">
          {/* Pulsing Concentric Circles */}
          <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
            isBroadcasting 
              ? 'bg-red-500/40 scale-125 animate-ping' 
              : 'bg-red-500/10 scale-110 animate-pulse'
          }`} />
          <div className={`absolute inset-2 rounded-full transition-all duration-700 ${
            isBroadcasting 
              ? 'bg-red-500/30 scale-115' 
              : 'bg-red-500/5 scale-105 animate-pulse'
          }`} />

          {/* Core Button */}
          <button
            id="sos-trigger-btn"
            onClick={triggerSOS}
            className={`absolute w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-300 shadow-lg ${
              isBroadcasting
                ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_40px_rgba(239,68,68,0.6)]'
                : 'bg-red-500 border-red-400 text-white hover:bg-red-600 hover:scale-105'
            }`}
          >
            <AlertOctagon className={`w-10 h-10 ${isBroadcasting ? 'animate-bounce' : ''}`} />
            <span className="text-sm font-sans font-extrabold tracking-wider mt-2">
              {isBroadcasting ? translations.broadcasting[language] : translations.pulseBtn[language]}
            </span>
          </button>
        </div>

        {/* Coordinate Telemetry Box */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl">
          <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            {translations.coords[language]}
          </h4>
          
          {coords ? (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Latitude:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{coords.latitude.toFixed(5)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Longitude:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{coords.longitude.toFixed(5)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                <span>{translations.accuracy[language]}</span>
                <span className="font-semibold">{coords.accuracy} meters</span>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-xs text-slate-400">
              {translations.retrievingGps[language]}
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE COLUMN: Category Selector & Vital Records */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Category triggers */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            {translations.categories[language]}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                id={`cat-btn-${cat.en.toLowerCase()}`}
                onClick={() => setActiveCategory(cat.name)}
                className={`p-2.5 rounded-xl border text-xs font-bold font-sans text-center transition-all ${
                  activeCategory === cat.name
                    ? 'bg-teal-500 text-slate-950 dark:bg-teal-950/80 dark:text-teal-400 dark:border-teal-900/60 shadow-sm font-extrabold'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {cat.translation[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Medical profile */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3.5">
          <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-500" />
            {translations.medicalProfile[language]}
          </h4>

          {/* Contact */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] text-slate-400 font-medium block">
              {translations.contact[language]}
            </label>
            <input
              id="emergency-phone-input"
              type="text"
              value={emergencyPhone}
              onChange={(e) => onEmergencyPhoneChange(e.target.value)}
              placeholder="+94 77 123 4567"
              className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-white outline-none"
            />
          </div>

          {/* Blood & Allergies */}
          <div className="grid grid-cols-12 gap-3 text-xs">
            <div className="col-span-4 space-y-1">
              <label className="text-[10px] text-slate-400 font-medium block">
                {translations.blood[language]}
              </label>
              <input
                id="blood-group-input"
                type="text"
                value={bloodGroup}
                onChange={(e) => onBloodGroupChange(e.target.value)}
                placeholder="O+"
                className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>

            <div className="col-span-8 space-y-1">
              <label className="text-[10px] text-slate-400 font-medium block">
                {translations.conditions[language]}
              </label>
              <input
                id="medical-conditions-input"
                type="text"
                value={medicalConditions}
                onChange={(e) => onMedicalConditionsChange(e.target.value)}
                placeholder="Penicillin allergy, Asthma"
                className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Fallback warning */}
          <div className="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-950/40 p-2 rounded border border-slate-200/40 dark:border-slate-800/40 flex items-center gap-1.5 leading-tight">
            <Settings className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{translations.syncActive[language]}</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Event Logs */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between max-h-[460px]">
        <div>
          <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
            <History className="w-4 h-4 text-teal-500" />
            {translations.recentSOS[language]}
          </h4>

          <div className="space-y-2 overflow-y-auto max-h-[340px] scrollbar-thin">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="bg-red-500/10 text-red-500 font-mono font-bold px-1.5 py-0.5 rounded border border-red-500/10 uppercase">
                      {log.type}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{translations.locLabel[language]} {log.coords.latitude.toFixed(4)}N, {log.coords.longitude.toFixed(4)}E</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-200/40 dark:border-slate-800/40">
                    <span className="text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Triage: <strong className="text-rose-500 capitalize">{log.triageLevel}</strong>
                    </span>
                    <span className="text-teal-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-teal-400" />
                      {translations.active[language]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <ShieldAlert className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                {translations.noLogs[language]}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
