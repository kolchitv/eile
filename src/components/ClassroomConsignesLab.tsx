import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { CLASSROOM_CONSIGNES_DATA, ClassroomConsigne } from '../data/classroomConsignesData';
import { speakArabic, playSoundEffect, stopAudio } from '../utils/audio';
import {
  Volume2,
  Sparkles,
  Search,
  CheckCircle2,
  Hand,
  UserCheck,
  GraduationCap,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface ClassroomConsignesLabProps {
  language: SupportedLanguage;
  onBack?: () => void;
}

export const ClassroomConsignesLab: React.FC<ClassroomConsignesLabProps> = ({
  language,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'simulator'>('cards');
  const [simulatedConsigneIndex, setSimulatedConsigneIndex] = useState<number>(0);
  const [simScore, setSimScore] = useState<number>(0);
  const [simFeedback, setSimFeedback] = useState<string | null>(null);

  const categories = [
    { key: 'all', titleFr: 'Toutes les consignes', titleAr: 'جميع التعليمات (34)', icon: '📚' },
    { key: 'attention', titleFr: 'Attention & Silence', titleAr: 'لفت الانتباه والهدوء', icon: '🤫' },
    { key: 'start', titleFr: 'Démarrer la séance', titleAr: 'بدء الحصة والترحيب', icon: '🌅' },
    { key: 'consigne', titleFr: 'Donner une consigne', titleAr: 'توجيه التعليمات', icon: '📋' },
    { key: 'speaking_turn', titleFr: 'Distribuer la parole', titleAr: 'توزيع الكلمة', icon: '🎯' },
    { key: 'regulate', titleFr: 'Réguler positivement', titleAr: 'الضبط الإيجابي', icon: '🛑' },
    { key: 'encourage', titleFr: 'Encourager & Féliciter', titleAr: 'التحفيز والتشجيع', icon: '🌟' },
    { key: 'end', titleFr: 'Fin de séance', titleAr: 'ختام الحصة والمغادرة', icon: '🚪' },
  ];

  const filteredConsignes = CLASSROOM_CONSIGNES_DATA.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchQuery =
      item.french.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabic.includes(searchQuery) ||
      item.gestureFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translitFr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handlePlay = async (arabicText: string, id: string) => {
    playSoundEffect('tap');
    if (playingId === id) {
      stopAudio();
      setPlayingId(null);
      return;
    }
    stopAudio();
    setPlayingId(id);
    try {
      await speakArabic(arabicText, 0.88, false);
    } finally {
      setPlayingId(null);
    }
  };

  const currentSimItem = CLASSROOM_CONSIGNES_DATA[simulatedConsigneIndex];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-emerald-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                EILE • CE1 à CM2
              </span>
              <span className="bg-emerald-500/20 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                المستويان A1 و A2 • لغة القسم والإشارات
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-arabic text-amber-200">
              {language === 'ar'
                ? 'مختبر لغة القسم والتعليمات المصحوبة بالإشارات (EILE)'
                : 'Phrases types, Consignes & Gestuelle de Classe (EILE)'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed font-sans">
              {language === 'fr'
                ? 'Répertoire officiel des consignes bilingues français-arabe avec posture et gestuelle corporelle. Conçu pour installer les rituels de classe, capter l’attention sans crier et encourager la prise de parole spontanée.'
                : 'الدليل الرسمي للعبارات التوجيهية ولغة التدريس بالقسم مع العمود البيداغوجي المخصص للحركات والوضعيات الجسدية المرافقة (Gestes / Posture).'}
            </p>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
              <span>{language === 'ar' ? 'العودة للخريطة' : 'Retour'}</span>
            </button>
          )}
        </div>

        {/* Mode Switcher */}
        <div className="relative z-10 mt-6 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('cards');
                playSoundEffect('tap');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-white/10 text-emerald-200 hover:bg-white/15'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'ar' ? 'بطاقات التعليمات والإشارات' : 'Répertoire & Gestes'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('simulator');
                playSoundEffect('tap');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-white/10 text-emerald-200 hover:bg-white/15'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{language === 'ar' ? 'محاكي إدارة القسم التفاعلي' : 'Simulateur de Classe'}</span>
            </button>
          </div>

          <div className="text-xs text-amber-300 font-bold flex items-center gap-2">
            <Hand className="w-4 h-4" />
            <span>34 تعليمة رسمية مصحوبة بالوضعيات والحركات الجسدية</span>
          </div>
        </div>
      </div>

      {activeTab === 'cards' ? (
        <>
          {/* Controls: Search and Filter Pills */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'ابحث عن تعليمة بالفرنسية أو العربية أو الحركة المقترنة بها...'
                    : 'Rechercher une consigne, un mot arabe ou un geste...'
                }
                className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    playSoundEffect('tap');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{language === 'ar' ? cat.titleAr : cat.titleFr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredConsignes.map((item) => {
              const isPlaying = playingId === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 bg-white ${
                    isPlaying
                      ? 'border-amber-400 ring-2 ring-amber-300 shadow-md bg-amber-50/30'
                      : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  {/* Category Tag & Audio Button */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span>{item.categoryIcon}</span>
                      <span>{language === 'ar' ? item.categoryTitleAr : item.categoryTitleFr}</span>
                    </span>

                    <button
                      onClick={() => handlePlay(item.arabic, item.id)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                      }`}
                      title="استمع للنطق الصوتي"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Arabic Consigne */}
                  <div className="space-y-1 text-center py-1">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 font-arabic tracking-wide">
                      {item.arabic}
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-700">{item.translitFr}</div>
                    <div className="text-sm font-semibold text-slate-700 font-sans">{item.french}</div>
                  </div>

                  {/* Gestes / Posture Box */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                      <span className="text-base">{item.gestureIcon}</span>
                      <span className="text-emerald-900 font-black">
                        {language === 'ar' ? 'الحركة / الوضعية:' : 'Geste / Posture :'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-sans leading-relaxed">
                      {language === 'ar' ? item.gestureAr : item.gestureFr}
                    </p>
                    <div className="text-[10px] text-slate-500 font-sans italic border-t border-slate-200/60 pt-1">
                      💡 {item.pedagogicalTipFr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Simulator Mode: Practice Classroom Management */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                محاكي القسم التفاعلي
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {language === 'ar' ? 'تمرين الربط بين العبارة والحركة البيداغوجية' : 'Jeu de Rôle : Consigne & Posture'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                السؤال {simulatedConsigneIndex + 1} / {CLASSROOM_CONSIGNES_DATA.length}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full border border-amber-300">
                النقاط: {simScore} 🌟
              </span>
            </div>
          </div>

          {currentSimItem && (
            <div className="max-w-2xl mx-auto space-y-6 text-center">
              {/* Teacher Situation Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-300 space-y-3">
                <span className="text-3xl">{currentSimItem.categoryIcon}</span>
                <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  {currentSimItem.categoryTitleFr}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                  « {currentSimItem.french} »
                </h3>
                <div className="text-sm font-mono text-slate-600 font-bold">
                  {currentSimItem.translitFr}
                </div>

                <button
                  onClick={() => handlePlay(currentSimItem.arabic, currentSimItem.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استمع للعبارة بالعربية 🔊</span>
                </button>
              </div>

              {/* Challenge Question */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-800">
                  {language === 'ar'
                    ? 'ما هي الحركة أو الوضعية الجسدية (Gestes / Posture) الموصى بها في وثيقة EILE؟'
                    : 'Quel est le geste ou la posture préconisée pour cette consigne ?'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {/* Generate 4 options: 1 correct, 3 distractors */}
                  {[
                    currentSimItem,
                    CLASSROOM_CONSIGNES_DATA[(simulatedConsigneIndex + 3) % CLASSROOM_CONSIGNES_DATA.length],
                    CLASSROOM_CONSIGNES_DATA[(simulatedConsigneIndex + 7) % CLASSROOM_CONSIGNES_DATA.length],
                    CLASSROOM_CONSIGNES_DATA[(simulatedConsigneIndex + 12) % CLASSROOM_CONSIGNES_DATA.length],
                  ]
                    .sort(() => (currentSimItem.id.charCodeAt(0) % 2 === 0 ? 0.5 - Math.random() : -0.5 + Math.random()))
                    .map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (opt.id === currentSimItem.id) {
                            setSimScore((prev) => prev + 10);
                            setSimFeedback('correct');
                            playSoundEffect('correct');
                          } else {
                            setSimFeedback('wrong');
                            playSoundEffect('wrong');
                          }
                        }}
                        className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all text-left flex items-start gap-2.5 cursor-pointer ${
                          simFeedback === 'correct' && opt.id === currentSimItem.id
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400'
                            : 'bg-white border-slate-200 hover:border-amber-400 text-slate-800'
                        }`}
                      >
                        <span className="text-xl shrink-0">{opt.gestureIcon}</span>
                        <div className="space-y-0.5">
                          <div className="font-arabic font-bold text-xs text-emerald-950">{opt.gestureAr}</div>
                          <div className="text-[11px] text-slate-600 font-sans">{opt.gestureFr}</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Feedback and Next */}
              {simFeedback && (
                <div
                  className={`p-4 rounded-2xl border text-center space-y-2 animate-fade-in ${
                    simFeedback === 'correct'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <p className="text-sm font-black font-arabic">
                    {simFeedback === 'correct'
                      ? '🎉 أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ!'
                      : `❌ حَاوِلْ مَرَّةً أُخْرَى: الحركة الصحيحة هي: ${currentSimItem.gestureAr} (${currentSimItem.gestureFr})`}
                  </p>
                  <p className="text-xs font-sans text-slate-600">
                    💡 {currentSimItem.pedagogicalTipFr}
                  </p>
                  <button
                    onClick={() => {
                      setSimFeedback(null);
                      setSimulatedConsigneIndex((prev) => (prev + 1) % CLASSROOM_CONSIGNES_DATA.length);
                      playSoundEffect('tap');
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md cursor-pointer mt-2"
                  >
                    التعليمة التالية ➔
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
