import React from 'react';
import { TRICKY_SOUNDS } from '../data/difficultSounds';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { Volume2, X, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface PhoneticsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'fr' | 'ar';
}

export const PhoneticsGuideModal: React.FC<PhoneticsGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-amber-200/80 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300/80 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {language === 'ar' ? 'دليل مخارج الحروف والأصوات الخاصة' : language === 'fr' ? 'Guide des Sons & Phonétique Arabe' : 'Arabic Phonetics & Articulation Guide'}
              </h3>
              <p className="text-xs text-slate-600">
                {language === 'fr'
                  ? 'Comment prononcer les sons uniques de l\'arabe (ح, ع, ق, ض, ص, خ) avec des astuces pour francophones'
                  : language === 'ar'
                  ? 'شرح مبسط لكيفية نطق الحروف الحلقية والمفخمة لغير الناطقين بالعربية'
                  : 'Mouth & throat articulation tips for unique Arabic sounds with audio pairs'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-amber-100/50 rounded-2xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phonetics cards grid */}
        <div className="space-y-4">
          {TRICKY_SOUNDS.map((sound) => (
            <div
              key={sound.id}
              className="p-5 rounded-3xl border border-amber-200/80 bg-white hover:border-amber-400/90 transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-serif text-3xl font-bold shadow-xs">
                    {sound.letter}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span>{sound.nameEn}</span>
                      <span className="text-xs font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 font-bold">{sound.ipa}</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === 'fr' ? sound.articulationGuideFr : sound.articulationGuideEn}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSoundEffect('tap');
                    speakArabic(sound.letter, 0.8);
                  }}
                  className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-200 transition-colors shadow-2xs"
                  title="Listen to sound"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Latin comparison explanation */}
              <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 mb-3 font-medium">
                <span className="font-bold block mb-0.5">
                  {language === 'fr' ? 'Comparaison & Règle :' : language === 'ar' ? 'المقارنة بالأصوات اللاتينية:' : 'Comparison & Golden Rule:'}
                </span>
                <span>{language === 'fr' ? sound.comparisonWithLatinFr : sound.comparisonWithLatinEn}</span>
              </div>

              {/* Minimal Pairs audio examples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sound.minimalPairs.map((pair, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playSoundEffect('tap');
                          speakArabic(pair.targetArabic, 0.85);
                        }}
                        className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span dir="rtl" className="font-serif text-base font-bold text-emerald-950">{pair.targetArabic}</span>
                      <span className="text-slate-600 text-[11px]">({pair.targetTranslit} - {pair.targetMeaning})</span>
                    </div>

                    <span className="text-amber-700/60 font-extrabold text-[10px] uppercase">vs</span>

                    <div className="flex items-center gap-2">
                      <span dir="rtl" className="font-serif text-base font-bold text-slate-800">{pair.confusedArabic}</span>
                      <button
                        onClick={() => {
                          playSoundEffect('tap');
                          speakArabic(pair.confusedArabic, 0.85);
                        }}
                        className="p-1.5 text-slate-600 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
