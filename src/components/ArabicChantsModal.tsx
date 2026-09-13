import React, { useState, useEffect, useRef } from 'react';
import { ArabicChant, ChantVerse, ARABIC_CHANTS_DATA } from '../data/chantsData';
import { SupportedLanguage } from '../types';
import { speakArabic, playSoundEffect } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  BookOpen,
  HelpCircle,
  Printer,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Languages,
  Mic,
  Award,
  Video,
  VideoOff,
  Maximize2,
  Minimize2,
  Plus,
  Edit3,
  RefreshCw,
  Type,
  Eye,
  Sliders,
  Share2,
} from 'lucide-react';

interface ArabicChantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChantId?: string;
  language: SupportedLanguage;
  onOpenTextStudio?: (text?: string) => void;
}

/**
 * Helper to parse any user-entered video URL into an embeddable iframe or direct video link
 */
function parseEmbedVideoUrl(url?: string): { type: 'youtube' | 'vimeo' | 'direct'; embedUrl: string } | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube matchers: watch?v=ID, youtu.be/ID, embed/ID, shorts/ID
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
    };
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/
  );
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
    };
  }

  // Direct MP4/WebM video
  if (trimmed.endsWith('.mp4') || trimmed.endsWith('.webm') || trimmed.endsWith('.ogg')) {
    return {
      type: 'direct',
      embedUrl: trimmed,
    };
  }

  // Fallback if already iframe embed or https link
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return {
      type: 'youtube',
      embedUrl: trimmed,
    };
  }

  return null;
}

export const ArabicChantsModal: React.FC<ArabicChantsModalProps> = ({
  isOpen,
  onClose,
  initialChantId,
  language,
  onOpenTextStudio,
}) => {
  const [selectedChantId, setSelectedChantId] = useState<string>(
    initialChantId || ARABIC_CHANTS_DATA[0].id
  );
  const [activeTab, setActiveTab] = useState<'sing' | 'vocab' | 'quiz' | 'video'>('sing');
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [showFrenchTranslation, setShowFrenchTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);

  // Enlargement & Layout States
  const [isMaximized, setIsMaximized] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showVideo, setShowVideo] = useState(true);
  const [videoLayout, setVideoLayout] = useState<'split' | 'top'>('split');

  // Custom Video URL state (per chant)
  const [customVideoUrls, setCustomVideoUrls] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('arabfacile_chants_custom_videos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isAddingVideoModalOpen, setIsAddingVideoModalOpen] = useState(false);
  const [videoInputUrl, setVideoInputUrl] = useState('');
  const [videoInputError, setVideoInputError] = useState('');

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const timerRef = useRef<any>(null);

  const currentChant =
    ARABIC_CHANTS_DATA.find((c) => c.id === selectedChantId) || ARABIC_CHANTS_DATA[0];

  // Determine current active video URL (custom override if present, or default chant video)
  const currentVideoUrl = customVideoUrls[currentChant.id] || currentChant.defaultVideoUrl;
  const parsedVideo = parseEmbedVideoUrl(currentVideoUrl);

  useEffect(() => {
    if (initialChantId) {
      setSelectedChantId(initialChantId);
    }
  }, [initialChantId]);

  // Clean up speech synthesis & timers on unmount or chant switch
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedChantId]);

  if (!isOpen) return null;

  const handleSelectChant = (id: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAll(false);
    setActiveVerseIndex(null);
    setSelectedChantId(id);
    setSelectedQuizAnswers({});
    setQuizScore(null);
    playSoundEffect('tap');
  };

  // Play single verse with speech synthesis
  const handlePlayVerse = (verse: ChantVerse, index: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveVerseIndex(index);
    speakArabic(verse.lineAr, speechRate);
    setTimeout(() => {
      if (!isPlayingAll) setActiveVerseIndex(null);
    }, 3500);
  };

  // Sing entire chant verse by verse
  const handleTogglePlayAll = () => {
    if (isPlayingAll) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAll(false);
      setActiveVerseIndex(null);
      return;
    }

    setIsPlayingAll(true);
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= currentChant.verses.length) {
        setIsPlayingAll(false);
        setActiveVerseIndex(null);
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        return;
      }

      const v = currentChant.verses[currentIndex];
      setActiveVerseIndex(currentIndex);
      speakArabic(v.lineAr, speechRate);

      const durationMs = Math.max(3000, (v.lineAr.length * 140) / speechRate);
      currentIndex += 1;
      timerRef.current = setTimeout(playNext, durationMs);
    };

    playNext();
  };

  // Save custom video URL
  const handleSaveCustomVideo = () => {
    setVideoInputError('');
    if (!videoInputUrl.trim()) {
      setVideoInputError('الرجاء إدخال رابط فيديو صالح (Veuillez entrer une URL valide)');
      return;
    }

    const parsed = parseEmbedVideoUrl(videoInputUrl.trim());
    if (!parsed) {
      setVideoInputError('صيغة الرابط غير مدعومة. يرجى إدخال رابط يوتيوب أو فيميو أو MP4');
      return;
    }

    const updated = {
      ...customVideoUrls,
      [currentChant.id]: videoInputUrl.trim(),
    };
    setCustomVideoUrls(updated);
    try {
      localStorage.setItem('arabfacile_chants_custom_videos', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setIsAddingVideoModalOpen(false);
    setShowVideo(true);
    setVideoInputUrl('');
    playSoundEffect('correct');
  };

  // Reset to default video URL
  const handleResetDefaultVideo = () => {
    const updated = { ...customVideoUrls };
    delete updated[currentChant.id];
    setCustomVideoUrls(updated);
    try {
      localStorage.setItem('arabfacile_chants_custom_videos', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsAddingVideoModalOpen(false);
    playSoundEffect('tap');
  };

  // Quiz submission
  const handleAnswerQuiz = (qId: string, optionIdx: number) => {
    const updated = { ...selectedQuizAnswers, [qId]: optionIdx };
    setSelectedQuizAnswers(updated);
    playSoundEffect('tap');

    if (Object.keys(updated).length === currentChant.quiz.length) {
      let correct = 0;
      currentChant.quiz.forEach((q) => {
        if (updated[q.id] === q.correctIndex) correct++;
      });
      setQuizScore(correct);
      if (correct === currentChant.quiz.length) {
        playSoundEffect('correct');
        confetti({ particleCount: 80, spread: 90 });
      } else {
        playSoundEffect('tap');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Font size classes for Arabic verses
  const verseTextClass =
    fontSizeLevel === 'xlarge'
      ? 'text-2xl sm:text-3xl lg:text-4xl leading-loose font-black'
      : fontSizeLevel === 'large'
      ? 'text-xl sm:text-2xl lg:text-3xl leading-relaxed font-black'
      : 'text-lg sm:text-xl lg:text-2xl leading-relaxed font-black';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 md:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in ${
        isMaximized ? 'p-0!' : ''
      }`}
    >
      <div
        className={`bg-white flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden transition-all duration-200 ${
          isMaximized
            ? 'w-full h-full rounded-none border-none'
            : 'w-full max-w-7xl h-[96vh] sm:h-[94vh] rounded-3xl'
        }`}
      >
        {/* ========================================================================= */}
        {/* TOP HEADER: Title, Unit, Enlargement & Video Controls                      */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-amber-950 p-4 sm:p-5 text-white relative shrink-0 border-b border-amber-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Title & Metadata */}
            <div className="space-y-1.5" dir="rtl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Music className="w-3.5 h-3.5" />
                  <span>الأناشيد المدرسية (EILE)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-xs font-mono">
                  {currentChant.unitNameFr}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-200 font-mono text-xs font-black">
                  مستوى {currentChant.level}
                </span>
                {parsedVideo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/40 text-xs font-bold flex items-center gap-1">
                    <Video className="w-3 h-3 text-rose-300 animate-pulse" />
                    <span>فيديو متاح 🎥</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-200 font-arabic flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl">{currentChant.icon}</span>
                  <span>{currentChant.titleAr}</span>
                </h2>
                <span className="text-base sm:text-xl font-medium text-slate-200 font-sans">
                  ({currentChant.titleFr})
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl line-clamp-1 sm:line-clamp-2">
                {currentChant.summaryFr}
              </p>
            </div>

            {/* Quick Actions: Video Toggle, Font Size, Maximize, Print, Close */}
            <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center shrink-0">
              {/* Toggle Video Visibility */}
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showVideo
                    ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-200'
                }`}
                title={showVideo ? 'إخفاء شاشة الفيديو' : 'إظهار شاشة الفيديو المرافقة'}
              >
                {showVideo ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{showVideo ? 'الفيديو مفعل' : 'عرض الفيديو'}</span>
              </button>

              {/* Add/Edit Video Link */}
              <button
                onClick={() => {
                  setVideoInputUrl(customVideoUrls[currentChant.id] || currentChant.defaultVideoUrl || '');
                  setVideoInputError('');
                  setIsAddingVideoModalOpen(true);
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                title="إضافة أو تعديل رابط الفيديو لهذه القصيدة"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إضافة فيديو</span>
              </button>

              {/* Maximize / Restore Window */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer"
                title={isMaximized ? 'استعادة الحجم الطبيعي' : 'تكبير الصفحة لملء الشاشة'}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                title="طباعة بطاقة النشيد"
                className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer hidden md:flex items-center justify-center"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl transition-all cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Selector Carousel Tabs for the 3 EILE Chants */}
          <div
            className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar"
            dir="rtl"
          >
            <span className="text-xs font-bold text-amber-300 shrink-0 hidden sm:inline">
              اختر الأنشودة:
            </span>
            {ARABIC_CHANTS_DATA.map((chant) => {
              const isSelected = chant.id === selectedChantId;
              return (
                <button
                  key={chant.id}
                  onClick={() => handleSelectChant(chant.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-md scale-102 ring-2 ring-amber-300/50'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                >
                  <span className="text-base">{chant.icon}</span>
                  <span className="font-arabic">{chant.titleAr}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/25 text-white/95 font-mono">
                    الوحدة {chant.unitNumber}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TOOLBAR: Mode Tabs + Verse Font Size + Audio Controls                     */}
        {/* ========================================================================= */}
        <div className="p-2.5 sm:p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {/* Main Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/90 shadow-2xs">
            <button
              onClick={() => setActiveTab('sing')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sing'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Music className="w-4 h-4 text-amber-400" />
              <span>الأبيات والإنشاد (Chant)</span>
            </button>

            {parsedVideo && (
              <button
                onClick={() => {
                  setActiveTab('video');
                  setShowVideo(true);
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Video className="w-4 h-4 text-rose-400" />
                <span>فيديو النشيد 🎥</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'vocab'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>معاني المفردات (Vocabulaire)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded-full">
                {currentChant.vocabulary.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>فهم النشيد (Quiz)</span>
            </button>
          </div>

          {/* Sing Controls & Font Size Adjuster */}
          {activeTab === 'sing' && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Font Size Adjuster */}
              <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="px-1.5 text-slate-500 text-[10px] flex items-center gap-0.5">
                  <Type className="w-3 h-3" />
                  <span className="hidden sm:inline">حجم الخط:</span>
                </span>
                <button
                  onClick={() => setFontSizeLevel('normal')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    fontSizeLevel === 'normal' ? 'bg-amber-200 font-black text-slate-950' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  عادي
                </button>
                <button
                  onClick={() => setFontSizeLevel('large')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    fontSizeLevel === 'large' ? 'bg-amber-200 font-black text-slate-950' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  كبير
                </button>
                <button
                  onClick={() => setFontSizeLevel('xlarge')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    fontSizeLevel === 'xlarge' ? 'bg-amber-200 font-black text-slate-950' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  كبير جداً
                </button>
              </div>

              {/* French Translation Toggle */}
              <button
                onClick={() => setShowFrenchTranslation(!showFrenchTranslation)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  showFrenchTranslation
                    ? 'bg-amber-100 border-amber-300 text-amber-950 font-black'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">الترجمة الفرنسية</span>
              </button>

              {/* Speed Rate */}
              <button
                onClick={() => setSpeechRate(speechRate === 0.9 ? 0.7 : 0.9)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  speechRate === 0.7
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-black'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
                title="تعديل سرعة الإنشاد للمبتدئين"
              >
                <span>{speechRate === 0.7 ? '🐢 بطيء' : '⚡ سرعة عادية'}</span>
              </button>

              {/* Play All Button */}
              <button
                onClick={handleTogglePlayAll}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                  isPlayingAll
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:brightness-110'
                }`}
              >
                {isPlayingAll ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>إيقاف الإنشاد</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>إنشاد القصيدة كاملة 🎶</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY AREA                                                            */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-slate-50/70">
          
          {/* TAB 1: VERSES & SING ALONG (With Responsive Video Side-by-Side) */}
          {activeTab === 'sing' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              {/* Pedagogical Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3.5 sm:p-4 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs" dir="rtl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>الأهداف التعليمية والمحور (Objectifs Pédagogiques EILE) :</span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-slate-700">
                    {currentChant.pedagogicalObjectivesFr.join(' • ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onOpenTextStudio && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTextStudio(currentChant.verses.map((v) => v.lineAr).join('\n'));
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <span>🎙️</span>
                      <span>استوديو القراءة والتحليل</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Layout: Side-by-Side Video + Verses OR Full Width Verses */}
              <div className={`grid grid-cols-1 ${showVideo && parsedVideo ? 'lg:grid-cols-12' : ''} gap-5 items-start`}>
                
                {/* VIDEO COLUMN (Left side on desktop, or above on mobile) */}
                {showVideo && parsedVideo && (
                  <div className="lg:col-span-5 space-y-3 order-1 lg:order-1 lg:sticky lg:top-0">
                    <div className="bg-white rounded-3xl p-3.5 border-2 border-amber-300/80 shadow-md space-y-2.5">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2" dir="rtl">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                          <span className="font-bold text-xs text-slate-800 font-arabic">
                            {currentChant.videoTitle || 'فيديو الأنشودة التعليمي'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setVideoInputUrl(customVideoUrls[currentChant.id] || currentChant.defaultVideoUrl || '');
                            setVideoInputError('');
                            setIsAddingVideoModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>تغيير الفيديو</span>
                        </button>
                      </div>

                      {/* Video Player Frame */}
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-inner border border-slate-200">
                        {parsedVideo.type === 'direct' ? (
                          <video
                            controls
                            className="w-full h-full object-cover"
                            src={parsedVideo.embedUrl}
                          />
                        ) : (
                          <iframe
                            className="w-full h-full border-0"
                            src={parsedVideo.embedUrl}
                            title={currentChant.titleAr}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1" dir="rtl">
                        <span>💡 استمع للأنشودة وردد الأبيات المقابلة بالتزامن</span>
                        <button
                          onClick={() => setActiveTab('video')}
                          className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>عرض مسرحي ➔</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* VERSES COLUMN */}
                <div className={`${showVideo && parsedVideo ? 'lg:col-span-7' : 'max-w-4xl mx-auto w-full'} space-y-3.5 order-2 lg:order-2`} dir="rtl">
                  {currentChant.verses.map((verse, idx) => {
                    const isActive = activeVerseIndex === idx;

                    return (
                      <div
                        key={verse.id}
                        className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-3 ${
                          isActive
                            ? 'bg-amber-100/90 border-amber-400 shadow-lg scale-[1.01] ring-2 ring-amber-400/40'
                            : 'bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Audio button & Verse index */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handlePlayVerse(verse, idx)}
                              className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                                isActive
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm animate-pulse'
                                  : 'bg-slate-100 hover:bg-emerald-100 text-slate-800 border-slate-200'
                              }`}
                              title="الاستماع لهذا البيت الشعري"
                            >
                              <Volume2 className="w-4 h-4" />
                              <span className="hidden sm:inline">استمع</span>
                            </button>

                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-black flex items-center justify-center border border-slate-200 shadow-2xs">
                              {idx + 1}
                            </span>
                          </div>

                          {/* Arabic Hemistichs: صدر البيت وعجز البيت */}
                          <div className="flex-1 text-center px-1 sm:px-3">
                            <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 font-arabic ${verseTextClass} text-slate-900`}>
                              <span className="text-emerald-950 bg-emerald-50/70 px-3 py-1 rounded-xl shadow-2xs border border-emerald-200/50">
                                {verse.firstHalfAr}
                              </span>
                              <span className="text-amber-500 font-bold hidden sm:inline select-none">
                                ✦
                              </span>
                              <span className="text-slate-900 bg-amber-50/70 px-3 py-1 rounded-xl shadow-2xs border border-amber-200/50">
                                {verse.secondHalfAr}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* French Translation */}
                        {showFrenchTranslation && (
                          <div className="pt-2 border-t border-slate-100 text-left" dir="ltr">
                            <p className="text-xs sm:text-sm font-sans font-medium text-slate-600 italic">
                              🇫🇷 {verse.translationFr}
                            </p>
                            {verse.translitFr && (
                              <p className="text-[11px] font-mono text-amber-800/90 mt-0.5">
                                🗣️ {verse.translitFr}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED CINEMA VIDEO TAB */}
          {activeTab === 'video' && (
            <div className="max-w-4xl mx-auto space-y-4" dir="rtl">
              <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-lg space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎥</span>
                    <div>
                      <h3 className="font-arabic font-black text-lg sm:text-xl text-slate-900">
                        {currentChant.videoTitle || `فيديو أنشودة «${currentChant.titleAr}»`}
                      </h3>
                      <p className="text-xs text-slate-500 font-sans" dir="ltr">
                        {currentChant.titleFr} • EILE Unité {currentChant.unitNumber}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setVideoInputUrl(customVideoUrls[currentChant.id] || currentChant.defaultVideoUrl || '');
                      setVideoInputError('');
                      setIsAddingVideoModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تغيير أو إضافة فيديو مخصص</span>
                  </button>
                </div>

                {/* Large Responsive Video Container */}
                {parsedVideo ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border-2 border-slate-300">
                    {parsedVideo.type === 'direct' ? (
                      <video
                        controls
                        className="w-full h-full object-cover"
                        src={parsedVideo.embedUrl}
                      />
                    ) : (
                      <iframe
                        className="w-full h-full border-0"
                        src={parsedVideo.embedUrl}
                        title={currentChant.titleAr}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
                    <Video className="w-12 h-12 text-slate-400 mx-auto" />
                    <p className="font-arabic text-sm text-slate-600 font-bold">
                      لم يتم تعيين فيديو لهذه الأنشودة بعد. اضغط على الزر أدناه لإضافة رابط يوتيوب أو فيديو.
                    </p>
                    <button
                      onClick={() => setIsAddingVideoModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
                    >
                      إضافة رابط فيديو الآن ➕
                    </button>
                  </div>
                )}

                {/* Verses Scroller under video for sing along */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-slate-700">
                    <span>كلمات الأنشودة للمتابعة (Paroles du chant) :</span>
                    <button
                      onClick={() => setActiveTab('sing')}
                      className="text-emerald-700 hover:text-emerald-800 font-bold"
                    >
                      العودة للأبيات المفصلة ➔
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    {currentChant.verses.map((v, i) => (
                      <div key={v.id} className="flex items-center justify-between text-sm py-1 px-2 hover:bg-white rounded-lg font-arabic font-bold text-slate-800">
                        <span>{i + 1}. {v.lineAr}</span>
                        <span className="text-xs font-sans text-slate-500 font-normal italic" dir="ltr">{v.translationFr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VOCABULARY */}
          {activeTab === 'vocab' && (
            <div className="space-y-4 max-w-5xl mx-auto" dir="rtl">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-bold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    قاموس مفردات أنشودة «{currentChant.titleAr}» مع الشرح باللغة العربية والترجمة الفرنسية:
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono text-xs font-black">
                  {currentChant.vocabulary.length} كلمات
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChant.vocabulary.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200/90 hover:border-amber-300 shadow-2xs space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="font-arabic text-2xl font-black text-emerald-900">
                          {item.wordAr}
                        </h4>
                        <p className="font-arabic text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                          💡 {item.meaningAr}
                        </p>
                      </div>

                      <button
                        onClick={() => speakArabic(item.wordAr)}
                        className="p-2.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-xl transition-colors cursor-pointer"
                        title="نطق الكلمة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-left" dir="ltr">
                      <span className="text-xs font-sans font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        🇫🇷 {item.meaningFr}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUIZ & COMPREHENSION */}
          {activeTab === 'quiz' && (
            <div className="space-y-5 max-w-3xl mx-auto" dir="rtl">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-950 font-bold">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    اختبر فهمك وتذكرك لأبيات أنشودة «{currentChant.titleAr}»:
                  </span>
                </div>
                {quizScore !== null && (
                  <span className="px-3.5 py-1 bg-amber-400 text-slate-950 rounded-xl font-black text-xs shadow-xs">
                    النتيجة: {quizScore} / {currentChant.quiz.length}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {currentChant.quiz.map((q, qIdx) => {
                  const selected = selectedQuizAnswers[q.id];
                  const isAnswered = selected !== undefined;
                  const isCorrect = isAnswered && selected === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="bg-white p-5 rounded-3xl border-2 border-slate-200/90 shadow-2xs space-y-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                            {qIdx + 1}
                          </span>
                          <h4 className="font-arabic font-extrabold text-base sm:text-lg text-slate-900">
                            {q.questionAr}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-sans mr-8" dir="ltr">
                          {q.questionFr}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mr-8">
                        {q.options.map((opt, optIdx) => {
                          const isThisSelected = selected === optIdx;
                          const isThisCorrect = optIdx === q.correctIndex;

                          let btnStyle =
                            'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800';
                          if (isAnswered) {
                            if (isThisCorrect) {
                              btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black';
                            } else if (isThisSelected) {
                              btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-black';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerQuiz(q.id, optIdx)}
                              className={`p-3 rounded-xl border-2 text-right text-xs sm:text-sm font-arabic font-bold transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isAnswered && isThisCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {isAnswered && isThisSelected && !isThisCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div className="mr-8 p-3 rounded-xl bg-slate-100 text-xs font-sans text-slate-700" dir="ltr">
                          💡 {q.explanationFr}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* FOOTER BAR                                                                */}
        {/* ========================================================================= */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-arabic">
            <Music className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="line-clamp-1">
              {language === 'ar'
                ? 'الأناشيد معتمدة ضمن مناهج تعليم اللغة العربية لغير الناطقين بها (EILE) لتعزيز الحفظ الشفهي والموسيقى اللغوية.'
                : 'Chants officiels du programme EILE pour enrichir l’expression orale, la prosodie et le vocabulaire.'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'إغلاق الأناشيد' : 'Fermer'}
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT CUSTOM VIDEO URL                                        */}
      {/* ========================================================================= */}
      {isAddingVideoModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-300 space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="font-arabic font-black text-lg text-slate-900">
                  إضافة أو تعديل فيديو الأنشودة
                </h3>
              </div>
              <button
                onClick={() => setIsAddingVideoModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-sans leading-relaxed" dir="ltr">
              Entrez le lien YouTube, Vimeo ou MP4 du chant ou du dessin animé éducatif :
            </p>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 block">
                رابط الفيديو (Lien URL de la vidéo) :
              </label>
              <input
                type="text"
                value={videoInputUrl}
                onChange={(e) => {
                  setVideoInputUrl(e.target.value);
                  setVideoInputError('');
                }}
                placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs sm:text-sm font-sans"
                dir="ltr"
              />
              {videoInputError && (
                <p className="text-xs text-rose-600 font-bold">{videoInputError}</p>
              )}
            </div>

            {/* Helper presets */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1" dir="rtl">
              <span className="font-bold block">📌 نصائح:</span>
              <p>• يدعم روابط YouTube العادية ومقاطع Shorts والمشاهدات المباشرة.</p>
              <p>• يتم حفظ الرابط تلقائياً في متصفحك ليبقى محفوظاً في كل مرة تفتح فيها النشيد.</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleResetDefaultVideo}
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>استعادة الفيديو الأصلي</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingVideoModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveCustomVideo}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer"
                >
                  حفظ وتطبيق الفيديو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
