import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Mic,
  Square,
  Sparkles,
  Download,
  Trash2,
  BookOpen,
  Settings2,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  HelpCircle,
  Clock,
  Timer,
  Flame,
  Wand2,
  Music,
  Eye,
  Sliders,
  X,
  Search,
  MessageCircle,
  BrainCircuit,
  GraduationCap,
  Sparkle,
  Bookmark,
  Award,
  Layers,
  Type,
  AlignJustify,
} from 'lucide-react';
import { speakArabic, stopAudio, playSoundEffect } from '../utils/audio';
import { SupportedLanguage } from '../types';
import { PRESET_TEXTS, PresetText } from '../data/readingStudioTexts';
import { ReadingHierarchySection, ReadingHierarchyTab } from './ReadingHierarchySection';
import confetti from 'canvas-confetti';

interface CustomTextReaderStudioProps {
  language: SupportedLanguage;
  onBack?: () => void;
  onEarnXp?: (amount: number) => void;
  initialText?: string;
  initialHierarchyTab?: ReadingHierarchyTab;
}

export type HighlightStyle = 'circle' | 'karaoke' | 'underline' | 'zoom';

export const CustomTextReaderStudio: React.FC<CustomTextReaderStudioProps> = ({
  language,
  onBack,
  onEarnXp,
  initialText = PRESET_TEXTS[0].textAr,
  initialHierarchyTab,
}) => {
  // Current active preset (if any)
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_TEXTS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Text Content State
  const [customText, setCustomText] = useState<string>(initialText);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'reader' | 'hierarchy' | 'oralQuestions' | 'thinking' | 'vocab'>(
    initialHierarchyTab ? 'hierarchy' : 'reader'
  );
  const [hierarchySubTab, setHierarchySubTab] = useState<ReadingHierarchyTab>(
    initialHierarchyTab || 'letters'
  );

  // Question answers / practice state
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [activeRecordingQuestionId, setActiveRecordingQuestionId] = useState<string | null>(null);

  // Playback & Tracking State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85); // TTS speed rate
  const [readingPaceWpm, setReadingPaceWpm] = useState<number>(75); // Target Words Per Minute
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Dedicated Reading Stopwatch State (المؤقت الذكي فوق النص مباشرة)
  const [isReadingTimerRunning, setIsReadingTimerRunning] = useState<boolean>(false);
  const [readingElapsedSeconds, setReadingElapsedSeconds] = useState<number>(0);
  const [readingCompletedTime, setReadingCompletedTime] = useState<number | null>(null);
  const [readingCalculatedWpm, setReadingCalculatedWpm] = useState<number | null>(null);
  const readingTimerIntervalRef = useRef<any>(null);

  // Highlighting & Visual Styling
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>('circle');
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(2); // 0: sm, 1: base, 2: lg, 3: xl, 4: 2xl

  // Voice Recording Studio State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState<boolean>(false);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const playTimerRef = useRef<any>(null);
  const wordsContainerRef = useRef<HTMLDivElement | null>(null);

  // Get active preset object
  const currentPresetIndex = useMemo(() => {
    return PRESET_TEXTS.findIndex((p) => p.id === selectedPresetId);
  }, [selectedPresetId]);

  const currentPreset = useMemo(() => {
    if (currentPresetIndex >= 0) return PRESET_TEXTS[currentPresetIndex];
    return PRESET_TEXTS.find((p) => p.id === selectedPresetId) || PRESET_TEXTS[0];
  }, [selectedPresetId, currentPresetIndex]);

  // Previous / Next Preset Handlers
  const hasPreviousPreset = currentPresetIndex > 0;
  const hasNextPreset = currentPresetIndex >= 0 && currentPresetIndex < PRESET_TEXTS.length - 1;

  const handlePreviousPreset = () => {
    if (hasPreviousPreset) {
      const prevPreset = PRESET_TEXTS[currentPresetIndex - 1];
      handleSelectPreset(prevPreset);
    }
  };

  const handleNextPreset = () => {
    if (hasNextPreset) {
      const nextPreset = PRESET_TEXTS[currentPresetIndex + 1];
      handleSelectPreset(nextPreset);
    }
  };

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(PRESET_TEXTS.map((t) => t.category)));
    return ['all', ...cats];
  }, []);

  // Filtered preset texts
  const filteredPresets = useMemo(() => {
    return PRESET_TEXTS.filter((preset) => {
      const matchCat = selectedCategory === 'all' || preset.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        preset.titleAr.includes(searchQuery.trim()) ||
        preset.textAr.includes(searchQuery.trim()) ||
        preset.titleFr.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Handle Preset Select
  const handleSelectPreset = (preset: PresetText) => {
    setSelectedPresetId(preset.id);
    setCustomText(preset.textAr);
    setIsEditing(false);
    resetReadingTimer();
    playSoundEffect('tap');
  };

  // Split text into words safely
  useEffect(() => {
    const raw = customText.trim();
    if (!raw) {
      setWordsList([]);
      return;
    }
    const words = raw.split(/\s+/).filter(Boolean);
    setWordsList(words);
    setCurrentWordIndex(-1);
    setIsPlaying(false);
    clearTimeout(playTimerRef.current);
  }, [customText]);

  // Format stopwatch MM:SS
  const formatTimerDigits = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(playTimerRef.current);
      clearInterval(recordingTimerRef.current);
      clearInterval(readingTimerIntervalRef.current);
      stopAudio();
    };
  }, []);

  // Voice Recording Functions
  const startRecording = async (questionId?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        playSoundEffect('correct');
        if (questionId) {
          toggleQuestionAnswered(questionId);
        }
        if (onEarnXp) onEarnXp(25);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
        });
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      if (questionId) {
        setActiveRecordingQuestionId(questionId);
      }
      setRecordingTime(0);
      playSoundEffect('tap');

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      alert(
        language === 'ar'
          ? 'تعذر الوصول إلى الميكروفون. يرجى التأكد من منح الإذن للمتصفح.'
          : 'Impossible d’accéder au microphone. Veuillez autoriser l’accès dans votre navigateur.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setActiveRecordingQuestionId(null);
      clearInterval(recordingTimerRef.current);
      playSoundEffect('tap');
    }
  };

  const deleteRecording = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
      setIsPlayingUserAudio(false);
      playSoundEffect('tap');
    }
  };

  const togglePlayUserAudio = () => {
    if (!recordedAudioUrl) return;
    if (!userAudioPlayerRef.current) {
      userAudioPlayerRef.current = new Audio(recordedAudioUrl);
      userAudioPlayerRef.current.onended = () => setIsPlayingUserAudio(false);
    } else {
      userAudioPlayerRef.current.src = recordedAudioUrl;
    }

    if (isPlayingUserAudio) {
      userAudioPlayerRef.current.pause();
      setIsPlayingUserAudio(false);
    } else {
      userAudioPlayerRef.current.play();
      setIsPlayingUserAudio(true);
    }
  };

  // Dedicated Reading Stopwatch Handlers (مؤقت القراءة المباشر فوق النص)
  const startReadingTimer = () => {
    if (isReadingTimerRunning) return;
    setIsReadingTimerRunning(true);
    setReadingCompletedTime(null);
    setReadingCalculatedWpm(null);
    playSoundEffect('tap');
    clearInterval(readingTimerIntervalRef.current);
    readingTimerIntervalRef.current = setInterval(() => {
      setReadingElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const pauseReadingTimer = () => {
    setIsReadingTimerRunning(false);
    clearInterval(readingTimerIntervalRef.current);
    if (isPlaying) {
      pauseReading();
    }
    playSoundEffect('tap');
  };

  const stopReadingTimer = () => {
    setIsReadingTimerRunning(false);
    clearInterval(readingTimerIntervalRef.current);
    if (isPlaying) {
      pauseReading();
    }
    const finalSeconds = readingElapsedSeconds > 0 ? readingElapsedSeconds : 1;
    setReadingCompletedTime(finalSeconds);
    const calculatedWpm = Math.round((wordsList.length / finalSeconds) * 60);
    setReadingCalculatedWpm(calculatedWpm);
    playSoundEffect('correct');
    if (onEarnXp) onEarnXp(20);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const resetReadingTimer = () => {
    setIsReadingTimerRunning(false);
    clearInterval(readingTimerIntervalRef.current);
    setReadingElapsedSeconds(0);
    setReadingCompletedTime(null);
    setReadingCalculatedWpm(null);
    resetReading();
  };

  const handleStartBothReadingAndTimer = () => {
    startReadingTimer();
    startReading();
  };

  // Automated Karaoke Reading Loop
  const startReading = async () => {
    if (wordsList.length === 0) return;
    setIsPlaying(true);
    playSoundEffect('tap');

    // Automatically trigger reading timer if not already ticking
    if (!isReadingTimerRunning) {
      setIsReadingTimerRunning(true);
      setReadingCompletedTime(null);
      setReadingCalculatedWpm(null);
      clearInterval(readingTimerIntervalRef.current);
      readingTimerIntervalRef.current = setInterval(() => {
        setReadingElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    const msPerWord = Math.max(300, Math.round((60 / readingPaceWpm) * 1000));
    let idx = currentWordIndex >= 0 && currentWordIndex < wordsList.length ? currentWordIndex : 0;

    const advanceWord = async () => {
      if (idx >= wordsList.length) {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        setIsReadingTimerRunning(false);
        clearInterval(readingTimerIntervalRef.current);
        const finalSeconds = readingElapsedSeconds > 0 ? readingElapsedSeconds : 1;
        setReadingCompletedTime(finalSeconds);
        const calculatedWpm = Math.round((wordsList.length / finalSeconds) * 60);
        setReadingCalculatedWpm(calculatedWpm);
        playSoundEffect('levelup');
        if (onEarnXp) onEarnXp(20);
        return;
      }

      setCurrentWordIndex(idx);

      const wordElement = document.getElementById(`studio-word-${idx}`);
      if (wordElement) {
        wordElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      if (soundEnabled) {
        const wordText = wordsList[idx];
        speakArabic(wordText, playbackSpeed);
      }

      idx++;
      playTimerRef.current = setTimeout(advanceWord, msPerWord);
    };

    advanceWord();
  };

  const pauseReading = () => {
    setIsPlaying(false);
    clearTimeout(playTimerRef.current);
    stopAudio();
    playSoundEffect('tap');
  };

  const resetReading = () => {
    setIsPlaying(false);
    clearTimeout(playTimerRef.current);
    stopAudio();
    setCurrentWordIndex(-1);
    playSoundEffect('tap');
  };

  const handleWordClick = (index: number) => {
    setCurrentWordIndex(index);
    playSoundEffect('tap');
    if (soundEnabled && wordsList[index]) {
      speakArabic(wordsList[index], playbackSpeed);
    }
  };

  // Font sizes for the text display
  const fontSizes = [
    'text-xl sm:text-2xl leading-loose',
    'text-2xl sm:text-3xl leading-loose',
    'text-3xl sm:text-4xl leading-loose',
    'text-4xl sm:text-5xl leading-loose',
    'text-5xl sm:text-6xl leading-loose',
  ];

  // Helper formatting for seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Color mappings for highlighting
  const getColorClasses = (isActive: boolean) => {
    if (!isActive) return '';

    switch (highlightStyle) {
      case 'circle':
        return 'ring-4 ring-amber-400 bg-amber-400/20 text-amber-950 font-black rounded-2xl scale-110 shadow-lg shadow-amber-400/30';
      case 'karaoke':
        return 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black rounded-xl px-2 py-0.5 shadow-md scale-105';
      case 'underline':
        return 'border-b-4 border-amber-500 text-amber-900 font-black bg-amber-100/60 rounded-md';
      case 'zoom':
        return 'text-amber-700 font-black scale-125 bg-amber-100/90 rounded-2xl px-2.5 shadow-xl';
      default:
        return 'bg-amber-300 text-slate-950 font-black rounded-lg';
    }
  };

  const toggleQuestionAnswered = (qKey: string) => {
    setAnsweredQuestions((prev) => {
      const next = { ...prev, [qKey]: !prev[qKey] };
      if (!prev[qKey]) {
        playSoundEffect('correct');
        if (onEarnXp) onEarnXp(10);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-16">
      
      {/* ========================================================================= */}
      {/* 1. TOP HERO HEADER & CONTROLS                                             */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/60 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-2 border-amber-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'مختبر القراءة الذكي • منهاج الصف الثاني' : language === 'fr' ? 'Studio de Lecture • 2e Année' : 'Smart Reading Studio'}</span>
              </span>
              <span className="bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-0.5 rounded-full border border-white/10">
                15 نصاً دراسياً • تتبع الكلمات • أسئلة شفوية • تسجيل صوتي
              </span>
            </div>

            <h1 dir="rtl" className="font-arabic text-3xl sm:text-4xl font-black text-amber-200 leading-tight flex items-center gap-3">
              <span>قَارِئُ النُّصُوصِ المُتَطَوِّرُ مَعَ التَّتَبُّعِ البَصَرِيِّ</span>
              {currentPreset && <span className="text-2xl">{currentPreset.icon || '📖'}</span>}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-arabic">
              {language === 'fr'
                ? 'Textes du manuel scolaire avec suivi mot par mot, questions orales (نجيب شفوياً) et de réflexion (نفكر), et studio d’enregistrement vocal.'
                : 'اقرأ نصوص منهاج الصف الثاني مع التتبع البصري التفاعلي كلمة بكلمة، واستمع للأسئلة الشفوية والتفكيرية، وسجل صوتك مع قياس الطلاقة.'}
            </p>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border ${
                isEditing
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/25 font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isEditing ? (language === 'ar' ? 'إغلاق مكتبة النصوص' : 'Fermer la bibliothèque') : (language === 'ar' ? 'اختيار نص أو كتابة نص مخصص' : 'Changer de texte')}</span>
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl transition-colors border border-slate-700"
                title="Retour"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Current Active Text Pill */}
        {currentPreset && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentPreset.icon || '📖'}</span>
              <span className="font-arabic font-extrabold text-amber-300 text-sm sm:text-base">
                النَّصُّ الْحَالِيُّ: {currentPreset.titleAr}
              </span>
              <span className="text-xs text-slate-400 font-sans">({currentPreset.titleFr})</span>
              <span className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {currentPreset.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  speakArabic(currentPreset.textAr, playbackSpeed);
                  playSoundEffect('tap');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'قراءة النص كاملاً' : 'Lire tout le texte'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. TEXT SELECTOR & EDITOR DRAWER                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-amber-600" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {language === 'ar' ? 'مكتبة نصوص منهاج الصف الثاني (15 نصاً دراسياً مع التشكيل)' : 'Bibliothèque des 15 textes scolaires :'}
                  </h3>
                  <p className="text-xs text-slate-500">اختر أي نص للانتقال إليه، أو اكتب نصك الخاص في الأسفل</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      playSoundEffect('tap');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? (language === 'ar' ? 'كل النصوص (15)' : 'Tous') : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  dir="rtl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث عن نص أو عنوان...' : 'Rechercher un texte...'}
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Grid of Preset Texts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredPresets.map((preset, idx) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 rounded-2xl text-right transition-all border flex flex-col justify-between gap-2 group ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-slate-50 hover:bg-amber-50/60 border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="text-xl group-hover:scale-110 transition-transform">{preset.icon || '📖'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white font-bold text-slate-500 border border-slate-200">
                        {preset.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-arabic font-black text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                        {preset.titleAr}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 font-sans mt-0.5">
                        {preset.titleFr}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 w-full">
                      <span className="font-arabic">
                        {preset.oralQuestions ? `${preset.oralQuestions.length} أسئلة فَهْم` : 'نص قراءة'}
                      </span>
                      {isSelected ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>محدد</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-amber-600 font-medium">قراءة ⬅️</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Textarea Input */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ar' ? 'أو اكتب / عدّل النص هنا يدوياً (يدعم التشكيل والحركات بالكامل) :' : 'Ou personnalisez le texte ici :'}</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{customText.length} حرفاً</span>
              </label>
              <textarea
                dir="rtl"
                rows={4}
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setSelectedPresetId('');
                }}
                placeholder="أدخل النص العربي هنا مع التشكيل أو بدونه..."
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-arabic text-lg sm:text-xl leading-loose focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all resize-y"
              />
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCustomText('')}
                className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'مسح النص' : 'Effacer'}</span>
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  playSoundEffect('tap');
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>{language === 'ar' ? 'تطبيق وبدء القراءة 🚀' : 'Appliquer et lire 🚀'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. SECTION NAVIGATION TABS (Hierarchy / Reader / Oral Questions / Thinking / Vocab)  */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => {
            setActiveTab('hierarchy');
            playSoundEffect('tap');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'hierarchy'
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'ar' ? 'سُلَّمُ الْقِرَاءَةِ (حروف، مقاطع، كلمات، جمل) 📚' : 'Échelle de lecture 📚'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('reader');
            playSoundEffect('tap');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'reader'
              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'ar' ? 'نَصُّ الْقِرَاءَةِ وَالتَّتَبُّعُ 📖' : 'Lecture guidée 📖'}</span>
        </button>

        {currentPreset?.oralQuestions && currentPreset.oralQuestions.length > 0 && (
          <button
            onClick={() => {
              setActiveTab('oralQuestions');
              playSoundEffect('tap');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'oralQuestions'
                ? 'bg-emerald-600 text-white font-black shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'ar' ? `نُجِيبُ شَفَوِيّاً (${currentPreset.oralQuestions.length}) 🗣️` : 'Questions orales 🗣️'}</span>
          </button>
        )}

        {currentPreset?.thinkingQuestions && currentPreset.thinkingQuestions.length > 0 && (
          <button
            onClick={() => {
              setActiveTab('thinking');
              playSoundEffect('tap');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'thinking'
                ? 'bg-indigo-600 text-white font-black shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{language === 'ar' ? `نُفَكِّرُ (${currentPreset.thinkingQuestions.length}) 💡` : 'Réflexion 💡'}</span>
          </button>
        )}

        {currentPreset?.keywords && currentPreset.keywords.length > 0 && (
          <button
            onClick={() => {
              setActiveTab('vocab');
              playSoundEffect('tap');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'vocab'
                ? 'bg-purple-600 text-white font-black shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkle className="w-4 h-4" />
            <span>{language === 'ar' ? `الْمُفْرَدَاتُ وَالْمَعَانِي (${currentPreset.keywords.length}) 🌟` : 'Vocabulaire 🌟'}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB 0: READING HIERARCHY (Letters -> Syllables -> Words -> Sentences)   */}
      {/* ========================================================================= */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-4">
          <ReadingHierarchySection
            language={language}
            activeSubTab={hierarchySubTab}
            onSelectSubTab={(tab) => {
              setHierarchySubTab(tab);
            }}
            onSelectSentenceForReader={(sentenceText) => {
              setCustomText(sentenceText);
              setSelectedPresetId('');
              setActiveTab('reader');
              playSoundEffect('tap');
            }}
            onEarnXp={onEarnXp}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 1: READING STAGE & TELEPROMPTER                                    */}
      {/* ========================================================================= */}
      {activeTab === 'reader' && (
        <div className="space-y-4">
          {/* Settings & Visual Styling Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
            
            {/* Pointer / Highlight Style Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Eye className="w-4 h-4 text-amber-600" />
                <span>{language === 'ar' ? 'نمط المؤشر :' : 'Style de curseur :'}</span>
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => {
                    setHighlightStyle('circle');
                    playSoundEffect('tap');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    highlightStyle === 'circle'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>⭕</span>
                  <span>{language === 'ar' ? 'دائرة مضيئة' : 'Cercle Halo'}</span>
                </button>

                <button
                  onClick={() => {
                    setHighlightStyle('karaoke');
                    playSoundEffect('tap');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    highlightStyle === 'karaoke'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🟨</span>
                  <span>{language === 'ar' ? 'تظليل كاريوكي' : 'Surlignage'}</span>
                </button>

                <button
                  onClick={() => {
                    setHighlightStyle('underline');
                    playSoundEffect('tap');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    highlightStyle === 'underline'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>〰️</span>
                  <span>{language === 'ar' ? 'سطر سفلي' : 'Ligne'}</span>
                </button>

                <button
                  onClick={() => {
                    setHighlightStyle('zoom');
                    playSoundEffect('tap');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    highlightStyle === 'zoom'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🔍</span>
                  <span>{language === 'ar' ? 'تكبير الكلمة' : 'Zoom'}</span>
                </button>
              </div>
            </div>

            {/* Speed & Reading Pace Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Target WPM */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-2xl text-xs">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-700">{language === 'ar' ? 'السرعة :' : 'Vitesse :'}</span>
                <select
                  value={readingPaceWpm}
                  onChange={(e) => {
                    setReadingPaceWpm(Number(e.target.value));
                    setPlaybackSpeed(Number(e.target.value) / 90);
                  }}
                  className="bg-transparent font-black text-emerald-800 focus:outline-none cursor-pointer text-xs"
                >
                  <option value={45}>45 ك/د (هادئ جداً)</option>
                  <option value={60}>60 ك/د (بطيء ومتأنٍ)</option>
                  <option value={80}>80 ك/د (طبيعي متوازن)</option>
                  <option value={110}>110 ك/د (سريع وطلاقة)</option>
                  <option value={140}>140 ك/د (تحدي سريع)</option>
                </select>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  playSoundEffect('tap');
                }}
                className={`p-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  soundEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
                title="تفعيل أو تعطيل صوت النطق الآلي"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundEnabled ? (language === 'ar' ? 'صوت ناطق' : 'Audio On') : (language === 'ar' ? 'صامت' : 'Silencieux')}</span>
              </button>

              {/* Font scale buttons */}
              <div className="flex items-center bg-slate-100 rounded-2xl p-1 text-xs">
                <button
                  onClick={() => setFontSizeIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded-xl"
                  title="A-"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-black text-amber-700">A</span>
                <button
                  onClick={() => setFontSizeIndex((prev) => Math.min(fontSizes.length - 1, prev + 1))}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded-xl"
                  title="A+"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Main Interactive Teleprompter & Text Stage */}
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/70 rounded-3xl p-6 sm:p-10 border-3 border-amber-300/90 shadow-xl relative min-h-[320px] flex flex-col justify-between">
            
            {/* Top Status Bar: Current Word Index & Dedicated Live Reading Timer directly above text */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 border-b border-amber-100 pb-3 mb-6 gap-2">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {language === 'ar'
                    ? `الكلمة الحالية: ${currentWordIndex >= 0 ? currentWordIndex + 1 : 0} من ${wordsList.length}`
                    : `Mot: ${currentWordIndex >= 0 ? currentWordIndex + 1 : 0} / ${wordsList.length}`}
                </span>
              </div>

              {/* Live Reading Timer & Instant Stop/Start Control directly above the text */}
              <div className="flex items-center gap-2 bg-amber-50/90 border border-amber-300/80 px-2.5 py-1 rounded-xl shadow-2xs">
                <Timer className={`w-3.5 h-3.5 ${isReadingTimerRunning ? 'text-amber-600 animate-spin' : 'text-slate-600'}`} />
                <span className="font-mono font-black text-sm text-slate-900">
                  {formatTimerDigits(readingElapsedSeconds)}
                </span>
                {isReadingTimerRunning ? (
                  <button
                    id="btn-timer-stop-top"
                    onClick={stopReadingTimer}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer animate-pulse"
                    title="إيقاف المؤقت"
                  >
                    <Square className="w-3 h-3 fill-white" />
                    <span>{language === 'ar' ? 'إيقاف ⏹️' : 'Stop ⏹️'}</span>
                  </button>
                ) : (
                  <button
                    id="btn-timer-start-top"
                    onClick={handleStartBothReadingAndTimer}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    title="بدء المؤقت والقراءة"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{language === 'ar' ? 'بدء ▶️' : 'Start ▶️'}</span>
                  </button>
                )}
                {readingCompletedTime !== null && (
                  <span className="text-[11px] font-bold text-emerald-700 font-arabic hidden sm:inline">
                    ({readingCompletedTime} {language === 'ar' ? 'ثانية' : 's'} • {readingCalculatedWpm} {language === 'ar' ? 'ك/د' : 'WPM'})
                  </span>
                )}
              </div>

              <div className="text-slate-400 font-medium font-arabic hidden md:inline">
                💡 {language === 'ar' ? 'انقر على أي كلمة للاستماع إليها مباشرة' : 'Cliquez sur n’importe quel mot pour l’écouter'}
              </div>
            </div>

            {/* The Text Stage: Words wrapped in spans with dynamic animated markers */}
            <div
              ref={wordsContainerRef}
              dir="rtl"
              className={`font-arabic text-slate-900 text-right tracking-wide select-none ${fontSizes[fontSizeIndex]} max-h-[460px] overflow-y-auto pr-2 leading-loose`}
            >
              {wordsList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-sans text-sm">
                  {language === 'ar' ? 'لا يوجد نص حالياً. انقر على "اختيار نص أو كتابة نص مخصص" في الأعلى.' : 'Aucun texte. Cliquez sur "Changer de texte" ci-dessus.'}
                </div>
              ) : (
                wordsList.map((word, index) => {
                  const isActive = currentWordIndex === index;
                  return (
                    <span
                      key={`word-${index}`}
                      id={`studio-word-${index}`}
                      onClick={() => handleWordClick(index)}
                      className={`inline-block mx-1.5 my-1 px-1.5 py-0.5 rounded-xl cursor-pointer transition-all duration-200 relative ${getColorClasses(
                        isActive
                      )} ${!isActive ? 'hover:bg-amber-100 hover:text-amber-900' : ''}`}
                    >
                      {isActive && highlightStyle === 'circle' && (
                        <motion.span
                          layoutId="karaoke-pointer"
                          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-amber-600 select-none pointer-events-none"
                        >
                          👇
                        </motion.span>
                      )}
                      {word}
                    </span>
                  );
                })
              )}
            </div>

            {/* Bottom Playback Action Bar */}
            <div className="mt-8 pt-6 border-t-2 border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
              
              {/* Main Play / Pause / Reset Buttons */}
              <div className="flex items-center gap-3">
                {!isPlaying ? (
                  <button
                    onClick={startReading}
                    className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>{language === 'ar' ? 'بدء القراءة والتتبع ▶️' : 'Démarrer la lecture ▶️'}</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseReading}
                    className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Pause className="w-5 h-5 fill-slate-950" />
                    <span>{language === 'ar' ? 'إيقاف مؤقت ⏸️' : 'Pause ⏸️'}</span>
                  </button>
                )}

                <button
                  onClick={resetReading}
                  className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors border border-slate-200"
                  title="إعادة القراءة من البداية"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Voice Recording Trigger Button */}
              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={() => startRecording()}
                    className="px-5 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-500/25 flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{language === 'ar' ? 'سجّل صوتك وأنت تقرأ 🎙️' : 'Enregistrer ma voix 🎙️'}</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-5 py-3.5 bg-slate-900 text-rose-400 font-black rounded-2xl text-xs sm:text-sm border-2 border-rose-500 shadow-xl flex items-center gap-2 animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-rose-500" />
                    <span>{language === 'ar' ? `جارٍ التسجيل (${formatTime(recordingTime)}) - انقر للإيقاف` : `Enregistrement (${formatTime(recordingTime)}) - Stop`}</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Previous Text / Next Text Navigation Bar (اسفل النصوص) */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Previous Text Button */}
            <button
              onClick={handlePreviousPreset}
              disabled={!hasPreviousPreset}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all border-2 ${
                hasPreviousPreset
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
              <div className="text-right">
                <span className="block text-xs uppercase tracking-wider font-bold">
                  {language === 'ar' ? 'النَّصُّ السَّابِقُ' : 'Texte précédent'}
                </span>
                {hasPreviousPreset && (
                  <span className="block text-[11px] font-normal text-slate-900 line-clamp-1 font-arabic">
                    {PRESET_TEXTS[currentPresetIndex - 1]?.titleAr}
                  </span>
                )}
              </div>
            </button>

            {/* Current Text Indicator / Counter */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-xs font-bold text-slate-500 font-arabic">
                {language === 'ar' ? 'فهرس النصوص الدراسية' : 'Index des textes'}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black font-mono border border-amber-200">
                  {currentPresetIndex >= 0 ? `${currentPresetIndex + 1} / ${PRESET_TEXTS.length}` : 'نص مخصص'}
                </span>
              </div>
              {currentPreset && (
                <span className="text-xs font-black text-slate-800 font-arabic mt-1">
                  {currentPreset.titleAr}
                </span>
              )}
            </div>

            {/* Next Text Button */}
            <button
              onClick={handleNextPreset}
              disabled={!hasNextPreset}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all border-2 ${
                hasNextPreset
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-500 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="text-left sm:text-right">
                <span className="block text-xs uppercase tracking-wider font-bold">
                  {language === 'ar' ? 'النَّصُّ التَّالِي' : 'Texte suivant'}
                </span>
                {hasNextPreset && (
                  <span className="block text-[11px] font-normal text-emerald-100 line-clamp-1 font-arabic">
                    {PRESET_TEXTS[currentPresetIndex + 1]?.titleAr}
                  </span>
                )}
              </div>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 2: ORAL QUESTIONS (نُجِيبُ شَفَوِيّاً)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'oralQuestions' && currentPreset?.oralQuestions && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300/80 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-arabic font-black text-slate-900 text-xl">
                  نُجِيبُ شَفَوِيّاً — {currentPreset.titleAr}
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  استمع لكل سؤال، وتحدث بإجابتك الشفوية، وسجل صوتك لتحصل على نقاط الخبرة (XP)
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
              {currentPreset.oralQuestions.length} أسئلة
            </span>
          </div>

          <div className="space-y-4">
            {currentPreset.oralQuestions.map((question, index) => {
              const qKey = `oral-${currentPreset.id}-${index}`;
              const isAnswered = answeredQuestions[qKey];
              const isCurrentlyRecording = isRecording && activeRecordingQuestionId === qKey;

              return (
                <div
                  key={index}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isAnswered
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-slate-50/80 hover:bg-emerald-50/30 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <p dir="rtl" className="font-arabic text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed text-right">
                        {question}
                      </p>
                      <span className="text-[11px] text-slate-400 font-arabic block mt-1">
                        💡 نصيحة: انقر على زر السماعة للاستماع للسؤال بصوت فصيح
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Speak Question Button */}
                    <button
                      onClick={() => {
                        speakArabic(question, playbackSpeed);
                        playSoundEffect('tap');
                      }}
                      className="p-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="استمع للسؤال"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>استمع</span>
                    </button>

                    {/* Record Answer Button */}
                    {!isCurrentlyRecording ? (
                      <button
                        onClick={() => startRecording(qKey)}
                        className="px-3.5 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        title="سجّل إجابتك الشفوية"
                      >
                        <Mic className="w-4 h-4" />
                        <span>سجّل إجابتك</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-3.5 py-3 bg-slate-900 text-rose-400 rounded-xl text-xs font-black border border-rose-500 flex items-center gap-1.5 animate-pulse"
                      >
                        <Square className="w-4 h-4 fill-rose-500" />
                        <span>إيقاف ({recordingTime}ث)</span>
                      </button>
                    )}

                    {/* Mark As Answered Checkbox */}
                    <button
                      onClick={() => toggleQuestionAnswered(qKey)}
                      className={`p-3 rounded-xl border transition-colors flex items-center gap-1 text-xs font-bold ${
                        isAnswered
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAnswered ? 'أجبتُ' : 'تم الإجابة'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 3: THINKING QUESTIONS (نُفَكِّرُ)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'thinking' && currentPreset?.thinkingQuestions && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-300/80 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-arabic font-black text-slate-900 text-xl">
                  نُفَكِّرُ وَنَتَأَمَّلُ — {currentPreset.titleAr}
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  أسئلة تفكير نقدي وعصف ذهني لتنمية مهارات الفهم العميق والتحليل لدى الطالب
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-full text-xs font-bold">
              {currentPreset.thinkingQuestions.length} أسئلة
            </span>
          </div>

          <div className="space-y-4">
            {currentPreset.thinkingQuestions.map((question, index) => {
              const qKey = `thinking-${currentPreset.id}-${index}`;
              const isAnswered = answeredQuestions[qKey];
              const isCurrentlyRecording = isRecording && activeRecordingQuestionId === qKey;

              return (
                <div
                  key={index}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isAnswered
                      ? 'bg-indigo-50/70 border-indigo-300'
                      : 'bg-slate-50/80 hover:bg-indigo-50/30 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      💡 {index + 1}
                    </span>
                    <div>
                      <p dir="rtl" className="font-arabic text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed text-right">
                        {question}
                      </p>
                      <span className="text-[11px] text-indigo-600 font-arabic block mt-1">
                        🤔 عبّر عن رأيك بحرية، لا توجد إجابة واحدة صحيحة!
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Speak Question Button */}
                    <button
                      onClick={() => {
                        speakArabic(question, playbackSpeed);
                        playSoundEffect('tap');
                      }}
                      className="p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="استمع للسؤال"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>استمع</span>
                    </button>

                    {/* Record Answer Button */}
                    {!isCurrentlyRecording ? (
                      <button
                        onClick={() => startRecording(qKey)}
                        className="px-3.5 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        title="سجّل فكرتك"
                      >
                        <Mic className="w-4 h-4" />
                        <span>سجّل فكرتك</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-3.5 py-3 bg-slate-900 text-rose-400 rounded-xl text-xs font-black border border-rose-500 flex items-center gap-1.5 animate-pulse"
                      >
                        <Square className="w-4 h-4 fill-rose-500" />
                        <span>إيقاف ({recordingTime}ث)</span>
                      </button>
                    )}

                    {/* Mark As Answered Checkbox */}
                    <button
                      onClick={() => toggleQuestionAnswered(qKey)}
                      className={`p-3 rounded-xl border transition-colors flex items-center gap-1 text-xs font-bold ${
                        isAnswered
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAnswered ? 'تأملتُ' : 'تم التفكير'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 4: VOCABULARY & KEYWORDS (الْمُفْرَدَاتُ وَالْمَعَانِي)               */}
      {/* ========================================================================= */}
      {activeTab === 'vocab' && currentPreset?.keywords && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-300/80 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-purple-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md">
                <Sparkle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-arabic font-black text-slate-900 text-xl">
                  الْمُفْرَدَاتُ وَالْمَعَانِي الْمِفْتَاحِيَّةُ — {currentPreset.titleAr}
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  معاني الكلمات الصعبة والجديدة في هذا النص مع الترجمة بالفرنسية والنطق الصوتي
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-xs font-bold">
              {currentPreset.keywords.length} كلمات
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentPreset.keywords.map((kw, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-purple-50/50 border-2 border-purple-200/80 flex items-center justify-between gap-4 group hover:bg-purple-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic text-2xl font-black text-purple-950">
                      {kw.word}
                    </span>
                    <button
                      onClick={() => {
                        speakArabic(kw.word, 0.8);
                        playSoundEffect('tap');
                      }}
                      className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                      title="استمع للكلمة"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p dir="rtl" className="font-arabic text-sm text-slate-700">
                    <strong className="text-purple-900">المعنى:</strong> {kw.meaningAr}
                  </p>
                  <p className="text-xs text-slate-500 font-sans">
                    <strong>Français:</strong> {kw.meaningFr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. USER VOICE RECORDING PLAYBACK & COMPARISON STUDIO                       */}
      {/* ========================================================================= */}
      {recordedAudioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-amber-500/40 text-white shadow-2xl space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black shadow-md">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-base">
                  {language === 'ar' ? 'استوديو الاستماع لتسجيلك الصوتي ومقارنة النطق' : 'Votre enregistrement vocal :'}
                </h3>
                <span className="text-xs text-slate-400 font-arabic">
                  {language === 'fr' ? 'Écoutez votre lecture et comparez-la avec la prononciation modèle' : 'استمع لتلاوتك وقراءتك وقارنها بالنطق الفصيح'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={recordedAudioUrl}
                download="my-arabic-reading.webm"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تحميل الصوت' : 'Télécharger'}</span>
              </a>

              <button
                onClick={deleteRecording}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                title="Supprimer l'enregistrement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Audio Player Controls */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayUserAudio}
                className={`p-3.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md ${
                  isPlayingUserAudio
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/25'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                }`}
              >
                {isPlayingUserAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isPlayingUserAudio ? (language === 'ar' ? 'إيقاف التسجيل' : 'Pause') : (language === 'ar' ? 'تشغيل تسجيلك 🎧' : 'Écouter mon audio 🎧')}</span>
              </button>
            </div>

            {/* Simulated Animated Waveform Bars */}
            <div className="flex items-center gap-1 flex-1 max-w-xs h-8 px-3">
              {[40, 70, 90, 60, 30, 80, 100, 65, 45, 85, 95, 55, 35, 75, 90, 60].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlayingUserAudio ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                  }`}
                  style={{ height: isPlayingUserAudio ? `${h}%` : '25%' }}
                />
              ))}
            </div>

            {/* Model Comparison Button */}
            <button
              onClick={() => {
                if (customText.trim()) {
                  speakArabic(customText.trim(), playbackSpeed);
                  playSoundEffect('tap');
                }
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'استمع للنطق النموذجي' : 'Modèle de référence'}</span>
            </button>

          </div>
        </motion.div>
      )}

    </div>
  );
};
