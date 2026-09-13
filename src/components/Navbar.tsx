import React from 'react';
import { CEFRLevel, SupportedLanguage } from '../types';
import { Flame, Zap, Gem, Award, Target, Music } from 'lucide-react';
import { ReadingHierarchyTab } from '../components/ReadingHierarchySection';

interface NavbarProps {
  currentLevel: CEFRLevel;
  onSelectLevel: (lvl: CEFRLevel) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  streak: number;
  xp: number;
  gems: number;
  onOpenPlacementTest?: () => void;
  onOpenGrammarAnalyzer?: () => void;
  onOpenCertificate: () => void;
  onOpenPhonetics?: () => void;
  onOpenVideoLibrary?: () => void;
  onOpenReadingLab?: (hierarchyTab?: ReadingHierarchyTab) => void;
  onOpenSpeakingLab?: () => void;
  onOpenUnit1Lab?: () => void;
  onSelectUnitNumber?: (unitNumber: number) => void;
  onOpenSpeedReading?: () => void;
  onOpenThematicVocab?: (categoryId?: string) => void;
  onOpenTextStudio?: (initialText?: string, hierarchyTab?: ReadingHierarchyTab) => void;
  onOpenCompetencies?: (level?: 'A1' | 'A2') => void;
  onOpenChants?: (chantId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLevel,
  onSelectLevel,
  language,
  onSelectLanguage,
  streak,
  xp,
  gems,
  onOpenCertificate,
  onOpenCompetencies,
  onOpenChants,
}) => {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const levelLabels: Record<CEFRLevel, { nameAr: string; nameEn: string; nameFr: string }> = {
    A1: { nameAr: 'المبتدئ', nameEn: 'Discovery', nameFr: 'Débutant' },
    A2: { nameAr: 'الأساسي', nameEn: 'Elementary', nameFr: 'Élémentaire' },
    B1: { nameAr: 'المستقل', nameEn: 'Intermediate', nameFr: 'Intermédiaire' },
    B2: { nameAr: 'المتمكن', nameEn: 'Vantage', nameFr: 'Avancé B2' },
    C1: { nameAr: 'المتقدم', nameEn: 'Proficient', nameFr: 'Autonome C1' },
    C2: { nameAr: 'الفصيح (الإتقان)', nameEn: 'Mastery', nameFr: 'Maîtrise C2' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm shadow-amber-500/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Bar: Brand Logo + CEFR Levels + Language & Certificate */}
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <span className="font-serif font-bold text-xl sm:text-2xl leading-none">ض</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight font-sans">
                  <span className="text-sky-800">Arab</span>
                  <span className="text-amber-500">facile</span>
                  <span className="text-emerald-700 font-bold text-base sm:text-lg">.com</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium hidden md:block">
                {language === 'ar' ? 'العربية في متناول يدك • A1 ➔ C2' : language === 'fr' ? "L'arabe à votre portée (A1 ➔ C2)" : 'Arabic within your reach (A1 ➔ C2)'}
              </p>
            </div>
          </div>

          {/* CEFR Level Selector Pills (In the Top Bar) */}
          <div className="flex items-center overflow-x-auto no-scrollbar bg-amber-100/70 p-1 rounded-2xl border border-amber-200/80 max-w-2xl gap-0.5">
            {levels.map((lvl) => {
              const isActive = currentLevel === lvl;
              return (
                <button
                  key={lvl}
                  id={`nav-level-${lvl}`}
                  onClick={() => onSelectLevel(lvl)}
                  className={`px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-sm shadow-emerald-800/20 border border-emerald-600'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
                  }`}
                  title={`${lvl} - ${levelLabels[lvl].nameEn}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-amber-300 ring-2 ring-emerald-300' : 'bg-amber-400'
                    }`}
                  />
                  <span className="font-black text-xs">{lvl}</span>
                  <span className="text-[10px] opacity-90 hidden lg:inline font-medium">
                    ({language === 'ar' ? levelLabels[lvl].nameAr : language === 'fr' ? levelLabels[lvl].nameFr : levelLabels[lvl].nameEn})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Area: Gamification Stats + Language Switcher + Certificate */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Gamification Stats: Streak & XP & Gems */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-100/90 via-orange-100/70 to-amber-100/90 border border-amber-300/80 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold text-amber-950 shadow-2xs shrink-0">
              <div className="flex items-center gap-1" title={`${streak} Day Learning Streak!`}>
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                <span>{streak}</span>
              </div>
              <span className="text-amber-300 font-light">|</span>
              <div className="flex items-center gap-1" title={`${xp} Total XP Points`}>
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>{xp}</span>
              </div>
              <span className="text-amber-300 font-light">|</span>
              <div className="flex items-center gap-1 text-emerald-900" title={`${gems} Dhad Gems`}>
                <Gem className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
                <span>{gems}</span>
              </div>
            </div>

            {/* Language Switcher Dropdown */}
            <div className="relative flex items-center bg-amber-100/80 rounded-xl p-0.5 border border-amber-300/80 text-xs font-bold shrink-0">
              <button
                id="btn-lang-fr"
                onClick={() => onSelectLanguage('fr')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all ${language === 'fr' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                FR 🇫🇷
              </button>
              <button
                id="btn-lang-ar"
                onClick={() => onSelectLanguage('ar')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all ${language === 'ar' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                عربي 🇸🇦
              </button>
              <button
                id="btn-lang-en"
                onClick={() => onSelectLanguage('en')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                EN 🇬🇧
              </button>
            </div>

            {/* Arabic Chants (الأناشيد المدرسية EILE) */}
            {onOpenChants && (
              <button
                id="btn-nav-chants"
                onClick={() => onOpenChants()}
                className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-700 hover:to-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-sm shadow-amber-600/25 active:scale-95 transition-all shrink-0 cursor-pointer"
                title="قسم الأناشيد المدرسية المترجمة (EILE)"
              >
                <Music className="w-4 h-4 text-amber-200" />
                <span>{language === 'ar' ? 'الأناشيد 🎵' : language === 'fr' ? 'Chants (EILE) 🎵' : 'Songs & Chants 🎵'}</span>
              </button>
            )}

            {/* CEFR Competencies Button */}
            {onOpenCompetencies && (
              <button
                id="btn-nav-competencies"
                onClick={() => onOpenCompetencies(currentLevel === 'A2' ? 'A2' : 'A1')}
                className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-emerald-700/25 active:scale-95 transition-all shrink-0"
                title="دليل كفايات A1 و A2 الرسمية CECRL"
              >
                <Target className="w-4 h-4 text-amber-300" />
                <span>{language === 'ar' ? 'الكفايات (CECRL)' : language === 'fr' ? 'Compétences A1/A2' : 'CEFR Competencies'}</span>
              </button>
            )}

            {/* Certificate Button */}
            <button
              id="btn-nav-certificate"
              onClick={onOpenCertificate}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-amber-500/25 active:scale-95 transition-all shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>{language === 'ar' ? 'الشهادة' : language === 'fr' ? 'Certificat' : 'Certificate'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

