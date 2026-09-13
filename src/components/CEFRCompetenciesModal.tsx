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
      // small confetti burst if reached a milestone
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden my-auto">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-amber-950 p-5 sm:p-6 text-white relative shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="space-y-1.5" dir="rtl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
                  مصنفات الكفايات الرسمية
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-xs">
                  CECRL Standard Framework
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-200 font-mono text-xs font-black">
                  {masteredCount} / {totalCount} كفاية مكتسبة ({progressPercent}%)
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-amber-200 font-arabic flex items-center gap-2">
                <span>📚 {currentLevelData.titleAr}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 font-sans max-w-2xl">
                {language === 'fr'
                  ? currentLevelData.descriptionFr
                  : language === 'ar'
                  ? currentLevelData.descriptionAr
                  : currentLevelData.descriptionEn}
              </p>
            </div>

            {/* Level Switcher & Close */}
            <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
              <div className="bg-white/10 p-1 rounded-2xl border border-white/20 flex items-center gap-1 backdrop-blur-xs">
                <button
                  onClick={() => {
                    setSelectedLevel('A1');
                    playSoundEffect('tap');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                    selectedLevel === 'A1'
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  المستوى A1
                </button>
                <button
                  onClick={() => {
                    setSelectedLevel('A2');
                    playSoundEffect('tap');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                    selectedLevel === 'A2'
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  المستوى A2
                </button>
              </div>

              <button
                onClick={handlePrint}
                title="طباعة مصفوفة الكفايات أو حفظها كـ PDF"
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all cursor-pointer hidden sm:flex items-center justify-center"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 bg-white/10 hover:bg-rose-500 hover:text-white text-white rounded-2xl border border-white/20 transition-all cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Real-time Level Competency Mastery Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {language === 'ar'
                  ? `نسبة استيفاء كفايات المستوى (${selectedLevel}): ${progressPercent}%`
                  : `Taux de maîtrise des compétences (${selectedLevel}) : ${progressPercent}%`}
              </span>
            </div>
            <div className="w-full sm:w-64 bg-black/30 h-3 rounded-full overflow-hidden border border-white/20 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 space-y-3 shrink-0">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'ابحث في نصوص الكفايات، الأمثلة، أو الكلمات المفتاحية...'
                    : 'Rechercher dans les compétences, exemples ou mots-clés...'
                }
                dir="rtl"
                className="w-full pr-10 pl-4 py-2.5 rounded-2xl border-2 border-slate-200 bg-white text-xs sm:text-sm font-arabic focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                {language === 'ar' ? 'الحالة:' : 'Statut :'}
              </span>
              <div className="bg-white p-1 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-2xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {language === 'ar' ? 'الكل' : 'Tous'} ({totalCount})
                </button>
                <button
                  onClick={() => setFilterStatus('mastered')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === 'mastered'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {language === 'ar' ? 'مكتسبة ✔️' : 'Maîtrisées ✔️'} ({masteredCount})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {language === 'ar' ? 'قيد التطوير' : 'En cours'} ({totalCount - masteredCount})
                </button>
              </div>
            </div>

          </div>

          {/* 7 Skill Domain Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => {
                setSelectedDomain('all');
                playSoundEffect('tap');
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-1.5 border ${
                selectedDomain === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              <span>🌐</span>
              <span>{language === 'ar' ? 'جميع مجالات الكفايات' : 'Tous les Domaines'}</span>
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
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span>{domain.icon}</span>
                  <span className="font-arabic">{domain.titleAr}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {domainMastered}/{domainDescs.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area: Grouped Domains & Categories */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-slate-50/50" dir="rtl">
          {filteredDomains.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="font-arabic text-lg font-bold text-slate-800">
                {language === 'ar' ? 'لم يتم العثور على كفايات مطابقة لبحثك' : 'Aucune compétence trouvée'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {language === 'ar'
                  ? 'جرب البحث بكلمات أخرى أو اختر مجالا مختلفا أو قم بإلغاء التصفية.'
                  : 'Essayez un autre mot-clé ou réinitialisez les filtres.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('all');
                  setFilterStatus('all');
                }}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
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
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200/90 shadow-xs space-y-5"
                >
                  {/* Domain Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-amber-100 text-slate-900 flex items-center justify-center text-xl shadow-2xs">
                        {domain.icon}
                      </span>
                      <div>
                        <h3 className="font-arabic text-lg sm:text-xl font-black text-slate-900">
                          {domain.titleAr}
                        </h3>
                        <p className="text-xs text-slate-500 font-sans">
                          {language === 'fr' ? domain.titleFr : domain.titleEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        {domainMastered} من {domainDescs.length} كفاية مكتسبة
                      </span>
                      <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
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
                  <div className="space-y-5">
                    {domain.categories.map((category: any) => {
                      const isCollapsed = expandedCategories[category.id] === false;
                      const catDescs = category.descriptors;
                      const catMastered = catDescs.filter((d: any) => acquiredMap[d.id]).length;

                      return (
                        <div
                          key={category.id}
                          className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3"
                        >
                          {/* Category Header */}
                          <div
                            onClick={() => toggleCategoryExpand(category.id)}
                            className="flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{category.icon}</span>
                              <h4 className="font-arabic text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                                {category.titleAr}
                              </h4>
                              <span className="text-[11px] text-slate-400 font-sans hidden md:inline">
                                ({language === 'fr' ? category.titleFr : category.titleEn})
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
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
                            <div className="grid grid-cols-1 gap-3 pt-1">
                              {category.descriptors.map((desc: any, dIdx: number) => {
                                const isAcquired = !!acquiredMap[desc.id];

                                return (
                                  <div
                                    key={desc.id}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                                      isAcquired
                                        ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                                        : 'bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-xs'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      {/* Can-do descriptor text */}
                                      <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-black flex items-center justify-center shrink-0">
                                            {dIdx + 1}
                                          </span>
                                          <p className="font-arabic text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                                            {desc.textAr}
                                          </p>
                                        </div>

                                        {/* Translation */}
                                        <p className="text-xs text-slate-500 font-sans mr-8 leading-normal" dir="ltr">
                                          {language === 'fr'
                                            ? desc.textFr || desc.textEn
                                            : desc.textEn || desc.textFr}
                                        </p>
                                      </div>

                                      {/* Mastery Checkbox Button */}
                                      <button
                                        onClick={() => toggleCompetency(desc.id)}
                                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer active:scale-95 ${
                                          isAcquired
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200'
                                        }`}
                                        title={isAcquired ? 'كفاية مكتسبة' : 'انقر لتحديد الكفاية كمكتسبة'}
                                      >
                                        {isAcquired ? (
                                          <>
                                            <CheckCircle2 className="w-4 h-4 fill-white text-emerald-600" />
                                            <span>{language === 'ar' ? 'مكتسبة ✔️' : 'Acquise ✔️'}</span>
                                          </>
                                        ) : (
                                          <>
                                            <Circle className="w-4 h-4 text-slate-400" />
                                            <span>{language === 'ar' ? 'تحديد كمكتسبة' : 'Marquer acquis'}</span>
                                          </>
                                        )}
                                      </button>
                                    </div>

                                    {/* Example Sentence & Pronunciation Action */}
                                    {desc.exampleAr && (
                                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mr-8">
                                        <div className="space-y-0.5">
                                          <span className="text-[10px] font-black text-amber-900 uppercase block">
                                            💡 مثال تطبيقي وممارسة:
                                          </span>
                                          <span className="font-arabic font-extrabold text-sm text-slate-900 block">
                                            {desc.exampleAr}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                          <button
                                            onClick={() => handleSpeakExample(desc.exampleAr, desc.id)}
                                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                                              activeSpeechId === desc.id
                                                ? 'bg-emerald-600 text-white border-emerald-600 scale-105'
                                                : 'bg-white text-slate-800 border-amber-200 hover:bg-amber-100'
                                            }`}
                                            title="الاستماع لنطق المثال التطبيقي"
                                          >
                                            <Volume2 className="w-3.5 h-3.5" />
                                            <span>{language === 'ar' ? 'استمع للمثال' : 'Écouter'}</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}
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

        {/* Modal Footer Quick Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-arabic">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              {language === 'ar'
                ? 'يتم حفظ تقييمك الذاتي للكفايات تلقائياً لتوثيق مسارك التعليمي وفق معايير CECRL.'
                : 'Votre auto-évaluation est enregistrée automatiquement pour suivre vos progrès selon le CECRL.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTutor && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTutor();
                }}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>🤖</span>
                <span>{language === 'ar' ? 'تدرب مع المعلم فصيح' : 'Pratiquer avec l’IA'}</span>
              </button>
            )}

            {onOpenTextStudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTextStudio();
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>🎙️</span>
                <span>{language === 'ar' ? 'استوديو نصوص القراءة' : 'Studio de Lecture'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xs transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'إغلاق الدليل' : 'Fermer'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
