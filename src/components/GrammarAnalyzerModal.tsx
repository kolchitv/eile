import React, { useState } from 'react';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { Search, X, Volume2, Sparkles, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

interface GrammarAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'fr' | 'ar';
}

export const GrammarAnalyzerModal: React.FC<GrammarAnalyzerProps> = ({ isOpen, onClose, language }) => {
  const [inputSentence, setInputSentence] = useState('السَّلَامُ عَلَيْكُمْ يَا صَدِيقِي');
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!inputSentence.trim()) return;
    setIsLoading(true);
    playSoundEffect('tap');

    try {
      const res = await fetch('/api/analyze-arabic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: inputSentence }),
      });
      const data = await res.json();
      setAnalysis(data);
      playSoundEffect('correct');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleSentences = [
    'كَتَبَ الطَّالِبُ الدَّرْسَ بِعِنَايَة',
    'العَرَبِيَّةُ لُغَةُ البَلَاغَةِ وَالبَيَان',
    'أَسْكُنُ فِي مَدِينَةِ فَاس المَغْرِبِيَّة',
    'الصَّبْرُ مِفْتَاحُ الفَرَج',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-amber-200/80 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {language === 'ar' ? 'محلل الجمل والتشكيل والإعراب' : language === 'fr' ? 'Analyseur de Grammaire & Tashkeel' : 'AI Arabic Grammar & Tashkeel Analyzer'}
              </h3>
              <p className="text-xs text-slate-600">
                {language === 'fr'
                  ? 'Entrez n\'importe quelle phrase arabe pour obtenir les voyelles (Tashkeel) et l\'analyse grammaticale'
                  : language === 'ar'
                  ? 'أدخل أي جملة لتحصل على التشكيل الكامل، التحليل الصرفي، والإعراب المبسط'
                  : 'Enter any Arabic sentence for full Tashkeel, I\'rab, root words, and phonetic guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-amber-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input area */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className="text-[11px] font-bold text-amber-900">
              {language === 'fr' ? 'Exemples rapides :' : language === 'ar' ? 'أمثلة سريعة:' : 'Quick samples:'}
            </span>
            {sampleSentences.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputSentence(s);
                  playSoundEffect('tap');
                }}
                className="text-[11px] font-serif px-2.5 py-1 rounded-xl bg-amber-100/70 hover:bg-amber-200/80 text-amber-950 font-bold border border-amber-200/60 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              dir="rtl"
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="اكتب جملة عربية هنا..."
              className="flex-1 px-4 py-3 bg-amber-50/40 border border-amber-200/80 rounded-2xl text-base font-serif font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !inputSentence.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{language === 'fr' ? 'Analyser' : language === 'ar' ? 'حلل الجملة' : 'Analyze'}</span>
            </button>
          </div>
        </div>

        {/* Results display */}
        {analysis && (
          <div className="mt-6 space-y-4 animate-scale-in">
            {/* Vocalized Sentence Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-teal-50/50 border border-amber-200/80 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[10px] font-extrabold text-teal-900 uppercase tracking-wider">
                  {language === 'fr' ? 'Texte entièrement vocalisé (Tashkeel)' : language === 'ar' ? 'الجملة بالتشكيل الكامل' : 'Fully Vocalized Text (Tashkeel)'}
                </span>
                <p dir="rtl" className="font-serif text-2xl font-bold text-slate-950 mt-1">
                  {analysis.tashkeel || analysis.original}
                </p>
                {analysis.transliteration && (
                  <p className="text-xs text-emerald-900 font-bold mt-1">
                    {analysis.transliteration}
                  </p>
                )}
                {analysis.translation && (
                  <p className="text-xs text-slate-600 italic mt-0.5 font-medium">
                    "{analysis.translation}"
                  </p>
                )}
              </div>

              <button
                onClick={() => speakArabic(analysis.tashkeel || analysis.original, 0.85)}
                className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
                title="Listen to full phrase"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Word by word I'rab breakdown table */}
            {analysis.breakdown && (
              <div className="border border-amber-200/80 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-amber-100/70 px-4 py-2.5 text-xs font-extrabold text-slate-800 flex items-center justify-between border-b border-amber-200/80">
                  <span>{language === 'fr' ? 'Décomposition mot à mot & Rôle grammatical' : language === 'ar' ? 'التحليل الصرفي والإعرابي للكلمات' : 'Word-by-Word Morphology & Syntax (I\'rab)'}</span>
                  {analysis.cefrLevel && (
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-200 text-teal-950 text-[10px] font-bold border border-teal-300">
                      {analysis.cefrLevel} Level
                    </span>
                  )}
                </div>
                <div className="divide-y divide-amber-100 text-xs bg-white">
                  {analysis.breakdown.map((item: any, i: number) => (
                    <div key={i} className="p-3 flex items-center justify-between hover:bg-amber-50/50 gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakArabic(item.vocalized || item.token, 0.85)}
                          className="p-1 rounded-md text-emerald-800 hover:bg-emerald-50"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span dir="rtl" className="font-serif text-lg font-bold text-slate-950">
                          {item.vocalized || item.token}
                        </span>
                        <span className="text-[11px] text-slate-600">({item.meaning})</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300/80 font-bold text-[11px]">
                          {item.type}
                        </span>
                        <span className="text-slate-700 block text-[11px] mt-0.5 font-serif font-medium">
                          {item.irab}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes & Cultural Tip */}
            {analysis.commonMistakes && (
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 flex items-start gap-2 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">
                    {language === 'fr' ? 'Piège fréquent à éviter :' : language === 'ar' ? 'تنبيه للمتعلم:' : 'Common learner pitfall to avoid:'}
                  </span>
                  <span>{analysis.commonMistakes}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
