import React, { useState } from 'react';
import { LessonUnit, SupportedLanguage } from '../types';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { LetterTraceCanvas } from './LetterTraceCanvas';
import { SentenceBuilderGame } from './SentenceBuilderGame';
import { FlashcardsGame } from './FlashcardsGame';
import { ContinuousSpeakingLab } from './ContinuousSpeakingLab';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  PenTool,
  MessageSquare,
  Layers,
  ArrowLeft,
  ArrowRight,
  Flame,
  Award,
  Video,
  Mic,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonViewProps {
  unit: LessonUnit;
  onBack: () => void;
  onCompleteUnit: (unitId: string, earnedXp: number) => void;
  language: SupportedLanguage;
  onOpenVideoLibrary?: (category?: string, query?: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  unit,
  onBack,
  onCompleteUnit,
  language,
  onOpenVideoLibrary,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tracing' | 'dialogue' | 'reading' | 'speaking' | 'exercises' | 'flashcards'>(
    unit.tracingLetters && unit.tracingLetters.length > 0 ? 'tracing' : 'dialogue'
  );

  // Exercise state
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedExercisesCount, setCompletedExercisesCount] = useState(0);

  const currentExercise = unit.exercises[currentExerciseIdx];

  const handleSelectOption = (opt: string) => {
    if (hasEvaluated) return;
    setSelectedAnswer(opt);
    playSoundEffect('tap');
  };

  const handleEvaluateExercise = () => {
    if (selectedAnswer === null || hasEvaluated) return;

    const correct = selectedAnswer === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setHasEvaluated(true);

    if (correct) {
      playSoundEffect('correct');
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      setCompletedExercisesCount((c) => c + 1);
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleNextExercise = () => {
    playSoundEffect('tap');
    setSelectedAnswer(null);
    setHasEvaluated(false);
    setIsCorrect(false);

    if (currentExerciseIdx < unit.exercises.length - 1) {
      setCurrentExerciseIdx((i) => i + 1);
    } else {
      // Unit finished celebration
      playSoundEffect('levelup');
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } });
      onCompleteUnit(unit.id, 50);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Unit Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-xs transition-colors mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'fr' ? 'Retour au parcours' : language === 'ar' ? 'العودة للخريطة' : 'Back to Roadmap'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-400/30">
                CEFR {unit.level}
              </span>
              <span className="text-xs text-slate-300">
                {unit.titleEn}
              </span>
            </div>

            <h1 dir="rtl" className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wide text-amber-200">
              {unit.titleAr}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              {language === 'fr' ? unit.descriptionFr : unit.descriptionEn}
            </p>
          </div>

          {/* Competency tags */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs space-y-1.5 max-w-sm">
            <span className="font-bold text-emerald-300 block text-[11px] uppercase tracking-wider">
              {language === 'fr' ? 'Compétences visées (ELCO/CEFR) :' : language === 'ar' ? 'الكفايات المستهدفة:' : 'Target Competencies:'}
            </span>
            <p className="text-[11px] text-slate-200 leading-snug">
              🗣️ {unit.competencies.oralInteraction}
            </p>
            <p className="text-[11px] text-slate-200 leading-snug">
              👂 {unit.competencies.listening}
            </p>
          </div>
        </div>
      </div>

      {/* Lesson Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/80 shadow-sm shadow-amber-500/5 no-scrollbar">
        {unit.tracingLetters && unit.tracingLetters.length > 0 && (
          <button
            onClick={() => {
              setActiveTab('tracing');
              playSoundEffect('tap');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tracing'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-700 hover:bg-amber-50 hover:text-emerald-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>{language === 'ar' ? 'تتبع الخط والحروف' : language === 'fr' ? 'Tracé des lettres' : 'Letter Tracing'}</span>
          </button>
        )}

        {unit.dialogue && unit.dialogue.length > 0 && (
          <button
            onClick={() => {
              setActiveTab('dialogue');
              playSoundEffect('tap');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dialogue'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-700 hover:bg-amber-50 hover:text-emerald-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{language === 'ar' ? 'الحوار والتفاعل الشفهي' : language === 'fr' ? 'Dialogue & Oral' : 'Dialogue & Speaking'}</span>
          </button>
        )}

        {unit.readingPassage && (
          <button
            onClick={() => {
              setActiveTab('reading');
              playSoundEffect('tap');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reading'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-700 hover:bg-amber-50 hover:text-emerald-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'ar' ? 'النص وفهم المكتوب' : language === 'fr' ? 'Compréhension Écrite' : 'Reading & Passage'}</span>
          </button>
        )}

        <button
          onClick={() => {
            setActiveTab('speaking');
            playSoundEffect('tap');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'speaking'
              ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-sm shadow-rose-600/30'
              : 'text-slate-700 hover:bg-rose-50 hover:text-rose-900 border border-rose-200/50'
          }`}
        >
          <Mic className="w-4 h-4 text-rose-500" />
          <span>{language === 'ar' ? 'التعبير الشفهي والاستماع' : language === 'fr' ? 'Oral & Parler en continu' : 'Speaking & Oral'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('flashcards');
            playSoundEffect('tap');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'flashcards'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30'
              : 'text-slate-700 hover:bg-amber-50 hover:text-emerald-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'ar' ? 'بطاقات المفردات' : language === 'fr' ? 'Cartes Vocabulaire' : 'Flashcards'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('exercises');
            playSoundEffect('tap');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'exercises'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30'
              : 'text-slate-700 hover:bg-amber-50 hover:text-emerald-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'ar' ? 'التمارين التفاعلية' : language === 'fr' ? 'Exercices & Quiz' : 'Exercises & Games'}</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {/* TAB 1: Letter Tracing Canvas */}
        {activeTab === 'tracing' && unit.tracingLetters && (
          <LetterTraceCanvas
            letters={unit.tracingLetters}
            language={language}
            onWatchVideo={(lettr) => onOpenVideoLibrary && onOpenVideoLibrary('letters', lettr)}
          />
        )}

        {/* TAB 2: Interactive Dialogue */}
        {activeTab === 'dialogue' && unit.dialogue && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100/70 text-emerald-800">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {language === 'ar' ? 'حوار تفاعلي بالصوت والتشكيل' : language === 'fr' ? 'Dialogue Interactif avec Audio' : 'Interactive Arabic Dialogue with Audio'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'fr' ? 'Cliquez sur n\'importe quelle réplique pour écouter la prononciation authentique' : 'Click on any line to hear authentic Arabic pronunciation'}
                  </p>
                </div>
              </div>

              {onOpenVideoLibrary && (
                <button
                  onClick={() => onOpenVideoLibrary('dialogues')}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1.5 transition"
                >
                  <Video className="w-3.5 h-3.5 text-red-600" />
                  <span>{language === 'ar' ? 'شاهد حوارات مصورة' : language === 'fr' ? 'Vidéos Dialogues' : 'Video Dialogues'}</span>
                </button>
              )}
            </div>

            <div className="space-y-3 pt-2">
              {unit.dialogue.map((line, idx) => (
                <div
                  key={idx}
                  onClick={() => speakArabic(line.arabic, 0.85)}
                  className="p-4 rounded-2xl border border-amber-200/70 bg-amber-50/40 hover:bg-emerald-50/50 hover:border-emerald-400 transition-all cursor-pointer group flex items-start gap-3 shadow-2xs"
                >
                  <span className="text-2xl select-none">{line.speakerAvatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-800">{line.speaker}</span>
                      <button className="p-1 rounded-full text-slate-400 group-hover:text-emerald-700 transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p dir="rtl" className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-relaxed">
                      {line.arabic}
                    </p>

                    <p className="text-xs text-emerald-900 font-semibold mt-1">
                      {line.transliteration}
                    </p>

                    <p className="text-xs text-slate-600 italic mt-0.5">
                      {language === 'fr' ? line.translationFr : line.translationEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Grammar Insight Card */}
            {unit.grammarTip && (
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/90 border border-amber-300/80 text-xs text-amber-950">
                <span className="font-extrabold text-sm block mb-1 text-amber-950">
                  💡 {language === 'fr' ? unit.grammarTip.titleFr : unit.grammarTip.titleEn}
                </span>
                <p className="text-slate-700 mb-3 leading-relaxed">
                  {language === 'fr' ? unit.grammarTip.contentFr : unit.grammarTip.contentEn}
                </p>
                <div className="flex flex-wrap gap-2">
                  {unit.grammarTip.examples.map((ex, i) => (
                    <div key={i} className="bg-white/95 px-3 py-1.5 rounded-xl border border-amber-300 text-slate-900 shadow-2xs">
                      <span dir="rtl" className="font-serif font-bold text-sm text-emerald-900 block">{ex.arabic}</span>
                      <span className="text-[10px] text-slate-600">{ex.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Reading Passage */}
        {activeTab === 'reading' && unit.readingPassage && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {unit.readingPassage.title}
                </h3>
              </div>
              <button
                onClick={() => speakArabic(unit.readingPassage!.arabicText, 0.85)}
                className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>{language === 'fr' ? 'Écouter le texte' : language === 'ar' ? 'استمع للنص' : 'Listen to Passage'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/70">
              <p dir="rtl" className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-loose text-justify">
                {unit.readingPassage.arabicText}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">
                {language === 'fr' ? 'Traduction en français :' : 'English Translation:'}
              </span>
              <p>{language === 'fr' ? unit.readingPassage.translationFr : unit.readingPassage.translationEn}</p>
            </div>
          </div>
        )}

        {/* TAB: Continuous Speaking & Listening */}
        {activeTab === 'speaking' && (
          <ContinuousSpeakingLab
            currentLevel={unit.level}
            language={language}
          />
        )}

        {/* TAB 4: Flashcards */}
        {activeTab === 'flashcards' && (
          <FlashcardsGame items={unit.vocabulary} language={language} />
        )}

        {/* TAB 5: Exercises & Interactive Challenges */}
        {activeTab === 'exercises' && (
          <div className="space-y-4">
            {currentExercise ? (
              currentExercise.type === 'sentence-order' ? (
                <SentenceBuilderGame
                  questionEn={currentExercise.questionEn}
                  questionFr={currentExercise.questionFr}
                  words={currentExercise.options || []}
                  correctSentence={currentExercise.correctAnswer as string}
                  explanationEn={currentExercise.explanationEn}
                  explanationFr={currentExercise.explanationFr}
                  language={language}
                  onComplete={handleNextExercise}
                />
              ) : (
                /* Multiple Choice / Audio Quiz Card */
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Exercise {currentExerciseIdx + 1} / {unit.exercises.length}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold">
                      +15 XP
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${((currentExerciseIdx + 1) / unit.exercises.length) * 100}%` }}
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {language === 'fr' ? currentExercise.questionFr : currentExercise.questionEn}
                    </h4>

                    {currentExercise.audioPrompt && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => speakArabic(currentExercise.audioPrompt || '', 0.85)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{language === 'fr' ? 'Écouter le son' : language === 'ar' ? 'استمع للصوت' : 'Play Sound'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Option Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentExercise.options?.map((opt, i) => {
                      const isChosen = selectedAnswer === opt;
                      const isCorrectChoice = opt === currentExercise.correctAnswer;

                      let btnCls = 'border-amber-200/80 bg-white hover:bg-amber-50/70 text-slate-800';
                      if (hasEvaluated) {
                        if (isCorrectChoice) {
                          btnCls = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
                        } else if (isChosen && !isCorrectChoice) {
                          btnCls = 'border-rose-400 bg-rose-50 text-rose-950';
                        } else {
                          btnCls = 'border-slate-200 opacity-60';
                        }
                      } else if (isChosen) {
                        btnCls = 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20';
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(opt)}
                          disabled={hasEvaluated}
                          className={`p-4 rounded-2xl border-2 font-serif text-lg font-bold transition-all flex items-center justify-between text-left ${btnCls}`}
                        >
                          <span dir="rtl">{opt}</span>
                          {hasEvaluated && isCorrectChoice && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                          {hasEvaluated && isChosen && !isCorrectChoice && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {hasEvaluated && (
                    <div
                      className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-bold mb-0.5">
                          {isCorrect ? (language === 'fr' ? 'Correct !' : 'Correct!') : (language === 'fr' ? 'Explication :' : 'Explanation:')}
                        </p>
                        <p className="text-slate-600">{language === 'fr' ? currentExercise.explanationFr : currentExercise.explanationEn}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex justify-end pt-2">
                    {!hasEvaluated ? (
                      <button
                        onClick={handleEvaluateExercise}
                        disabled={selectedAnswer === null}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          selectedAnswer !== null
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/25 active:scale-95'
                            : 'bg-amber-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {language === 'fr' ? 'Vérifier' : language === 'ar' ? 'تحقق' : 'Check Answer'}
                      </button>
                    ) : (
                      <button
                        onClick={handleNextExercise}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <span>{currentExerciseIdx < unit.exercises.length - 1 ? 'Next Exercise' : 'Finish Unit 🎉'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
