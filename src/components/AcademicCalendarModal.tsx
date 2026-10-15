import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { ACADEMIC_CALENDAR_2025_2026, AcademicCalendarMilestone } from '../data/academicCalendarData';
import { playSoundEffect } from '../utils/audio';
import {
  Calendar,
  X,
  BookOpen,
  Award,
  Coffee,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface AcademicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onSelectUnit?: (unitId: string) => void;
}

export const AcademicCalendarModal: React.FC<AcademicCalendarModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectUnit,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredMilestones = ACADEMIC_CALENDAR_2025_2026.filter((item) => {
    const matchSem = item.semester === selectedSemester;
    const matchFilter = filterType === 'all' || item.type === filterType;
    return matchSem && matchFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                2025/2026
              </span>
              <span className="bg-emerald-500/20 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                إعداد: المفتش التربوي محمد اعزة
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-arabic text-amber-200">
              {language === 'ar'
                ? 'تنظيم السنة الدراسية 2025/2026 - الأجندة التربوية الرسمية'
                : 'Organisation de l’Année Scolaire 2025/2026 (Calendrier Officiel)'}
            </h2>
            <p className="text-xs text-emerald-200 font-sans max-w-2xl">
              {language === 'fr'
                ? 'Planning annuel officiel réparti en 34 semaines d’apprentissage actif, 6 unités pédagogiques, 6 semaines d’évaluation-remédiation et périodes de vacances intermédiaires.'
                : 'التوزيع الزمني السنوي المعتمد: 34 أسبوعاً للدراسة الفعلية، 6 وحدات ديداكتيكية، وأسابيع الدعم والتقويم والتوليف والامتحانات الموحدة.'}
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              playSoundEffect('tap');
            }}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Semester Tabs & Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Semester Selector */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-2xl">
            <button
              onClick={() => {
                setSelectedSemester(1);
                playSoundEffect('tap');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSemester === 1
                  ? 'bg-emerald-700 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>{language === 'ar' ? 'الأسدوس الأول (الوحدات 1-2-3)' : 'Semestre 1 (Unités 1-3)'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedSemester(2);
                playSoundEffect('tap');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSemester === 2
                  ? 'bg-cyan-700 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>{language === 'ar' ? 'الأسدوس الثاني (الوحدات 4-5-6)' : 'Semestre 2 (Unités 4-6)'}</span>
            </button>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {[
              { id: 'all', labelAr: 'الكل', labelFr: 'Tous' },
              { id: 'unit', labelAr: 'الوحدات الدراسية (1-6)', labelFr: 'Unités' },
              { id: 'evaluation_support', labelAr: 'التقويم والدعم', labelFr: 'Évaluation' },
              { id: 'vacation', labelAr: 'العطل البينية', labelFr: 'Vacances' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFilterType(f.id);
                  playSoundEffect('tap');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {language === 'ar' ? f.labelAr : f.labelFr}
              </button>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {filteredMilestones.map((item, index) => {
            const isUnit = item.type === 'unit';
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isUnit
                    ? 'bg-emerald-50/40 border-emerald-300 hover:border-amber-400 hover:shadow-sm'
                    : item.type === 'vacation'
                    ? 'bg-amber-50/50 border-amber-300'
                    : item.type === 'evaluation_support'
                    ? 'bg-teal-50/40 border-teal-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Left/Right Info: Weeks & Dates */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {item.weekRange}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {item.startDate} ➔ {item.endDate}
                      </span>
                    </span>
                    {item.unitNumber && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                        الوحدة {item.unitNumber}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-arabic">
                    {item.titleAr}
                  </h3>
                  <div className="text-xs font-semibold text-slate-600 font-sans">
                    {item.titleFr}
                  </div>
                  <p className="text-xs text-slate-700 font-sans pt-1 border-t border-slate-200/60 leading-relaxed">
                    📝 {language === 'ar' ? item.notesAr : item.notesFr}
                  </p>
                </div>

                {/* Direct Action: Jump to Unit Lab if available */}
                {isUnit && item.unitId && onSelectUnit && (
                  <button
                    onClick={() => {
                      onSelectUnit(item.unitId!);
                      onClose();
                      playSoundEffect('tap');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>فتح الوحدة في المختبر</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>متوافق كلياً مع التوجيهات الرسمية لوزارة التربية الوطنية 2025/2026</span>
          </div>

          <button
            onClick={() => {
              window.print();
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold cursor-pointer"
          >
            🖨️ طباعة الجدول الزمني
          </button>
        </div>
      </div>
    </div>
  );
};
