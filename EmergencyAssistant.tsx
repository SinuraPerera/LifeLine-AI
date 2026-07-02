import React, { useState, useEffect, useRef } from 'react';
import { Message, Language } from './types';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Camera, 
  AlertTriangle, 
  Loader2, 
  Plus, 
  CornerDownLeft,
  X,
  Stethoscope,
  HeartPulse
} from 'lucide-react';

interface EmergencyAssistantProps {
  language: Language;
  medicalConditions: string;
}

// Low-profile 5x5 valid base64 PNGs for one-click mock-testing image uploads
const SAMPLE_DIAGNOSTIC_IMAGES = [
  {
    id: 'wound',
    name: { en: 'Laceration / Bleeding Wound', si: 'රුධිර වහනය තුවාලය', ta: 'இரத்தப்போக்கு காயம்' },
    mimeType: 'image/png',
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
    description: 'A close-up of a laceration on the forearm with active deep red blood loss.'
  },
  {
    id: 'burn',
    name: { en: 'Thermal Skin Burn', si: 'පිළිස්සුම් තුවාලය', ta: 'தீக்காயம்' },
    mimeType: 'image/png',
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4z8Dwf8GfbyAMIiCYgI4pE8RKBgB68jO26K9wOwAAAABJRU5ErkJggg==',
    description: 'Reddened blistering heat burn covering the hand with signs of minor swelling.'
  },
  {
    id: 'poison',
    name: { en: 'Pills / Chemical Vial', si: 'රසායනික ද්‍රව්‍ය / පෙති', ta: 'இரசாயன குப்பி / மாத்திரைகள்' },
    mimeType: 'image/png',
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P8//8/w38GIPnPwDCHICgUIsYIAO90NMDWl9pYAAAAAElFTkSuQmCC',
    description: 'An open prescription drug bottle with scattered white pills nearby.'
  }
];

export default function EmergencyAssistant({ language, medicalConditions }: EmergencyAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'I am your LifeLine AI Emergency Triage Assistant. Tell me your emergency, or upload a photo of an injury. I can guide you step-by-step.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('lifeline_gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  
  // Audio configuration
  const [speechOn, setSpeechOn] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Vision configuration
  const [selectedImage, setSelectedImage] = useState<{ id: string; base64: string; mimeType: string; name: string } | null>(null);
  const [visionLoading, setVisionLoading] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<any | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, visionLoading]);

  // Save API key to localStorage when changed
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('lifeline_gemini_api_key', apiKey);
    } else {
      localStorage.removeItem('lifeline_gemini_api_key');
    }
  }, [apiKey]);

  // Clean up any speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Web Speech API - Text to Speech Reader
  const speakText = (text: string) => {
    if (!speechOn) return;
    try {
      window.speechSynthesis.cancel(); // Stop any active speech
      const cleanText = text.replace(/[*#`_\-]/g, ''); // Strip markdown syntax
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Attempt language-matching voices
      if (language === 'si') utterance.lang = 'si-LK';
      else if (language === 'ta') utterance.lang = 'ta-LK';
      else utterance.lang = 'en-US';

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis failed:', e);
    }
  };

  // Toggle Vocal Speech Reader
  const handleSpeechToggle = () => {
    const newState = !speechOn;
    setSpeechOn(newState);
    if (!newState) {
      window.speechSynthesis.cancel();
    } else if (messages.length > 0) {
      speakText(messages[messages.length - 1].content);
    }
  };

  // Web Speech API - Speech to Text Dictator
  const startListening = () => {
    try {
      const SpeechGen = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechGen) {
        alert('Vocal Speech Dictation is not supported by your current browser.');
        return;
      }

      const recognition = new SpeechGen();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      if (language === 'si') recognition.lang = 'si-LK';
      else if (language === 'ta') recognition.lang = 'ta-LK';
      else recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInput(text);
        }
      };

      recognition.onerror = (e: any) => {
        console.error('Speech dictation error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to trigger speech recognition:', e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Submit Text Triage Chat
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMsgText = input;
    setInput('');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          history: messages.slice(-10), // Send last 10 messages for context
          language,
          medicalConditions,
          apiKey
        })
      });

      const data = await response.json();
      
      if (response.ok && data.content) {
        const modelMessage: Message = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, modelMessage]);
        speakText(data.content);
      } else {
        throw new Error(data.error || 'Server error generating response.');
      }
    } catch (err: any) {
      console.error('Triage chat failed:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'system',
        content: `Error: Unable to connect to LifeLine servers. Please verify internet connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // Multimodal Image Analysis triggers
  const handleSampleImageClick = (sample: typeof SAMPLE_DIAGNOSTIC_IMAGES[0]) => {
    setSelectedImage({
      id: sample.id,
      base64: sample.base64,
      mimeType: sample.mimeType,
      name: sample.name[language]
    });
    setVisionResult(null);
  };

  // Upload Custom File Image Handler
  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedImage({
        id: 'custom',
        base64: base64String,
        mimeType: file.type,
        name: file.name
      });
      setVisionResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setVisionResult(null);
  };

  const analyzeSelectedImage = async () => {
    if (!selectedImage || visionLoading) return;

    setVisionLoading(true);
    setVisionResult(null);

    try {
      const response = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage.base64,
          mimeType: selectedImage.mimeType,
          language,
          apiKey
        })
      });

      const data = await response.json();

      if (response.ok && data) {
        setVisionResult(data);
        
        // Add artificial message confirming image diagnostic completion
        const feedbackMsg: Message = {
          id: `vision-${Date.now()}`,
          role: 'model',
          content: `📷 **Visual Emergency Assessment Completed**\n\n**Visual observation:** ${data.hazardDetected}\n**Triage Level:** ${data.triageLevel.toUpperCase()}\n**Justification:** ${data.severityJustification}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, feedbackMsg]);
        speakText(`Visual assessment complete. Hazard detected is ${data.hazardDetected}. Suggested triage is ${data.triageLevel}`);
      } else {
        throw new Error(data.error || 'Diagnostic server error.');
      }
    } catch (err: any) {
      console.error('Vision diagnostic failed:', err);
      alert('Vision assessment failed. Verify Gemini API Key configuration.');
    } finally {
      setVisionLoading(false);
    }
  };

  const translations = {
    welcome: {
      en: 'I am your LifeLine AI Emergency Triage Assistant. Tell me your emergency, or upload a photo of an injury. I can guide you step-by-step.',
      si: 'මම ඔබේ LifeLine AI හදිසි උපකාරක සහකරු වෙමි. ඔබේ ගැටලුව පවසන්න, නැතහොත් තුවාලයේ ඡායාරූපයක් යොමු කරන්න.',
      ta: 'நான் உங்கள் லைஃப்லைன் அவசரகால AI உதவியாளர். உங்கள் அவசரநிலையைக் கூறவும் அல்லது காயத்தின் புகைப்படத்தைப் பதிவேற்றவும்.'
    },
    apiKey: { en: 'API Key', si: 'API යතුරු සංකේතය', ta: 'API விசை' },
    apiKeyPlaceholder: { en: 'Enter your Gemini API key...', si: 'ඔබේ Gemini API යතුරු සංකේතය ඇතුලත් කරන්න...', ta: 'உங்கள் Gemini API விசையை உள்ளிடவும்...' },
    saveApiKey: { en: 'Save Key', si: 'යතුරු සංකේතය සුරකින්න', ta: 'விசையை சேமி' },
    apiKeySet: { en: 'API Key Set', si: 'API යතුරු සංකේතය සකසා ඇත', ta: 'API விசை அமைக்கப்பட்டது' },
    apiKeyNotSet: { en: 'No API Key', si: 'API යතුරු සංකේතය නැත', ta: 'API விசை இல்லை' },
    chatHeader: { en: 'Clinical AI Emergency Assistant', si: 'සයනික AI හදිසි සහායක', ta: 'மருத்துவ AI அவசர உதவியாளர்' },
    chatSub: { en: 'Gemini-powered real-time emergency responder & first-aid triage.', si: 'Gemini තාක්ෂණයෙන් ක්‍රියාත්මක වන හදිසි ප්‍රතිචාර.', ta: 'ஜெமினி மூலம் இயங்கும் அவசர கால முதலுதவி சிகிச்சை.' },
    placeholder: { en: 'Describe symptoms (e.g., chest tightness, bleeding)...', si: 'රෝග ලක්ෂණ මෙහි ලියන්න (පපුවේ අමාරුව, ලේ වැගිරීම්)...', ta: 'அறிகுறிகளை விவரிக்கவும் (நெஞ்சு வலி, இரத்தப்போக்கு)...' },
    visionHeader: { en: 'Multimodal Image Emergency Detector', si: 'රූප-පාදක හදිසි හඳුනාගැනීම', ta: 'மல்டிமாடல் பட அவசர கண்டறிதல்' },
    visionDesc: { en: 'Snap or choose a sample diagnostic image below to trigger vision triage:', si: 'හදිසි පින්තූරයක් තෝරාගෙන පරීක්ෂා කිරීමට පහත සාම්පල ක්ලික් කරන්න:', ta: 'கீழே உள்ள மாதிரி படங்களை கிளிக் செய்து ஜெமினி மூலம் பகுப்பாய்வு செய்க:' },
    customUpload: { en: 'Or Upload Custom Photo', si: 'හෝ ඔබගේ පින්තූරයක් එක් කරන්න', ta: 'அல்லது புகைப்படத்தைப் பதிவேற்றவும்' },
    analyzeBtn: { en: 'Run Vision Diagnostics', si: 'රූපය විශ්ලේෂණය කරන්න', ta: 'பகுப்பாய்வைத் தொடங்கு' },
    analyzing: { en: 'Analyzing Image...', si: 'විශ්ලේෂණය කරමින් පවතී...', ta: 'பகுப்பாய்வு செய்யப்படுகிறது...' },
    triageLevel: { en: 'Triage Level', si: 'වර්ගීකරණය (Triage)', ta: 'வகைப்பாடு (Triage)' },
    hazard: { en: 'Identified Issue', si: 'හඳුනාගත් ගැටලුව', ta: 'கண்டறியப்பட்ட சிக்கல்' },
    remedies: { en: 'Actionable First Aid Steps', si: 'ගත යුතු පියවර', ta: 'முதலுதவி நடவடிக்கைகள்' },
    visionWarnings: { en: 'Critical Warnings', si: 'අනතුරු ඇඟවීම්', ta: 'எச்சரிக்கைகள்' },
    synthesizing: { en: 'Synthesizing responder triage advice...', si: 'හදිසි ප්‍රතිචාර උපදෙස් සකස් කරමින් පවතී...', ta: 'பதில் தரும் முதலுதவி ஆலோசனைகள் தயாரிக்கப்படுகிறது...' }
  };

  const getLocalizedContent = (msg: Message) => {
    if (msg.id === 'welcome') {
      return translations.welcome[language];
    }
    return msg.content;
  };

  return (
    <div id="emergency-assistant-container" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* LEFT COLUMN: Emergency Triage Chat */}
      <div className="lg:col-span-7 flex flex-col h-[520px] bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 overflow-hidden shadow-sm">
        {/* Chat Box Header */}
        <div className="bg-white dark:bg-slate-950 px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-ping" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-sans leading-none">
                {translations.chatHeader[language]}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                {translations.chatSub[language]}
              </p>
            </div>
          </div>

          {/* API Key Toggle & Vocal Toggle */}
          <div className="flex items-center gap-2">
            <button
              id="api-key-toggle-btn"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className={`p-1.5 rounded-lg border transition-all ${
                apiKey
                  ? 'bg-teal-500/10 text-teal-500 border-teal-500/20'
                  : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              }`}
              title={apiKey ? translations.apiKeySet[language] : translations.apiKeyNotSet[language]}
            >
              <Stethoscope className="w-4 h-4" />
            </button>
            <button
              id="vocal-tts-btn"
              onClick={handleSpeechToggle}
              className={`p-1.5 rounded-lg border transition-all ${
                speechOn
                  ? 'bg-teal-500/10 text-teal-500 border-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
              }`}
              title="Toggle Text-To-Speech Audio Guide"
            >
              {speechOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* API Key Input Panel */}
        {showApiKeyInput && (
          <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <input
                id="api-key-input"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={translations.apiKeyPlaceholder[language]}
                className="flex-1 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-950 outline-none border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 placeholder-slate-400"
              />
              <button
                id="save-api-key-btn"
                onClick={() => setShowApiKeyInput(false)}
                className="px-3 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-bold rounded-lg transition-all"
              >
                {translations.saveApiKey[language]}
              </button>
            </div>
          </div>
        )}

        {/* Messaging Box Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              {/* Message bubble */}
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-none shadow-sm'
                    : msg.role === 'system'
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-tl-none shadow-sm whitespace-pre-wrap'
                }`}
              >
                {getLocalizedContent(msg)}
              </div>

              {/* Time */}
              <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Chat Stream loading indicator */}
          {isSending && (
            <div className="flex gap-2 items-center text-slate-400 text-xs pl-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" />
              <span>{translations.synthesizing[language]}</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-1.5 border border-slate-100 dark:border-slate-800/80">
            <input
              id="chat-text-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={translations.placeholder[language]}
              className="flex-1 text-xs text-slate-800 dark:text-white bg-transparent outline-none border-none py-1 placeholder-slate-400"
              disabled={isSending}
            />

            {/* Micro Dictation Trigger */}
            <button
              id="vocal-stt-btn"
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-1.5 rounded-lg transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'text-slate-400 hover:text-slate-100'
              }`}
              title="Dictate speech (Speech-To-Text)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send */}
            <button
              id="chat-send-btn"
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-1.5 bg-teal-500 disabled:opacity-30 disabled:pointer-events-none text-slate-950 rounded-lg hover:bg-teal-600 transition-all flex items-center justify-center shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: Diagnostic Image Analysis */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
            <Camera className="w-4 h-4 text-teal-500" />
            {translations.visionHeader[language]}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            {translations.visionDesc[language]}
          </p>

          {/* Sample Injury Toggles */}
          <div className="grid grid-cols-3 gap-2 mt-3.5">
            {SAMPLE_DIAGNOSTIC_IMAGES.map((sample) => (
              <button
                key={sample.id}
                id={`sample-img-btn-${sample.id}`}
                onClick={() => handleSampleImageClick(sample)}
                className={`p-2 rounded-xl border text-[10px] font-sans font-bold flex flex-col items-center gap-1.5 text-center transition-all ${
                  selectedImage?.id === sample.id
                    ? 'bg-teal-500/15 text-teal-400 border-teal-500/40 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                {/* Simulated Thumbnail */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  sample.id === 'wound' ? 'bg-red-500/20 text-red-500' :
                  sample.id === 'burn' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span className="leading-tight truncate max-w-[80px]">{sample.name[language]}</span>
              </button>
            ))}
          </div>

          {/* Drag & Drop File Upload */}
          <div className="mt-4 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans">{translations.customUpload[language]}</span>
            <label className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all">
              <Plus className="w-3.5 h-3.5 inline mr-1" /> Choose
              <input 
                id="custom-file-upload-input"
                type="file" 
                accept="image/*" 
                onChange={handleCustomFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Active Image Preview & Action */}
          {selectedImage && (
            <div className="mt-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/40 dark:border-slate-800/60 mb-2">
                <span className="text-[10px] font-mono text-teal-400 font-bold uppercase truncate max-w-[150px]">
                  📷 Selected: {selectedImage.name}
                </span>
                <button 
                  id="clear-image-btn"
                  onClick={handleClearImage} 
                  className="text-slate-400 hover:text-rose-500 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Run Vision Button */}
              <button
                id="run-vision-diagnostics-btn"
                onClick={analyzeSelectedImage}
                disabled={visionLoading}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-30 disabled:pointer-events-none text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                {visionLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{translations.analyzing[language]}</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{translations.analyzeBtn[language]}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Vision Verdict Results Panel */}
        {visionResult && (
          <div className="mt-4 border border-teal-500/20 bg-teal-500/5 p-3 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center pb-1.5 border-b border-teal-500/10">
              <span className="text-[10px] font-sans font-bold text-teal-400 uppercase tracking-wider">{translations.triageLevel[language]}</span>
              <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[9px] uppercase ${
                visionResult.triageLevel === 'critical' ? 'bg-red-500 text-white animate-pulse' :
                visionResult.triageLevel === 'high' ? 'bg-rose-500 text-white' :
                visionResult.triageLevel === 'medium' ? 'bg-amber-500 text-slate-950' :
                'bg-teal-500 text-slate-950'
              }`}>
                {visionResult.triageLevel}
              </span>
            </div>

            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block">{translations.hazard[language]}</span>
              <p className="text-slate-700 dark:text-slate-200 font-medium text-[11px] leading-tight mt-0.5">{visionResult.hazardDetected}</p>
            </div>

            {/* Steps list */}
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block">{translations.remedies[language]}</span>
              <ul className="space-y-1 mt-1 pl-3 list-decimal text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                {visionResult.firstAidSteps.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Warnings list */}
            {visionResult.warnings && visionResult.warnings.length > 0 && (
              <div className="pt-1.5 border-t border-teal-500/10 text-rose-500 text-[10px] leading-normal font-medium">
                <span className="flex items-center gap-1 uppercase text-[9px] font-bold text-rose-400">
                  <AlertTriangle className="w-3 h-3" />
                  {translations.visionWarnings[language]}
                </span>
                <ul className="list-disc pl-3 mt-1 space-y-0.5">
                  {visionResult.warnings.map((w: string, idx: number) => (
                    <li key={idx} className="text-[10px] text-rose-400">{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
