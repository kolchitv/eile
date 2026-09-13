import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { Volume2, RotateCw, Check, Sparkles, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';

interface FlashcardsGameProps {
  items: VocabularyItem[];
  onComplete?: () => void;
  language: 'en' | 'fr' | 'ar';
}

export const FlashcardsGame: React.FC<FlashcardsGameProps> = ({
  items,
  onComplete,
  language,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [masteredCount, setMasteredCount] = useState(0);

  const currentItem = items[currentIndex] || items[0];

  const handleFlip = () => {
    playSoundEffect('tap');
    setIsFlipped(!isFlipped);
  };

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSoundEffect('tap');
    speakArabic(currentItem.arabic, 0.85);
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSoundEffect('tap');
    if (bookmarked.includes(currentItem.id)) {
      setBookmarked(bookmarked.filter((id) => id !== currentItem.id));
    } else {
      setBookmarked([...bookmarked, currentItem.id]);
    }
  };

  const handleNext = (mastered: boolean) => {
    playSoundEffect('tap');
    if (mastered) {
      setMasteredCount((c) => c + 1);
    }
    setIsFlipped(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-amber-200/80 shadow-sm max-w-xl mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-extrabold text-slate-900">
            {language === 'ar' ? 'بطاقات الذاكرة التفاعلية' : language === 'fr' ? 'Cartes Mémoire Vocabulaire' : 'Interactive Flashcard Trainer'}
          </span>
        </div>

        <div className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/80">
          {currentIndex + 1} / {items.length}
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="relative h-64 w-full cursor-pointer perspective-1000 select-none group"
      >
        <div
          className={`w-full h-full rounded-3xl border-2 transition-all duration-500 transform-style-3d p-6 flex flex-col justify-between shadow-md ${
            isFlipped
              ? 'bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-900 text-white border-emerald-600/60 rotate-y-180'
              : 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 text-slate-900 border-amber-300/80 hover:border-amber-400'
          }`}
        >
          {/* Top Row: Category & Bookmark */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/80 text-amber-950 border border-amber-200/80 shadow-2xs">
              {currentItem.category || 'Vocabulary'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAudio}
                className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs transition-transform active:scale-95"
                title="Pronounce Word"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleBookmark}
                className={`p-2 rounded-xl border transition-colors ${
                  bookmarked.includes(currentItem.id)
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-white/80 text-slate-400 hover:text-amber-500 border-amber-200'
                }`}
                title="Bookmark for review"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Middle: Arabic vs Translation */}
          <div className="flex flex-col items-center justify-center my-auto text-center">
            {!isFlipped ? (
              <>
                <span className="font-serif text-4xl sm:text-5xl font-bold tracking-wide mb-2 text-slate-950">
                  {currentItem.arabic}
                </span>
                <span className="text-sm font-bold text-emerald-900 tracking-wider">
                  {currentItem.transliteration}
                </span>
              </>
            ) : (
              <div className="rotate-y-180">
                <span className="text-xl sm:text-2xl font-extrabold mb-1 block text-amber-300">
                  {language === 'fr' ? currentItem.translation.fr : currentItem.translation.en}
                </span>
                {currentItem.exampleSentence && (
                  <div className="mt-3 p-2.5 rounded-2xl bg-white/10 border border-white/10 text-xs text-slate-200 text-center">
                    <p className="font-serif text-sm font-bold text-emerald-300 mb-1">
                      {currentItem.exampleSentence.arabic}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {language === 'fr' ? currentItem.exampleSentence.translationFr : currentItem.exampleSentence.translationEn}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Prompt */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <RotateCw className="w-3 h-3" />
            <span>
              {!isFlipped
                ? language === 'fr' ? 'Cliquez pour voir la traduction' : language === 'ar' ? 'انقر لقلب البطاقة ومعرفة المعنى' : 'Click card to reveal meaning'
                : language === 'fr' ? 'Cliquez pour revenir' : language === 'ar' ? 'انقر للعودة' : 'Click to flip back'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Still Learning vs Mastered */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => handleNext(false)}
          className="flex-1 py-2.5 px-4 rounded-xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-100/60 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'fr' ? 'À revoir' : language === 'ar' ? 'أحتاج لمراجعتها' : 'Still Learning'}</span>
        </button>

        <button
          onClick={() => handleNext(true)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Maîtrisé !' : language === 'ar' ? 'حفظتها بإتقان!' : 'Mastered (+10 XP)'}</span>
        </button>
      </div>
    </div>
  );
};
