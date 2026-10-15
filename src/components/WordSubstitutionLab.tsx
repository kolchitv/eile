import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  ArrowRight,
  ArrowLeft,
  Play,
  Shuffle,
  Lightbulb,
  BookOpen,
  Mic,
  Bookmark,
  Share2,
} from 'lucide-react';
import {
  SUBSTITUTION_FAMILIES,
  SUBSTITUTION_QUIZZES,
  SubstitutionFamily,
  SubstitutionLetterOption,
  SubstitutionQuizQuestion,
} from '../data/substitutionWordsData';
import { speakArabic, playSoundEffect, stopAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import { SupportedLanguage } from '../types';

interface WordSubstitutionLabProps {
  language: SupportedLanguage;
  onEarnXp?: (amount: number) => void;
  onBack?: () => void;
  initialFamilyId?: string;
  isCompactMode?: boolean;
}

export const WordSubstitutionLab: React.FC<WordSubstitutionLabProps> = ({
  language,
  onEarnXp,
  onBack,
  initialFamilyId,
  isCompactMode = false,
}) => {
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'madd' | 'verbs' | 'nouns'>('all');

  // Selected family
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(
    initialFamilyId || SUBSTITUTION_FAMILIES[0].id
  );

  // Selected letter index within family
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number>(0);

  // Previous word for visual substitution comparison
  const [previousWord, setPreviousWord] = useState<string | null>(null);

  // Lab Mode: 'explore' (توليد واستكشاف بالأسهم) | 'quiz' (تحدي التعويض الذكي)
  const [activeMode, setActiveMode] = useState<'explore' | 'quiz'>('explore');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<string | null>(null);
  const [isQuizAnswerCorrect, setIsQuizAnswerCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Audio animation state
  const [isAssemblingAudio, setIsAssemblingAudio] = useState<boolean>(false);

  // Filtered families
  const filteredFamilies = SUBSTITUTION_FAMILIES.filter((f) => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  const currentFamily: SubstitutionFamily =
    SUBSTITUTION_FAMILIES.find((f) => f.id === selectedFamilyId) || SUBSTITUTION_FAMILIES[0];

  const currentOption: SubstitutionLetterOption =
    currentFamily.letters[selectedLetterIndex] || currentFamily.letters[0];

  // Reset letter index when family changes
  useEffect(() => {
    setSelectedLetterIndex(0);
    setPreviousWord(null);
  }, [selectedFamilyId]);

  // Handle arrow navigation to next / previous letter (مهارة التعويض عبر الأسهم)
  const handleNextLetter = () => {
    setPreviousWord(currentOption.fullWord);
    playSoundEffect('tap');
    const nextIdx = (selectedLetterIndex + 1) % currentFamily.letters.length;
    setSelectedLetterIndex(nextIdx);
    const newWord = currentFamily.letters[nextIdx];
    speakArabic(newWord.fullWord, 0.85);
  };

  const handlePrevLetter = () => {
    setPreviousWord(currentOption.fullWord);
    playSoundEffect('tap');
    const prevIdx =
      selectedLetterIndex === 0 ? currentFamily.letters.length - 1 : selectedLetterIndex - 1;
    setSelectedLetterIndex(prevIdx);
    const newWord = currentFamily.letters[prevIdx];
    speakArabic(newWord.fullWord, 0.85);
  };

  // Keyboard navigation for arrows (Up/Down or Left/Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMode !== 'explore') return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextLetter();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevLetter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLetterIndex, currentFamily, activeMode]);

  // Audio helpers
  const handlePlayLetterOnly = async () => {
    playSoundEffect('tap');
    await speakArabic(currentOption.letter, 0.7);
  };

  const handlePlayBaseOnly = async () => {
    playSoundEffect('tap');
    // Say the base suffix
    await speakArabic(currentFamily.baseSuffix.replace('ـ', ''), 0.75);
  };

  const handlePlayFullWord = async () => {
    playSoundEffect('tap');
    await speakArabic(currentOption.fullWord, 0.85);
    if (onEarnXp) onEarnXp(2);
  };

  const handlePlayExampleSentence = async () => {
    playSoundEffect('tap');
    await speakArabic(currentOption.exampleSentenceAr, 0.85);
  };

  // Step-by-step Assembly & Read (أركب وأنطق خطوة بخطوة)
  const handleAssembleAndRead = async () => {
    if (isAssemblingAudio) return;
    setIsAssemblingAudio(true);
    playSoundEffect('tap');

    // 1. Speak first letter
    await speakArabic(currentOption.letter, 0.7);
    await new Promise((r) => setTimeout(r, 450));

    // 2. Speak base suffix
    const cleanBase = currentFamily.baseSuffix.replace('ـ', '');
    await speakArabic(cleanBase, 0.7);
    await new Promise((r) => setTimeout(r, 450));

    // 3. Speak combined word
    await speakArabic(currentOption.fullWord, 0.85);
    setIsAssemblingAudio(false);

    if (onEarnXp) onEarnXp(5);
  };

  // Quiz Handling
  const currentQuiz = SUBSTITUTION_QUIZZES[currentQuizIndex];

  const handleSelectQuizOption = (word: string) => {
    if (selectedQuizChoice !== null) return;
    setSelectedQuizChoice(word);

    const isCorrect = word === currentQuiz.correctWord;
    setIsQuizAnswerCorrect(isCorrect);

    if (isCorrect) {
      playSoundEffect('correct');
      setQuizScore((prev) => prev + 15);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      speakArabic(word, 0.85);
      if (onEarnXp) onEarnXp(15);
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleNextQuiz = () => {
    setSelectedQuizChoice(null);
    setIsQuizAnswerCorrect(null);
    playSoundEffect('tap');
    setCurrentQuizIndex((prev) => (prev + 1) % SUBSTITUTION_QUIZZES.length);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* ========================================================================= */}
      {/* 1. HEADER BANNER: رَكِّبْ وَاقْرَأْ - مَهَارَةُ التَّعْوِيضِ                   */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-emerald-600/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الوعي الصوتي • مهارة التعويض (Substitution)</span>
              </span>
              <span className="bg-white/15 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                المستوى الأول A1
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-arabic text-amber-200 tracking-wide flex items-center gap-2">
              <span>رَكِّبْ وَاقْرَأْ</span>
              <span className="text-white text-lg sm:text-xl font-normal font-sans">
                | توليد الكلمات بتغيير الحرف الأول
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 font-arabic max-w-2xl leading-relaxed">
              اختر كلمة ثم غيّر الحرف الأول باستخدام الأسهم (▲ ▼) لاستبداله بحروف جديدة واكتشاف كلمات
              مختلفة المعنى بالاستناد إلى نفس المقطع المشترك.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 border border-white/20"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>العودة</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="bg-black/30 p-1 rounded-2xl flex items-center border border-white/10">
              <button
                onClick={() => {
                  setActiveMode('explore');
                  playSoundEffect('tap');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  activeMode === 'explore'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>المختبر التفاعلي</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('quiz');
                  playSoundEffect('tap');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  activeMode === 'quiz'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>تحدي التعويض ({SUBSTITUTION_QUIZZES.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE: EXPLORE & ASSEMBLE (المختبر التفاعلي للتعويض عبر الأسهم)             */}
      {/* ========================================================================= */}
      {activeMode === 'explore' && (
        <div className="space-y-6">
          {/* Category Filter Pills & Word Family Selector */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
              <div>
                <h3 className="font-arabic font-black text-slate-900 text-base flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <span>قائمة اختيار الكلمات والمقاطع المشتركة:</span>
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  اختر عائلة الكلمات التي ترغب في تركيبها وتبديل حرفها الأول
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', labelAr: 'الكل (9 عائلات)' },
                  { id: 'madd', labelAr: 'المدود الثلاثة 🌾' },
                  { id: 'verbs', labelAr: 'أفعال ثلاثية 🏃' },
                  { id: 'nouns', labelAr: 'أدوات وأسماء ✏️' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id as any);
                      playSoundEffect('tap');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-700 text-white shadow-xs font-black'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.labelAr}
                  </button>
                ))}
              </div>
            </div>

            {/* Word Family Buttons Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredFamilies.map((fam) => {
                const isSelected = fam.id === selectedFamilyId;
                return (
                  <button
                    key={fam.id}
                    onClick={() => {
                      setSelectedFamilyId(fam.id);
                      playSoundEffect('tap');
                    }}
                    className={`p-3 rounded-2xl border-2 text-right transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-400/40 scale-[1.02]'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                        {fam.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-bold" dir="ltr">
                        {fam.baseSuffixTranslit}
                      </span>
                    </div>

                    <div>
                      <div className="font-arabic font-black text-xl text-slate-900">
                        {fam.baseSuffix}
                      </div>
                      <p className="text-[11px] text-slate-500 font-arabic line-clamp-1 mt-0.5">
                        {fam.letters.map((l) => l.fullWord).join(' • ')}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                      <span>{fam.letters.length} كلمات</span>
                      <span className="text-slate-400">←</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. MAIN SUBSTITUTION WORKBENCH (المختبر الحركي لتبديل الحرف الأول بالأسهم)  */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl space-y-6">
            {/* Top Toolbar: Family Info + Quick Instructions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
              <div>
                <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
                  {currentFamily.titleAr}
                </span>
                <p className="text-xs text-slate-600 font-arabic mt-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>
                    استخدم الأسهم (▲ ▼) لتغيير الحرف الأول وتوليد كلمة جديدة بواسطة مهارة التعويض
                  </span>
                </p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                  الكلمة {selectedLetterIndex + 1} من {currentFamily.letters.length}
                </span>
                <div className="flex gap-1">
                  {currentFamily.letters.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === selectedLetterIndex
                          ? 'w-6 bg-emerald-600'
                          : 'w-2 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* THE VISUAL EQUATION: [ الحرف الأول مع الأسهم ] + [ المقطع المشترك ] = [ الكلمة الناتجة ] */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* SLOT 1: FIRST LETTER WITH ARROW CONTROLS (الحرف الأول القابل للتغيير بالأسهم) */}
                <div className="md:col-span-4 bg-gradient-to-b from-amber-50 to-orange-50/70 p-4 sm:p-5 rounded-3xl border-2 border-amber-400 shadow-md flex flex-col items-center justify-center gap-2.5 relative group">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full">
                      1. الحرف الأول (المُعَوَّض)
                    </span>
                    <span className="text-[10px] text-amber-800 font-bold">
                      بدّل بالأسهم (▲ ▼)
                    </span>
                  </div>

                  {/* ARROW CONTROLS CLUSTER */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevLetter}
                      className="w-10 h-10 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl flex items-center justify-center font-black shadow-sm transition-all cursor-pointer"
                      title="السابق (سهم يمين أو أسفل)"
                    >
                      <ChevronRight className="w-6 h-6 stroke-[3]" />
                    </button>

                    {/* UP ARROW BUTTON */}
                    <button
                      onClick={handleNextLetter}
                      className="w-14 h-10 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-2xl flex items-center justify-center font-black shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                      title="الحرف التالي (السهم لأعلى)"
                    >
                      <ChevronUp className="w-7 h-7 stroke-[3]" />
                    </button>

                    <button
                      onClick={handleNextLetter}
                      className="w-10 h-10 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl flex items-center justify-center font-black shadow-sm transition-all cursor-pointer"
                      title="التالي (سهم يسار أو أعلى)"
                    >
                      <ChevronLeft className="w-6 h-6 stroke-[3]" />
                    </button>
                  </div>

                  {/* CURRENT LETTER CARD */}
                  <motion.div
                    key={currentOption.letter}
                    initial={{ scale: 0.85, opacity: 0, y: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                    className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-3xl border-4 border-amber-400 shadow-inner flex flex-col items-center justify-center gap-1"
                  >
                    <span className="font-arabic font-black text-5xl sm:text-6xl text-amber-950">
                      {currentOption.letter}
                    </span>
                    <span className="text-[11px] font-bold text-amber-800">
                      {currentOption.letterNameAr}
                    </span>
                  </motion.div>

                  {/* DOWN ARROW BUTTON (السهم لأسفل / الحرف السابق) */}
                  <button
                    onClick={handlePrevLetter}
                    className="w-14 h-10 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-2xl flex items-center justify-center font-black shadow-md transition-all hover:translate-y-0.5 cursor-pointer"
                    title="الحرف السابق (السهم لأسفل)"
                  >
                    <ChevronDown className="w-7 h-7 stroke-[3]" />
                  </button>

                  {/* Letter Quick Chips (اختيار الحرف مباشرة) */}
                  <div className="flex flex-wrap items-center justify-center gap-1 max-w-[240px] pt-1 border-t border-amber-200/80 w-full">
                    {currentFamily.letters.map((opt, idx) => (
                      <button
                        key={opt.letter}
                        onClick={() => {
                          setPreviousWord(currentOption.fullWord);
                          setSelectedLetterIndex(idx);
                          playSoundEffect('tap');
                          speakArabic(opt.fullWord, 0.85);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-arabic font-black transition-all cursor-pointer ${
                          selectedLetterIndex === idx
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-xs scale-105'
                            : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-200'
                        }`}
                        title={`${opt.letterNameAr} ➔ ${opt.fullWord}`}
                      >
                        {opt.letter}
                      </button>
                    ))}
                  </div>

                  {/* Audio button for isolated letter */}
                  <button
                    onClick={handlePlayLetterOnly}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>صوت الحرف</span>
                  </button>
                </div>

                {/* PLUS CONNECTOR [+] */}
                <div className="md:col-span-1 flex flex-col items-center justify-center text-3xl font-black text-amber-500">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shadow-xs">
                    +
                  </div>
                </div>

                {/* SLOT 2: THE BASE COMMON SUFFIX (المقطع الثابت المشترك) */}
                <div className="md:col-span-3 bg-gradient-to-b from-teal-50 to-emerald-50/70 p-5 rounded-3xl border-2 border-teal-300 shadow-md flex flex-col items-center justify-center gap-3">
                  <span className="text-xs font-black text-teal-900 bg-teal-200 px-3 py-0.5 rounded-full">
                    2. المقطع المشترك
                  </span>

                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-3xl border-4 border-teal-400 shadow-inner flex flex-col items-center justify-center gap-1">
                    <span className="font-arabic font-black text-4xl sm:text-5xl text-teal-950">
                      {currentFamily.baseSuffix}
                    </span>
                    <span className="text-[11px] font-bold text-teal-700 font-mono" dir="ltr">
                      {currentFamily.baseSuffixTranslit}
                    </span>
                  </div>

                  <button
                    onClick={handlePlayBaseOnly}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-200/80 hover:bg-teal-300 text-teal-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>صوت المقطع</span>
                  </button>
                </div>

                {/* EQUALS CONNECTOR [=] */}
                <div className="md:col-span-1 flex flex-col items-center justify-center text-3xl font-black text-emerald-600">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-900 shadow-xs">
                    =
                  </div>
                </div>

                {/* SLOT 3: THE ASSEMBLED NEW WORD (الكلمة الجديدة الناتجة عن التعويض) */}
                <div className="md:col-span-3 bg-gradient-to-b from-emerald-600 to-teal-800 text-white p-5 rounded-3xl shadow-xl border-2 border-emerald-400 flex flex-col items-center justify-center gap-3 text-center">
                  <span className="text-xs font-black text-slate-950 bg-amber-400 px-3 py-0.5 rounded-full">
                    3. الكلمة المركبة
                  </span>

                  <motion.div
                    key={currentOption.fullWord}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-full py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-3xl sm:text-4xl">{currentOption.icon}</span>
                    <span className="font-arabic font-black text-4xl sm:text-5xl text-amber-200 tracking-wider">
                      {currentOption.fullWord}
                    </span>
                    <span className="text-xs text-emerald-200 font-mono font-bold" dir="ltr">
                      {currentOption.transliteration}
                    </span>
                  </motion.div>

                  <button
                    onClick={handlePlayFullWord}
                    className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>نطق الكلمة 🔊</span>
                  </button>
                </div>

              </div>

              {/* ACTION BAR: Step-by-Step Composition and Sound */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAssembleAndRead}
                    disabled={isAssemblingAudio}
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                      isAssemblingAudio
                        ? 'bg-amber-300 text-slate-950 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isAssemblingAudio ? 'جارٍ التركيب الصوتي...' : 'رَكِّبْ وَانْطِقْ (أركب وأقرأ 🎬)'}</span>
                  </button>

                  <button
                    onClick={handlePlayExampleSentence}
                    className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-300"
                  >
                    <Volume2 className="w-4 h-4 text-amber-800" />
                    <span>استمع للجملة</span>
                  </button>
                </div>

                {/* Visual Substitution Indicator */}
                {previousWord && previousWord !== currentOption.fullWord && (
                  <div className="bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-300 text-xs font-arabic flex items-center gap-2">
                    <span className="text-slate-500">تم التعويض من:</span>
                    <span className="line-through text-slate-400 font-bold">{previousWord}</span>
                    <span className="text-emerald-700 font-black">⬅️ {currentOption.fullWord}</span>
                  </div>
                )}
              </div>
            </div>

            {/* DIRECT WORD SELECTOR CARDS (اختيار الكلمات مباشرة من العائلة) */}
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
                <div>
                  <h4 className="font-arabic font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <span>اختيار الكلمات من هذه العائلة (استبدال الحرف الأول فوراً):</span>
                  </h4>
                  <p className="text-xs text-slate-600 font-arabic">
                    انقر على أي كلمة لاختيارها مباشرة ومشاهدة معادلة التعويض ونطقها
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
                  {currentFamily.letters.length} كلمات مولدة
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {currentFamily.letters.map((opt, idx) => {
                  const isCurrent = idx === selectedLetterIndex;
                  return (
                    <button
                      key={opt.fullWord}
                      onClick={() => {
                        setPreviousWord(currentOption.fullWord);
                        setSelectedLetterIndex(idx);
                        playSoundEffect('tap');
                        speakArabic(opt.fullWord, 0.85);
                      }}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 relative ${
                        isCurrent
                          ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-md ring-2 ring-amber-300 scale-[1.03]'
                          : 'bg-white hover:bg-amber-50/60 text-slate-900 border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="font-arabic font-black text-xl tracking-wide">
                        {opt.fullWord}
                      </span>
                      <span
                        className={`text-[11px] font-sans truncate max-w-full font-medium ${
                          isCurrent ? 'text-emerald-100' : 'text-slate-500'
                        }`}
                        dir="ltr"
                      >
                        {opt.meaningFr}
                      </span>
                      {isCurrent && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WORD MEANING & SAMPLE SENTENCE DETAILS */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                    {currentOption.icon}
                  </span>
                  <div>
                    <h4 className="font-arabic font-black text-slate-900 text-xl flex items-center gap-2">
                      <span>دَلالَةُ الْكَلِمَةِ:</span>
                      <span className="text-emerald-700 font-extrabold">{currentOption.fullWord}</span>
                    </h4>
                    <p className="text-xs text-slate-500 font-arabic">
                      {currentOption.meaningAr}
                    </p>
                  </div>
                </div>

                <div className="text-left font-sans text-xs space-y-0.5" dir="ltr">
                  <p className="font-bold text-slate-800">🇫🇷 {currentOption.meaningFr}</p>
                  <p className="text-slate-500">🇬🇧 {currentOption.meaningEn}</p>
                </div>
              </div>

              {/* Example sentence card */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-900 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                    مِثَالٌ فِي سِيَاقِ جُمْلَةٍ:
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 font-arabic">
                    « {currentOption.exampleSentenceAr} »
                  </p>
                  <p className="text-xs text-slate-500 font-sans" dir="ltr">
                    🇫🇷 {currentOption.exampleSentenceFr}
                  </p>
                </div>

                <button
                  onClick={handlePlayExampleSentence}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm transition-all active:scale-95 shrink-0"
                  title="استمع لنطق الجملة"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* HORIZONTAL WORDS STRIP (شريط جميع كلمات العائلة مع النقر المباشر) */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-700 font-arabic flex items-center gap-1.5">
                <span>🔄</span>
                <span>جميع الكلمات المولدة بالتعويض في هذه العائلة (انقر على أي كلمة للانتقال إليها):</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {currentFamily.letters.map((opt, idx) => {
                  const isCurrent = idx === selectedLetterIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setPreviousWord(currentOption.fullWord);
                        setSelectedLetterIndex(idx);
                        playSoundEffect('tap');
                        speakArabic(opt.fullWord, 0.85);
                      }}
                      className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        isCurrent
                          ? 'bg-amber-400 border-amber-500 text-slate-950 font-black shadow-md scale-105 ring-2 ring-amber-300'
                          : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="font-arabic font-black text-2xl">{opt.fullWord}</span>
                      <span className="text-[10px] opacity-80 font-arabic">{opt.letterNameAr}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODE: INTERACTIVE QUIZ (تحدي مهارة التعويض الذكي)                         */}
      {/* ========================================================================= */}
      {activeMode === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Award className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-arabic font-black text-slate-900 text-xl">
                  تحدي مهارة التعويض القرائي
                </h3>
                <p className="text-xs text-slate-500 font-arabic">
                  السؤال {currentQuizIndex + 1} من {SUBSTITUTION_QUIZZES.length}
                </p>
              </div>
            </div>

            <div className="bg-amber-100 border border-amber-300 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span className="text-amber-700 font-black text-sm">⭐ النقاط:</span>
              <span className="font-black text-slate-900 text-lg">{quizScore} XP</span>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-indigo-50/70 p-6 rounded-3xl border-2 border-indigo-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full">
                الكلمة الأصلية: {currentQuiz.sourceWord} ⬅️ استبدل بحرف [{currentQuiz.targetLetter}]
              </span>
              <button
                onClick={() => speakArabic(currentQuiz.clueAr, 0.85)}
                className="p-2 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>اسمع السؤال</span>
              </button>
            </div>

            <p className="text-xl sm:text-2xl font-black text-indigo-950 font-arabic leading-relaxed">
              {currentQuiz.clueAr}
            </p>
            <p className="text-xs text-slate-500 font-sans" dir="ltr">
              🇫🇷 {currentQuiz.clueFr}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentQuiz.options.map((opt, i) => {
              const isSelected = selectedQuizChoice === opt;
              const isCorrect = opt === currentQuiz.correctWord;
              const showResult = selectedQuizChoice !== null;

              return (
                <button
                  key={i}
                  disabled={showResult}
                  onClick={() => handleSelectQuizOption(opt)}
                  className={`p-5 rounded-3xl text-3xl font-black font-arabic transition-all border-2 flex items-center justify-center gap-2 ${
                    showResult && isCorrect
                      ? 'bg-emerald-500 border-emerald-600 text-white scale-105 ring-4 ring-emerald-300 shadow-lg'
                      : showResult && isSelected && !isCorrect
                      ? 'bg-rose-500 border-rose-600 text-white'
                      : 'bg-slate-50 hover:bg-indigo-50 border-slate-300 text-slate-900 hover:scale-102 shadow-xs'
                  }`}
                >
                  <span>{opt}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {selectedQuizChoice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <p className="font-arabic font-black text-slate-900 text-lg">
                  {isQuizAnswerCorrect ? '🎉 إجابة صحيحة وممتازة!' : '❌ حاول أن تنتبه للحرف المطلوب:'}
                </p>
                <p className="text-xs text-amber-900 font-arabic mt-1">
                  {currentQuiz.explanationAr}
                </p>
              </div>

              <button
                onClick={handleNextQuiz}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
              >
                <span>السؤال التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
