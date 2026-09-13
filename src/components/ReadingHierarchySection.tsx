import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Layers,
  FileText,
  AlignJustify,
  Type,
  ChevronRight,
  ChevronLeft,
  Sparkle,
  BookOpen,
} from 'lucide-react';
import {
  LETTERS_READING_DATA,
  SYLLABLES_READING_GROUPS,
  WORDS_READING_CATEGORIES,
  SENTENCES_READING_ITEMS,
  LetterReadingItem,
  SyllableReadingGroup,
  WordReadingCategory,
  SentenceReadingItem,
} from '../data/readingElementsData';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { SupportedLanguage } from '../types';

export type ReadingHierarchyTab = 'letters' | 'syllables' | 'words' | 'sentences';

interface ReadingHierarchySectionProps {
  language: SupportedLanguage;
  activeSubTab: ReadingHierarchyTab;
  onSelectSubTab: (tab: ReadingHierarchyTab) => void;
  onSelectSentenceForReader?: (sentenceText: string) => void;
  onEarnXp?: (amount: number) => void;
}

export const ReadingHierarchySection: React.FC<ReadingHierarchySectionProps> = ({
  language,
  activeSubTab,
  onSelectSubTab,
  onSelectSentenceForReader,
  onEarnXp,
}) => {
  // Letters state
  const [selectedLetter, setSelectedLetter] = useState<LetterReadingItem>(LETTERS_READING_DATA[0]);
  const [activeLetterMode, setActiveLetterMode] = useState<'vowels' | 'forms' | 'tanween'>('vowels');

  // Syllables state
  const [selectedSyllableGroup, setSelectedSyllableGroup] = useState<SyllableReadingGroup>(SYLLABLES_READING_GROUPS[0]);

  // Words state
  const [selectedWordCategory, setSelectedWordCategory] = useState<WordReadingCategory>(WORDS_READING_CATEGORIES[0]);
  const [activePlayingWordId, setActivePlayingWordId] = useState<string | null>(null);

  // Sentences state
  const [selectedSentenceGroup, setSelectedSentenceGroup] = useState<SentenceReadingItem>(SENTENCES_READING_ITEMS[0]);
  const [activePlayingSentenceId, setActivePlayingSentenceId] = useState<string | null>(null);

  const handlePlayLetterAudio = async (text: string, rate: number = 0.8) => {
    playSoundEffect('tap');
    await speakArabic(text, rate);
    if (onEarnXp) onEarnXp(2);
  };

  const handlePlayWordAudio = async (wordId: string, text: string) => {
    setActivePlayingWordId(wordId);
    playSoundEffect('tap');
    await speakArabic(text, 0.8);
    setActivePlayingWordId(null);
    if (onEarnXp) onEarnXp(3);
  };

  const handlePlaySentenceAudio = async (sentenceId: string, text: string) => {
    setActivePlayingSentenceId(sentenceId);
    playSoundEffect('tap');
    await speakArabic(text, 0.85);
    setActivePlayingSentenceId(null);
    if (onEarnXp) onEarnXp(5);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* SUB-TABS SELECTOR: حروف • مقاطع • كلمات • جمل/نصوص                        */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-amber-300 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔤</span>
            <div>
              <h3 className="font-arabic font-extrabold text-slate-900 text-sm sm:text-base">
                {language === 'ar' ? 'سُلَّمُ التَّدَرُّجِ فِي الْقِرَاءَةِ (Lecture)' : 'Échelle de Progression en Lecture :'}
              </h3>
              <p className="text-[11px] text-slate-500 font-arabic">
                {language === 'ar' ? 'اختر المستوى للتدرج من أصغر وحدة صوتية إلى النصوص الكاملة' : 'Progressez des lettres aux syllabes, puis aux mots et phrases/textes.'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300 self-start sm:self-auto">
            {language === 'ar' ? '4 مستويات متكاملة' : '4 Niveaux de Lecture'}
          </span>
        </div>

        {/* 4 Large Interactive Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
          {/* 1. حروف Lettres */}
          <button
            onClick={() => {
              onSelectSubTab('letters');
              playSoundEffect('tap');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 text-center ${
              activeSubTab === 'letters'
                ? 'bg-gradient-to-br from-amber-400 via-amber-300 to-orange-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-400/40 font-black scale-[1.02]'
                : 'bg-amber-50/60 hover:bg-amber-100 text-slate-700 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Type className="w-4 h-4 text-amber-800" />
              <span className="font-arabic text-base sm:text-lg font-black">1. حُرُوف</span>
            </div>
            <span className="text-[10px] font-sans font-bold opacity-80 uppercase tracking-wider">
              Lettres (28)
            </span>
          </button>

          {/* 2. مقاطع Syllabes */}
          <button
            onClick={() => {
              onSelectSubTab('syllables');
              playSoundEffect('tap');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 text-center ${
              activeSubTab === 'syllables'
                ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-teal-600 shadow-md ring-2 ring-teal-400/40 font-black scale-[1.02]'
                : 'bg-teal-50/60 hover:bg-teal-100 text-slate-700 border-teal-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-700" />
              <span className="font-arabic text-base sm:text-lg font-black">2. مَقَاطِع</span>
            </div>
            <span className="text-[10px] font-sans font-bold opacity-80 uppercase tracking-wider">
              Syllabes (الحركات والمدود)
            </span>
          </button>

          {/* 3. كلمات Mots */}
          <button
            onClick={() => {
              onSelectSubTab('words');
              playSoundEffect('tap');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 text-center ${
              activeSubTab === 'words'
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/40 font-black scale-[1.02]'
                : 'bg-purple-50/60 hover:bg-purple-100 text-slate-700 border-purple-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-700" />
              <span className="font-arabic text-base sm:text-lg font-black">3. كَلِمَات</span>
            </div>
            <span className="text-[10px] font-sans font-bold opacity-80 uppercase tracking-wider">
              Mots (التهجئة والتقطيع)
            </span>
          </button>

          {/* 4. جمل/نصوص Phrases & Textes */}
          <button
            onClick={() => {
              onSelectSubTab('sentences');
              playSoundEffect('tap');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 text-center ${
              activeSubTab === 'sentences'
                ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white border-rose-600 shadow-md ring-2 ring-rose-400/40 font-black scale-[1.02]'
                : 'bg-rose-50/60 hover:bg-rose-100 text-slate-700 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <AlignJustify className="w-4 h-4 text-rose-700" />
              <span className="font-arabic text-base sm:text-lg font-black">4. جُمَل / نُصُوص</span>
            </div>
            <span className="text-[10px] font-sans font-bold opacity-80 uppercase tracking-wider">
              Phrases & Textes
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. LEVEL 1: LETTERS VIEW (حُرُوف)                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'letters' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quick Horizontal 28 Letters Strip */}
          <div className="bg-white rounded-3xl p-4 border-2 border-amber-300/80 shadow-md">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-black text-amber-950 font-arabic">
                اختر حرفاً من الحروف العربية (28 حرفاً):
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                الحرف المحدد: {selectedLetter.letter}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 py-2">
              {LETTERS_READING_DATA.map((item) => {
                const isSelected = selectedLetter.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedLetter(item);
                      handlePlayLetterAudio(item.letter, 0.7);
                    }}
                    className={`w-11 h-12 rounded-2xl flex flex-col items-center justify-center font-arabic transition-all shrink-0 border-2 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-black text-2xl shadow-md scale-105 ring-2 ring-amber-400/40'
                        : 'bg-slate-50 hover:bg-amber-100/70 text-slate-800 border-slate-200 text-xl font-bold'
                    }`}
                  >
                    <span>{item.letter}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Letter Deep-Dive Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-orange-400 text-slate-950 flex items-center justify-center font-arabic font-black text-4xl sm:text-5xl shadow-lg border-2 border-amber-500">
                  {selectedLetter.letter}
                </div>
                <div>
                  <h3 className="font-arabic font-black text-slate-900 text-2xl sm:text-3xl">
                    {selectedLetter.nameAr}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                    {selectedLetter.nameFr}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayLetterAudio(selectedLetter.letter, 0.7)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'نطق الحرف الفصيح' : 'Prononcer'}</span>
                </button>
              </div>
            </div>

            {/* Display Modes Selector: Vowels / Forms / Tanween */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setActiveLetterMode('vowels')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeLetterMode === 'vowels'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                1. الحركات القصيرة والمدود (Voyelles)
              </button>
              <button
                onClick={() => setActiveLetterMode('forms')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeLetterMode === 'forms'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                2. أشكال الحرف ومواضعه (Positions)
              </button>
              <button
                onClick={() => setActiveLetterMode('tanween')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeLetterMode === 'tanween'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                3. التنوين (Tanween)
              </button>
            </div>

            {/* Mode 1: Short & Long Vowels */}
            {activeLetterMode === 'vowels' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h4 className="font-arabic font-extrabold text-slate-800 text-sm mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>الحركات القصيرة والسكون (Voyelles courtes) :</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'فَتْحَة (a)', sound: selectedLetter.shortVowels.fatha, color: 'bg-rose-50 border-rose-200 text-rose-950' },
                      { label: 'ضَمَّة (ou)', sound: selectedLetter.shortVowels.damma, color: 'bg-blue-50 border-blue-200 text-blue-950' },
                      { label: 'كَسْرَة (i)', sound: selectedLetter.shortVowels.kasra, color: 'bg-emerald-50 border-emerald-200 text-emerald-950' },
                      { label: 'سُكُون (stop)', sound: selectedLetter.shortVowels.sukoon, color: 'bg-amber-50 border-amber-200 text-amber-950' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePlayLetterAudio(item.sound, 0.7)}
                        className={`p-4 rounded-2xl border-2 ${item.color} flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-xs group`}
                      >
                        <span className="font-arabic font-black text-3xl sm:text-4xl group-hover:text-amber-700">
                          {item.sound}
                        </span>
                        <span className="text-[11px] font-bold opacity-80">{item.label}</span>
                        <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-arabic font-extrabold text-slate-800 text-sm mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>المدود الطويلة الثلاثة (Voyelles longues) :</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'مد بالألف (â)', sound: selectedLetter.longVowels.alif, color: 'bg-amber-50 border-amber-300 text-amber-950' },
                      { label: 'مد بالواو (oû)', sound: selectedLetter.longVowels.waw, color: 'bg-orange-50 border-orange-300 text-orange-950' },
                      { label: 'مد بالياء (î)', sound: selectedLetter.longVowels.yaa, color: 'bg-teal-50 border-teal-300 text-teal-950' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePlayLetterAudio(item.sound, 0.7)}
                        className={`p-4 rounded-2xl border-2 ${item.color} flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-xs group`}
                      >
                        <span className="font-arabic font-black text-3xl sm:text-4xl group-hover:text-amber-700">
                          {item.sound}
                        </span>
                        <span className="text-[11px] font-bold opacity-80">{item.label}</span>
                        <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Letter Positions in Words */}
            {activeLetterMode === 'forms' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="font-arabic font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>أشكال الحرف في الكلمة (منفصل، أول، وسط، آخر) :</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'مُنْفَصِل (Isolé)', form: selectedLetter.forms.isolated },
                    { label: 'أَوَّل الْكَلِمَة (Début)', form: selectedLetter.forms.initial },
                    { label: 'وَسَط الْكَلِمَة (Milieu)', form: selectedLetter.forms.medial },
                    { label: 'آخِر الْكَلِمَة (Fin)', form: selectedLetter.forms.final },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePlayLetterAudio(item.form, 0.7)}
                      className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group"
                    >
                      <span className="font-arabic font-black text-3xl sm:text-4xl text-slate-900 group-hover:text-amber-700">
                        {item.form}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 3: Tanween */}
            {activeLetterMode === 'tanween' && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="font-arabic font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>التنوين بالفتح والضم والكسر (Tanween) :</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'تَنْوِينُ الفَتْح (an)', sound: selectedLetter.tanween.fath, color: 'bg-purple-50 border-purple-200 text-purple-950' },
                    { label: 'تَنْوِينُ الضَّمّ (oun)', sound: selectedLetter.tanween.damm, color: 'bg-indigo-50 border-indigo-200 text-indigo-950' },
                    { label: 'تَنْوِينُ الكَسْر (in)', sound: selectedLetter.tanween.kasr, color: 'bg-pink-50 border-pink-200 text-pink-950' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePlayLetterAudio(item.sound, 0.7)}
                      className={`p-4 rounded-2xl border-2 ${item.color} flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-xs group`}
                    >
                      <span className="font-arabic font-black text-3xl sm:text-4xl group-hover:text-purple-700">
                        {item.sound}
                      </span>
                      <span className="text-[11px] font-bold opacity-80">{item.label}</span>
                      <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Example Word Card */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedLetter.sampleWord.imageIcon}</span>
                <div>
                  <span className="text-[11px] text-amber-800 font-bold block">مِثَالٌ عَلَى الحَرْفِ:</span>
                  <span className="font-arabic font-black text-xl text-slate-900">
                    {selectedLetter.sampleWord.word}
                  </span>
                  <span className="text-xs text-slate-500 font-sans block">
                    ({selectedLetter.sampleWord.meaningFr} • {selectedLetter.sampleWord.meaningAr})
                  </span>
                </div>
              </div>
              <button
                onClick={() => handlePlayLetterAudio(selectedLetter.sampleWord.word, 0.8)}
                className="p-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 transition-colors shadow-xs"
                title="نطق الكلمة"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 2. LEVEL 2: SYLLABLES VIEW (مَقَاطِع)                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'syllables' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Letters Filter Pills for Syllables */}
          <div className="bg-white rounded-3xl p-4 border-2 border-teal-300 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-teal-950 font-arabic">
                اختر الحرف لدراسة مقاطعه الصوتية المقطوعة:
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full font-bold">
                {selectedSyllableGroup.syllables.length} مقاطع
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 py-1">
              {SYLLABLES_READING_GROUPS.map((grp) => {
                const isSelected = selectedSyllableGroup.id === grp.id;
                return (
                  <button
                    key={grp.id}
                    onClick={() => {
                      setSelectedSyllableGroup(grp);
                      playSoundEffect('tap');
                    }}
                    className={`px-4 py-2 rounded-2xl font-arabic font-black text-base transition-all border-2 flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105'
                        : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200'
                    }`}
                  >
                    <span>حرف {grp.letter}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-sans">
                      {grp.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Syllables Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-300 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-teal-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl font-arabic shadow-md">
                  {selectedSyllableGroup.letter}
                </div>
                <div>
                  <h3 className="font-arabic font-black text-slate-900 text-xl sm:text-2xl">
                    مَقَاطِعُ حَرْفِ {selectedSyllableGroup.letterName}
                  </h3>
                  <p className="text-xs text-slate-500 font-arabic">
                    انقر على أي مقطع للاستماع لنطقه المجرد مع الكلمة النموذجية
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const allSyls = selectedSyllableGroup.syllables.map((s) => s.syllable).join(' ... ');
                  speakArabic(allSyls, 0.7);
                  playSoundEffect('tap');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>قراءة كل المقاطع 🎧</span>
              </button>
            </div>

            {/* Grid of Syllables with Pronunciation and Sample Words */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {selectedSyllableGroup.syllables.map((syl, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePlayLetterAudio(`${syl.syllable} ... ${syl.exampleWord}`, 0.75)}
                  className="p-4 rounded-2xl bg-teal-50/60 hover:bg-teal-100/80 border-2 border-teal-200/80 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xs space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white font-bold text-teal-800 border border-teal-200">
                      {syl.typeLabelAr}
                    </span>
                    <Volume2 className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110" />
                  </div>

                  <div className="text-center py-2">
                    <span className="font-arabic font-black text-4xl text-teal-950 group-hover:text-teal-700 transition-colors">
                      {syl.syllable}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between text-xs font-arabic">
                    <span className="text-slate-500">مِثَال:</span>
                    <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-teal-200">
                      {syl.exampleWord}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. LEVEL 3: WORDS VIEW (كَلِمَات)                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'words' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Categories Filter Pills for Words */}
          <div className="bg-white rounded-3xl p-4 border-2 border-purple-300 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-purple-950 font-arabic">
                اختر نوع الكلمات للتدرب على التقطيع والتهجئة السليمة:
              </span>
              <span className="text-[10px] bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full font-bold">
                {selectedWordCategory.words.length} كلمات
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 py-1">
              {WORDS_READING_CATEGORIES.map((cat) => {
                const isSelected = selectedWordCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedWordCategory(cat);
                      playSoundEffect('tap');
                    }}
                    className={`px-4 py-2.5 rounded-2xl font-arabic font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                    }`}
                  >
                    <span>{cat.titleAr}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-sans">
                      {cat.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Words Grid with Syllable Breakdowns */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-300 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-arabic font-black text-slate-900 text-xl sm:text-2xl">
                    {selectedWordCategory.titleAr}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    {selectedWordCategory.titleFr}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const allWords = selectedWordCategory.words.map((w) => w.arabic).join(' ... ');
                  speakArabic(allWords, 0.75);
                  playSoundEffect('tap');
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>قراءة كل الكلمات 🎧</span>
              </button>
            </div>

            {/* Grid of Words with Syllable Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedWordCategory.words.map((w) => {
                const isPlayingThis = activePlayingWordId === w.id;
                return (
                  <div
                    key={w.id}
                    className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                      isPlayingThis
                        ? 'bg-purple-100 border-purple-500 shadow-md ring-2 ring-purple-400'
                        : 'bg-purple-50/50 hover:bg-purple-50 border-purple-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{w.icon || '📝'}</span>
                      <button
                        onClick={() => handlePlayWordAudio(w.id, w.arabic)}
                        className="p-2 rounded-xl bg-purple-200/80 hover:bg-purple-300 text-purple-900 transition-colors"
                        title="استمع للكلمة كاملة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Word Big Display */}
                    <div className="text-center">
                      <span className="font-arabic font-black text-3xl text-purple-950">
                        {w.arabic}
                      </span>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">
                        {w.french}
                      </p>
                    </div>

                    {/* Syllables Breakdown Pills */}
                    <div className="pt-2 border-t border-purple-200/60">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 font-arabic">
                        <span>التقطيع الهجائي (Syllabes) :</span>
                        <span className="font-mono">{w.syllables.length} مقاطع</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        {w.syllables.map((syl, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handlePlayLetterAudio(syl, 0.7)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-600 hover:text-white text-purple-900 font-arabic font-black text-sm border border-purple-300 shadow-2xs transition-colors"
                            title={`نطق المقطع: ${syl}`}
                          >
                            {syl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. LEVEL 4: SENTENCES & TEXTS VIEW (جُمَل / نُصُوص)                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'sentences' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Sentence Groups Filter */}
          <div className="bg-white rounded-3xl p-4 border-2 border-rose-300 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-rose-950 font-arabic">
                اختر باقة الجمل للتدرب على الطلاقة وفهم المعنى:
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full font-bold">
                {selectedSentenceGroup.sentences.length} جمل
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 py-1">
              {SENTENCES_READING_ITEMS.map((grp) => {
                const isSelected = selectedSentenceGroup.id === grp.id;
                return (
                  <button
                    key={grp.id}
                    onClick={() => {
                      setSelectedSentenceGroup(grp);
                      playSoundEffect('tap');
                    }}
                    className={`px-4 py-2.5 rounded-2xl font-arabic font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-105'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200'
                    }`}
                  >
                    <span>{grp.titleAr}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-sans">
                      {grp.unitBadge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Sentences List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-300 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  <AlignJustify className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-arabic font-black text-slate-900 text-xl sm:text-2xl">
                    {selectedSentenceGroup.titleAr}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    {selectedSentenceGroup.titleFr}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const allSentences = selectedSentenceGroup.sentences.map((s) => s.textAr).join(' ... ');
                  speakArabic(allSentences, 0.8);
                  playSoundEffect('tap');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>قراءة كل الجمل 🎧</span>
              </button>
            </div>

            {/* List of Sentences */}
            <div className="space-y-4">
              {selectedSentenceGroup.sentences.map((sent, sIdx) => {
                const isPlayingThis = activePlayingSentenceId === sent.id;
                return (
                  <div
                    key={sent.id}
                    className={`p-5 rounded-3xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      isPlayingThis
                        ? 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-400'
                        : 'bg-slate-50/80 hover:bg-rose-50/50 border-slate-200 hover:border-rose-200'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-rose-200 text-rose-900 font-black text-xs flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white font-bold text-slate-600 border border-slate-200">
                          السياق: {sent.context}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                          {sent.level}
                        </span>
                      </div>

                      <p dir="rtl" className="font-arabic font-black text-2xl sm:text-3xl text-slate-900 leading-relaxed">
                        {sent.textAr}
                      </p>

                      <p className="text-xs text-slate-500 font-sans">
                        <strong>Français :</strong> {sent.textFr}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handlePlaySentenceAudio(sent.id, sent.textAr)}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>استمع</span>
                      </button>

                      {onSelectSentenceForReader && (
                        <button
                          onClick={() => onSelectSentenceForReader(sent.textAr)}
                          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors"
                          title="فتح في استوديو التتبع البصري والتسجيل"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>تتبع وتسجيل 🎙️</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
