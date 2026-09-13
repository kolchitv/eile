import React, { useState } from 'react';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { Volume2, CheckCircle2, RotateCcw, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SentenceBuilderProps {
  questionEn: string;
  questionFr: string;
  words: string[];
  correctSentence: string;
  explanationEn: string;
  explanationFr: string;
  onComplete?: () => void;
  language: 'en' | 'fr' | 'ar';
}

export const SentenceBuilderGame: React.FC<SentenceBuilderProps> = ({
  questionEn,
  questionFr,
  words,
  correctSentence,
  explanationEn,
  explanationFr,
  onComplete,
  language,
}) => {
  // Shuffled available words
  const [availableWords, setAvailableWords] = useState<string[]>(() => [...words].sort(() => Math.random() - 0.5));
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectWord = (word: string, index: number) => {
    if (isEvaluated) return;
    playSoundEffect('tap');
    speakArabic(word, 0.9);

    const nextAvailable = [...availableWords];
    nextAvailable.splice(index, 1);
    setAvailableWords(nextAvailable);
    setPlacedWords([...placedWords, word]);
  };

  const handleRemovePlacedWord = (word: string, index: number) => {
    if (isEvaluated) return;
    playSoundEffect('tap');

    const nextPlaced = [...placedWords];
    nextPlaced.splice(index, 1);
    setPlacedWords(nextPlaced);
    setAvailableWords([...availableWords, word]);
  };

  const handleReset = () => {
    playSoundEffect('tap');
    setAvailableWords([...words].sort(() => Math.random() - 0.5));
    setPlacedWords([]);
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    const userBuilt = placedWords.join(' ').trim();
    const cleanTarget = correctSentence.replace(/[ـ\s]+/g, ' ').trim();
    const cleanUser = userBuilt.replace(/[ـ\s]+/g, ' ').trim();

    // Check if matches or if simple equality holds
    const passed = cleanUser === cleanTarget;
    setIsEvaluated(true);
    setIsCorrect(passed);

    if (passed) {
      playSoundEffect('correct');
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      speakArabic(correctSentence, 0.85);
      if (onComplete) onComplete();
    } else {
      playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-amber-200/80 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 rounded-xl bg-teal-100 text-teal-800">
          <Layers className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
            {language === 'ar' ? 'بناء وتركيب الجمل العربية' : language === 'fr' ? 'Constructeur de Phrases Arabes' : 'Arabic Sentence Builder Challenge'}
          </h3>
          <p className="text-xs text-slate-600">
            {language === 'fr' ? questionFr : questionEn}
          </p>
        </div>
      </div>

      {/* Target Construction Dropzone */}
      <div
        dir="rtl"
        className={`min-h-[84px] p-4 rounded-2xl border-2 border-dashed flex flex-wrap items-center gap-2 transition-all ${
          isEvaluated
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/70'
              : 'border-rose-400 bg-rose-50/50'
            : placedWords.length > 0
            ? 'border-teal-500 bg-teal-50/30'
            : 'border-amber-300/80 bg-amber-50/40'
        }`}
      >
        {placedWords.length === 0 && (
          <span className="text-xs text-slate-400 select-none w-full text-center py-2 font-medium">
            {language === 'fr'
              ? 'Cliquez sur les mots ci-dessous pour former la phrase'
              : language === 'ar'
              ? 'انقر على الكلمات بالأسفل لترتيب الجملة بالتشكيل'
              : 'Click words below to assemble the sentence from right to left'}
          </span>
        )}

        {placedWords.map((word, idx) => (
          <button
            key={`placed-${idx}-${word}`}
            onClick={() => handleRemovePlacedWord(word, idx)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-serif text-lg font-bold shadow-xs hover:from-teal-800 hover:to-emerald-800 transition-all transform active:scale-95 flex items-center gap-1.5 animate-scale-in"
          >
            <span>{word}</span>
          </button>
        ))}
      </div>

      {/* Available Word Bank */}
      <div className="mt-4">
        <div className="text-[11px] font-bold text-amber-900 mb-2 uppercase tracking-wider">
          {language === 'fr' ? 'Banque de mots disponibles :' : language === 'ar' ? 'بنك الكلمات المتاحة:' : 'Word Bank:'}
        </div>
        <div dir="rtl" className="flex flex-wrap gap-2 min-h-[50px]">
          {availableWords.map((word, idx) => (
            <button
              key={`avail-${idx}-${word}`}
              onClick={() => handleSelectWord(word, idx)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 font-serif text-lg font-bold border border-amber-200/80 shadow-2xs hover:scale-105 transition-all active:scale-95"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Alert */}
      {isEvaluated && (
        <div
          className={`mt-4 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
            isCorrect
              ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 shadow-2xs'
              : 'bg-rose-50 text-rose-950 border border-rose-300 shadow-2xs'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-bold mb-1">
              {isCorrect
                ? language === 'fr' ? 'Bravo ! Phrase parfaitement construite !' : language === 'ar' ? 'أحسنت! ترتيب نحوي وصحيح تماماً!' : 'Excellent! Perfect sentence structure!'
                : language === 'fr' ? 'Pas tout à fait. Essayez à nouveau !' : language === 'ar' ? 'حاول مجدداً للوصول للترتيب الدقيق' : 'Not quite right yet. Try rearranging!'}
            </p>
            <p className="text-slate-700">{language === 'fr' ? explanationFr : explanationEn}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-amber-100/80 pt-3">
        <button
          onClick={handleReset}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-amber-50 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'fr' ? 'Réinitialiser' : language === 'ar' ? 'إعادة' : 'Reset'}</span>
        </button>

        <div className="flex items-center gap-2">
          {isCorrect && (
            <button
              onClick={() => speakArabic(correctSentence, 0.85)}
              className="p-2 text-teal-900 bg-teal-100 hover:bg-teal-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'fr' ? 'Écouter' : language === 'ar' ? 'استمع' : 'Listen'}</span>
            </button>
          )}

          <button
            onClick={handleCheck}
            disabled={placedWords.length === 0}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              placedWords.length > 0
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/25 active:scale-95'
                : 'bg-amber-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'fr' ? 'Vérifier la phrase' : language === 'ar' ? 'تحقق من الإجابة' : 'Check Sentence'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
