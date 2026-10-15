import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import {
  COMMUNICATIVE_FUNCTIONS_DATA,
  THEMATIC_NOTIONS_DATA,
  CommunicativeItem,
} from '../data/communicativeFunctionsData';
import { speakArabic, playSoundEffect, stopAudio } from '../utils/audio';
import {
  Volume2,
  Sparkles,
  Search,
  MessageSquare,
  Globe,
  BookOpen,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface CommunicativeFunctionsLabProps {
  language: SupportedLanguage;
  onBack?: () => void;
  initialLevel?: 'A1' | 'A2';
}

export const CommunicativeFunctionsLab: React.FC<CommunicativeFunctionsLabProps> = ({
  language,
  onBack,
  initialLevel = 'A1',
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'all'>(initialLevel);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'functions' | 'notions'>('functions');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const functionCategories = [
    { key: 'all', titleFr: 'Toutes les fonctions', titleAr: 'جميع الوظائف التواصلية', icon: '🌟' },
    { key: 'information', titleFr: '1. Informations & Descriptions', titleAr: '1. تبادل المعلومات والوصف', icon: 'ℹ️' },
    { key: 'opinions', titleFr: '2. Opinions, Accord & Volonté', titleAr: '2. التعبير عن الرأي والموافقة', icon: '💭' },
    { key: 'emotions', titleFr: '3. Émotions & Sentiments', titleAr: '3. العواطف والمشاعر والمواساة', icon: '❤️' },
    { key: 'activities', titleFr: '4. Demandes, Actions & Ordres', titleAr: '4. الطلب والأنشطة والأوامر', icon: '⚡' },
    { key: 'social_rituals', titleFr: '5. Rituels Sociaux, Salutations & Fêtes', titleAr: '5. التحيات والأعياد والمناسبات', icon: '🤝' },
    { key: 'structure_speech', titleFr: '6. Structurer son Propos & Récits', titleAr: '6. تنظيم الحديث وسرد الحكايات', icon: '📖' },
    { key: 'structure_interaction', titleFr: '7. Réguler l’Interaction & Compréhension', titleAr: '7. ضبط الحوار والتحقق من الفهم', icon: '🔄' },
  ];

  const filteredFunctions = COMMUNICATIVE_FUNCTIONS_DATA.filter((item) => {
    const matchLevel =
      selectedLevel === 'all' ||
      item.level === selectedLevel ||
      item.level === 'A1-A2';
    const matchCategory = selectedCategory === 'all' || item.categoryKey === selectedCategory;
    const matchQuery =
      item.standardArabic.includes(searchQuery) ||
      item.french.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subCategoryFr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchCategory && matchQuery;
  });

  const handlePlay = async (text: string, id: string) => {
    playSoundEffect('tap');
    if (playingId === id) {
      stopAudio();
      setPlayingId(null);
      return;
    }
    stopAudio();
    setPlayingId(id);
    try {
      await speakArabic(text, 0.88, false);
    } finally {
      setPlayingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-teal-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                éduscol • CECRL (A1 - A2)
              </span>
              <span className="bg-white/10 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                الوظائف التواصلية والمفاهيم الثيماتية
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-arabic text-amber-200">
              {language === 'ar'
                ? 'مختبر الوظائف التواصلية والتنوع اللغوي (A1 - A2)'
                : 'Laboratoire des Fonctions Communicatives & Polyglossie (A1 - A2)'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed font-sans">
              {language === 'fr'
                ? 'D’après le Référentiel officiel de l’Éducation nationale (éduscol) : Maîtrisez les actes de parole essentiels en arabe littéral moderne et découvrez les variantes dialectales usuelles (Maghreb, Levant, Égypte) pour une communication naturelle et fluide.'
                : 'وفق مصنفات الكفايات الرسمية للإطار الأوروبي (CECRL): نماذج التعبير والتواصل اليومي، السؤال والجواب، مع رصد التنوع واللهجات الشائعة للإثراء الصوتي.'}
            </p>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
              <span>{language === 'ar' ? 'العودة' : 'Retour'}</span>
            </button>
          )}
        </div>

        {/* Level and Tab Switcher */}
        <div className="relative z-10 mt-6 pt-4 border-t border-teal-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Level Selector */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {(['all', 'A1', 'A2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    playSoundEffect('tap');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-emerald-200 hover:bg-white/10'
                  }`}
                >
                  {lvl === 'all' ? 'المستويان A1 و A2' : `المستوى ${lvl}`}
                </button>
              ))}
            </div>

            {/* Tab: Functions vs Notions */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  setActiveTab('functions');
                  playSoundEffect('tap');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'functions'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-emerald-200 hover:bg-white/10'
                }`}
              >
                الوظائف التواصلية (7)
              </button>
              <button
                onClick={() => {
                  setActiveTab('notions');
                  playSoundEffect('tap');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'notions'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-emerald-200 hover:bg-white/10'
                }`}
              >
                المفاهيم والموضوعات (19)
              </button>
            </div>
          </div>

          <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            <span>مقارنة الفصحى واللهجات المغاربية والمشرقية [ ]</span>
          </div>
        </div>
      </div>

      {activeTab === 'functions' ? (
        <>
          {/* Controls: Search and Category Pills */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'ابحث في الوظائف التواصلية أو العبارات بالعربية أو الفرنسية...'
                    : 'Rechercher une fonction, un acte de parole ou une expression...'
                }
                className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {functionCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    playSoundEffect('tap');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-teal-700 text-white shadow-sm ring-1 ring-teal-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{language === 'ar' ? cat.titleAr : cat.titleFr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Functions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFunctions.map((item) => {
              const isPlaying = playingId === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border bg-white transition-all space-y-3.5 ${
                    isPlaying
                      ? 'border-amber-400 ring-2 ring-amber-300 shadow-md bg-amber-50/20'
                      : 'border-slate-200 hover:border-teal-300 hover:shadow-md'
                  }`}
                >
                  {/* Category Title & Badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {item.level} • {item.subCategoryFr}
                      </span>
                      <h4 className="font-arabic font-bold text-xs text-slate-800">
                        {item.subCategoryAr}
                      </h4>
                    </div>

                    <button
                      onClick={() => handlePlay(item.standardArabic, item.id)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-teal-100 hover:bg-teal-200 text-teal-900'
                      }`}
                      title="استمع للعبارة الفصيحة"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Standard Arabic Formulation */}
                  <div className="space-y-1 bg-gradient-to-r from-emerald-50/60 to-teal-50/60 p-3.5 rounded-2xl border border-emerald-100">
                    <div className="text-lg sm:text-xl font-black text-slate-900 font-arabic leading-relaxed">
                      {item.standardArabic}
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-800">{item.translitFr}</div>
                    <div className="text-xs font-semibold text-slate-700 font-sans">{item.french}</div>
                  </div>

                  {/* Dialectal Variants & Polyglossie Note */}
                  {item.dialectalVariants && (
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Globe className="w-3.5 h-3.5 text-teal-600" />
                        <span className="text-[11px] font-black text-teal-950">
                          {language === 'ar' ? 'التنوع اللغوي الشائع [ ]:' : 'Variantes régionales courantes [ ] :'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
                        {item.dialectalVariants.maghreb && (
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-amber-800 font-bold block text-[10px]">المغاربي:</span>
                            <span className="font-arabic font-bold text-slate-800">
                              {item.dialectalVariants.maghreb}
                            </span>
                          </div>
                        )}
                        {item.dialectalVariants.levant && (
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-teal-800 font-bold block text-[10px]">الشامي:</span>
                            <span className="font-arabic font-bold text-slate-800">
                              {item.dialectalVariants.levant}
                            </span>
                          </div>
                        )}
                        {item.dialectalVariants.egypt && (
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-blue-800 font-bold block text-[10px]">المصري:</span>
                            <span className="font-arabic font-bold text-slate-800">
                              {item.dialectalVariants.egypt}
                            </span>
                          </div>
                        )}
                      </div>

                      {item.dialectalVariants.generalNote && (
                        <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                          📌 {item.dialectalVariants.generalNote}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Sample Dialogue */}
                  {item.sampleDialogue && (
                    <div className="bg-amber-50/50 p-2.5 rounded-2xl border border-amber-200 text-xs space-y-1 font-arabic">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="text-amber-700">🗣️ {item.sampleDialogue.speakerA}:</span>
                        <span>{item.sampleDialogue.textA}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="text-emerald-700">💬 {item.sampleDialogue.speakerB}:</span>
                        <span>{item.sampleDialogue.textB}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-sans italic">
                    💡 {item.contextNoteFr}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Thematic Notions Explorer (19 Themes) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEMATIC_NOTIONS_DATA.map((notion) => (
              <div
                key={notion.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{notion.icon}</span>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 font-arabic">
                        {notion.titleAr}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-sans">{notion.titleFr}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    {notion.level}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {notion.subthemes.map((sub, i) => (
                    <div key={i} className="space-y-1.5">
                      <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                        <span>•</span>
                        <span>{sub.nameAr}</span>
                        <span className="text-slate-400 font-normal">({sub.nameFr})</span>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {sub.words.map((w, j) => (
                          <div
                            key={j}
                            onClick={() => handlePlay(w.ar, `${notion.id}-${i}-${j}`)}
                            className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
                          >
                            <span className="font-arabic font-black text-xs text-slate-900">
                              {w.ar}
                            </span>
                            <span className="text-[10px] text-slate-600 font-sans truncate">
                              {w.fr}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
