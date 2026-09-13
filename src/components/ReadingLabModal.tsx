import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  X, 
  Sparkles, 
  BookOpen, 
  Play, 
  Pause, 
  CheckCircle2, 
  Award, 
  Flame, 
  RotateCcw, 
  HelpCircle,
  Layers,
  GraduationCap,
  FileText
} from 'lucide-react';
import { FIRST_GRADE_READING_DATA, ReadingCategory, WordItem } from '../data/readingLabData';
import { speakArabic, playSoundEffect } from '../utils/audio';
import confetti from 'canvas-confetti';
import { SupportedLanguage } from '../types';

interface ReadingLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  initialCategoryId?: string;
}

export const ReadingLabModal: React.FC<ReadingLabModalProps> = ({
  isOpen,
  onClose,
  language,
  initialCategoryId,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(
    initialCategoryId || FIRST_GRADE_READING_DATA[0].id
  );
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [isSlowAudio, setIsSlowAudio] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activePlayIdx, setActivePlayIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'grid' | 'game' | 'worksheet'>('grid');

  // Game state
  const [gameScore, setGameScore] = useState(0);
  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [gameOptions, setGameOptions] = useState<WordItem[]>([]);
  const [selectedGameChoice, setSelectedGameChoice] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const currentCategory = FIRST_GRADE_READING_DATA.find((c) => c.id === selectedCatId) || FIRST_GRADE_READING_DATA[0];

  // Set default word when category changes
  useEffect(() => {
    if (currentCategory && currentCategory.words.length > 0) {
      setSelectedWord(currentCategory.words[0]);
    }
  }, [selectedCatId]);

  // Audio helper
  const handlePlayWord = async (word: WordItem, slow = isSlowAudio) => {
    setSelectedWord(word);
    playSoundEffect('tap');
    await speakArabic(word.arabic, slow ? 0.6 : 0.85);
  };

  const handlePlaySyllable = async (syl: string) => {
    playSoundEffect('tap');
    await speakArabic(syl, 0.7);
  };

  // Karaoke Auto-play loop
  useEffect(() => {
    let timeoutId: any;
    if (isAutoPlaying && currentCategory) {
      const words = currentCategory.words;
      let currentIndex = activePlayIdx !== null ? activePlayIdx : 0;

      const playNext = async () => {
        if (!isAutoPlaying) return;
        if (currentIndex >= words.length) {
          setIsAutoPlaying(false);
          setActivePlayIdx(null);
          return;
        }

        const current = words[currentIndex];
        setActivePlayIdx(currentIndex);
        setSelectedWord(current);
        await speakArabic(current.arabic, isSlowAudio ? 0.6 : 0.85);

        timeoutId = setTimeout(() => {
          currentIndex++;
          playNext();
        }, isSlowAudio ? 1600 : 1200);
      };

      playNext();
    } else {
      setActivePlayIdx(null);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAutoPlaying, selectedCatId]);

  // Start a new game round
  const startNewGameRound = () => {
    setSelectedGameChoice(null);
    setIsAnswerCorrect(null);
    const words = currentCategory.words;
    if (words.length < 4) return;

    const randomIndex = Math.floor(Math.random() * words.length);
    const target = words[randomIndex];
    setTargetWord(target);

    // Pick 3 other random words
    const others = words.filter((w) => w.id !== target.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const roundOptions = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setGameOptions(roundOptions);

    // Speak the target word after a brief delay
    setTimeout(() => {
      speakArabic(target.arabic, 0.8);
    }, 300);
  };

  useEffect(() => {
    if (activeTab === 'game') {
      startNewGameRound();
    }
  }, [activeTab, selectedCatId]);

  const handleSelectGameOption = (option: WordItem) => {
    if (selectedGameChoice !== null || !targetWord) return;
    setSelectedGameChoice(option.id);

    if (option.id === targetWord.id) {
      setIsAnswerCorrect(true);
      playSoundEffect('correct');
      setGameScore((prev) => prev + 10);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        startNewGameRound();
      }, 1400);
    } else {
      setIsAnswerCorrect(false);
      playSoundEffect('wrong');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
                <GraduationCap className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif">
                    {language === 'ar' ? 'مختبر القراءة والتهجئة (الصف الأول متقدم)' : language === 'fr' ? 'Atelier de Lecture & Phonetique (1re Année Avancé)' : 'Reading & Phonics Lab (1st Grade Advanced)'}
                  </h2>
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    6 ورشات كاملة
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                  {language === 'ar'
                    ? 'تدريب نطق الكلمات البسيطة، المدود الثلاثة (الألف، الواو، الياء)، والمقطع الساكن بصوت واضح وتقطيع هجائي'
                    : language === 'fr'
                    ? 'Prononciation interactive, découpage syllabique des voyelles courtes, longues (ā, ū, ī) et soukoūn'
                    : 'Interactive pronunciation, syllable breakdown of short/long vowels and sukoon'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Category Tabs (6 Worksheets from the PDF) */}
          <div className="bg-slate-100 p-2 sm:p-3 border-b border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-2">
            {FIRST_GRADE_READING_DATA.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCatId(cat.id);
                    setIsAutoPlaying(false);
                    playSoundEffect('tap');
                  }}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400/40'
                      : 'bg-white text-slate-700 hover:bg-slate-200/80 border-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${isSelected ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {cat.pageNumber}
                  </span>
                  <span>{cat.titleAr}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Header Toolbar: Mode Selector + Audio Speed */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* View Mode Buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setActiveTab('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'grid'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{language === 'ar' ? 'الشبكة التفاعلية والتقطيع' : 'Grille Interactive'}</span>
              </button>

              <button
                onClick={() => setActiveTab('worksheet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'worksheet'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'ar' ? 'ورقة القراءة الأصلية' : 'Fiche Originale'}</span>
              </button>

              <button
                onClick={() => setActiveTab('game')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'game'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'تحدي القراءة السريعة' : 'Défi de Lecture'}</span>
              </button>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSlowAudio(!isSlowAudio)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  isSlowAudio
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🐢</span>
                <span>{isSlowAudio ? 'نطق هجائي بطيء' : 'نطق عادي'}</span>
              </button>

              {activeTab === 'grid' && (
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                    isAutoPlaying
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>إيقاف القراءة الآلية</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>قراءة آلية للكل (كاريوكي)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            
            {/* Rule explanation banner */}
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-600 text-white">
                    {currentCategory.badge}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {currentCategory.titleAr}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  💡 {currentCategory.ruleExplanationAr}
                </p>
                <p className="text-xs text-slate-500 italic mt-0.5" dir="ltr">
                  {currentCategory.ruleExplanationFr}
                </p>
              </div>

              <div className="text-left font-sans text-xs text-emerald-800 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-100 shrink-0">
                <span>{currentCategory.words.length} كلمات تعليمية</span>
              </div>
            </div>

            {/* TAB 1: Interactive Grid with Phonics Breakdown */}
            {activeTab === 'grid' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Word Cards Grid (4 Columns) */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currentCategory.words.map((word, idx) => {
                      const isSelected = selectedWord?.id === word.id;
                      const isKaraokeActive = activePlayIdx === idx;
                      return (
                        <motion.button
                          key={word.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handlePlayWord(word)}
                          className={`p-4 rounded-2xl text-center border transition-all flex flex-col items-center justify-center relative overflow-hidden shadow-2xs ${
                            isKaraokeActive
                              ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-400 scale-105 shadow-lg'
                              : isSelected
                              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          {/* Top audio icon */}
                          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span className="font-mono text-[10px] opacity-70">#{idx + 1}</span>
                            <Volume2 className={`w-4 h-4 ${isSelected || isKaraokeActive ? 'text-emerald-700' : 'text-slate-300'}`} />
                          </div>

                          {/* Large Arabic Word with Tashkeel */}
                          <div className="text-3xl sm:text-4xl font-bold font-serif my-1 text-slate-900 tracking-wide">
                            {word.arabic}
                          </div>

                          {/* Syllable preview */}
                          <div className="text-xs text-emerald-700 font-medium mt-1">
                            {word.syllables.join(' • ')}
                          </div>

                          {/* French / English Translation */}
                          <div className="text-[11px] text-slate-500 truncate max-w-[120px] mt-0.5" dir="ltr">
                            {language === 'ar' ? word.french : language === 'fr' ? word.french : word.english}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Right/Focus Panel: Word Deep-Dive & Syllable Breakdown */}
                <div className="lg:col-span-4">
                  {selectedWord ? (
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md sticky top-4 space-y-5">
                      <div className="text-center pb-4 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          بطاقة التهجئة والنطق
                        </span>
                        
                        {/* Word Mega Display */}
                        <div className="text-5xl sm:text-6xl font-black font-serif text-emerald-900 my-3">
                          {selectedWord.arabic}
                        </div>

                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold font-mono" dir="ltr">
                          /{selectedWord.transliteration}/
                        </div>

                        {/* Audio play button */}
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <button
                            onClick={() => handlePlayWord(selectedWord, false)}
                            className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center gap-2 active:scale-95 transition"
                          >
                            <Volume2 className="w-5 h-5" />
                            <span>استمع للنطق</span>
                          </button>

                          <button
                            onClick={() => handlePlayWord(selectedWord, true)}
                            className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-bold active:scale-95 transition"
                            title="نطق بطيء"
                          >
                            <span>🐢 بطيء</span>
                          </button>
                        </div>
                      </div>

                      {/* Syllable Breakdown (التقطيع الصوتي) */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                          <span>✂️ التقطيع الهجائي الصوتي:</span>
                          <span className="text-[10px] text-slate-400 font-normal">(اضغط على المقطع لسماعه)</span>
                        </h4>

                        <div className="flex items-center justify-center gap-2">
                          {selectedWord.syllables.map((syl, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handlePlaySyllable(syl)}
                              className="flex-1 py-3 px-2 rounded-2xl bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-300 text-slate-900 font-bold text-2xl font-serif text-center transition active:scale-95 flex flex-col items-center gap-1 group"
                            >
                              <span>{syl}</span>
                              <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Translations */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">الفرنسية (Français):</span>
                          <span className="font-medium text-slate-900" dir="ltr">{selectedWord.french}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">الإنجليزية (English):</span>
                          <span className="font-medium text-slate-900" dir="ltr">{selectedWord.english}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300 p-6 text-center">
                      <BookOpen className="w-12 h-12 text-slate-300 mb-2" />
                      <p className="text-sm">اضغط على أي كلمة لعرض تفاصيلها ونطقها الهجائي</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: Original Worksheet Layout (Matching the PDF) */}
            {activeTab === 'worksheet' && (
              <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-xl border-4 border-slate-800">
                <div className="text-center pb-6 border-b-2 border-slate-800 mb-6">
                  <h3 className="text-2xl sm:text-3xl font-black font-serif text-slate-900">
                    {currentCategory.titleAr}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 font-sans">
                    {currentCategory.titleFr} • {currentCategory.badge}
                  </p>
                </div>

                {/* 4x4 or 4x5 Table matching exactly the original PDF */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-2 border-slate-800 rounded-xl overflow-hidden shadow-inner bg-slate-900">
                  {currentCategory.words.map((word, idx) => (
                    <button
                      key={word.id}
                      onClick={() => handlePlayWord(word)}
                      className="bg-white hover:bg-amber-50 p-4 sm:p-6 border border-slate-800 flex flex-col items-center justify-center text-center transition group relative"
                    >
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-900 group-hover:text-emerald-800 transition">
                        {word.arabic}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition">
                        اضغط للنطق 🔊
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 text-center text-xs text-slate-400">
                  <span>منهاج تعليم القراءة باللغة العربية • الصف الأول متقدم</span>
                </div>
              </div>
            )}

            {/* TAB 3: Fast Reading Quiz / Game */}
            {activeTab === 'game' && (
              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200 text-center space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    <span className="font-bold text-slate-800">
                      النقاط: <span className="text-emerald-700 text-lg">{gameScore} XP</span>
                    </span>
                  </div>

                  <button
                    onClick={startNewGameRound}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>تخطي / كلمة أخرى</span>
                  </button>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    استمع للصوت واختر الكلمة الصحيحة
                  </span>
                  
                  {targetWord && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => speakArabic(targetWord.arabic, 0.8)}
                        className="w-24 h-24 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition"
                      >
                        <Volume2 className="w-10 h-10 animate-bounce" />
                        <span className="text-[11px] font-bold">أعد الاستماع</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 4 Choices */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {gameOptions.map((opt) => {
                    const isSelected = selectedGameChoice === opt.id;
                    const isTarget = targetWord?.id === opt.id;

                    let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900';
                    if (selectedGameChoice !== null) {
                      if (isTarget) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-700 shadow-lg';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-500 text-white border-red-600';
                      } else {
                        btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={selectedGameChoice !== null}
                        onClick={() => handleSelectGameOption(opt)}
                        className={`py-5 px-4 rounded-2xl text-2xl sm:text-3xl font-bold font-serif border-2 transition-all active:scale-95 ${btnStyle}`}
                      >
                        {opt.arabic}
                      </button>
                    );
                  })}
                </div>

                {isAnswerCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-2xl text-sm font-bold ${
                      isAnswerCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                    }`}
                  >
                    {isAnswerCorrect ? '🎉 أحسنت! إجابة صحيحة +10 نقاط' : '❌ حاول مرة أخرى! استمع جيداً'}
                  </motion.div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
