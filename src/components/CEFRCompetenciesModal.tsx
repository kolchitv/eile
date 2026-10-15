import React, { useState, useEffect } from 'react';
import { CEFRLevel, SupportedLanguage, CompetencyDomainId } from '../types';
import { CEFR_COMPETENCIES_DATA } from '../data/competenciesData';
import { speakArabic, playSoundEffect } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Search,
  Volume2,
  Filter,
  Printer,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  GraduationCap,
  FileText,
  Share2,
  CheckCheck,
  Zap,
  Maximize2,
  Minimize2,
  Info,
} from 'lucide-react';

interface CEFRCompetenciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: 'A1' | 'A2';
  language: SupportedLanguage;
  onOpenTutor?: () => void;
  onOpenTextStudio?: () => void;
  onOpenSoundGame?: () => void;
}

export const CEFRCompetenciesModal: React.FC<CEFRCompetenciesModalProps> = ({
  isOpen,
  onClose,
  initialLevel = 'A1',
  language,
  onOpenTutor,
  onOpenTextStudio,
  onOpenSoundGame,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2'>(initialLevel);
  const [selectedDomain, setSelectedDomain] = useState<CompetencyDomainId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'mastered' | 'pending'>('all');
  const [acquiredMap, setAcquiredMap] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(false);

  // Load acquired competencies from localStorage
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

  // Update level when initialLevel changes
  useEffect(() => {
    if (initialLevel === 'A1' || initialLevel === 'A2') {
      setSelectedLevel(initialLevel);
    }
  }, [initialLevel]);

  // Save to localStorage
  const toggleCompetency = (id: string) => {
    const updated = { ...acquiredMap, [id]: !acquiredMap[id] };
    setAcquiredMap(updated);
    try {
      localStorage.setItem('cefr_acquired_competencies_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (updated[id]) {
      playSoundEffect('correct');
      const levelData = CEFR_COMPETENCIES_DATA[selectedLevel];
      const allDescriptors = levelData.domains.flatMap((d) => d.categories.flatMap((c) => c.descriptors));
      const acquiredCount = allDescriptors.filter((d) => updated[d.id]).length;
      if (acquiredCount % 5 === 0 || acquiredCount === allDescriptors.length) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      playSoundEffect('tap');
    }
  };

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: prev[catId] === undefined ? false : !prev[catId],
    }));
  };

  const handleToggleExpandAll = () => {
    const levelData = CEFR_COMPETENCIES_DATA[selectedLevel];
    const allCatIds = levelData.domains.flatMap((d) => d.categories.map((c) => c.id));
    const allExpanded = allCatIds.every((id) => expandedCategories[id] !== false);

    const nextState: Record<string, boolean> = {};
    allCatIds.forEach((id) => {
      nextState[id] = !allExpanded;
    });
    setExpandedCategories(nextState);
    playSoundEffect('tap');
  };

  const handleSpeakExample = (text: string, id: string) => {
    setActiveSpeechId(id);
    speakArabic(text);
    setTimeout(() => setActiveSpeechId(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const currentLevelData = CEFR_COMPETENCIES_DATA[selectedLevel];
  const allDescriptorsInLevel = currentLevelData.domains.flatMap((d) =>
    d.categories.flatMap((c) => c.descriptors)
  );
  const masteredCount = allDescriptorsInLevel.filter((d) => acquiredMap[d.id]).length;
  const totalCount = allDescriptorsInLevel.length;
  const progressPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  // Filter domains
  const filteredDomains = currentLevelData.domains
    .map((domain) => {
      if (selectedDomain !== 'all' && domain.id !== selectedDomain) {
        return null;
      }

      const filteredCategories = domain.categories
        .map((cat) => {
          const filteredDescriptors = cat.descriptors.filter((desc) => {
            // Search query filter
            const matchesSearch =
              !searchQuery.trim() ||
              desc.textAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (desc.textFr && desc.textFr.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (desc.textEn && desc.textEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (desc.exampleAr && desc.exampleAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
              cat.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
              cat.titleFr.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const isAcquired = !!acquiredMap[desc.id];
            const matchesStatus =
              filterStatus === 'all' ||
              (filterStatus === 'mastered' && isAcquired) ||
              (filterStatus === 'pending' && !isAcquired);

            return matchesSearch && matchesStatus;
          });

          if (filteredDescriptors.length === 0) return null;
          return { ...cat, descriptors: filteredDescriptors };
        })
        .filter(Boolean);

      if (filteredCategories.length === 0) return null;
      return { ...domain, categories: filteredCategories as any };
    })
    .filter(Boolean);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in ${
        isMaximized ? 'p-0!' : ''
      }`}
    >
      <div
        className={`bg-white flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden transition-all duration-200 ${
          isMaximized
            ? 'w-full h-full rounded-none border-none'
            : 'w-full max-w-6xl h-[96vh] sm:h-[95vh] rounded-3xl'
        }`}
      >
        {/* ========================================================================= */}
        {/* 1. ULTRA-COMPACT SLIM HEADER: Single sleek row, minimal vertical height   */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-amber-950 px-3 py-2.5 sm:px-4 sm:py-2.5 text-white shrink-0 border-b border-amber-500/30">
          <div className="flex items-center justify-between gap-2.5">
            
            {/* Title & Stats Badges (Right side in RTL) */}
            <div className="flex items-center gap-2 overflow-hidden" dir="rtl">
              <span className="text-xl shrink-0">📚</span>
              <div className="flex items-baseline gap-2">
                <h2 className="text-sm sm:text-base md:text-lg font-black text-amber-200 font-arabic whitespace-nowrap">
                  مصنفات الكفايات الرسمية ({selectedLevel})
                </h2>
                <span className="text-xs text-slate-300 font-sans hidden lg:inline">
                  (CECRL Standard Framework)
                </span>
              </div>

              {/* Progress pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 border border-white/15 text-xs">
                <span className="font-mono font-bold text-amber-300">
                  {masteredCount}/{totalCount}
                </span>
                <span className="text-slate-300">مكتسبة</span>
                <span className="text-emerald-400 font-bold font-mono">({progressPercent}%)</span>
                <div className="w-12 bg-white/20 h-1.5 rounded-full overflow-hidden ml-1 hidden md:block">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Controls: Level Toggle, Info, Maximize, Print, Close (Left side in RTL) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Level Pill Switcher */}
              <div className="bg-white/15 p-0.5 rounded-xl border border-white/20 flex items-center gap-0.5">
                <button
                  onClick={() => {
                    setSelectedLevel('A1');
                    playSoundEffect('tap');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-black text-xs transition-all cursor-pointer ${
                    selectedLevel === 'A1'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  A1
                </button>
                <button
                  onClick={() => {
                    setSelectedLevel('A2');
                    playSoundEffect('tap');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-black text-xs transition-all cursor-pointer ${
                    selectedLevel === 'A2'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  A2
                </button>
              </div>

              {/* Info description toggle */}
              <button
                onClick={() => setShowInfoBanner(!showInfoBanner)}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  showInfoBanner
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title="عرض وصف المستوى والأهداف"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {/* Maximize / Restore to give 100% full screen to text */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer"
                title={isMaximized ? 'استعادة الحجم الطبيعي' : 'تكبير النافذة لملء الشاشة'}
              >
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5 text-amber-300" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-300" />}
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                title="طباعة مصفوفة الكفايات أو حفظها كـ PDF"
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer hidden md:flex items-center justify-center"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl transition-all cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Collapsible Info description row */}
          {showInfoBanner && (
            <div className="mt-2 pt-2 border-t border-white/15 text-xs text-slate-200 font-sans flex items-center justify-between gap-2" dir="rtl">
              <p>
                {language === 'fr'
                  ? currentLevelData.descriptionFr
                  : language === 'ar'
                  ? currentLevelData.descriptionAr
                  : currentLevelData.descriptionEn}
              </p>
              <button
                onClick={() => setShowInfoBanner(false)}
                className="text-[11px] text-amber-300 hover:text-white shrink-0 font-bold"
              >
                إغلاق الوصف ✕
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. ULTRA-COMPACT TOOLBAR: Search, Status & Domain filters in unified strip */}
        {/* ========================================================================= */}
        <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 space-y-1.5 shrink-0">
          
          {/* Row 1: Search + Status Filters + Expand All */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث سريع في الكفايات أو الأمثلة..."
                dir="rtl"
                className="w-full pr-8 pl-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-arabic focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter buttons */}
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 text-xs shrink-0">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                الكل ({totalCount})
              </button>
              <button
                onClick={() => setFilterStatus('mastered')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'mastered'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                مكتسبة ✔️ ({masteredCount})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                قيد التطوير ({totalCount - masteredCount})
              </button>
            </div>

            {/* Expand / Collapse All Toggle */}
            <button
              onClick={handleToggleExpandAll}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs shrink-0 cursor-pointer flex items-center gap-1"
              title="توسيع أو طي كافة الأقسام معاً"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>طي/توسيع الكل</span>
            </button>
          </div>

          {/* Row 2: Skill Domain Filter Pills (Single scroll row) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => {
                setSelectedDomain('all');
                playSoundEffect('tap');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 border cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              <span>🌐</span>
              <span>جميع المجالات</span>
            </button>

            {currentLevelData.domains.map((domain) => {
              const isSelected = selectedDomain === domain.id;
              const domainDescs = domain.categories.flatMap((c) => c.descriptors);
              const domainMastered = domainDescs.filter((d) => acquiredMap[d.id]).length;

              return (
                <button
                  key={domain.id}
                  onClick={() => {
                    setSelectedDomain(domain.id);
                    playSoundEffect('tap');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span>{domain.icon}</span>
                  <span className="font-arabic">{domain.titleAr}</span>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {domainMastered}/{domainDescs.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MAIN CONTENT AREA: Spacious, clean, visible multi-competencies layout  */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 bg-slate-50/70" dir="rtl">
          {filteredDomains.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-slate-200 space-y-2">
              <div className="text-3xl">🔍</div>
              <h3 className="font-arabic text-base font-bold text-slate-800">
                لم يتم العثور على كفايات مطابقة لبحثك
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                جرب البحث بكلمات أخرى أو اختر مجالا مختلفا أو قم بإلغاء التصفية.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('all');
                  setFilterStatus('all');
                }}
                className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                إعادة ضبط البحث
              </button>
            </div>
          ) : (
            filteredDomains.map((domain: any) => {
              const domainDescs = domain.categories.flatMap((c: any) => c.descriptors);
              const domainMastered = domainDescs.filter((d: any) => acquiredMap[d.id]).length;

              return (
                <div
                  key={domain.id}
                  className="bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-slate-200 shadow-2xs space-y-3"
                >
                  {/* Domain Header - Compact Row */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-amber-100 text-slate-900 flex items-center justify-center text-lg shadow-2xs">
                        {domain.icon}
                      </span>
                      <div>
                        <h3 className="font-arabic text-sm sm:text-base font-black text-slate-900">
                          {domain.titleAr}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                          {language === 'fr' ? domain.titleFr : domain.titleEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        {domainMastered} من {domainDescs.length} مكتسبة
                      </span>
                      <div className="w-16 sm:w-20 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{
                            width: `${domainDescs.length > 0 ? (domainMastered / domainDescs.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Categories inside this Domain */}
                  <div className="space-y-2.5">
                    {domain.categories.map((category: any) => {
                      const isCollapsed = expandedCategories[category.id] === false;
                      const catDescs = category.descriptors;
                      const catMastered = catDescs.filter((d: any) => acquiredMap[d.id]).length;

                      return (
                        <div
                          key={category.id}
                          className="bg-slate-50/90 rounded-xl p-2.5 sm:p-3 border border-slate-200/90 space-y-2"
                        >
                          {/* Category Header */}
                          <div
                            onClick={() => toggleCategoryExpand(category.id)}
                            className="flex items-center justify-between cursor-pointer group select-none"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{category.icon}</span>
                              <h4 className="font-arabic text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                                {category.titleAr}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-sans hidden md:inline">
                                ({language === 'fr' ? category.titleFr : category.titleEn})
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                {catMastered} / {catDescs.length}
                              </span>
                              {isCollapsed ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>

                          {/* Category Descriptors List */}
                          {!isCollapsed && (
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {category.descriptors.map((desc: any, dIdx: number) => {
                                const isAcquired = !!acquiredMap[desc.id];

                                return (
                                  <div
                                    key={desc.id}
                                    className={`p-3 rounded-xl border transition-all ${
                                      isAcquired
                                        ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                                        : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      {/* Can-do descriptor text */}
                                      <div className="space-y-1 flex-1">
                                        <div className="flex items-start gap-2">
                                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-black flex items-center justify-center shrink-0 mt-0.5">
                                            {dIdx + 1}
                                          </span>
                                          <div className="space-y-0.5">
                                            <p className="font-arabic text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                                              {desc.textAr}
                                            </p>
                                            <p className="text-[11px] text-slate-500 font-sans leading-tight" dir="ltr">
                                              {language === 'fr'
                                                ? desc.textFr || desc.textEn
                                                : desc.textEn || desc.textFr}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Inline Example Sentence with Audio */}
                                        {desc.exampleAr && (
                                          <div className="bg-amber-50/90 py-1.5 px-2.5 rounded-lg border border-amber-200/80 flex items-center justify-between gap-2 mr-7 mt-1.5">
                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                              <span className="text-[11px] shrink-0">💡</span>
                                              <span className="font-arabic font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                                                {desc.exampleAr}
                                              </span>
                                            </div>

                                            <button
                                              onClick={() => handleSpeakExample(desc.exampleAr, desc.id)}
                                              className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 flex items-center gap-1 text-[11px] font-bold ${
                                                activeSpeechId === desc.id
                                                  ? 'bg-emerald-600 text-white border-emerald-600 scale-105'
                                                  : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-100'
                                              }`}
                                              title="الاستماع لنطق المثال التطبيقي"
                                            >
                                              <Volume2 className="w-3 h-3" />
                                              <span className="hidden sm:inline">نطق</span>
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {/* Mastery Checkbox Button */}
                                      <button
                                        onClick={() => toggleCompetency(desc.id)}
                                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95 ${
                                          isAcquired
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200'
                                        }`}
                                        title={isAcquired ? 'كفاية مكتسبة' : 'انقر لتحديد الكفاية كمكتسبة'}
                                      >
                                        {isAcquired ? (
                                          <>
                                            <CheckCircle2 className="w-3.5 h-3.5 fill-white text-emerald-600" />
                                            <span>مكتسبة ✔️</span>
                                          </>
                                        ) : (
                                          <>
                                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="hidden sm:inline">تحديد كمكتسبة</span>
                                            <span className="sm:hidden">إكمال</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. MODAL FOOTER BAR: Compact & Clean                                      */}
        {/* ========================================================================= */}
        <div className="px-3 py-2 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-arabic">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">
              يتم حفظ تقييمك الذاتي للكفايات تلقائياً لتوثيق مسارك التعليمي وفق معايير CECRL.
            </span>
            <span className="sm:hidden">توثيق الكفايات وفق معايير CECRL</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenTutor && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTutor();
                }}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>🤖</span>
                <span>المعلم فصيح</span>
              </button>
            )}

            {onOpenTextStudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTextStudio();
                }}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>🎙️</span>
                <span>استوديو القراءة</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
