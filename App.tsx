import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { auth, isMockFirebase } from './firebase';
import SOSDashboard from './SOSDashboard';
import EmergencyAssistant from './EmergencyAssistant';
import HospitalFinder from './HospitalFinder';
import OfflineGuides from './OfflineGuides';
import { Language } from './types';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Settings, 
  Sun, 
  Moon, 
  BookOpen, 
  Flame, 
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  Menu,
  X,
  Mail
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sos' | 'assistant' | 'hospitals' | 'guides'>('sos');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Manual Sign-in Form State
  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');
  const [signInError, setSignInError] = useState<string>('');

  // Profile data shared state
  const [medicalConditions, setMedicalConditions] = useState<string>('');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('');

  // Hydrate states from localStorage and track authentication changes
  useEffect(() => {
    const savedLang = localStorage.getItem('lifeline_language');
    if (savedLang) setLanguage(savedLang as Language);

    const savedTheme = localStorage.getItem('lifeline_theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else {
      // Default to dark theme if not set
      setTheme('dark');
      localStorage.setItem('lifeline_theme', 'dark');
    }

    const savedProfile = localStorage.getItem('lifeline_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setMedicalConditions(parsed.conditions || '');
        setEmergencyPhone(parsed.phone || '');
        setBloodGroup(parsed.blood || '');
      } catch (e) {
        console.error('Failed to parse profile:', e);
      }
    }

    // Restore mock user if using mock Firebase
    if (isMockFirebase) {
      const savedMockUser = localStorage.getItem('lifeline_mock_user');
      if (savedMockUser) {
        try {
          setUser(JSON.parse(savedMockUser) as User);
          setAuthLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse mock user:', e);
        }
      }
    }

    // Subscribe to Auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [isMockFirebase]);

  // Ensure the dark class is synced to documentElement for full styling compatibility
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      document.body.classList.add('bg-slate-950', 'text-slate-100');
      document.body.classList.remove('bg-slate-50', 'text-slate-800');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
      document.body.classList.add('bg-slate-50', 'text-slate-800');
    }
  }, [theme]);

  // Update theme in localStorage on change
  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('lifeline_theme', nextTheme);
  };

  // Update language in localStorage on change
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('lifeline_language', lang);
  };

  // Update profile in localStorage on change
  useEffect(() => {
    localStorage.setItem(
      'lifeline_profile',
      JSON.stringify({ conditions: medicalConditions, phone: emergencyPhone, blood: bloodGroup })
    );
  }, [medicalConditions, emergencyPhone, bloodGroup]);

  // Google Authentication Handlers (With fully styled robust mock support)
  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      if (isMockFirebase) {
        const mockUser = {
          uid: 'mock-user-id-12345',
          displayName: 'SVD Responder',
          email: 'cyberguard622@gmail.com',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          emailVerified: true
        } as unknown as User;
        setUser(mockUser);
        localStorage.setItem('lifeline_mock_user', JSON.stringify(mockUser));
      } else {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      alert(`Authentication Error: ${error.message || 'Failed to sign in'}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Manual Email/Password Sign-in Handler
  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setSignInError('');
    
    try {
      // For demo purposes, accept any email/password combination
      // In production, this would connect to a real authentication backend
      const mockUser = {
        uid: `manual-user-${Date.now()}`,
        displayName: signInEmail.split('@')[0] || 'User',
        email: signInEmail,
        photoURL: null,
        emailVerified: true
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('lifeline_mock_user', JSON.stringify(mockUser));
      setShowSignInModal(false);
      setSignInEmail('');
      setSignInPassword('');
    } catch (error: any) {
      setSignInError('Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    try {
      if (isMockFirebase) {
        setUser(null);
        localStorage.removeItem('lifeline_mock_user');
      } else {
        await signOut(auth);
        setUser(null);
      }
    } catch (error: any) {
      console.error('Sign-out error:', error);
      alert(`Sign-out Error: ${error.message || 'Failed to sign out'}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const translations = {
    brand: { en: 'LifeLine AI', si: 'ලයිෆ්ලයින් AI', ta: 'லைஃப்லைன் AI' },
    slogan: { en: 'Emergency AI Guard', si: 'හදිසි AI සහයක', ta: 'அவசர கால AI கவசம்' },
    sosTab: { en: 'SOS Dashboard', si: 'SOS පාලක පුවරුව', ta: 'SOS டாஷ்போர்டு' },
    assistantTab: { en: 'AI Assistant', si: 'AI සහායක', ta: 'AI உதவியாளர்' },
    hospitalsTab: { en: 'Hospital Finder', si: 'රෝහල් සෙවුම', ta: 'மருத்துவமனை தேடல்' },
    guidesTab: { en: 'Offline Guides', si: 'නොබැඳි උපදෙස්', ta: 'ஆஃப்லைன் வழிகாட்டிகள்' },
    emergencyBar: { en: 'Immediate Dispatch Hotlines', si: 'හදිසි ඇමතුම් සේවාවන්', ta: 'உடனடி அவசர அழைப்புகள்' },
    suwaSeriya: { en: 'Suwa Seriya (Ambulance)', si: 'සුවසැරිය (ගිලන්රථ)', ta: 'சுவசெரிய (ஆம்புலன்ஸ்)' },
    signIn: { en: 'Sign In', si: 'ලොග් වන්න', ta: 'உள்நுழைக' },
    signOut: { en: 'Sign Out', si: 'ලොග් අවුට්', ta: 'வெளியேறு' },
    welcomeUser: { en: 'Welcome', si: 'ආයුබෝවන්', ta: 'வரவேற்கிறோம்' }
  };

  return (
    <div className="min-h-screen font-sans pb-16 transition-colors duration-300">
      
      {/* Main Container Shell */}
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Global Navigation Header */}
        <header className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 gap-4 transition-all duration-300">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/logo.png" alt="LifeLine AI Logo" className="w-10 h-10 rounded-full shadow-lg animate-pulse shrink-0" />
                <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping opacity-30" />
              </div>
              <div>
                <h1 className="text-xl font-sans font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  {translations.brand[language]}
                  <span className="text-[10px] bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider shadow-sm">
                    V1.0
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 flex-wrap">
                  <span>{translations.slogan[language]}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent font-bold">by SVD Group</span>
                </p>
              </div>
            </div>

            {/* Hamburger Button for mobile devices */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-all border border-slate-200/40 dark:border-slate-800 ml-2 shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Controls Bar (Language, Theme, Authentication) - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector pills */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/60 shadow-sm">
              {(['en', 'si', 'ta'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  id={`lang-toggle-${lang}`}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    language === lang
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'si' ? 'සිං' : 'தமிழ்'}
                </button>
              ))}
            </div>

            {/* Dark Mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={handleThemeToggle}
              className="p-2.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-all border border-slate-200/40 dark:border-slate-800/60 shadow-sm hover:shadow-md"
              title="Toggle Theme Mode"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <span className="h-5 w-px bg-slate-200 dark:bg-slate-800/60" />

            {/* Google Firebase Authentication Section */}
            {authLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-t-teal-500 border-slate-200 dark:border-slate-700 animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full object-cover border-2 border-teal-500/30 shadow-sm" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden lg:flex flex-col text-left leading-none max-w-[90px]">
                  <span className="text-[9px] font-sans font-bold text-slate-800 dark:text-slate-200 truncate">
                    {user.displayName || 'User'}
                  </span>
                  <span className="text-[7.5px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  id="auth-logout-btn"
                  onClick={handleSignOut}
                  className="px-2 py-1 bg-slate-200/80 hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-600 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[9px] font-bold uppercase transition-all shadow-sm hover:shadow-md"
                >
                  {translations.signOut[language]}
                </button>
              </div>
            ) : (
              <button
                id="auth-login-btn"
                onClick={() => setShowSignInModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow-md hover:shadow-lg"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{translations.signIn[language]}</span>
              </button>
            )}
          </div>
        </header>

        {/* Mobile Dropdown Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-2xl space-y-4 animate-fade-in transition-all">
            {/* Mobile Auth Section */}
            <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              {authLoading ? (
                <div className="flex items-center gap-2 justify-center py-2">
                  <div className="w-4 h-4 rounded-full border-2 border-t-teal-500 border-slate-200 dark:border-slate-700 animate-spin" />
                  <span className="text-[10px] text-slate-400">Loading Auth...</span>
                </div>
              ) : user ? (
                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                  <div className="flex items-center gap-2 max-w-[180px]">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full object-cover border-2 border-teal-500/30 shadow-sm" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {user.displayName || 'User'}
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    id="mob-auth-logout-btn"
                    onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                    className="px-2.5 py-1.5 bg-slate-200/80 hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-600 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[9px] font-bold uppercase transition-all shadow-sm"
                  >
                    {translations.signOut[language]}
                  </button>
                </div>
              ) : (
                <button
                  id="mob-auth-login-btn"
                  onClick={() => { setShowSignInModal(true); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  <span>{translations.signIn[language]}</span>
                </button>
              )}
            </div>

            {/* Mobile Language Selector */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/60">
              {(['en', 'si', 'ta'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  id={`mob-lang-toggle-${lang}`}
                  onClick={() => { handleLanguageChange(lang); }}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    language === lang
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'si' ? 'සිං' : 'தமிழ்'}
                </button>
              ))}
            </div>

            {/* Mobile Theme Toggle */}
            <button
              id="mob-theme-toggle-btn"
              onClick={() => { handleThemeToggle(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-200/40 dark:border-slate-800/60 shadow-sm"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

            <div className="flex flex-col gap-1.5">
              <button
                id="mob-tab-sos"
                onClick={() => { setActiveTab('sos'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === 'sos'
                    ? 'bg-red-500 text-white dark:bg-red-950/90 dark:text-red-300 dark:border dark:border-red-900/40 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span>{translations.sosTab[language]}</span>
                <span className={`w-2.5 h-2.5 rounded-full bg-red-500 ${activeTab === 'sos' ? 'animate-ping' : ''}`} />
              </button>

              <button
                id="mob-tab-assistant"
                onClick={() => { setActiveTab('assistant'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === 'assistant'
                    ? 'bg-teal-500 text-slate-950 dark:bg-teal-950/90 dark:text-teal-300 dark:border dark:border-teal-900/40 shadow-sm font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span>{translations.assistantTab[language]}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              </button>

              <button
                id="mob-tab-hospitals"
                onClick={() => { setActiveTab('hospitals'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === 'hospitals'
                    ? 'bg-teal-500 text-slate-950 dark:bg-teal-950/90 dark:text-teal-300 dark:border dark:border-teal-900/40 shadow-sm font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span>{translations.hospitalsTab[language]}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              </button>

              <button
                id="mob-tab-guides"
                onClick={() => { setActiveTab('guides'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === 'guides'
                    ? 'bg-teal-500 text-slate-950 dark:bg-teal-950/90 dark:text-teal-300 dark:border dark:border-teal-900/40 shadow-sm font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span>{translations.guidesTab[language]}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              </button>
            </div>

            {/* Quick Controls for language & theme inside Mobile Menu */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Settings</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  {(['en', 'si', 'ta'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        language === lang
                          ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {lang === 'en' ? 'EN' : lang === 'si' ? 'සිං' : 'தமிழ்'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleThemeToggle}
                  className="p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-all border border-slate-200/40 dark:border-slate-800"
                  title="Toggle Theme Mode"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Navigation Tabs (Hidden on mobile view, replaced by hamburger) */}
        <nav className="hidden md:flex bg-white dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm gap-1 w-full max-w-lg mx-auto">
          <button
            id="tab-sos"
            onClick={() => setActiveTab('sos')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sos'
                ? 'bg-red-500 text-white dark:bg-red-950/95 dark:text-red-300 dark:border dark:border-red-900/50 shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {translations.sosTab[language]}
          </button>
          <button
            id="tab-assistant"
            onClick={() => setActiveTab('assistant')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'assistant'
                ? 'bg-teal-500 text-slate-950 dark:bg-teal-950/95 dark:text-teal-300 dark:border dark:border-teal-900/50 shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {translations.assistantTab[language]}
          </button>
          <button
            id="tab-hospitals"
            onClick={() => setActiveTab('hospitals')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hospitals'
                ? 'bg-teal-500 text-slate-950 dark:bg-teal-950/95 dark:text-teal-300 dark:border dark:border-teal-900/50 shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {translations.hospitalsTab[language]}
          </button>
          <button
            id="tab-guides"
            onClick={() => setActiveTab('guides')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guides'
                ? 'bg-teal-500 text-slate-950 dark:bg-teal-950/95 dark:text-teal-300 dark:border dark:border-teal-900/50 shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {translations.guidesTab[language]}
          </button>
        </nav>

        {/* ACTIVE MODULE CONTAINER */}
        <main className="animate-fade-in">
          {activeTab === 'sos' && (
            <SOSDashboard
              language={language}
              onLanguageChange={handleLanguageChange}
              theme={theme}
              onThemeToggle={handleThemeToggle}
              medicalConditions={medicalConditions}
              onMedicalConditionsChange={setMedicalConditions}
              emergencyPhone={emergencyPhone}
              onEmergencyPhoneChange={setEmergencyPhone}
              bloodGroup={bloodGroup}
              onBloodGroupChange={setBloodGroup}
            />
          )}

          {activeTab === 'assistant' && (
            <EmergencyAssistant
              language={language}
              medicalConditions={medicalConditions}
            />
          )}

          {activeTab === 'hospitals' && (
            <HospitalFinder
              language={language}
              userLatitude={null} // Will fetch internally via GPS Geolocation API
              userLongitude={null}
            />
          )}

          {activeTab === 'guides' && (
            <OfflineGuides
              language={language}
            />
          )}
        </main>

        {/* Sticky Emergency Dispatch Quickbar */}
        <footer className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
            <span className="font-semibold text-[11px] tracking-wide text-slate-300">
              {translations.emergencyBar[language].toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            <a
              id="emergency-dial-1990"
              href="tel:1990"
              className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl text-[11px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>1990 {translations.suwaSeriya[language].toUpperCase()}</span>
            </a>

            <a
              id="emergency-dial-119"
              href="tel:119"
              className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-[11px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-sm transition-all border border-slate-700/50"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>119 POLICE</span>
            </a>

            <a
              id="emergency-dial-110"
              href="tel:110"
              className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-[11px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-sm transition-all border border-slate-700/50"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>110 FIRE & RESCUE</span>
            </a>
          </div>
        </footer>

        {/* Manual Sign-in Modal */}
        {showSignInModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-teal-500" />
                  Sign In to LifeLine AI
                </h2>
                <button
                  onClick={() => setShowSignInModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleManualSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <input
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    required
                  />
                </div>

                {signInError && (
                  <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs px-3 py-2 rounded-lg">
                    {signInError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-current animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 text-center">
                  Enter any email and password to sign in (demo mode)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Project Attribution & Contact Footer */}
        <div className="border-t border-slate-200/60 dark:border-slate-850/80 mt-8 pt-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="space-y-1">
              <p className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase">
                LifeLine AI • Developed by SVD Group
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md">
                Secure offline-first emergency dispatch, diagnostic triage telemetry, and rapid-response localized hazard radar.
              </p>
            </div>

            {/* Direct Contact Handles */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <a 
                id="footer-email-link"
                href="mailto:sinuradamsath2022@gmail.com"
                className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
              >
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors shrink-0" />
                <span className="font-mono text-[11px] underline underline-offset-4 decoration-slate-300 dark:decoration-slate-700 hover:decoration-teal-500">
                  sinuradamsath2022@gmail.com
                </span>
              </a>

              <a 
                id="footer-phone-link"
                href="tel:+94774470098"
                className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
              >
                <Phone className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors shrink-0" />
                <span className="font-mono text-[11px] font-bold">
                  +94 77 447 0098
                </span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-4 border-t border-slate-100 dark:border-slate-900/60">
            <div>
              © {new Date().getFullYear()} LifeLine AI. All rights reserved. SVD Group Initiative.
            </div>
            <div className="mt-1 sm:mt-0 tracking-wider">
              LATENCY STATUS: SECURE TELEMETRY FEED
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
