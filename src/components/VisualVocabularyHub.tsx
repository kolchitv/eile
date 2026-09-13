import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  Search,
  BookOpen,
  CheckCircle2,
  RotateCw,
  Trophy,
  Award,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Zap,
  Mic,
  MicOff,
  Flame,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Eye,
  Layers,
  Heart,
  Grid,
} from 'lucide-react';
import {
  THEMATIC_CATEGORIES,
  THEMATIC_VOCABULARY_ITEMS,
  ThematicCategory,
  ThematicCategoryId,
  ThematicWordItem,
} from '../data/thematicVocabularyData';
import { speakArabic, playSoundEffect, stopAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import { SupportedLanguage } from '../types';

interface VisualVocabularyHubProps {
  language: SupportedLanguage;
  onBack?: () => void;
  onEarnXp?: (amount: number) => void;
  initialCategoryId?: ThematicCategoryId | 'all';
}

type ViewMode = 'grid' | 'flashcards' | 'quiz' | 'practice';

export const VisualVocabularyHub: React.FC<VisualVocabularyHubProps> = ({
  language,
  onBack,
  onEarnXp,
  initialCategoryId = 'all',
}) => {
  // Category & Filter state
  const [selectedCategory, setSelectedCategory] = useState<ThematicCategoryId | 'all'>(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Bookmarks & Mastered storage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [filterBookmarksOnly, setFilterBookmarksOnly] = useState<boolean>(false);

  // Audio settings
  const [audioSpeed, setAudioSpeed] = useState<number>(0.85);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  // Font scale
  const [fontScaleStep, setFontScaleStep] = useState<number>(1); // 0: regular, 1: large, 2: extra-large

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Quiz game state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);
  const [quizStreak, setQuizStreak] = useState<number>(0);

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioMap, setRecordedAudioMap] = useState<Record<string, string>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Expanded example sentence drawer
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  // Load bookmarks from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('faseeh_thematic_vocab_bookmarks');
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSoundEffect('tap');
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('faseeh_thematic_vocab_bookmarks', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Filter items
  const filteredWords = useMemo(() => {
    return THEMATIC_VOCABULARY_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Bookmark filter
      if (filterBookmarksOnly && !bookmarkedIds.includes(item.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesArabic = item.arabic.toLowerCase().includes(query);
        const matchesFr = item.translationFr.toLowerCase().includes(query);
        const matchesEn = item.translationEn.toLowerCase().includes(query);
        const matchesTranslit = item.transliteration.toLowerCase().includes(query);
        return matchesArabic || matchesFr || matchesEn || matchesTranslit;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, filterBookmarksOnly, bookmarkedIds]);

  // Current active category metadata
  const currentCategoryMeta = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return THEMATIC_CATEGORIES.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  // Audio speech handler
  const handlePlayWord = async (item: ThematicWordItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSoundEffect('tap');
    setActiveAudioId(item.id);
    await speakArabic(item.arabic, audioSpeed);
    setActiveAudioId(null);
  };

  const handlePlaySentence = async (item: ThematicWordItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSoundEffect('tap');
    setActiveAudioId(`${item.id}-sentence`);
    await speakArabic(item.exampleAr, audioSpeed);
    setActiveAudioId(null);
  };

  // Voice recording toggle for practice
  const toggleRecordingForWord = async (wordId: string) => {
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
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioMap((prev) => ({ ...prev, [wordId]: audioUrl }));
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        playSoundEffect('tap');
      } catch (err) {
        console.warn('Microphone error:', err);
      }
    }
  };

  // Flashcards navigation
  const currentFlashcard = filteredWords[flashcardIndex] || filteredWords[0];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    playSoundEffect('tap');
    setFlashcardIndex((prev) => (prev < filteredWords.length - 1 ? prev + 1 : 0));
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    playSoundEffect('tap');
    setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : filteredWords.length - 1));
  };

  // Quiz generator
  const quizPool = filteredWords.length >= 4 ? filteredWords : THEMATIC_VOCABULARY_ITEMS;
  const currentQuizItem = quizPool[quizQuestionIndex % quizPool.length];

  const quizOptions = useMemo(() => {
    if (!currentQuizItem) return [];
    // Generate 3 wrong options + 1 correct option
    const otherItems = quizPool.filter((w) => w.id !== currentQuizItem.id);
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...shuffledOthers, currentQuizItem].sort(() => 0.5 - Math.random());
    return combined;
  }, [quizQuestionIndex, currentQuizItem, quizPool]);

  const handleSelectQuizOption = (optionItem: ThematicWordItem, index: number) => {
    if (isQuizAnswered) return;
    setSelectedQuizOption(index);
    setIsQuizAnswered(true);

    const isCorrect = optionItem.id === currentQuizItem.id;
    if (isCorrect) {
      playSoundEffect('correct');
      setQuizScore((s) => s + 1);
      setQuizStreak((st) => st + 1);
      if (onEarnXp) onEarnXp(15);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      playSoundEffect('wrong');
      setQuizStreak(0);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    setIsQuizAnswered(false);
    playSoundEffect('tap');
    setQuizQuestionIndex((prev) => prev + 1);
  };

  // Font sizing styles
  const arabicFontSizes = ['text-2xl sm:text-3xl', 'text-3xl sm:text-4xl', 'text-4xl sm:text-5xl'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* 1. TOP HERO HEADER & NAVIGATION STRIP                                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-amber-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'بنك المفردات المصورة' : language === 'fr' ? 'Dictionnaire Visuel Thématique' : 'Visual Thematic Dictionary'}</span>
              </span>
              <span className="bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                12 مجالات رئيسية • نطق فصيح • أمثلة حية
              </span>
            </div>

            <h1 dir="rtl" className="font-arabic text-3xl sm:text-4xl font-black text-amber-200 leading-tight">
              مَوْسُوعَةُ المَفَاهِيمِ وَالمُفْرَدَاتِ المُصَوَّرَةِ
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              {language === 'fr'
                ? 'Apprenez le vocabulaire essentiel par le visuel, l’écoute et la pratique : Maison, Famille, Salutations, Fruits, École, Animaux et bien plus.'
                : 'تعلّم الكلمات العربية الأساسية بالصور التعبيرية، النطق الفصيح، الترجمة الدقيقة وجمل الاستعمال اليومي.'}
            </p>
          </div>

          {/* Quick Stats & XP Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-750 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">إجمالي الكلمات</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{THEMATIC_VOCABULARY_ITEMS.length}</span>
              <span className="text-[10px] text-emerald-400 font-bold block">مفردة مصورة</span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-750 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">المفضلة</span>
              <span className="text-2xl font-black text-rose-400 font-mono">{bookmarkedIds.length}</span>
              <span className="text-[10px] text-slate-400 font-bold block">محفوظة</span>
            </div>

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

        {/* View Mode Switcher inside Header Banner */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-750">
            <button
              onClick={() => {
                setViewMode('grid');
                playSoundEffect('tap');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'معرض البطاقات المصورة' : language === 'fr' ? 'Galerie Illustrée' : 'Visual Gallery'}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('flashcards');
                playSoundEffect('tap');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'flashcards'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'بطاقات الذاكرة (Flashcards)' : language === 'fr' ? 'Cartes Mémoire' : 'Flashcards'}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('quiz');
                playSoundEffect('tap');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'quiz'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ar' ? 'اختبار الصور والذاكرة' : language === 'fr' ? 'Quiz Visuel' : 'Visual Quiz'}</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">XP</span>
            </button>
          </div>

          {/* Quick Font & Speed Controls */}
          <div className="flex items-center gap-2">
            {/* Pronunciation Speed */}
            <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-750 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={audioSpeed}
                onChange={(e) => setAudioSpeed(Number(e.target.value))}
                className="bg-transparent text-slate-300 font-bold focus:outline-none text-xs cursor-pointer"
              >
                <option value={0.7} className="bg-slate-900 text-white">0.7x (بطيء)</option>
                <option value={0.85} className="bg-slate-900 text-white">0.85x (طبيعي)</option>
                <option value={1.0} className="bg-slate-900 text-white">1.0x (سريع)</option>
              </select>
            </div>

            {/* Font scaling */}
            <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-750 text-xs">
              <button
                onClick={() => setFontScaleStep((prev) => Math.max(0, prev - 1))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="A-"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] text-amber-300 font-bold">A</span>
              <button
                onClick={() => setFontScaleStep((prev) => Math.min(arabicFontSizes.length - 1, prev + 1))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="A+"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THEMATIC CATEGORIES OR DIRECT SELECTION HEADER                         */}
      {/* ========================================================================= */}

      {/* When a specific category is selected: Show breadcrumb & category banner */}
      {selectedCategory !== 'all' && currentCategoryMeta && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 rounded-3xl p-5 sm:p-6 border-2 border-amber-300/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedCategory('all');
                playSoundEffect('tap');
              }}
              className="p-3 bg-white hover:bg-amber-100 text-amber-950 font-bold rounded-2xl border-2 border-amber-300 shadow-xs hover:shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm shrink-0 active:scale-95"
              title="العودة لجميع مجالات المفردات"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              <span>{language === 'ar' ? 'العودة للمجالات' : language === 'fr' ? 'Tous les thèmes' : 'All Domains'}</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-white rounded-2xl shadow-xs border border-amber-200">
                {currentCategoryMeta.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 dir="rtl" className="font-arabic font-black text-xl sm:text-2xl text-slate-900">
                    {currentCategoryMeta.titleAr}
                  </h2>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-2xs">
                    {filteredWords.length} {language === 'ar' ? 'كلمات' : 'mots'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-600 mt-0.5">
                  {language === 'fr' ? currentCategoryMeta.titleFr : currentCategoryMeta.titleEn} — {language === 'fr' ? currentCategoryMeta.descriptionFr : currentCategoryMeta.descriptionAr}
                </p>
              </div>
            </div>
          </div>

          {/* Quick horizontal category switcher pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-md">
            {THEMATIC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setFlashcardIndex(0);
                  playSoundEffect('tap');
                }}
                className={`p-2 rounded-xl text-lg transition-all shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 border-amber-600 shadow-xs scale-110'
                    : 'bg-white hover:bg-amber-50 border-amber-200'
                }`}
                title={cat.titleAr}
              >
                {cat.icon}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. SEARCH & BOOKMARK FILTER BAR                                           */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث بالكلمة العربية، النطق، أو الترجمة الفرنسية (مثال: تفاح، pomme، كتاب)...'
                : language === 'fr'
                ? 'Rechercher en arabe, français ou phonétique (ex: maison, pomme, qalam)...'
                : 'Search words in Arabic, English, or phonetics...'
            }
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Reset to All Domains Button if in single category */}
          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                playSoundEffect('tap');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'عرض كل المجالات' : 'Voir tous les thèmes'}</span>
            </button>
          )}

          {/* Bookmarks Toggle Pill */}
          <button
            onClick={() => {
              setFilterBookmarksOnly((prev) => !prev);
              playSoundEffect('tap');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              filterBookmarksOnly
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${filterBookmarksOnly ? 'fill-white' : 'text-rose-500'}`} />
            <span>{language === 'ar' ? 'الكلمات المحفوظة' : language === 'fr' ? 'Favoris' : 'Bookmarks'}</span>
            <span className="font-mono text-[11px] font-black">({bookmarkedIds.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DEFAULT OVERVIEW: DOMAIN CATEGORY CARDS GRID                           */}
      {/* (When in 'all' view and not searching/filtering bookmarks)                */}
      {/* ========================================================================= */}
      {selectedCategory === 'all' && !searchQuery.trim() && !filterBookmarksOnly && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs">
                📚
              </span>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {language === 'ar'
                  ? 'اختر مجال المفردات لعرض الكلمات والتفاصيل :'
                  : language === 'fr'
                  ? 'Choisissez une catégorie thématique :'
                  : 'Select a Vocabulary Domain :'}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {THEMATIC_CATEGORIES.length} {language === 'ar' ? 'مجالات مصورة' : 'catégories'}
            </span>
          </div>

          {/* Grid of Domain Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {THEMATIC_CATEGORIES.map((cat) => {
              const categoryWords = THEMATIC_VOCABULARY_ITEMS.filter((w) => w.category === cat.id);
              const previewWords = categoryWords.slice(0, 4);

              return (
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    playSoundEffect('tap');
                  }}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200/90 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Category Accent Top Gradient Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${cat.colorGradient}`} />

                  {/* Header: Icon + Word Count Badge */}
                  <div className="flex items-start justify-between gap-3 pt-2">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-4xl shadow-inner border border-amber-200/80 group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>

                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      {categoryWords.length} {language === 'ar' ? 'كلمات' : 'mots'}
                    </span>
                  </div>

                  {/* Category Titles & Description */}
                  <div className="my-4 space-y-1.5">
                    <h3 dir="rtl" className="font-arabic font-black text-lg sm:text-xl text-slate-900 group-hover:text-amber-800 transition-colors">
                      {cat.titleAr}
                    </h3>
                    <p className="text-xs font-extrabold text-amber-700">
                      {language === 'fr' ? cat.titleFr : cat.titleEn}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {language === 'fr' ? cat.descriptionFr : cat.descriptionAr}
                    </p>
                  </div>

                  {/* Word Preview Chips */}
                  <div className="bg-amber-50/60 rounded-2xl p-2.5 border border-amber-100 mb-4">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5" dir="rtl">
                      {language === 'ar' ? 'أمثلة من الكلمات :' : 'Exemples :'}
                    </span>
                    <div className="flex flex-wrap gap-1.5" dir="rtl">
                      {previewWords.map((pw) => (
                        <span
                          key={pw.id}
                          className="font-arabic text-xs font-bold px-2 py-0.5 rounded-lg bg-white text-slate-800 border border-amber-200/70 shadow-2xs"
                        >
                          {pw.arabic}
                        </span>
                      ))}
                      {categoryWords.length > 4 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-amber-200/70 text-amber-950">
                          +{categoryWords.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Call to Action Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-900 group-hover:text-amber-600">
                    <span>{language === 'ar' ? 'تصفح مفردات هذا المجال' : language === 'fr' ? 'Ouvrir le vocabulaire' : 'Open Vocabulary'}</span>
                    <span className="w-7 h-7 rounded-xl bg-amber-100 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                      ➔
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT AREA: BASED ON SELECTED VIEW MODE                         */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* MODE 1: VISUAL CARDS GRID (ILLUSTRATED WORDS FOR SELECTED CATEGORY / SEARCH) */}
      {/* ------------------------------------------------------------------------- */}
      {viewMode === 'grid' && (selectedCategory !== 'all' || searchQuery.trim() || filterBookmarksOnly) && (
        <div className="space-y-4">
          {/* Header indicator for active category word list */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {currentCategoryMeta ? currentCategoryMeta.icon : '🔍'}
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {currentCategoryMeta
                  ? `${language === 'ar' ? 'مفردات' : 'Vocabulaire'} : ${language === 'ar' ? currentCategoryMeta.titleAr : currentCategoryMeta.titleFr}`
                  : searchQuery.trim()
                  ? `${language === 'ar' ? 'نتائج البحث عن' : 'Résultats de recherche'} : "${searchQuery}"`
                  : language === 'ar' ? 'الكلمات المفضلة' : 'Mots favoris'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
              {filteredWords.length} {language === 'ar' ? 'كلمات معروضة' : 'mots'}
            </span>
          </div>

          {filteredWords.length === 0 ? (
            <div className="text-center py-16 bg-white/90 rounded-3xl border-2 border-dashed border-amber-200 p-8">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-bold text-slate-800 text-base">
                {language === 'ar' ? 'لم يتم العثور على كلمات مطابقة للبحث' : 'Aucun mot trouvé pour cette recherche'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ar' ? 'جرب البحث بكلمة أخرى أو اختر مجالا مختلفا.' : 'Essayez une autre recherche ou sélectionnez une catégorie.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterBookmarksOnly(false);
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Réinitialiser les filtres'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWords.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id);
                const isPlaying = activeAudioId === item.id;
                const isSentenceExpanded = expandedWordId === item.id;

                return (
                  <motion.div
                    layout
                    key={item.id}
                    className={`bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group relative overflow-hidden`}
                  >
                    {/* Top row: Category tag & bookmark */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {THEMATIC_CATEGORIES.find((c) => c.id === item.category)?.icon}{' '}
                        {language === 'fr'
                          ? THEMATIC_CATEGORIES.find((c) => c.id === item.category)?.titleFr
                          : THEMATIC_CATEGORIES.find((c) => c.id === item.category)?.titleAr}
                      </span>

                      <button
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Favori"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Visual Illustration Badge */}
                    <div className="my-2 flex items-center justify-center">
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${item.colorBg} border-2 border-amber-200/70 flex items-center justify-center text-5xl sm:text-6xl shadow-inner group-hover:scale-108 transition-transform duration-300 select-none`}>
                        {item.emoji}
                      </div>
                    </div>

                    {/* Arabic Vocalized Word & Transliteration */}
                    <div className="text-center my-2">
                      <h3
                        dir="rtl"
                        className={`font-arabic font-black text-slate-900 tracking-wide text-center leading-snug cursor-pointer hover:text-amber-700 transition-colors ${arabicFontSizes[fontScaleStep]}`}
                        onClick={() => handlePlayWord(item)}
                      >
                        {item.arabic}
                      </h3>
                      <p className="text-[11px] font-mono text-emerald-800 font-bold mt-0.5">
                        {item.transliteration}
                      </p>
                    </div>

                    {/* French & English Meaning */}
                    <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200/70 text-center mb-3">
                      <p className="text-xs font-bold text-slate-800">
                        🇫🇷 {item.translationFr}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        🇬🇧 {item.translationEn}
                      </p>
                      {item.pluralAr && (
                        <p className="text-[10px] text-amber-900 font-arabic font-bold mt-1" dir="rtl">
                          جَمْعُهَا: <span className="text-emerald-800 font-black">{item.pluralAr}</span>
                        </p>
                      )}
                    </div>

                    {/* Action Buttons: Audio & Example Sentence Toggle */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handlePlayWord(item, e)}
                          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                            isPlaying
                              ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{language === 'ar' ? 'استمع للنطق' : 'Écouter'}</span>
                        </button>

                        <button
                          onClick={() => setExpandedWordId(isSentenceExpanded ? null : item.id)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                            isSentenceExpanded
                              ? 'bg-amber-100 text-amber-950 border-amber-300'
                              : 'bg-slate-50 text-slate-700 hover:bg-amber-50 border-slate-200'
                          }`}
                          title="Exemple de phrase"
                        >
                          <BookOpen className="w-4 h-4 text-amber-700" />
                        </button>
                      </div>

                      {/* Expandable Example Sentence */}
                      <AnimatePresence>
                        {isSentenceExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3 rounded-2xl border border-slate-700 space-y-1.5 text-xs shadow-md"
                          >
                            <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold border-b border-slate-700 pb-1">
                              <span>جُمْلَةُ الاسْتِعْمَالِ :</span>
                              <button
                                onClick={() => handlePlaySentence(item)}
                                className="p-1 text-emerald-400 hover:text-white flex items-center gap-1"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>نطق الجملة</span>
                              </button>
                            </div>

                            <p dir="rtl" className="font-arabic text-sm text-slate-100 font-extrabold leading-relaxed">
                              {item.exampleAr}
                            </p>

                            <p className="text-[11px] text-slate-300 italic">
                              « {item.exampleFr} »
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* MODE 2: 3D FLIP FLASHCARDS                                                */}
      {/* ------------------------------------------------------------------------- */}
      {viewMode === 'flashcards' && currentFlashcard && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-xl space-y-6">
            
            {/* Flashcard Header & Navigation */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {THEMATIC_CATEGORIES.find((c) => c.id === currentFlashcard.category)?.icon}{' '}
                {THEMATIC_CATEGORIES.find((c) => c.id === currentFlashcard.category)?.titleAr}
              </span>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
                <span>{flashcardIndex + 1}</span>
                <span>/</span>
                <span>{filteredWords.length}</span>
              </div>
            </div>

            {/* 3D Interactive Card Stage */}
            <div
              onClick={() => {
                setIsFlipped(!isFlipped);
                playSoundEffect('tap');
              }}
              className="relative h-80 w-full cursor-pointer perspective-1000 select-none group"
            >
              <div
                className={`w-full h-full rounded-3xl border-2 transition-all duration-500 transform-style-3d p-6 flex flex-col justify-between shadow-lg ${
                  isFlipped
                    ? 'bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white border-amber-400 rotate-y-180 shadow-amber-500/10'
                    : 'bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80 text-slate-900 border-amber-300 hover:border-amber-400'
                }`}
              >
                {!isFlipped ? (
                  /* FRONT OF CARD: LARGE PICTURE & ARABIC WORD */
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                    <div className="text-7xl sm:text-8xl drop-shadow-md animate-bounce-short">
                      {currentFlashcard.emoji}
                    </div>
                    <div>
                      <h2 dir="rtl" className="font-arabic font-black text-3xl sm:text-4xl text-slate-900">
                        {currentFlashcard.arabic}
                      </h2>
                      <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
                        {currentFlashcard.transliteration}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                      💡 {language === 'fr' ? 'Touchez pour voir la traduction' : 'انقر لقلب البطاقة ومعرفة المعنى'}
                    </span>
                  </div>
                ) : (
                  /* BACK OF CARD: TRANSLATION & EXAMPLE */
                  <div className="flex flex-col justify-between h-full transform-rotate-y-180 text-center py-2 space-y-3">
                    <div className="flex items-center justify-between text-xs text-amber-300">
                      <span className="font-bold">المعنى والترجمة</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayWord(currentFlashcard);
                        }}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1 text-xs"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>نطق</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {currentFlashcard.translationFr}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {currentFlashcard.translationEn}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-right" dir="rtl">
                      <span className="text-[10px] text-amber-300 font-bold block mb-0.5">مثال:</span>
                      <p className="font-arabic text-sm text-slate-100 font-bold">
                        {currentFlashcard.exampleAr}
                      </p>
                      <p className="text-[11px] text-slate-400 italic text-left" dir="ltr">
                        « {currentFlashcard.exampleFr} »
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevFlashcard}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'ar' ? 'السابق' : 'Précédent'}</span>
              </button>

              <button
                onClick={() => handlePlayWord(currentFlashcard)}
                className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-transform"
                title="Prononcer le mot"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextFlashcard}
                className="py-3 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 transition-all"
              >
                <span>{language === 'ar' ? 'التالي' : 'Suivant'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* MODE 3: VISUAL QUIZ & MATCH GAME                                          */}
      {/* ------------------------------------------------------------------------- */}
      {viewMode === 'quiz' && currentQuizItem && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 text-white shadow-2xl space-y-6">
            
            {/* Quiz Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg">
                  🏆
                </span>
                <div>
                  <h3 className="font-black text-white text-base">
                    {language === 'ar' ? 'تحدي مطابقة المفردة والصورة' : language === 'fr' ? 'Défi : Associez le mot à l\'image' : 'Match Word with Picture'}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {language === 'fr' ? 'Choisissez le mot arabe qui correspond à l’image' : 'اختر الكلمة العربية المطابقة للصورة المعروضة'}
                  </span>
                </div>
              </div>

              {/* Score & Streak */}
              <div className="flex items-center gap-3">
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-750 text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">النقاط</span>
                  <span className="text-base font-black text-amber-400 font-mono">{quizScore} XP</span>
                </div>

                {quizStreak > 1 && (
                  <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1.5 rounded-xl text-xs font-bold animate-pulse">
                    <Flame className="w-4 h-4 fill-orange-400" />
                    <span>x{quizStreak}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Target Visual Prompt (Big Emoji + Audio Button) */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-3">
              <div className="text-8xl sm:text-9xl drop-shadow-lg animate-pulse">
                {currentQuizItem.emoji}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayWord(currentQuizItem)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'استمع لنطق الكلمة' : 'Écouter le son'}</span>
                </button>

                <span className="text-xs font-bold text-slate-400">
                  (« {currentQuizItem.translationFr} »)
                </span>
              </div>
            </div>

            {/* 4 Interactive Choice Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizOptions.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = opt.id === currentQuizItem.id;
                
                let btnStyle = 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700';
                if (isQuizAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400 shadow-lg';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-600 text-white border-rose-400';
                  } else {
                    btnStyle = 'bg-slate-900 text-slate-500 border-slate-800 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isQuizAnswered}
                    onClick={() => handleSelectQuizOption(opt, idx)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-right font-arabic ${btnStyle}`}
                  >
                    <span className="text-xs font-sans text-slate-400">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <div className="flex-1">
                      <span className="text-xl sm:text-2xl font-black block" dir="rtl">
                        {opt.arabic}
                      </span>
                      <span className="text-[11px] font-mono text-slate-300 font-sans block" dir="ltr">
                        {opt.transliteration}
                      </span>
                    </div>
                    {isQuizAnswered && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Question button when answered */}
            {isQuizAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2"
              >
                <button
                  onClick={handleNextQuizQuestion}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <span>{language === 'ar' ? 'السؤال التالي 🎯' : 'Question Suivante 🎯'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
