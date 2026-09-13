import React, { useState, useRef, useEffect } from 'react';
import { CEFRLevel, SupportedLanguage } from '../types';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { Send, Mic, MicOff, Volume2, Sparkles, Bot, User, RefreshCw, BookOpen } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  transliteration?: string;
  translation?: string;
  feedback?: string;
  vocabulary?: { arabic: string; transliteration: string; meaning: string }[];
}

interface AITutorChatProps {
  currentLevel: CEFRLevel;
  language: SupportedLanguage;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({ currentLevel, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('general');

  const recognitionRef = useRef<any>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  const scenarios: Record<CEFRLevel, { id: string; titleEn: string; titleFr: string; titleAr: string; prompt: string }[]> = {
    A1: [
      { id: 'general', titleEn: '👋 Self Introduction', titleFr: '👋 Se présenter', titleAr: '👋 التعارف والتحية', prompt: 'السَّلَامُ عَلَيْكُم! أَنَا اسْمِي...' },
      { id: 'numbers', titleEn: '🔢 Shopping & Numbers', titleFr: '🔢 Achats & Chiffres', titleAr: '🔢 الأرقام والتسوق', prompt: 'كَمْ سِعْرُ هَذَا الكِتَاب؟' },
      { id: 'tea-grocer', titleEn: '☕ Mint Tea & Grocer (Unit 3)', titleFr: '☕ Thé à la menthe & Épicerie (Unité 3)', titleAr: '☕ إعداد الشاي والبقال (الوحدة 3)', prompt: 'أُرِيدُ إِعْدَادَ الشَّاي، هَلْ عِنْدَكَ نَعْنَاعٌ وَسُكَّرٌ مِنْ فَضْلِك؟' },
      { id: 'birthday-party', titleEn: '🎉 Birthday Party & Time (Unit 4)', titleFr: '🎉 Fête d’Anniversaire & Heure (Unité 4)', titleAr: '🎉 حفل عيد الميلاد والوقت (الوحدة 4)', prompt: 'سَأُنَظِّمُ حَفْلًا بِمُنَاسَبَةِ عِيدِ مِيلَادِي يَوْمَ السَّبْتِ عَلَى السَّاعَةِ الخَامِسَةِ مَسَاءً، هَلْ تَحْضُر؟' },
    ],
    A2: [
      { id: 'restaurant', titleEn: '🍲 Ordering at Cafe/Souk', titleFr: '🍲 Commander au café', titleAr: '🍲 في المقهى والمطعم', prompt: 'مَرْحَبًا، أُرِيدُ قَهْوَةً عَرَبِيَّةً وَمَاءً مِنْ فَضْلِك.' },
      { id: 'directions', titleEn: '🗺️ Asking Directions', titleFr: '🗺️ Demander son chemin', titleAr: '🗺️ السؤال عن الطريق', prompt: 'عَفْوًا، أَيْنَ مَحَطَّةُ القِطَار؟' },
    ],
    B1: [
      { id: 'travel', titleEn: '✈️ Travel & Holidays', titleFr: '✈️ Voyages & Vacances', titleAr: '✈️ حكايات السفر', prompt: 'زُرْتُ مَدِينَةَ مَرَّاكُش الأُسْبُوعَ المَاضِي...' },
      { id: 'culture', titleEn: '🏺 Traditions & Customs', titleFr: '🏺 Traditions & Coutumes', titleAr: '🏺 العادات والتقاليد', prompt: 'مَا هِيَ أَشْهَرُ الأَعْيَادِ فِي العَالَمِ العَرَبِيّ؟' },
    ],
    B2: [
      { id: 'debates', titleEn: '💬 Social Debates & Media', titleFr: '💬 Débats de société', titleAr: '💬 حوارات الرأي والإعلام', prompt: 'فِي رَأْيِي أَنَّ تَعَلُّمَ اللُّغَاتِ يَفْتَحُ آفَاقًا جَدِيدَة.' },
      { id: 'dialects', titleEn: '🗣️ Dialect vs Fusha', titleFr: '🗣️ Dialecte vs Fusha', titleAr: '🗣️ اللهجات والفصحى', prompt: 'مَا الفَرْقُ بَيْنَ اللَّهْجَةِ المِصْرِيَّةِ وَالفُصْحَى؟' },
    ],
    C1: [
      { id: 'academic', titleEn: '🎓 Literary Critique', titleFr: '🎓 Critique Littéraire', titleAr: '🎓 النقد الأدبي والبلاغة', prompt: 'كَيْفَ تُفَسِّرُ ظَاهِرَةَ المَجَازِ فِي النَّثْرِ العَرَبِيّ؟' },
    ],
    C2: [
      { id: 'poetry', titleEn: '👑 Classical Poetry & Philosophy', titleFr: '👑 Poésie classique', titleAr: '👑 عيون الشعر والفلسفة', prompt: 'مَا هِيَ بَلَاغَةُ شِعْرِ المُتَنَبِّي فِي الحِكْمَة؟' },
    ],
  };

  const levelScenarios = scenarios[currentLevel] || scenarios.A1;

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessages: Record<CEFRLevel, ChatMessage> = {
      A1: {
        id: 'welcome-a1',
        sender: 'tutor',
        text: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ! أَنَا أُسْتَاذُكَ فَصِيح. كَيْفَ حَالُكَ اليَوْم؟',
        transliteration: 'As-salāmu ‘alaykum wa raḥmatullāh! Anā ustādhuka Faseeh. Kayfa ḥāluka al-yawm?',
        translation: 'Peace be upon you! I am your tutor Faseeh. How are you today?',
        vocabulary: [
          { arabic: 'السَّلَامُ عَلَيْكُم', transliteration: 'As-salamu alaykum', meaning: 'Hello / Peace be upon you' },
          { arabic: 'كَيْفَ حَالُك؟', transliteration: 'Kayfa haluk?', meaning: 'How are you?' },
        ],
      },
      A2: {
        id: 'welcome-a2',
        sender: 'tutor',
        text: 'أَهْلًا وَسَهْلًا بِكَ فِي مُسْتَوَى A2! هَلْ جَرَّبْتَ طَلَبَ وَجْبَةٍ فِي مَطْعَمٍ عَرَبِيٍّ مِنْ قَبْل؟',
        transliteration: 'Ahlan wa sahlan bika fī mustawā A2! Hal jarrabta talaba wajbah fī mat‘am ‘arabiyy min qabl?',
        translation: 'Welcome to Level A2! Have you tried ordering food in an Arabic restaurant before?',
      },
      B1: {
        id: 'welcome-b1',
        sender: 'tutor',
        text: 'مَرْحَبًا بِكَ يَا صَدِيقِي! فِي مُسْتَوَى B1 يُمْكِنُنَا التَّحَدُّثُ عَنِ السَّفَرِ، وَتَجَارِبِكَ، وَهَوَايَاتِكَ المُفَضَّلَة.',
        translation: 'Welcome my friend! In Level B1 we can chat about travel, your experiences, and your favorite hobbies.',
      },
      B2: {
        id: 'welcome-b2',
        sender: 'tutor',
        text: 'طَابَ يَوْمُكَ! فِي هَذَا المُسْتَوَى نَتَنَاوَلُ مَقَالَاتِ الرَّأْيِ وَالأَمْثَالَ الشَّعْبِيَّةِ وَمُقَارَنَةَ اللَّهَجَاتِ بِالفُصْحَى.',
        translation: 'Good day! In this level we explore opinion pieces, proverbs, and comparing dialects to MSA.',
      },
      C1: {
        id: 'welcome-c1',
        sender: 'tutor',
        text: 'أَهْلًا بِكَ فِي رِحَابِ الفَصَاحَةِ وَالبَلَاغَة! هُنَا نُحَلِّلُ النُّصُوصَ الأَدَبِيَّةَ وَنَصُوغُ الحُجَجَ الفِكْرِيَّةَ الرَّصِينَة.',
        translation: 'Welcome to advanced eloquence and rhetoric! Here we analyze literary texts and construct refined arguments.',
      },
      C2: {
        id: 'welcome-c2',
        sender: 'tutor',
        text: 'أَهْلًا بِفَارِسِ الضَّاد! فِي مُسْتَوَى الإِتْقَانِ C2 نَسْبِرُ أَغْوَارَ عُيُونِ الشِّعْرِ وَذُرْوَةِ البَيَانِ العَرَبِيّ.',
        translation: 'Welcome to Arabic Mastery! In Level C2 we explore the heights of classical poetry and eloquence.',
      },
    };

    setMessages([welcomeMessages[currentLevel] || welcomeMessages.A1]);
  }, [currentLevel]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setInputText(spoken);
        setIsRecording(false);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    playSoundEffect('tap');
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    playSoundEffect('tap');
    setInputText('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          level: currentLevel,
          topic: selectedScenario,
          userLanguage: language,
        }),
      });

      const data = await res.json();
      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: data.reply || data.response || 'أَحْسَنْتَ! كَلَامٌ جَمِيلٌ جِدًّا.',
        feedback: data.feedback,
        vocabulary: data.vocabulary || data.vocabularyUsed,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      playSoundEffect('correct');
      // Auto speak tutor reply
      speakArabic(tutorMsg.text, 0.9);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `fallback-${Date.now()}`,
        sender: 'tutor',
        text: 'مُمْتَاز! أَنَا أَسْتَمِعُ إِلَيْكَ وَأُشَجِّعُكَ دَوْمًا عَلَى المُمَارَسَة.',
        translation: 'Excellent! I am listening and always encouraging you to practice.',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-sm flex flex-col h-[580px] overflow-hidden">
      {/* Chat Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center text-amber-300 shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base">
                {language === 'ar' ? 'المعلم الذكي: فَصِيح' : language === 'fr' ? 'Tuteur IA : Faseeh' : 'AI Arabic Tutor: Faseeh'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold border border-white/30">
                {currentLevel} CEFR
              </span>
            </div>
            <p className="text-[11px] text-amber-100/90 font-medium">
              {language === 'fr' ? 'Conversation vocale avec voyelles complètes & correction' : language === 'ar' ? 'محادثة ذكية بالتشكيل وتصحيح فوري' : 'Interactive vocalized dialogue with grammar feedback'}
            </p>
          </div>
        </div>

        {/* Quick Scenario Picker */}
        <div className="hidden sm:flex items-center gap-1.5">
          {levelScenarios.map((scen) => (
            <button
              key={scen.id}
              onClick={() => {
                setSelectedScenario(scen.id);
                handleSendMessage(scen.prompt);
              }}
              className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-xs text-white font-bold border border-white/20 transition-colors shadow-2xs"
            >
              {language === 'fr' ? scen.titleFr : language === 'ar' ? scen.titleAr : scen.titleEn}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-amber-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                msg.sender === 'user' ? 'bg-gradient-to-tr from-amber-500 to-orange-500' : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-900 border border-amber-200/80 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Main Arabic Text */}
                <p dir="rtl" className="font-serif text-base sm:text-lg font-bold leading-relaxed">
                  {msg.text}
                </p>

                {/* Transliteration if available */}
                {msg.transliteration && (
                  <p className="text-xs text-emerald-800 font-semibold mt-1">
                    {msg.transliteration}
                  </p>
                )}

                {/* Translation if available */}
                {msg.translation && (
                  <p className="text-[11px] text-slate-500 mt-1 italic border-t border-amber-100/80 pt-1">
                    {msg.translation}
                  </p>
                )}

                {/* Audio Button for Tutor */}
                {msg.sender === 'tutor' && (
                  <div className="mt-2 flex items-center justify-between border-t border-amber-100/80 pt-2">
                    <button
                      onClick={() => speakArabic(msg.text, 0.85)}
                      className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-xs font-bold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Écouter la prononciation' : language === 'ar' ? 'استمع للنطق' : 'Listen to Arabic'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Grammar / Feedback Highlight */}
              {msg.feedback && (
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-300/80 text-xs text-amber-950 shadow-2xs">
                  <div className="flex items-center gap-1 font-bold mb-0.5 text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'fr' ? 'Conseil du professeur' : language === 'ar' ? 'توجيه المعلم' : 'Tutor Tip & Correction'}</span>
                  </div>
                  <p className="text-slate-700">{msg.feedback}</p>
                </div>
              )}

              {/* Vocabulary Chips */}
              {msg.vocabulary && msg.vocabulary.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.vocabulary.map((v, i) => (
                    <button
                      key={`voc-${i}`}
                      onClick={() => speakArabic(v.arabic, 0.85)}
                      className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[11px] text-emerald-950 font-bold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <span className="font-serif font-bold text-emerald-900">{v.arabic}</span>
                      <span className="text-slate-600">({v.meaning})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium animate-pulse">
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>{language === 'fr' ? 'Faseeh prépare sa réponse...' : language === 'ar' ? 'فصيح يكتب بالتشكيل...' : 'Faseeh is composing with Tashkeel...'}</span>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-white/95 border-t border-amber-200/80 flex items-center gap-2">
        <button
          id="btn-tutor-mic"
          type="button"
          onClick={toggleRecording}
          className={`p-2.5 rounded-2xl border transition-all ${
            isRecording
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-amber-100/70 hover:bg-amber-100 text-slate-800 border-amber-300/80'
          }`}
          title={isRecording ? 'Stop Recording' : 'Speak in Arabic (Voice input)'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          id="input-tutor-message"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={
            language === 'fr'
              ? 'Écrivez en arabe ou utilisez le micro...'
              : language === 'ar'
              ? 'اكتب بالعربية أو تحدث عبر الميكروفون...'
              : 'Type in Arabic (or English) or speak...'
          }
          className="flex-1 px-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-serif"
        />

        <button
          id="btn-tutor-send"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className={`p-2.5 rounded-2xl transition-all ${
            inputText.trim() && !isLoading
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/25 active:scale-95'
              : 'bg-amber-100 text-slate-300 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
