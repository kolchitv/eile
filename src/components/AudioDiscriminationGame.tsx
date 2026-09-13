import React, { useState } from 'react';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { TRICKY_SOUNDS } from '../data/difficultSounds';
import { Volume2, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AudioDiscriminationProps {
  onComplete?: () => void;
  language: 'en' | 'fr' | 'ar';
}

export const AudioDiscriminationGame: React.FC<AudioDiscriminationProps> = ({
  onComplete,
  language,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetPairIdx, setTargetPairIdx] = useState(0);
  const [isTargetFirst, setIsTargetFirst] = useState(() => Math.random() > 0.5);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentSound = TRICKY_SOUNDS[currentIndex];
  const pair = currentSound.minimalPairs[targetPairIdx] || currentSound.minimalPairs[0];

  const targetWord = isTargetFirst ? pair.targetArabic : pair.confusedArabic;
  const targetMeaning = isTargetFirst ? pair.targetMeaning : pair.confusedMeaning;
  const targetTranslit = isTargetFirst ? pair.targetTranslit : pair.confusedTranslit;

  const handlePlayAudio = () => {
    playSoundEffect('tap');
    speakArabic(targetWord, 0.8);
  };

  const handleSelect = (word: string) => {
    if (hasAnswered) return;
    setSelectedOption(word);
    setHasAnswered(true);

    const isRight = word === targetWord;
    if (isRight) {
      playSoundEffect('correct');
      setScore((s) => s + 1);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleNext = () => {
    playSoundEffect('tap');
    if (currentIndex < TRICKY_SOUNDS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setTargetPairIdx(0);
      setIsTargetFirst(Math.random() > 0.5);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-amber-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
            {currentSound.letter}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>{language === 'ar' ? 'تحدي التمييز الصوتي والمخارج' : language === 'fr' ? 'Défi de Discrimination Phonétique' : 'Arabic Phonetic Distinction Game'}</span>
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'fr' ? currentSound.articulationGuideFr : currentSound.articulationGuideEn}
            </p>
          </div>
        </div>

        <div className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/80">
          {currentIndex + 1} / {TRICKY_SOUNDS.length}
        </div>
      </div>

      {/* Audio Play Center */}
      <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-amber-50/70 via-orange-50/50 to-amber-50/40 rounded-2xl border border-amber-200/80 mb-6 shadow-2xs">
        <span className="text-xs font-semibold text-amber-900 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {language === 'fr'
              ? 'Écoutez attentivement le mot prononcé :'
              : language === 'ar'
              ? 'استمع جيداً للكلمة المنطوقة وحدد الحرف الصحيح:'
              : 'Listen closely to the audio clip:'}
          </span>
        </span>

        <button
          id="btn-play-sound-game"
          onClick={handlePlayAudio}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
          title="Click to play Arabic audio"
        >
          <Volume2 className="w-9 h-9 animate-pulse" />
        </button>

        <span className="text-[11px] text-slate-500 mt-2 font-medium">
          {language === 'fr' ? 'Cliquez pour réécouter' : language === 'ar' ? 'انقر للاستماع' : 'Click to listen / replay'}
        </span>
      </div>

      {/* Minimal Pair Choice Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {[pair.targetArabic, pair.confusedArabic].map((word) => {
          const isChosen = selectedOption === word;
          const isCorrectWord = word === targetWord;
          const meaning = word === pair.targetArabic ? pair.targetMeaning : pair.confusedMeaning;
          const translit = word === pair.targetArabic ? pair.targetTranslit : pair.confusedTranslit;

          let btnStyle = 'border-amber-200/80 bg-white hover:bg-amber-50/60 text-slate-900';
          if (hasAnswered) {
            if (isCorrectWord) {
              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20';
            } else if (isChosen && !isCorrectWord) {
              btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
            } else {
              btnStyle = 'border-amber-200/50 bg-white opacity-60';
            }
          }

          return (
            <button
              key={word}
              onClick={() => handleSelect(word)}
              disabled={hasAnswered}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1 ${btnStyle}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-3xl font-bold">{word}</span>
                {hasAnswered && isCorrectWord && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {hasAnswered && isChosen && !isCorrectWord && <XCircle className="w-5 h-5 text-rose-500" />}
              </div>
              <span className="text-xs font-semibold text-slate-600">{translit}</span>
              {hasAnswered && (
                <span className="text-[11px] text-slate-500 italic mt-0.5">
                  ({meaning})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Articulation & Difference Tip */}
      {hasAnswered && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 mb-4 animate-fade-in shadow-2xs">
          <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>{language === 'fr' ? 'Conseil phonétique' : language === 'ar' ? 'معلومة صوتية للمتعلم' : 'Phonetic Secret for Non-Natives:'}</span>
          </p>
          <p className="text-slate-700">
            {language === 'fr' ? currentSound.comparisonWithLatinFr : currentSound.comparisonWithLatinEn}
          </p>
        </div>
      )}

      {/* Next Button */}
      {hasAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/25 active:scale-95 transition-all"
          >
            {currentIndex < TRICKY_SOUNDS.length - 1
              ? language === 'fr' ? 'Son suivant ➔' : language === 'ar' ? 'الصوت التالي ➔' : 'Next Sound Challenge ➔'
              : language === 'fr' ? 'Terminer le défi 🎉' : language === 'ar' ? 'إنهاء التحدي 🎉' : 'Finish Challenge 🎉'}
          </button>
        </div>
      )}
    </div>
  );
};
