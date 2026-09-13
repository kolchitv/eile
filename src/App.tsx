import React, { useState, useEffect } from 'react';
import { CEFRLevel, LessonUnit, SupportedLanguage } from './types';
import { CURRICULUM_UNITS } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { LevelRoadmap } from './components/LevelRoadmap';
import { LessonView } from './components/LessonView';
import { AITutorChat } from './components/AITutorChat';
import { AudioDiscriminationGame } from './components/AudioDiscriminationGame';
import { GrammarAnalyzerModal } from './components/GrammarAnalyzerModal';
import { PlacementTestModal } from './components/PlacementTestModal';
import { CertificateModal } from './components/CertificateModal';
import { PhoneticsGuideModal } from './components/PhoneticsGuideModal';
import { VideoLibraryModal } from './components/VideoLibraryModal';
import { ReadingLabModal } from './components/ReadingLabModal';
import { SpeedReadingGameModal } from './components/SpeedReadingGameModal';
import { ContinuousSpeakingLab } from './components/ContinuousSpeakingLab';
import { UnitCurriculumLab } from './components/UnitCurriculumLab';
import { VisualVocabularyHub } from './components/VisualVocabularyHub';
import { CustomTextReaderStudio } from './components/CustomTextReaderStudio';
import { CEFRCompetenciesModal } from './components/CEFRCompetenciesModal';
import { ArabicChantsModal } from './components/ArabicChantsModal';
import { ReadingHierarchyTab } from './components/ReadingHierarchySection';
import { ThematicCategoryId } from './data/thematicVocabularyData';
import { Footer } from './components/Footer';
import { CulturalProverbs } from './components/CulturalProverbs';
import { playSoundEffect } from './utils/audio';
import {
  Compass,
  MessageSquare,
  Volume2,
  Award,
  Search,
  Sparkles,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Flame,
  Crown,
  Video,
  Timer,
  Target,
  Music,
} from 'lucide-react';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>('A1');
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('arabiya_lang');
    return (saved as SupportedLanguage) || 'fr';
  });
  const [activeView, setActiveView] = useState<'roadmap' | 'vocabHub' | 'textStudio' | 'lesson' | 'tutor' | 'soundLab' | 'speakingLab' | 'unit1Lab'>('roadmap');
  const [selectedUnit, setSelectedUnit] = useState<LessonUnit | null>(null);
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<ThematicCategoryId | 'all'>('all');

  // Gamification State (with local storage persistence)
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('arabiya_xp');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('arabiya_streak');
    return saved ? parseInt(saved, 10) : 4;
  });
  const [gems, setGems] = useState<number>(() => {
    const saved = localStorage.getItem('arabiya_gems');
    return saved ? parseInt(saved, 10) : 45;
  });
  const [completedUnits, setCompletedUnits] = useState<string[]>(() => {
    const saved = localStorage.getItem('arabiya_completed_units');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal States
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isPhoneticsModalOpen, setIsPhoneticsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoModalCategory, setVideoModalCategory] = useState<'all' | 'letters' | 'texts' | 'vocabulary' | 'dialogues'>('all');
  const [videoModalInitialId, setVideoModalInitialId] = useState<string | undefined>(undefined);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [readingModalCategoryId, setReadingModalCategoryId] = useState<string | undefined>(undefined);
  const [isSpeedReadingModalOpen, setIsSpeedReadingModalOpen] = useState(false);
  const [isCompetenciesModalOpen, setIsCompetenciesModalOpen] = useState(false);
  const [competenciesModalInitialLevel, setCompetenciesModalInitialLevel] = useState<'A1' | 'A2'>('A1');
  const [isChantsModalOpen, setIsChantsModalOpen] = useState(false);
  const [chantsModalInitialId, setChantsModalInitialId] = useState<string | undefined>(undefined);

  const [textStudioInitialText, setTextStudioInitialText] = useState<string | undefined>(undefined);
  const [textStudioInitialHierarchyTab, setTextStudioInitialHierarchyTab] = useState<ReadingHierarchyTab | undefined>(undefined);

  const handleOpenChants = (chantId?: string) => {
    setChantsModalInitialId(chantId);
    setIsChantsModalOpen(true);
    playSoundEffect('tap');
  };

  const handleOpenCompetencies = (level?: 'A1' | 'A2') => {
    if (level === 'A1' || level === 'A2') {
      setCompetenciesModalInitialLevel(level);
    } else if (currentLevel === 'A2') {
      setCompetenciesModalInitialLevel('A2');
    } else {
      setCompetenciesModalInitialLevel('A1');
    }
    setIsCompetenciesModalOpen(true);
    playSoundEffect('tap');
  };

  const handleOpenReadingLab = (categoryId?: string) => {
    setReadingModalCategoryId(categoryId);
    setIsReadingModalOpen(true);
    playSoundEffect('tap');
  };

  const handleOpenSpeedReading = () => {
    setIsSpeedReadingModalOpen(true);
    playSoundEffect('tap');
  };

  const handleOpenThematicVocab = (categoryId?: ThematicCategoryId | 'all') => {
    setSelectedVocabCategory(categoryId || 'all');
    setActiveView('vocabHub');
    setSelectedUnit(null);
    playSoundEffect('tap');
  };

  const handleOpenTextStudio = (initialText?: string, hierarchyTab?: ReadingHierarchyTab) => {
    setTextStudioInitialText(initialText);
    setTextStudioInitialHierarchyTab(hierarchyTab);
    setActiveView('textStudio');
    setSelectedUnit(null);
    playSoundEffect('tap');
  };

  const handleOpenVideoLibrary = (category?: string, queryOrId?: string) => {
    if (category) {
      setVideoModalCategory(category as any);
    } else {
      setVideoModalCategory('all');
    }
    setVideoModalInitialId(queryOrId);
    setIsVideoModalOpen(true);
    playSoundEffect('tap');
  };

  // Persist gamification and language changes
  useEffect(() => {
    localStorage.setItem('arabiya_lang', language);
    localStorage.setItem('arabiya_xp', xp.toString());
    localStorage.setItem('arabiya_streak', streak.toString());
    localStorage.setItem('arabiya_gems', gems.toString());
    localStorage.setItem('arabiya_completed_units', JSON.stringify(completedUnits));
  }, [language, xp, streak, gems, completedUnits]);

  const handleSelectUnitNumber = (unitNum: number) => {
    if (unitNum === 1) {
      setActiveView('unit1Lab');
      setSelectedUnit(null);
      playSoundEffect('tap');
      return;
    }
    // Find unit matching unitNum in current level or A2/A1
    const matchingUnit =
      CURRICULUM_UNITS.find((u) => u.level === currentLevel && u.unitNumber === unitNum) ||
      CURRICULUM_UNITS.find((u) => u.level === 'A2' && u.unitNumber === unitNum) ||
      CURRICULUM_UNITS.find((u) => u.level === 'A1' && u.unitNumber === unitNum) ||
      CURRICULUM_UNITS.find((u) => u.unitNumber === unitNum);

    if (matchingUnit) {
      handleSelectUnit(matchingUnit);
      playSoundEffect('tap');
    } else {
      setActiveView('roadmap');
      playSoundEffect('tap');
    }
  };

  const handleSelectUnit = (unit: LessonUnit) => {
    setSelectedUnit(unit);
    setActiveView('lesson');
  };

  const handleCompleteUnit = (unitId: string, earnedXp: number) => {
    if (!completedUnits.includes(unitId)) {
      setCompletedUnits((prev) => [...prev, unitId]);
    }
    setXp((x) => x + earnedXp);
    setGems((g) => g + 10);
    setActiveView('roadmap');
    setSelectedUnit(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-900 font-sans flex flex-col selection:bg-amber-400 selection:text-amber-950">
      {/* Navigation Bar */}
      <Navbar
        currentLevel={currentLevel}
        onSelectLevel={(lvl) => {
          setCurrentLevel(lvl);
          setActiveView('roadmap');
          setSelectedUnit(null);
        }}
        language={language}
        onSelectLanguage={setLanguage}
        streak={streak}
        xp={xp}
        gems={gems}
        onOpenPlacementTest={() => setIsPlacementModalOpen(true)}
        onOpenGrammarAnalyzer={() => setIsGrammarModalOpen(true)}
        onOpenCertificate={() => setIsCertificateModalOpen(true)}
        onOpenPhonetics={() => setIsPhoneticsModalOpen(true)}
        onOpenVideoLibrary={() => handleOpenVideoLibrary('all')}
        onOpenReadingLab={() => handleOpenReadingLab()}
        onOpenSpeedReading={handleOpenSpeedReading}
        onOpenThematicVocab={handleOpenThematicVocab}
        onOpenTextStudio={handleOpenTextStudio}
        onOpenCompetencies={handleOpenCompetencies}
        onOpenChants={handleOpenChants}
        onOpenSpeakingLab={() => {
          setActiveView('speakingLab');
          playSoundEffect('tap');
        }}
        onOpenUnit1Lab={() => {
          setActiveView('unit1Lab');
          setSelectedUnit(null);
          playSoundEffect('tap');
        }}
        onSelectUnitNumber={handleSelectUnitNumber}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Organized Navigation Hub - Structured, Clean, Zero Overlapping */}
        <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-amber-200/90 shadow-sm shadow-amber-500/5 space-y-3">
          {/* Tier 1: Core Curriculum Paths & Chants (المسارات التعليمية والأناشيد) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 font-sans">
                {language === 'ar' ? 'المسار التعليمي والبرامج الرسمية :' : language === 'fr' ? 'Parcours & Programmes Officiels :' : 'Curriculum Paths :'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Roadmap */}
              <button
                id="btn-nav-roadmap"
                onClick={() => {
                  setActiveView('roadmap');
                  setSelectedUnit(null);
                  playSoundEffect('tap');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'roadmap'
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-sm shadow-emerald-800/30'
                    : 'text-slate-700 hover:bg-amber-100/70 hover:text-emerald-900 bg-amber-50/60 border border-amber-200/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{language === 'ar' ? 'خريطة المستويات' : language === 'fr' ? 'Parcours A1-C2' : 'Curriculum Roadmap'}</span>
              </button>

              {/* CEFR Competencies */}
              <button
                id="btn-strip-competencies"
                onClick={() => handleOpenCompetencies(currentLevel === 'A2' ? 'A2' : 'A1')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-900 text-amber-200 border border-emerald-600 shadow-xs hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <Target className="w-4 h-4 text-amber-300" />
                <span className="font-arabic">{language === 'ar' ? 'كفايات المنهاج (A1/A2)' : language === 'fr' ? 'Compétences CECRL' : 'CEFR Competencies'}</span>
                <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-black">7 مجالات</span>
              </button>

              {/* Arabic Chants (EILE) */}
              <button
                id="btn-strip-chants"
                onClick={() => handleOpenChants()}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 text-white shadow-sm hover:brightness-110 active:scale-95 cursor-pointer border border-amber-300 ring-2 ring-amber-400/30"
              >
                <Music className="w-4 h-4 text-amber-200" />
                <span className="font-arabic">{language === 'ar' ? 'الأناشيد المدرسية 🎵' : language === 'fr' ? 'Chants & Poésies 🎵' : 'Arabic Songs 🎵'}</span>
                <span className="bg-amber-300 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-black">مترجمة 🇫🇷</span>
              </button>

              {/* Reading Studio */}
              <button
                id="btn-strip-text-studio"
                onClick={() => handleOpenTextStudio()}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'textStudio'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400'
                    : 'text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-arabic">{language === 'ar' ? 'استوديو القراءة والنصوص' : language === 'fr' ? 'Lecture (قراءة)' : 'Reading Studio'}</span>
              </button>

              {/* Thematic Vocab */}
              <button
                id="btn-strip-thematic-vocab"
                onClick={() => handleOpenThematicVocab()}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'vocabHub'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400'
                    : 'text-amber-950 bg-amber-100/80 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                <span className="text-base">🖼️</span>
                <span className="font-arabic">{language === 'ar' ? 'المفردات المصورة' : language === 'fr' ? 'Vocabulaire Thématique' : 'Visual Vocabulary'}</span>
                <span className="bg-slate-950 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-full font-black">12 مجالاً</span>
              </button>
            </div>
          </div>

          {/* Tier 2: Interactive Labs & Media Tools (الورشات التفاعلية والأدوات) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 font-sans">
                {language === 'ar' ? 'الورشات التطبيقية والأدوات :' : language === 'fr' ? 'Ateliers Pratiques & Outils :' : 'Practice Labs & Tools :'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Speaking Lab */}
              <button
                onClick={() => {
                  setActiveView('speakingLab');
                  setSelectedUnit(null);
                  playSoundEffect('tap');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'speakingLab'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-sm shadow-rose-600/30'
                    : 'text-slate-700 hover:bg-rose-50 hover:text-rose-900 border border-rose-200 bg-white'
                }`}
              >
                <span className="text-sm">🗣️</span>
                <span>{language === 'ar' ? 'التعبير الشفهي' : language === 'fr' ? 'Oral & Écoute' : 'Speaking'}</span>
              </button>

              {/* Unit 1 Lab */}
              <button
                onClick={() => {
                  setActiveView('unit1Lab');
                  setSelectedUnit(null);
                  playSoundEffect('tap');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'unit1Lab'
                    ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-sm shadow-amber-500/30'
                    : 'text-amber-950 bg-white hover:bg-amber-50 border border-amber-200'
                }`}
              >
                <span className="text-sm">👨‍👩‍👧‍👦</span>
                <span className="font-arabic font-extrabold">{language === 'ar' ? 'الوحدة 1 (الأسرة)' : language === 'fr' ? 'Unité 1 (Famille)' : 'Unit 1 (Family)'}</span>
              </button>

              {/* Speed Reading Challenge */}
              <button
                id="btn-main-speed-reading"
                onClick={handleOpenSpeedReading}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-2xs hover:brightness-105 active:scale-95 border border-amber-400 cursor-pointer"
              >
                <span className="text-sm">⚡</span>
                <span>{language === 'ar' ? 'تحدي السرعة ⏱️' : language === 'fr' ? 'Jeu Vitesse ⏱️' : 'Speed Game'}</span>
              </button>

              {/* Video Library */}
              <button
                onClick={() => handleOpenVideoLibrary('all')}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold border border-red-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-red-600" />
                <span>{language === 'ar' ? 'الفيديوهات (45)' : language === 'fr' ? 'Médiathèque (45)' : 'Videos (45)'}</span>
              </button>

              {/* Tashkeel Analyzer */}
              <button
                onClick={() => {
                  setIsGrammarModalOpen(true);
                  playSoundEffect('tap');
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold border border-teal-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'ar' ? 'محلل التشكيل' : language === 'fr' ? 'Tashkeel' : 'Tashkeel'}</span>
              </button>

              {/* Sound / Phonetics Lab */}
              <button
                onClick={() => {
                  setActiveView('soundLab');
                  playSoundEffect('tap');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'soundLab'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm shadow-teal-600/30'
                    : 'text-slate-700 hover:bg-teal-50 hover:text-teal-900 bg-white border border-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'ar' ? 'مختبر الأصوات' : language === 'fr' ? 'Phonétique' : 'Phonetics'}</span>
              </button>

              {/* AI Tutor */}
              <button
                onClick={() => {
                  setActiveView('tutor');
                  playSoundEffect('tap');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'tutor'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/30'
                    : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900 bg-white border border-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'ar' ? 'المعلم الذكي' : language === 'fr' ? 'Tuteur IA' : 'AI Tutor'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Main View */}
        {activeView === 'roadmap' && (
          <div className="space-y-6">
            <LevelRoadmap
              currentLevel={currentLevel}
              onSelectUnit={handleSelectUnit}
              completedUnits={completedUnits}
              language={language}
              onOpenTutor={() => setActiveView('tutor')}
              onOpenSoundGame={() => setActiveView('soundLab')}
              onOpenUnit1Lab={() => {
                setActiveView('unit1Lab');
                playSoundEffect('tap');
              }}
              onOpenThematicVocab={handleOpenThematicVocab}
              onOpenTextStudio={handleOpenTextStudio}
              onOpenCompetencies={handleOpenCompetencies}
              onOpenChants={handleOpenChants}
            />

            {/* Cultural wisdom and dialect comparisons widget */}
            <CulturalProverbs language={language} />
          </div>
        )}

        {activeView === 'textStudio' && (
          <CustomTextReaderStudio
            key={`${textStudioInitialHierarchyTab || 'default'}-${textStudioInitialText ? 'text' : 'notext'}`}
            language={language}
            initialText={textStudioInitialText}
            initialHierarchyTab={textStudioInitialHierarchyTab}
            onBack={() => {
              setActiveView('roadmap');
              playSoundEffect('tap');
            }}
            onEarnXp={(amt) => {
              setXp((x) => x + amt);
              setGems((g) => g + Math.ceil(amt / 10));
            }}
          />
        )}

        {activeView === 'vocabHub' && (
          <VisualVocabularyHub
            language={language}
            initialCategoryId={selectedVocabCategory}
            onBack={() => {
              setActiveView('roadmap');
              playSoundEffect('tap');
            }}
            onEarnXp={(amt) => {
              setXp((x) => x + amt);
              setGems((g) => g + Math.ceil(amt / 10));
            }}
          />
        )}

        {activeView === 'unit1Lab' && (
          <UnitCurriculumLab
            language={language}
            onBack={() => {
              setActiveView('roadmap');
              playSoundEffect('tap');
            }}
            onEarnXp={(amt) => {
              setXp((x) => x + amt);
              setGems((g) => g + Math.ceil(amt / 10));
            }}
          />
        )}

        {activeView === 'lesson' && selectedUnit && (
          <LessonView
            unit={selectedUnit}
            onBack={() => {
              setActiveView('roadmap');
              setSelectedUnit(null);
            }}
            onCompleteUnit={handleCompleteUnit}
            language={language}
            onOpenVideoLibrary={handleOpenVideoLibrary}
          />
        )}

        {activeView === 'tutor' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  {language === 'ar' ? 'المحادثة الشفهية والذكية مع الأستاذ فصيح' : language === 'fr' ? 'Pratique Orale avec le Tuteur IA Faseeh' : 'Oral & Conversational Practice with Tutor Faseeh'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'fr'
                    ? 'Parlez ou écrivez en arabe pour recevoir des corrections personnalisées et le Tashkeel'
                    : 'Speak or type in Arabic to get instant vocalized pedagogical feedback'}
                </p>
              </div>
            </div>
            <AITutorChat currentLevel={currentLevel} language={language} />
          </div>
        )}

        {activeView === 'speakingLab' && (
          <ContinuousSpeakingLab
            currentLevel={currentLevel}
            language={language}
            onEarnXp={(amt) => setXp((x) => x + amt)}
          />
        )}

        {activeView === 'soundLab' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  {language === 'ar' ? 'مختبر تمييز الأصوات ومخارج الحروف الصعبة' : language === 'fr' ? 'Laboratoire de Discrimination Auditive & Phonétique' : 'Auditory Discrimination & Tricky Arabic Sounds'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'fr'
                    ? 'Développez votre oreille pour différencier les sons proches de la langue arabe'
                    : 'Train your brain to recognize minimal pairs and subtle pharyngeal/emphatic distinctions'}
                </p>
              </div>
            </div>
            <AudioDiscriminationGame language={language} onComplete={() => setXp((x) => x + 30)} />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <GrammarAnalyzerModal
        isOpen={isGrammarModalOpen}
        onClose={() => setIsGrammarModalOpen(false)}
        language={language}
      />

      <PlacementTestModal
        isOpen={isPlacementModalOpen}
        onClose={() => setIsPlacementModalOpen(false)}
        onSelectLevel={(lvl) => {
          setCurrentLevel(lvl);
          setActiveView('roadmap');
        }}
        language={language}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        level={currentLevel}
        xp={xp}
        language={language}
      />

      <PhoneticsGuideModal
        isOpen={isPhoneticsModalOpen}
        onClose={() => setIsPhoneticsModalOpen(false)}
        language={language}
      />

      <VideoLibraryModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        language={language}
        initialCategory={videoModalCategory}
        initialVideoId={videoModalInitialId}
      />

      <ReadingLabModal
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
        language={language}
        initialCategoryId={readingModalCategoryId}
      />

      <SpeedReadingGameModal
        isOpen={isSpeedReadingModalOpen}
        onClose={() => setIsSpeedReadingModalOpen(false)}
        language={language}
        onAwardXp={(gain) => {
          setXp((prev) => prev + gain);
          setGems((g) => g + 5);
        }}
      />

      <CEFRCompetenciesModal
        isOpen={isCompetenciesModalOpen}
        onClose={() => setIsCompetenciesModalOpen(false)}
        initialLevel={competenciesModalInitialLevel}
        language={language}
        onOpenTutor={() => setActiveView('tutor')}
        onOpenTextStudio={() => setActiveView('textStudio')}
        onOpenSoundGame={() => setActiveView('soundLab')}
      />

      <ArabicChantsModal
        isOpen={isChantsModalOpen}
        onClose={() => setIsChantsModalOpen(false)}
        initialChantId={chantsModalInitialId}
        language={language}
        onOpenTextStudio={(verseText) => handleOpenTextStudio(verseText, 'sentences')}
      />

      {/* Footer ArabFacile.com */}
      <Footer
        language={language}
        onOpenPhonetics={() => setIsPhoneticsModalOpen(true)}
        onOpenVideoLibrary={() => handleOpenVideoLibrary('all')}
        onOpenPlacement={() => setIsPlacementModalOpen(true)}
        onOpenReadingLab={() => handleOpenReadingLab()}
        onOpenSpeedReading={handleOpenSpeedReading}
        onOpenCompetencies={() => handleOpenCompetencies(currentLevel === 'A2' ? 'A2' : 'A1')}
        onOpenChants={handleOpenChants}
        onOpenSpeakingLab={() => {
          setActiveView('speakingLab');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          playSoundEffect('tap');
        }}
      />
    </div>
  );
}
