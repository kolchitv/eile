import React, { useState, useEffect } from 'react';
import { CEFRLevel, LessonUnit, SupportedLanguage } from '../types';
import { CURRICULUM_UNITS } from '../data/curriculumData';
import { THEMATIC_CATEGORIES, ThematicCategoryId } from '../data/thematicVocabularyData';
import { CEFR_COMPETENCIES_DATA } from '../data/competenciesData';
import { ARABIC_CHANTS_DATA } from '../data/chantsData';
import { speakArabic, playSoundEffect } from '../utils/audio';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  Play,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Compass,
  GraduationCap,
  Crown,
  Volume2,
  Zap,
  Grid,
  Layers,
  Target,
  FileCheck,
  CheckCheck,
  ChevronRight,
  Music,
} from 'lucide-react';

interface LevelRoadmapProps {
  currentLevel: CEFRLevel;
  onSelectUnit: (unit: LessonUnit) => void;
  completedUnits: string[];
  language: SupportedLanguage;
  onOpenTutor: () => void;
  onOpenSoundGame: () => void;
  onOpenUnit1Lab?: () => void;
  onOpenThematicVocab?: (categoryId?: ThematicCategoryId) => void;
  onOpenTextStudio?: () => void;
  onOpenCompetencies?: (level?: 'A1' | 'A2') => void;
  onOpenChants?: (chantId?: string) => void;
}

export const LevelRoadmap: React.FC<LevelRoadmapProps> = ({
  currentLevel,
  onSelectUnit,
  completedUnits,
  language,
  onOpenTutor,
  onOpenSoundGame,
  onOpenUnit1Lab,
  onOpenThematicVocab,
  onOpenTextStudio,
  onOpenCompetencies,
  onOpenChants,
}) => {
  const [acquiredMap, setAcquiredMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cefr_acquired_competencies_v1');
      if (saved) {
        setAcquiredMap(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const unitsInLevel = CURRICULUM_UNITS.filter((u) => u.level === currentLevel);
  const cefrData = currentLevel === 'A1' || currentLevel === 'A2' ? CEFR_COMPETENCIES_DATA[currentLevel] : null;

  const levelMeta: Record<
    CEFRLevel,
    {
      titleAr: string;
      titleEn: string;
      titleFr: string;
      descEn: string;
      descFr: string;
      color: string;
      badgeIcon: any;
    }
  > = {
    A1: {
      titleAr: 'المستوى A1: المبتدئ الاستكشافي',
      titleEn: 'Level A1: Discovery & Foundations',
      titleFr: 'Niveau A1 : Découverte & Fondations',
      descEn: 'Foundational Arabic letters (M, K, L, N, S), Tashkeel vowels, basic greetings, and self-introductions (ELCO curriculum).',
      descFr: 'Lettres arabes fondamentales (M, K, L, N, S), voyelles courtes, salutations et présentation de soi.',
      color: 'from-emerald-600 to-teal-800',
      badgeIcon: Sparkles,
    },
    A2: {
      titleAr: 'المستوى A2: الأساسي التواصلي',
      titleEn: 'Level A2: Elementary Survival Arabic',
      titleFr: 'Niveau A2 : Survie & Communication Essentielle',
      descEn: 'Souk marketplace negotiations, ordering food at cafes/restaurants, asking directions, and daily routines.',
      descFr: 'Négociation au souk, commandes au restaurant, demander son chemin et routines quotidiennes.',
      color: 'from-amber-600 to-orange-800',
      badgeIcon: Compass,
    },
    B1: {
      titleAr: 'المستوى B1: المستقل التطبيقي',
      titleEn: 'Level B1: Intermediate Travel & Fluency',
      titleFr: 'Niveau B1 : Voyages & Autonomie Intermédiaire',
      descEn: 'Narrating adventures across Arab capitals, expressing personal feelings, short folktales (Juha), and past/present narratives.',
      descFr: 'Récits de voyage à travers le monde arabe, expression des émotions et contes populaires.',
      color: 'from-cyan-600 to-blue-800',
      badgeIcon: BookOpen,
    },
    B2: {
      titleAr: 'المستوى B2: المتمكن الحواري',
      titleEn: 'Level B2: Upper-Intermediate Vantage',
      titleFr: 'Niveau B2 : Débats, Médias & Proverbes',
      descEn: 'Media news comprehension, classic proverbs & wisdom, social debates, and comparing regional dialects with MSA.',
      descFr: 'Compréhension des médias, proverbes arabes, débats de société et comparaison dialectes vs Fusha.',
      color: 'from-purple-600 to-indigo-800',
      badgeIcon: GraduationCap,
    },
    C1: {
      titleAr: 'المستوى C1: المتقدم الأكاديمي',
      titleEn: 'Level C1: Effective Operational Proficiency',
      titleFr: 'Niveau C1 : Prose Classique & Diplomatie',
      descEn: 'Classical prose analysis (Ibn Khaldun, Al-Jahiz), diplomatic discourses, complex syntax (I‘rab), and rhetorical figures.',
      descFr: 'Analyse de textes classiques (Ibn Khaldoun), discours diplomatique et rhétorique arabe avancée.',
      color: 'from-rose-600 to-pink-900',
      badgeIcon: Award,
    },
    C2: {
      titleAr: 'المستوى C2: الإتقان والطلاقة الفصيحة',
      titleEn: 'Level C2: Mastery & Classical Eloquence',
      titleFr: 'Niveau C2 : Maîtrise Poétique & Éloquence Suprême',
      descEn: 'Pre-Islamic odes (Mu‘allaqat), Al-Mutanabbi poetry, the 16 poetic meters (Buhur), and sophisticated philosophical debates.',
      descFr: 'Les grands poèmes classiques (Mu‘allaqat, Al-Mutanabbi), les mètres poétiques et débats philosophiques.',
      color: 'from-amber-700 via-yellow-600 to-stone-900',
      badgeIcon: Crown,
    },
  };

  const currentMeta = levelMeta[currentLevel];
  const BadgeIcon = currentMeta.badgeIcon;

  return (
    <div className="space-y-6">
      {/* Level Header Banner */}
      <div
        className={`bg-gradient-to-r ${currentMeta.color} rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider border border-white/20">
                CEFR Standard {currentLevel}
              </span>
              <span className="text-xs text-white/80 font-medium">
                {language === 'fr' ? 'Cadre Européen des Langues' : 'Common European Framework'}
              </span>
            </div>

            <h1 dir="rtl" className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide text-amber-200">
              {currentMeta.titleAr}
            </h1>

            <p className="text-sm text-slate-100 max-w-2xl leading-relaxed">
              {language === 'fr' ? currentMeta.descFr : currentMeta.descEn}
            </p>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <BadgeIcon className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Quick Interactive Mini-Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* AI Tutor Quick Jump */}
        <div
          onClick={onOpenTutor}
          className="p-5 rounded-3xl bg-white/95 backdrop-blur-xs border-2 border-emerald-200/90 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-extrabold border border-emerald-200">
                AI Powered
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                {language === 'ar' ? 'تحدث مع المعلم "فصيح"' : language === 'fr' ? 'Dialogue avec le Tuteur Faseeh' : 'Chat with AI Tutor Faseeh'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 max-w-xs">
              {language === 'fr'
                ? 'Pratiquez l\'oral et l\'écrit avec corrections instantanées adaptées au niveau ' + currentLevel
                : 'Practice speaking & writing with instant feedback tailored to ' + currentLevel}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Phonetics & Tricky Sounds Game Jump */}
        <div
          onClick={onOpenSoundGame}
          className="p-5 rounded-3xl bg-white/95 backdrop-blur-xs border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[10px] font-extrabold border border-amber-300/80">
                Phonetics Lab
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-amber-800 transition-colors">
                {language === 'ar' ? 'مختبر تمييز الأصوات الخاصة' : language === 'fr' ? 'Laboratoire des Sons Difficiles' : 'Tricky Arabic Sounds Challenge'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 max-w-xs">
              {language === 'fr'
                ? 'Distinguez les sons (ح / هـ, ق / ك, ص / س, ض / د) à l\'oreille'
                : 'Train your ear to master distinct Arabic letters (Ḥā, ‘Ayn, Qāf, Ḍād)'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <Volume2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CEFR COMPETENCIES SHOWCASE FOR A1 & A2 (دليل الكفايات الرسمية)            */}
      {/* ========================================================================= */}
      {cefrData && (
        <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white border-2 border-amber-300/90 shadow-xl relative overflow-hidden space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5" dir="rtl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                  كفايات المنهاج الرسمي CECRL
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold font-mono">
                  المستوى {currentLevel} • 7 مجالات لغوية
                </span>
              </div>

              <h2 className="font-arabic text-xl sm:text-2xl font-black text-amber-200">
                مصفوفة الكفايات التواصليّة واللغويّة ({cefrData.titleAr})
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 font-sans max-w-2xl">
                {language === 'fr'
                  ? cefrData.descriptionFr
                  : language === 'ar'
                  ? cefrData.descriptionAr
                  : cefrData.descriptionEn}
              </p>
            </div>

            {onOpenCompetencies && (
              <button
                onClick={() => {
                  onOpenCompetencies(currentLevel as 'A1' | 'A2');
                  playSoundEffect('tap');
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>
                  {language === 'ar'
                    ? `استعراض وتقييم كفايات ${currentLevel} (دليل تفاعلي) ➔`
                    : `Explorer les compétences ${currentLevel} (CECRL) ➔`}
                </span>
              </button>
            )}
          </div>

          {/* 7 Domains Compact Interactive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-2 relative z-10" dir="rtl">
            {cefrData.domains.map((domain) => {
              const descs = domain.categories.flatMap((c) => c.descriptors);
              const acquiredCount = descs.filter((d) => acquiredMap[d.id]).length;
              const isAllAcquired = descs.length > 0 && acquiredCount === descs.length;

              return (
                <div
                  key={domain.id}
                  onClick={() => {
                    if (onOpenCompetencies) onOpenCompetencies(currentLevel as 'A1' | 'A2');
                    playSoundEffect('tap');
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 text-right group ${
                    isAllAcquired
                      ? 'bg-emerald-800/60 border-emerald-400 shadow-xs'
                      : 'bg-white/10 border-white/15 hover:bg-white/20 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl group-hover:scale-110 transition-transform">{domain.icon}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 text-amber-300">
                      {acquiredCount}/{descs.length}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-arabic font-black text-xs text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {domain.titleAr}
                    </h4>
                    <p className="text-[9px] text-slate-300 font-sans truncate">
                      {language === 'fr' ? domain.titleFr : domain.titleEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Special Feature: Unit 1 Official Syllabus (المجال الثاني: الأسرة والمحيط) */}
      {onOpenUnit1Lab && (
        <div
          onClick={onOpenUnit1Lab}
          className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-amber-950 text-white shadow-xl border-2 border-amber-400/80 hover:border-amber-300 transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                توزيع منهاج 2024/2025
              </span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                5 مكونات متكررة + حوارات التعارف
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-amber-200 font-arabic">
              المجال الثاني: الأُسْرَةُ وَالمُحِيطُ (الحصص 1 إلى 6)
            </h3>
            
            <p className="text-xs sm:text-sm text-emerald-100 font-sans max-w-xl">
              {language === 'fr'
                ? 'Dialogues de présentation en phrases courtes à mémoriser, consignes de classe, parler en continu, lecture (م، ك، ل، ن، س) et fiche d’identité.'
                : 'حوارات التعارف مقسمة لجمل قصيرة للحفظ والتسميع، تعليمات القسم، الاسترسال والنشيد، القراءة والكتابة وبطاقة التعريف.'}
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 self-end md:self-center shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-amber-300 block">6 حصص تفاعلية</span>
              <span className="text-[10px] text-emerald-200 block">وضع التسميع الفوري 🧠</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ARABIC CHANTS & POETRY SHOWCASE (قسم الأناشيد المدرسية المترجمة EILE)      */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-900 via-rose-950 to-slate-950 rounded-3xl p-6 sm:p-7 border-2 border-amber-400/80 shadow-xl space-y-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1" dir="rtl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-xs">
                🎵
              </span>
              <h2 className="font-arabic text-xl sm:text-2xl font-black text-amber-200">
                قِسْمُ الأَنَاشِيدِ وَالقَصَائِدِ المَدْرَسِيَّةِ (EILE)
              </h2>
              <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                مترجمة بالفرنسية 🇫🇷
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-sans max-w-2xl">
              {language === 'fr'
                ? 'Chants et comptines en rimes avec écoute audio, mode karaoké, traduction française vers par vers, explication du vocabulaire et quiz de compréhension.'
                : 'أناشيد تعليمية ملحنة بالنطق الصوتي الفصيح، الترجمة الفرنسية، شرح المفردات، واختبارات الحفظ السريع.'}
            </p>
          </div>

          {onOpenChants && (
            <button
              onClick={() => {
                onOpenChants();
                playSoundEffect('tap');
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Music className="w-4 h-4 text-slate-950" />
              <span>{language === 'ar' ? 'استمع للأناشيد كاملة ➔' : 'Écouter les Chants ➔'}</span>
            </button>
          )}
        </div>

        {/* 3 Chants Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 relative z-10" dir="rtl">
          {ARABIC_CHANTS_DATA.map((chant) => (
            <div
              key={chant.id}
              onClick={() => {
                if (onOpenChants) onOpenChants(chant.id);
                playSoundEffect('tap');
              }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:border-amber-400 hover:bg-white/15 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {chant.icon}
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {chant.unitNameAr.split(' ')[0]} {chant.unitNumber}
                </span>
              </div>

              <div>
                <h4 className="font-arabic font-black text-lg text-amber-100 group-hover:text-amber-300 transition-colors">
                  {chant.titleAr}
                </h4>
                <p className="text-xs font-sans text-slate-300 italic" dir="ltr">
                  🇫🇷 {chant.titleFr}
                </p>
                <p className="text-[11px] font-arabic text-emerald-200 mt-1 line-clamp-1">
                  «{chant.verses[0]?.lineAr}»
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-amber-200 font-bold flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{chant.verses.length} أبيات مع الصوت</span>
                </span>
                <span className="text-white font-bold group-hover:translate-x-[-2px] transition-transform">
                  أنشد الآن ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THEMATIC VISUAL VOCABULARY SHOWCASE (المفردات المصورة بالصور والنطق)         */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-emerald-500/10 rounded-3xl p-6 sm:p-7 border-2 border-amber-300/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-xs">
                🖼️
              </span>
              <h2 dir="rtl" className="font-arabic text-xl sm:text-2xl font-black text-slate-900">
                بَنْكُ المُفْرَدَاتِ وَالمَفَاهِيمِ المُصَوَّرَةِ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'fr'
                ? 'Apprentissage visuel par thèmes : Maison, Famille, Salutations, Fruits, Métiers, Transports, etc.'
                : 'موسوعة المفردات الأساسية بالصور التعبيرية، النطق الفصيح، وأمثلة الاستعمال.'}
            </p>
          </div>

          {onOpenThematicVocab && (
            <button
              onClick={() => {
                onOpenThematicVocab();
                playSoundEffect('tap');
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <Grid className="w-4 h-4" />
              <span>{language === 'ar' ? 'تصفح كل المفردات (12 مجالاً) ➔' : language === 'fr' ? 'Ouvrir le Dictionnaire Visuel ➔' : 'Explore Visual Dictionary ➔'}</span>
            </button>
          )}
        </div>

        {/* Thematic Category Visual Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {THEMATIC_CATEGORIES.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (onOpenThematicVocab) onOpenThematicVocab(cat.id);
                playSoundEffect('tap');
              }}
              className="bg-white rounded-2xl p-3.5 border-2 border-amber-200/90 hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group text-center flex flex-col items-center justify-between space-y-2 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl group-hover:scale-115 transition-transform">
                {cat.icon}
              </div>
              <div>
                <h4 dir="rtl" className="font-arabic font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                  {cat.titleAr}
                </h4>
                <p className="text-[10px] text-slate-500 font-bold truncate">
                  {language === 'fr' ? cat.titleFr : cat.titleEn}
                </p>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                {language === 'ar' ? 'عرض الكلمات' : 'Voir les mots'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUSTOM TEXT READER & VOICE STUDIO BANNER (قارئ النصوص المخصص والمسجل الصوتي) */}
      {/* ========================================================================= */}
      {onOpenTextStudio && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-amber-400/80 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="space-y-2 text-right w-full md:w-auto" dir="rtl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                ✨ ميزة جديدة ومطلوبة
              </span>
              <span className="text-amber-300 text-xs font-bold font-arabic">
                تتبع الكلمات بدائرة مضيئة + تسجيل ومقارنة الصوت
              </span>
            </div>
            <h3 className="font-arabic text-xl sm:text-2xl font-black text-amber-200">
              قَارِئُ النُّصُوصِ المُخَصَّصَةِ وَاسْتُودِيُو التَّسْجِيلِ الصَّوْتِيِّ
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {language === 'fr'
                ? 'Collez n’importe quel texte arabe pour le lire avec un curseur animé mot par mot et enregistrer votre voix.'
                : 'أدخل نصوصك الخاصة أو قصصك المفضلة، واستمع لقراءتها مع تظليل كل كلمة بدائرة أو خط ملون، وسجل صوتك للمقارنة الفورية.'}
            </p>
          </div>

          <button
            onClick={() => {
              onOpenTextStudio();
              playSoundEffect('tap');
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2.5 transition-all active:scale-95 shrink-0 w-full md:w-auto"
          >
            <span className="text-base">🎙️</span>
            <span>{language === 'ar' ? 'افتح قارئ النصوص والمسجل ➔' : language === 'fr' ? 'Ouvrir le Studio de Lecture ➔' : 'Open Custom Reader Studio ➔'}</span>
          </button>
        </div>
      )}

      {/* Curriculum Units List for Selected Level */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <span>{language === 'ar' ? 'الوحدات الدراسية التفاعلية' : language === 'fr' ? 'Unités d\'Apprentissage' : 'Interactive Learning Units'}</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {unitsInLevel.length} {unitsInLevel.length === 1 ? 'Unit' : 'Units'}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unitsInLevel.map((unit) => {
            const isCompleted = completedUnits.includes(unit.id);

            return (
              <div
                key={unit.id}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-xs bg-white/95 hover:border-emerald-500 hover:shadow-md ${
                  isCompleted ? 'border-emerald-300 ring-2 ring-emerald-400/20' : 'border-amber-200/80'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-amber-100/70 text-amber-950 border border-amber-200">
                      Unit {unit.unitNumber}
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>+50 XP</span>
                      </span>
                    )}
                  </div>

                  {/* Titles */}
                  <h3 dir="rtl" className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-1 leading-snug">
                    {unit.titleAr}
                  </h3>
                  <h4 className="text-xs font-bold text-emerald-800 mb-2">
                    {language === 'fr' ? unit.titleFr : unit.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {language === 'fr' ? unit.descriptionFr : unit.descriptionEn}
                  </p>

                  {/* Competency Highlights */}
                  <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/70 text-[11px] text-slate-700 space-y-1 mb-4">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{unit.competencies.reading}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{unit.competencies.oralInteraction}</span>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={() => {
                    playSoundEffect('tap');
                    onSelectUnit(unit);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isCompleted ? (language === 'fr' ? 'Revoir l\'unité' : language === 'ar' ? 'مراجعة الوحدة' : 'Review Unit') : (language === 'fr' ? 'Commencer la leçon' : language === 'ar' ? 'ابدأ الدرس' : 'Start Lesson')}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
