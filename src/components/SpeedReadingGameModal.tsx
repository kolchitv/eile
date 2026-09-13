import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Timer,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  X,
  Award,
  Zap,
  Flame,
  Mic,
  MicOff,
  BookOpen,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Eye,
  Shuffle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  HelpCircle,
  VolumeX,
} from 'lucide-react';
import { SPEED_READING_ITEMS, SpeedReadingItem } from '../data/speedReadingData';
import { speakArabic, playSoundEffect, stopAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import { SupportedLanguage } from '../types';

interface SpeedReadingGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onAwardXp?: (amount: number) => void;
}

type GameMode = 'stopwatch' | 'countdown';

export const SpeedReadingGameModal: React.FC<SpeedReadingGameModalProps> = ({
  isOpen,
  onClose,
  language,
  onAwardXp,
}) => {
  // Navigation & Category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemsList] = useState<SpeedReadingItem[]>(SPEED_READING_ITEMS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Custom text support
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customTextInput, setCustomTextInput] = useState<string>('');

  // Font scaling state
  const [fontSizeStep, setFontSizeStep] = useState<number>(2); // 0: text-xl, 1: text-2xl, 2: text-3xl, 3: text-4xl, 4: text-5xl
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

  // Game Engine State
  const [gameMode, setGameMode] = useState<GameMode>('stopwatch');
  const [countdownTarget, setCountdownTarget] = useState<number>(15); // seconds
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Result & Evaluation
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [finalTimeSec, setFinalTimeSec] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [personalBests, setPersonalBests] = useState<Record<string, number>>({});

  // Audio / Karaoke Pacer State
  const [audioSpeed, setAudioSpeed] = useState<number>(0.85);
  const [isKaraokeRunning, setIsKaraokeRunning] = useState<boolean>(false);
  const [karaokeWordIdx, setKaraokeWordIdx] = useState<number>(-1);
  const [karaokePacerWpm, setKaraokePacerWpm] = useState<number>(90); // words per min
  const karaokeTimerRef = useRef<any>(null);

  // Voice recording simulation & microphone check
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Quiz state
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  // Filter items
  const filteredItems = itemsList.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const currentItem: SpeedReadingItem = isCustomMode
    ? {
        id: 'custom-text',
        titleAr: 'نَصٌّ مُخَصَّصٌ لِلتَّدْرِيبِ',
        titleFr: 'Texte personnalisé',
        titleEn: 'Custom Training Text',
        category: 'easy_sentences',
        level: 'A1',
        arabicText: customTextInput || 'أَهْلًا وَسَهْلًا بِكُمْ فِي مَيْدَانِ القِرَاءَةِ السَّرِيعَةِ وَالفَصَاحَةِ.',
        frenchTranslation: 'Bienvenue au défi de lecture rapide et d’éloquence.',
        englishTranslation: 'Welcome to the speed reading and eloquence challenge.',
        wordCount: (customTextInput || 'أَهْلًا وَسَهْلًا بِكُمْ فِي مَيْدَانِ القِرَاءَةِ السَّرِيعَةِ وَالفَصَاحَةِ.').trim().split(/\s+/).length,
        targetSecondsStandard: 10,
        targetSecondsPro: 5,
        themeIcon: '✍️',
        badge: 'مخصص',
      }
    : filteredItems[currentIndex] || filteredItems[0];

  const wordsArray = currentItem.arabicText.trim().split(/\s+/);

  // Reset states on item switch
  useEffect(() => {
    resetTimer();
    setSelectedQuizAnswer(null);
    setIsQuizSubmitted(false);
    stopKaraoke();
  }, [currentIndex, selectedCategory, isCustomMode]);

  // Load personal bests from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('faseeh_speed_reading_records');
      if (saved) {
        setPersonalBests(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Keyboard Spacebar Shortcut to Start / Stop timer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in the custom text input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (timerRunning) {
          handleStopTimer(false);
        } else {
          handleStartTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, timerRunning, elapsedMs, currentItem]);

  // Save personal best
  const savePersonalBest = (itemId: string, timeSec: number) => {
    setPersonalBests((prev) => {
      const currentBest = prev[itemId];
      if (!currentBest || timeSec < currentBest) {
        const updated = { ...prev, [itemId]: timeSec };
        try {
          localStorage.setItem('faseeh_speed_reading_records', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prev;
    });
  };

  // Timer Interval Hook
  useEffect(() => {
    if (timerRunning) {
      startTimeRef.current = Date.now() - elapsedMs;
      timerRef.current = setInterval(() => {
        const currentElapsed = Date.now() - startTimeRef.current;
        if (gameMode === 'countdown') {
          const maxMs = countdownTarget * 1000;
          if (currentElapsed >= maxMs) {
            setElapsedMs(maxMs);
            handleStopTimer(true); // timeout
          } else {
            setElapsedMs(currentElapsed);
          }
        } else {
          setElapsedMs(currentElapsed);
        }
      }, 30);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, gameMode, countdownTarget]);

  const handleStartTimer = () => {
    playSoundEffect('tap');
    setHasFinished(false);
    setSelectedQuizAnswer(null);
    setIsQuizSubmitted(false);
    setElapsedMs(0);
    setTimerRunning(true);
  };

  const handleStopTimer = (isTimeout = false) => {
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeInSeconds = elapsedMs / 1000;
    const finalSec = Math.max(0.2, timeInSeconds);
    setFinalTimeSec(finalSec);
    setHasFinished(true);

    const computedWpm = Math.round((currentItem.wordCount / finalSec) * 60);
    setWpm(computedWpm);

    if (!isTimeout) {
      savePersonalBest(currentItem.id, finalSec);
      playSoundEffect('correct');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      if (onAwardXp) {
        onAwardXp(computedWpm > 100 ? 35 : 20);
      }
    } else {
      playSoundEffect('wrong');
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedMs(0);
    setHasFinished(false);
    setWpm(0);
  };

  // Format Milliseconds to MM:SS.s
  const formatTime = (ms: number) => {
    if (gameMode === 'countdown') {
      const remainingMs = Math.max(0, countdownTarget * 1000 - ms);
      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);
      const tenths = Math.floor((remainingMs % 1000) / 100);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
    }
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
  };

  // Karaoke Pacer (Visual Word Highlighter)
  const startKaraoke = () => {
    stopKaraoke();
    setIsKaraokeRunning(true);
    playSoundEffect('tap');
    let index = 0;
    setKaraokeWordIdx(0);

    const intervalMs = (60 / karaokePacerWpm) * 1000;
    karaokeTimerRef.current = setInterval(() => {
      index++;
      if (index < wordsArray.length) {
        setKaraokeWordIdx(index);
      } else {
        stopKaraoke();
        playSoundEffect('levelup');
      }
    }, intervalMs);
  };

  const stopKaraoke = () => {
    if (karaokeTimerRef.current) clearInterval(karaokeTimerRef.current);
    setIsKaraokeRunning(false);
    setKaraokeWordIdx(-1);
  };

  // Voice recording using Web MediaRecorder
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      playSoundEffect('tap');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        playSoundEffect('tap');
      } catch (err) {
        console.warn('Microphone access denied or unsupported:', err);
        alert(language === 'fr' ? 'Accès au microphone requis.' : 'يرجى السماح بالوصول إلى الميكروفون للتسجيل.');
      }
    }
  };

  // TTS Speech Player
  const handlePlayArabic = async () => {
    playSoundEffect('tap');
    await speakArabic(currentItem.arabicText, audioSpeed);
  };

  if (!isOpen) return null;

  // Rank / Speed evaluation
  const getRankBadge = (calculatedWpm: number) => {
    if (calculatedWpm >= 140) {
      return {
        titleAr: 'صَقْرُ الفَصَاحَةِ وَالسُّرْعَةِ',
        titleFr: 'Aigle de la vitesse (Pro)',
        icon: '🦅',
        color: 'text-amber-400 bg-amber-500/20 border-amber-400/40',
        descAr: 'قراءة استثنائية فائقة السرعة بطلاقة تامة!',
      };
    } else if (calculatedWpm >= 95) {
      return {
        titleAr: 'فَهْدُ القِرَاءَةِ المَاهِرُ',
        titleFr: 'Guépard Agile (Excellent)',
        icon: '🐆',
        color: 'text-emerald-400 bg-emerald-500/20 border-emerald-400/40',
        descAr: 'سرعة ممتازة جداً فوق المعدل الطبيعي!',
      };
    } else if (calculatedWpm >= 55) {
      return {
        titleAr: 'قَارِئٌ سَرِيعٌ وَمُجْتَهِدٌ',
        titleFr: 'Lecteur Rapide (Très Bien)',
        icon: '🐇',
        color: 'text-teal-400 bg-teal-500/20 border-teal-400/40',
        descAr: 'إيقاع قراءة متناسق وجيد جداً.',
      };
    } else {
      return {
        titleAr: 'قَارِئٌ مُتَأَنٍّ وَمُتْقِنٌ',
        titleFr: 'Lecteur Soigné (Bon début)',
        icon: '🐢',
        color: 'text-blue-400 bg-blue-500/20 border-blue-400/40',
        descAr: 'قراءة متأنية، واصل التدريب لزيادة سرعتك!',
      };
    }
  };

  const currentRank = getRankBadge(wpm);

  // Dynamic font sizing
  const fontSizeClasses = [
    'text-xl sm:text-2xl leading-[2.1]',
    'text-2xl sm:text-3xl leading-[2.2]',
    'text-3xl sm:text-4xl md:text-[40px] leading-[2.3]',
    'text-4xl sm:text-5xl md:text-[48px] leading-[2.4]',
    'text-5xl sm:text-6xl md:text-[56px] leading-[2.5]',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* WIDE COCKPIT CONTAINER (Max Width 7XL with panoramic view) */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl w-full max-w-[96vw] xl:max-w-7xl p-4 sm:p-6 shadow-2xl border border-amber-500/30 my-auto max-h-[96vh] flex flex-col">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER BAR                                                         */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <span>{language === 'fr' ? 'Défi : Qui lit le plus vite ?' : language === 'ar' ? 'تَحَدِّي: مَنْ يَقْرَأُ أَسْرَعَ؟' : 'Who Reads Faster Challenge'}</span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                  {language === 'fr' ? 'Chronomètre & WPM' : 'مؤقت ذكي بالثواني والدقائق'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                {language === 'fr'
                  ? 'Visualisez le texte et le chronomètre en temps réel côte à côte pour une fluidité maximale.'
                  : 'رؤية النص والمؤقت الذكي معاً في شاشة بانورامية واحدة لقياس السرعة وطلاقة اللسان.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-[11px] font-mono bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="bg-slate-950 text-slate-300 px-1.5 py-0.2 rounded text-[10px] font-bold">Space</span> = {timerRunning ? (language === 'fr' ? 'Arrêter' : 'إيقاف') : (language === 'fr' ? 'Démarrer' : 'بدء')}
            </span>

            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CATEGORY SELECTOR & TOOLS RIBBON                                       */}
        {/* ========================================================================= */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shrink-0">
          
          {/* Categories - Fully Wrapped (No Horizontal Scroll) */}
          <div className="flex flex-wrap items-center gap-1.5 py-0.5 max-w-3xl">
            <button
              onClick={() => {
                setIsCustomMode(false);
                setSelectedCategory('all');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                !isCustomMode && selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌟 {language === 'fr' ? 'Tous les textes' : 'جميع النصوص'} ({SPEED_READING_ITEMS.length})
            </button>

            <button
              onClick={() => {
                setIsCustomMode(false);
                setSelectedCategory('easy_sentences');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                !isCustomMode && selectedCategory === 'easy_sentences'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌱 {language === 'fr' ? 'Phrases courtes (A1)' : 'جمل قصيرة (A1)'}
            </button>

            <button
              onClick={() => {
                setIsCustomMode(false);
                setSelectedCategory('medium_sentences');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                !isCustomMode && selectedCategory === 'medium_sentences'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌿 {language === 'fr' ? 'Phrases moyennes (A2)' : 'جمل متوسطة (A2)'}
            </button>

            <button
              onClick={() => {
                setIsCustomMode(false);
                setSelectedCategory('short_stories');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                !isCustomMode && selectedCategory === 'short_stories'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              📖 {language === 'fr' ? 'Textes & Histoires (B1/B2)' : 'نصوص وقصص قصيرة'}
            </button>

            <button
              onClick={() => {
                setIsCustomMode(false);
                setSelectedCategory('tongue_twisters');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                !isCustomMode && selectedCategory === 'tongue_twisters'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⚡ {language === 'fr' ? 'Virelangues (Fluence)' : 'طلاقة اللسان وتحدي النطق'}
            </button>

            <button
              onClick={() => {
                setIsCustomMode(false);
                setSelectedCategory('eile_dialogues');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                !isCustomMode && selectedCategory === 'eile_dialogues'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🤝 {language === 'fr' ? 'Dialogues EILE' : 'حوارات وتراكيب EILE'}
            </button>

            <button
              onClick={() => {
                setIsCustomMode(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                isCustomMode
                  ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                  : 'bg-slate-800 text-purple-300 border-purple-500/30 hover:bg-slate-700'
              }`}
            >
              ✍️ {language === 'fr' ? 'Texte libre' : 'نص مخصص'}
            </button>
          </div>

          {/* Quick Tools: Font Size scaling & Translation Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setFontSizeStep((prev) => Math.max(0, prev - 1))}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                title="Diminuer la taille du texte"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] text-amber-300 font-bold">A</span>
              <button
                onClick={() => setFontSizeStep((prev) => Math.min(fontSizeClasses.length - 1, prev + 1))}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                title="Agrandir la taille du texte"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setShowTranslation((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showTranslation
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title="Afficher/masquer la traduction"
            >
              {showTranslation ? '👁️ Traduction' : '🙈 Sans traduction'}
            </button>
          </div>

        </div>

        {/* Custom Text Input Drawer if active */}
        {isCustomMode && (
          <div className="my-2 p-3 bg-slate-800/80 rounded-2xl border border-purple-500/40 animate-fade-in shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <span>✍️ {language === 'fr' ? 'Écrivez ou collez votre texte ou phrase arabe :' : 'اكتب أو الصق الجملة أو النص المراد قياس سرعة قراءته:'}</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {customTextInput.trim() ? customTextInput.trim().split(/\s+/).length : 0} {language === 'fr' ? 'mots' : 'كلمة'}
              </span>
            </div>
            <textarea
              rows={2}
              value={customTextInput}
              onChange={(e) => setCustomTextInput(e.target.value)}
              placeholder="مثال: يَقْرَأُ التِّلْمِيذُ النَّشِيطُ الدَّرْسَ بِسُرْعَةٍ وَإِتْقَانٍ..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-arabic text-base sm:text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-right leading-relaxed"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. PANORAMIC 2-COLUMN VIEW: TIMER COCKPIT (LEFT) + READING STAGE (RIGHT)  */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* --------------------------------------------------------------------- */}
            {/* LEFT / SIDE COCKPIT: LIVE DIGITAL STOPWATCH & SPEED HUD (Cols 1 to 5) */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-0">
              
              {/* BIG DIGITAL TIMER HUD */}
              <div className={`rounded-3xl p-5 sm:p-6 border-2 shadow-2xl transition-all duration-300 flex flex-col items-center justify-center ${
                timerRunning
                  ? 'bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border-amber-400/80 shadow-amber-500/20 ring-4 ring-amber-500/20'
                  : hasFinished
                  ? 'bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border-emerald-500/50 shadow-emerald-500/10'
                  : 'bg-slate-800/90 border-slate-700/80'
              }`}>
                
                {/* Mode Selector pills inside cockpit */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-700/80 text-xs mb-3">
                  <button
                    onClick={() => {
                      setGameMode('stopwatch');
                      resetTimer();
                    }}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                      gameMode === 'stopwatch' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Chronomètre' : 'عداد تصاعدي'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setGameMode('countdown');
                      resetTimer();
                    }}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                      gameMode === 'countdown' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Défi Rebours' : 'تحدي تنازلي'}</span>
                  </button>

                  {gameMode === 'countdown' && (
                    <select
                      value={countdownTarget}
                      onChange={(e) => {
                        setCountdownTarget(Number(e.target.value));
                        resetTimer();
                      }}
                      className="bg-slate-900 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-slate-700 text-xs focus:outline-none"
                    >
                      <option value={5}>5s</option>
                      <option value={10}>10s</option>
                      <option value={15}>15s</option>
                      <option value={20}>20s</option>
                      <option value={30}>30s</option>
                      <option value={60}>60s</option>
                    </select>
                  )}
                </div>

                {/* Digital LED Numbers */}
                <div className="text-center my-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                    {gameMode === 'stopwatch'
                      ? (language === 'fr' ? 'TEMPS ÉCOULÉ (MM:SS.s)' : 'الوَقْتُ المُنْقَضِي (دقيقة : ثانية)')
                      : (language === 'fr' ? 'TEMPS RESTANT' : 'الوَقْتُ المُتَبَقِّي')}
                  </span>
                  <div className={`font-mono text-5xl sm:text-6xl font-black tracking-wider transition-all select-none ${
                    timerRunning
                      ? 'text-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.6)] scale-105'
                      : hasFinished
                      ? 'text-emerald-400 drop-shadow-[0_0_14px_rgba(52,211,153,0.5)]'
                      : 'text-slate-200'
                  }`}>
                    {formatTime(elapsedMs)}
                  </div>
                </div>

                {/* Live Status indicator */}
                <div className="flex items-center gap-2 mt-1 mb-4">
                  {timerRunning ? (
                    <span className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-amber-400/15 px-3 py-0.5 rounded-full border border-amber-400/30 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      {language === 'fr' ? 'Chrono en cours... Lisez !' : 'المؤقت يسجل... اقرأ الآن!'}
                    </span>
                  ) : hasFinished ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold bg-emerald-400/15 px-3 py-0.5 rounded-full border border-emerald-400/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {language === 'fr' ? 'Terminé ! Score calculé' : 'تم الانتهاء! وحساب السرعة'}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      {language === 'fr' ? 'Prêt ? Cliquez ci-dessous' : 'جاهز؟ اضغط على الزر للبدء'}
                    </span>
                  )}
                </div>

                {/* GIANT PRIMARY ACTION BUTTON */}
                <div className="w-full space-y-2">
                  {!timerRunning ? (
                    <button
                      onClick={handleStartTimer}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2.5"
                    >
                      <Play className="w-6 h-6 fill-slate-950" />
                      <span>{hasFinished ? (language === 'fr' ? 'Recommencer le chrono' : 'إعادة المحاولة من جديد') : (language === 'fr' ? 'Démarrer le chrono ⏱️' : 'ابدأ القراءة والتوقيت ! ⏱️')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStopTimer(false)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-lg sm:text-xl shadow-2xl shadow-emerald-500/40 animate-pulse active:scale-95 transition-all flex items-center justify-center gap-2.5 ring-4 ring-emerald-400/30"
                    >
                      <CheckCircle2 className="w-7 h-7" />
                      <span>{language === 'fr' ? 'J’ai fini de lire ! 🏁' : 'أَنْهَيْتُ القِرَاءَةَ ! 🏁'}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetTimer}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Remettre à zéro' : 'تصفير العداد'}</span>
                    </button>

                    {/* Shuffle next text */}
                    {!isCustomMode && (
                      <button
                        onClick={() => {
                          const nextIdx = Math.floor(Math.random() * filteredItems.length);
                          setCurrentIndex(nextIdx);
                          playSoundEffect('tap');
                        }}
                        className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center gap-1 text-xs font-bold"
                        title="Texte aléatoire"
                      >
                        <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{language === 'fr' ? 'Aléatoire' : 'عشوائي'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* TARGET SPEED & BENCHMARK METRICS */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold flex items-center gap-1 text-amber-300">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'fr' ? 'Objectifs de vitesse :' : 'أهداف وتوقيت السرعة:'}</span>
                  </span>
                  <span className="font-mono text-slate-300">{currentItem.wordCount} {language === 'fr' ? 'mots' : 'كلمات'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-750">
                    <span className="text-[10px] text-slate-400 block">{language === 'fr' ? 'Standard' : 'معدل قياسي'}</span>
                    <span className="font-mono font-bold text-teal-300">{currentItem.targetSecondsStandard}s</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-750">
                    <span className="text-[10px] text-amber-400 block font-bold">⚡ {language === 'fr' ? 'Pro / Expert' : 'سرعة الصقر'}</span>
                    <span className="font-mono font-black text-amber-400">{currentItem.targetSecondsPro}s</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-750">
                    <span className="text-[10px] text-slate-400 block">{language === 'fr' ? 'Mon Record' : 'أفضل رقمي'}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {personalBests[currentItem.id] ? `${personalBests[currentItem.id].toFixed(1)}s` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* AUDIO STUDIO: LISTEN & VOICE RECORDING */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'fr' ? 'Guide audio & Prononciation' : 'الاستماع الصوتي وتسجيل القراءة'}</span>
                  </span>

                  <select
                    value={audioSpeed}
                    onChange={(e) => setAudioSpeed(Number(e.target.value))}
                    className="bg-slate-900 text-slate-300 font-bold px-2 py-0.5 rounded-lg text-xs border border-slate-750 focus:outline-none"
                    title="Vitesse de la voix"
                  >
                    <option value={0.6}>0.6x (Lent)</option>
                    <option value={0.85}>0.85x (Normal)</option>
                    <option value={1.1}>1.1x (Rapide)</option>
                    <option value={1.3}>1.3x (Expert)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayArabic}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-750 text-emerald-400 hover:text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs border border-slate-750"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Écouter la prononciation' : 'استمع للنطق الفصيح'}</span>
                  </button>

                  <button
                    onClick={toggleRecording}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      isRecording
                        ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-750 border-slate-750'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-rose-400" />}
                    <span>{isRecording ? (language === 'fr' ? 'Arrêter' : 'إيقاف') : (language === 'fr' ? 'Enregistrer' : 'سجل صوتك')}</span>
                  </button>
                </div>

                {/* Recorded Voice Playback */}
                {recordedAudioUrl && (
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-rose-500/30 text-xs">
                    <span className="text-rose-400 font-bold shrink-0">🎙️ {language === 'fr' ? 'Votre voix :' : 'تسجيلك:'}</span>
                    <audio controls src={recordedAudioUrl} className="h-7 w-full" />
                  </div>
                )}

                {/* Karaoke Visual Pacer Tool */}
                <div className="pt-2 border-t border-slate-750 flex items-center justify-between gap-2">
                  <button
                    onClick={isKaraokeRunning ? stopKaraoke : startKaraoke}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      isKaraokeRunning
                        ? 'bg-amber-400 text-slate-950 border-amber-300 animate-bounce'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-750 border-slate-750'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{isKaraokeRunning ? (language === 'fr' ? 'Arrêter le guide' : 'إيقاف الموجه') : (language === 'fr' ? 'Guide visuel (Karaoké)' : 'موجه السرعة البصري')}</span>
                  </button>

                  <select
                    value={karaokePacerWpm}
                    onChange={(e) => setKaraokePacerWpm(Number(e.target.value))}
                    className="bg-slate-900 text-amber-300 font-bold px-2 py-1 rounded-xl text-xs border border-slate-750 focus:outline-none"
                    title="Vitesse du guide mots/minute"
                  >
                    <option value={60}>60 WPM</option>
                    <option value={90}>90 WPM</option>
                    <option value={120}>120 WPM</option>
                    <option value={150}>150 WPM</option>
                  </select>
                </div>

              </div>

            </div>

            {/* --------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: MAIN ARABIC READING STAGE & QUIZ EVALUATION (Cols 6-12) */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Item Card Meta & Item Carousel Navigation */}
              {!isCustomMode && (
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xl">{currentItem.themeIcon}</span>
                    <span className="font-extrabold text-amber-400 font-arabic text-base">{currentItem.titleAr}</span>
                    <span className="text-slate-400 hidden sm:inline">({currentItem.titleFr})</span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-mono border border-slate-700">
                      {currentItem.wordCount} {language === 'fr' ? 'mots' : 'كلمة'}
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md text-[11px] font-bold">
                      {currentItem.badge}
                    </span>
                  </div>

                  {/* Carousel Previous / Next */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
                        playSoundEffect('tap');
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                      title="Précédent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-slate-400 text-xs font-mono px-1 font-bold">
                      {currentIndex + 1} / {filteredItems.length}
                    </span>
                    <button
                      onClick={() => {
                        setCurrentIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
                        playSoundEffect('tap');
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                      title="Suivant"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* HIGH-IMPACT ARABIC READING BOARD */}
              <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-700/80 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all overflow-hidden flex flex-col justify-between min-h-[300px]">
                
                {/* Top Info Bar inside board */}
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-slate-300">{language === 'fr' ? 'Lisez distinctement à voix haute :' : 'اقرأ بوضوح وبصوت مسموع ومسترسل:'}</span>
                  </div>

                  {personalBests[currentItem.id] && (
                    <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-400/30">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {language === 'fr' ? 'Record :' : 'أفضل توقيت:'} {personalBests[currentItem.id].toFixed(1)}s
                      </span>
                    </div>
                  )}
                </div>

                {/* STICKY LIVE READING STOPWATCH BAR DIRECTLY ABOVE TEXT */}
                <div className="sticky top-0 z-20 my-2.5 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-2 sm:p-3 flex items-center justify-between gap-3 shadow-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`px-3 py-1 sm:py-1.5 rounded-xl font-mono font-black text-lg sm:text-xl flex items-center gap-2 border transition-all ${
                      timerRunning
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-slate-950 text-amber-400 border-slate-750'
                    }`}>
                      <Timer className={`w-4 h-4 ${timerRunning ? 'animate-spin' : ''}`} />
                      <span>{formatTime(elapsedMs)}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-arabic font-extrabold text-slate-200">
                        {timerRunning
                          ? (language === 'fr' ? '⏱️ Chrono en cours... Lisez !' : '⏱️ المؤقت يسجل... اقرأ الآن!')
                          : (language === 'fr' ? 'مؤقت القراءة الذكي' : 'مؤقت القراءة الذكي')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {currentItem.wordCount} {language === 'fr' ? 'mots' : 'كلمات'}
                      </span>
                    </div>
                  </div>

                  {/* Immediate Stop / Start button right above text */}
                  <div className="flex items-center gap-2">
                    {timerRunning ? (
                      <button
                        onClick={() => handleStopTimer(false)}
                        className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-1.5 animate-pulse active:scale-95 transition-all cursor-pointer"
                        title="إيقاف المؤقت فور الانتهاء من القراءة"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>{language === 'fr' ? 'Arrêter le chrono ⏹️' : 'إيقاف المؤقت ⏹️'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStartTimer}
                        className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        title="بدء مؤقت القراءة"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>{language === 'fr' ? 'Démarrer le chrono ▶️' : 'بدء المؤقت ▶️'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* ARABIC TEXT DISPLAY WITH FULL TASHKEEL AND KARAOKE HIGHLIGHT */}
                <div className="text-right py-6 sm:py-8 my-auto" dir="rtl">
                  <p className={`font-arabic font-extrabold text-slate-100 tracking-wide select-none transition-all ${fontSizeClasses[fontSizeStep]}`}>
                    {wordsArray.map((word, wIdx) => {
                      const isHighlighted = isKaraokeRunning && karaokeWordIdx === wIdx;
                      return (
                        <span
                          key={wIdx}
                          className={`inline-block px-1.5 py-0.5 rounded-xl transition-all duration-150 ${
                            isHighlighted
                              ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg font-black'
                              : 'hover:text-amber-300'
                          }`}
                        >
                          {word}{' '}
                        </span>
                      );
                    })}
                  </p>
                </div>

                {/* French / English Translation (Toggleable) */}
                {showTranslation && (
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                    <p className="text-slate-400 italic">
                      « {currentItem.frenchTranslation} »
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">{currentItem.englishTranslation}</span>
                  </div>
                )}

              </div>

              {/* =================================================================== */}
              {/* EVALUATION RESULT & SCORE DASHBOARD (APPEARS WHEN FINISHED)        */}
              {/* =================================================================== */}
              <AnimatePresence>
                {hasFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-amber-500/50 shadow-2xl space-y-4"
                  >
                    
                    {/* Score Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl sm:text-5xl">{currentRank.icon}</div>
                        <div>
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block">
                            {language === 'fr' ? 'ÉVALUATION DE FLUIDITÉ & RAPIDITÉ' : 'تَقْيِيمُ سُرْعَةِ القِرَاءَةِ وَالفَصَاحَةِ'}
                          </span>
                          <h3 className="text-lg sm:text-xl font-black text-white font-arabic">
                            {currentRank.titleAr} <span className="text-sm font-sans font-normal text-slate-400">({currentRank.titleFr})</span>
                          </h3>
                          <p className="text-xs text-slate-300 mt-0.5">{currentRank.descAr}</p>
                        </div>
                      </div>

                      {/* Speed Metrics (WPM + Seconds) */}
                      <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-2xl border border-slate-700">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-bold">VITESSE</span>
                          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{wpm}</span>
                          <span className="text-[10px] text-slate-400 block font-bold">WPM (موت/دقيقة)</span>
                        </div>

                        <div className="h-8 w-px bg-slate-700" />

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-bold">TEMPS</span>
                          <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{finalTimeSec.toFixed(1)}s</span>
                          <span className="text-[10px] text-slate-400 block font-bold">SECONDES</span>
                        </div>
                      </div>
                    </div>

                    {/* Comprehension Quiz (Check understanding) */}
                    {currentItem.question && (
                      <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-700/80 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                          <BookOpen className="w-4 h-4" />
                          <span>{language === 'fr' ? 'Test de compréhension immédiate :' : 'سُؤَالُ الفَهْمِ السَّرِيعِ (اختر الإجابة الصحيحة):'}</span>
                        </div>

                        <p className="font-arabic font-bold text-base sm:text-lg text-white text-right" dir="rtl">
                          {currentItem.question.questionAr}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          {currentItem.question.options.map((opt, oIdx) => {
                            const isSelected = selectedQuizAnswer === oIdx;
                            const showResult = isQuizSubmitted;
                            let btnStyle = 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750';

                            if (showResult) {
                              if (opt.isCorrect) {
                                btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-black ring-2 ring-emerald-400/40';
                              } else if (isSelected && !opt.isCorrect) {
                                btnStyle = 'bg-rose-600 text-white border-rose-400';
                              }
                            } else if (isSelected) {
                              btnStyle = 'bg-amber-500 text-slate-950 border-amber-300 font-bold';
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  if (!isQuizSubmitted) {
                                    setSelectedQuizAnswer(oIdx);
                                    setIsQuizSubmitted(true);
                                    if (opt.isCorrect) {
                                      playSoundEffect('correct');
                                      confetti({ particleCount: 35 });
                                      if (onAwardXp) onAwardXp(15);
                                    } else {
                                      playSoundEffect('wrong');
                                    }
                                  }
                                }}
                                className={`p-3 rounded-xl border text-xs text-right transition-all font-arabic font-bold ${btnStyle}`}
                                dir="rtl"
                              >
                                {opt.textAr}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Next Text Button */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-400">
                        {language === 'fr' ? 'Prêt pour le prochain défi ?' : 'جاهز للنص التالي لرفع رصيدك من النقاط والأوسمة؟'}
                      </span>

                      <button
                        onClick={() => {
                          setCurrentIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
                          playSoundEffect('tap');
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95"
                      >
                        <span>{language === 'fr' ? 'Texte suivant' : 'النص التالي'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. BOTTOM FOOTER                                                          */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{language === 'fr' ? 'Défi de fluence et lecture rapide • EILE & Arabe Langue Vivante' : 'تحدي طلاقة اللسان وسرعة القراءة والفهم • منهاج EILE'}</span>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="px-5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl transition-colors"
          >
            {language === 'fr' ? 'Fermer' : 'إغلاق'}
          </button>
        </div>

      </div>
    </div>
  );
};
