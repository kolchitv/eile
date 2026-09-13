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
  Smile,
  Layers,
  Award,
} from 'lucide-react';

interface ArabicChantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChantId?: string;
  language: SupportedLanguage;
  onOpenTextStudio?: (text?: string) => void;
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
  const [activeTab, setActiveTab] = useState<'sing' | 'vocab' | 'quiz'>('sing');
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [showFrenchTranslation, setShowFrenchTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const timerRef = useRef<any>(null);

  const currentChant =
    ARABIC_CHANTS_DATA.find((c) => c.id === selectedChantId) || ARABIC_CHANTS_DATA[0];

  useEffect(() => {
    if (initialChantId) {
      setSelectedChantId(initialChantId);
    }
  }, [initialChantId]);

  // Clean up timer on unmount or chant switch
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

  // Speak single verse
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

  // Sing entire chant step by step
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
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        return;
      }

      const v = currentChant.verses[currentIndex];
      setActiveVerseIndex(currentIndex);
      speakArabic(v.lineAr, speechRate);

      // Estimate duration based on text length and speed
      const durationMs = Math.max(2800, (v.lineAr.length * 130) / speechRate);
      currentIndex += 1;
      timerRef.current = setTimeout(playNext, durationMs);
    };

    playNext();
  };

  // Quiz submission
  const handleAnswerQuiz = (qId: string, optionIdx: number) => {
    const updated = { ...selectedQuizAnswers, [qId]: optionIdx };
    setSelectedQuizAnswers(updated);
    playSoundEffect('tap');

    // Check if all answered
    if (Object.keys(updated).length === currentChant.quiz.length) {
      let correct = 0;
      currentChant.quiz.forEach((q) => {
        if (updated[q.id] === q.correctIndex) correct++;
      });
      setQuizScore(correct);
      if (correct === currentChant.quiz.length) {
        playSoundEffect('correct');
        confetti({ particleCount: 70, spread: 80 });
      } else {
        playSoundEffect('tap');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden my-auto">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-amber-950 p-5 sm:p-6 text-white relative shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="space-y-1.5" dir="rtl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Music className="w-3.5 h-3.5" />
                  <span>قسم الأناشيد المدرسية</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-xs">
                  {currentChant.unitNameFr}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-200 font-mono text-xs font-black">
                  مستوى {currentChant.level}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-amber-200 font-arabic flex items-center gap-2">
                <span>{currentChant.icon}</span>
                <span>{currentChant.titleAr}</span>
                <span className="text-base sm:text-xl font-normal text-slate-200 font-sans">
                  ({currentChant.titleFr})
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 font-sans max-w-2xl">
                {currentChant.summaryFr}
              </p>
            </div>

            {/* Print & Close */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={handlePrint}
                title="طباعة بطاقة النشيد"
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all cursor-pointer hidden sm:flex items-center justify-center"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 bg-white/10 hover:bg-rose-500 hover:text-white text-white rounded-2xl border border-white/20 transition-all cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Songs Selector Carousel Tabs */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar" dir="rtl">
            {ARABIC_CHANTS_DATA.map((chant) => {
              const isSelected = chant.id === selectedChantId;
              return (
                <button
                  key={chant.id}
                  onClick={() => handleSelectChant(chant.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                >
                  <span className="text-base">{chant.icon}</span>
                  <span className="font-arabic">{chant.titleAr}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 text-white/90 font-mono">
                    الوحدة {chant.unitNumber}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Tabs (Chant & Poésie / Vocabulaire / Quiz) */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('sing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sing'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Music className="w-4 h-4 text-amber-400" />
              <span>الأبيات والإنشاد (Chant)</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'vocab'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>معاني الكلمات (Vocabulaire)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded-full">
                {currentChant.vocabulary.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>فهم النشيد (Quiz)</span>
            </button>
          </div>

          {/* Sing Controls Toolbar */}
          {activeTab === 'sing' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFrenchTranslation(!showFrenchTranslation)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  showFrenchTranslation
                    ? 'bg-amber-100 border-amber-300 text-amber-950 font-black'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>الترجمة الفرنسية</span>
              </button>

              <button
                onClick={() => setSpeechRate(speechRate === 0.9 ? 0.7 : 0.9)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  speechRate === 0.7
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-black'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
                title="تعديل سرعة الإنشاد للمبتدئين"
              >
                <span>{speechRate === 0.7 ? '🐢 بطيء للتكرار' : '⚡ سرعة عادية'}</span>
              </button>

              <button
                onClick={handleTogglePlayAll}
                className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* TAB 1: VERSES & SING ALONG */}
          {activeTab === 'sing' && (
            <div className="space-y-4 max-w-4xl mx-auto" dir="rtl">
              
              {/* Pedagogical Header Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>الموضوع والأهداف التعليمية (Objectifs EILE) :</span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-slate-700">
                    {currentChant.pedagogicalObjectivesFr.join(' • ')}
                  </p>
                </div>

                {onOpenTextStudio && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTextStudio(currentChant.verses.map((v) => v.lineAr).join('\n'));
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer transition-colors"
                  >
                    <span>🎙️</span>
                    <span>فتح في استوديو القراءة والتحليل</span>
                  </button>
                )}
              </div>

              {/* Verses Grid/List */}
              <div className="space-y-3 pt-2">
                {currentChant.verses.map((verse, idx) => {
                  const isActive = activeVerseIndex === idx;

                  return (
                    <div
                      key={verse.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                        isActive
                          ? 'bg-amber-100/90 border-amber-400 shadow-md scale-[1.01]'
                          : 'bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        
                        {/* Verse Number & Audio Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePlayVerse(verse, idx)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                              isActive
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm animate-bounce'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-800 border-slate-200'
                            }`}
                            title="الاستماع لهذا البيت الشعري"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span className="hidden sm:inline">استمع</span>
                          </button>

                          <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-black flex items-center justify-center border border-slate-200">
                            {idx + 1}
                          </span>
                        </div>

                        {/* Two Hemistichs / Verses Display (صدر البيت وعجز البيت) */}
                        <div className="flex-1 text-center space-y-1">
                          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 font-arabic text-lg sm:text-2xl font-black text-slate-900 leading-relaxed">
                            <span className="text-emerald-950 bg-emerald-50/50 px-2 py-0.5 rounded-lg">
                              {verse.firstHalfAr}
                            </span>
                            <span className="text-amber-500 font-bold hidden md:inline">✦</span>
                            <span className="text-slate-900 bg-amber-50/50 px-2 py-0.5 rounded-lg">
                              {verse.secondHalfAr}
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* French Translation Box */}
                      {showFrenchTranslation && (
                        <div className="pt-2 border-t border-slate-100 text-left" dir="ltr">
                          <p className="text-xs sm:text-sm font-sans font-medium text-slate-600 italic">
                            🇫🇷 {verse.translationFr}
                          </p>
                          {verse.translitFr && showTransliteration && (
                            <p className="text-[11px] font-mono text-amber-800 mt-0.5">
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
          )}

          {/* TAB 2: VOCABULARY & EXPLANATIONS */}
          {activeTab === 'vocab' && (
            <div className="space-y-4 max-w-4xl mx-auto" dir="rtl">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  قاموس مفردات أنشودة «{currentChant.titleAr}» مع الشرح باللغة العربية والترجمة الفرنسية:
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentChant.vocabulary.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border-2 border-slate-200/90 hover:border-amber-300 shadow-2xs space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="font-arabic text-xl font-black text-emerald-900">
                          {item.wordAr}
                        </h4>
                        <p className="font-arabic text-xs sm:text-sm text-slate-700 font-bold">
                          💡 {item.meaningAr}
                        </p>
                      </div>

                      <button
                        onClick={() => speakArabic(item.wordAr)}
                        className="p-2 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-xl transition-colors cursor-pointer"
                        title="نطق الكلمة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-left" dir="ltr">
                      <span className="text-xs font-sans font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        🇫🇷 {item.meaningFr}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ & COMPREHENSION */}
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
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-xl font-black text-xs">
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
                      className="bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-2xs space-y-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                            {qIdx + 1}
                          </span>
                          <h4 className="font-arabic font-extrabold text-base text-slate-900">
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

        {/* Footer actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-arabic">
            <Music className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'ar'
                ? 'الأناشيد معتمدة ضمن مناهج تعليم اللغة العربية لغير الناطقين بها (EILE) لتعزيز الحفظ الشفهي والموسيقى اللغوية.'
                : 'Chants officiels du programme EILE pour enrichir l’expression orale, la prosodie et le vocabulaire.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xs transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'إغلاق الأناشيد' : 'Fermer'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
