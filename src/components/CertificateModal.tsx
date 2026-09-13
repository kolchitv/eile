import React, { useState } from 'react';
import { CEFRLevel } from '../types';
import { Award, X, Printer, Download, Sparkles, CheckCircle2, SlidersHorizontal, School, User, Calendar, MapPin, Building2, BookOpen } from 'lucide-react';

interface CertificateProps {
  isOpen: boolean;
  onClose: () => void;
  level: CEFRLevel;
  xp: number;
  language: 'en' | 'fr' | 'ar';
}

export const CertificateModal: React.FC<CertificateProps> = ({
  isOpen,
  onClose,
  level: initialLevel,
  xp,
  language,
}) => {
  // Customizable Form State
  const [titleFr, setTitleFr] = useState('ATTESTATION EN EILE ARABE');
  const [titleAr, setTitleAr] = useState('شَهَادَةٌ تَقْدِيرِيَّةٌ فِي اللُّغَةِ العَرَبِيَّةِ');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(initialLevel || 'A1');
  const [studentName, setStudentName] = useState('Said Kolchi');
  const [studentNameAr, setStudentNameAr] = useState('سعيد كلشي');
  const [birthDate, setBirthDate] = useState('15/05/2014');
  const [teacherName, setTeacherName] = useState('Mme Aissaoui Nadia');
  const [teacherNameAr, setTeacherNameAr] = useState('الأستاذة عيساوي نادية');
  const [academie, setAcademie] = useState('ACADÉMIE DE STRASBOURG');
  const [academieAr, setAcademieAr] = useState('أكاديمية ستراسبورغ للتربية والتعليم');
  const [school, setSchool] = useState('École Élémentaire');
  const [city, setCity] = useState('Strasbourg');
  const [cityAr, setCityAr] = useState('ستراسبورغ');
  const [issueDate, setIssueDate] = useState(() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [diplomaMode, setDiplomaMode] = useState<'bilingual' | 'fr' | 'ar'>('bilingual');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const levelLabels: Record<CEFRLevel, { ar: string; fr: string; en: string }> = {
    A1: { ar: 'المستوى الاستكشافي المبتدئ (A1)', fr: 'Niveau Découverte (A1)', en: 'Discovery Level (A1)' },
    A2: { ar: 'المستوى الأساسي التواصلي (A2)', fr: 'Niveau Élémentaire (A2)', en: 'Elementary Level (A2)' },
    B1: { ar: 'المستوى المستقل العملي (B1)', fr: 'Niveau Intermédiaire (B1)', en: 'Intermediate Level (B1)' },
    B2: { ar: 'المستوى المتقدم الحواري (B2)', fr: 'Niveau Avancé (B2)', en: 'Upper-Intermediate Level (B2)' },
    C1: { ar: 'المستوى الأكاديمي الكفء (C1)', fr: 'Niveau Autonome (C1)', en: 'Autonomous Level (C1)' },
    C2: { ar: 'مستوى الإتقان والطلاقة الفصيحة (C2)', fr: 'Niveau Maîtrise (C2)', en: 'Mastery Level (C2)' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-amber-500/30 my-auto max-h-[96vh] flex flex-col">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/80 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-md font-black">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                <span>Attestation EILE Arabe</span>
                <span className="text-amber-400 font-arabic text-sm">شهادة تقديرية في اللغة العربية</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'fr'
                  ? 'Modèle officiel bilingue français-arabe (conforme au cadre EILE & CECRL)'
                  : 'نموذج رسمي ثنائي اللغة (الفرنسية والعربية) متوافق مع المنهاج الدولي EILE'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                showSettings
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showSettings ? 'Masquer paramètres' : 'Modifier les données'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-700/30 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customization Drawer (Hidden on Print) */}
        {showSettings && (
          <div className="my-4 p-4 bg-slate-800/90 rounded-2xl border border-slate-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs print:hidden animate-fade-in shrink-0">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Titre (FR)</label>
              <input
                type="text"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 font-arabic">العنوان الرئيسي (عربي)</label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-arabic font-bold text-right focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Nom et prénom (FR)</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 font-arabic">الاسم والنسب (عربي)</label>
              <input
                type="text"
                value={studentNameAr}
                onChange={(e) => setStudentNameAr(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-arabic font-bold text-right focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Date de naissance / الازدياد</label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="15/05/2014"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Niveau / المستوى</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as CEFRLevel)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl} - {levelLabels[lvl].fr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Enseignant(e) (FR)</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 font-arabic">الأستاذ(ة) (عربي)</label>
              <input
                type="text"
                value={teacherNameAr}
                onChange={(e) => setTeacherNameAr(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-arabic font-bold text-right focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Académie / الأكاديمية</label>
              <input
                type="text"
                value={academie}
                onChange={(e) => setAcademie(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Établissement / École</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Ville (Fait à / حرر بـ)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Date d'attestation (Le / في)</label>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Langue d'affichage</label>
              <div className="flex bg-slate-900 rounded-xl p-0.5 border border-slate-700">
                <button
                  onClick={() => setDiplomaMode('bilingual')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    diplomaMode === 'bilingual' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  Bilingue
                </button>
                <button
                  onClick={() => setDiplomaMode('fr')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    diplomaMode === 'fr' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  Français
                </button>
                <button
                  onClick={() => setDiplomaMode('ar')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    diplomaMode === 'ar' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  عربي
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DIPLOMA CANVAS - PERFECT A4 LANDSCAPE BILINGUAL MODEL                     */}
        {/* ========================================================================= */}
        <div className="overflow-auto flex-1 p-2 sm:p-4 bg-slate-950/40 rounded-2xl flex items-center justify-center">
          <div
            id="certificate-printable"
            className="w-full max-w-4xl aspect-[1.414/1] bg-[#fffdfa] text-slate-900 relative shadow-2xl rounded-xl border-[10px] border-[#1b365d] p-6 sm:p-10 flex flex-col justify-between overflow-hidden select-text transition-all"
            style={{
              backgroundImage: `radial-gradient(#f0e6d2 0.75px, transparent 0.75px), radial-gradient(#f0e6d2 0.75px, #fffdfa 0.75px)`,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px',
            }}
          >
            {/* Inner Gold Thin Border */}
            <div className="absolute inset-2 border-2 border-[#c59b27] pointer-events-none rounded-lg" />
            <div className="absolute inset-3 border border-[#e5c158]/60 pointer-events-none rounded-md" />

            {/* Baroque Golden Corner Ornaments */}
            {/* Top Left */}
            <div className="absolute top-4 left-4 w-16 h-16 pointer-events-none text-[#c59b27]">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90">
                <path d="M5,5 L45,5 C40,15 35,25 25,25 C25,35 15,40 5,45 Z M10,10 L30,10 C26,16 20,20 10,22 Z" />
                <circle cx="20" cy="20" r="4" fill="#1b365d" />
                <path d="M5,5 Q50,0 50,50 Q0,50 5,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* Top Right */}
            <div className="absolute top-4 right-4 w-16 h-16 pointer-events-none text-[#c59b27] -scale-x-100">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90">
                <path d="M5,5 L45,5 C40,15 35,25 25,25 C25,35 15,40 5,45 Z M10,10 L30,10 C26,16 20,20 10,22 Z" />
                <circle cx="20" cy="20" r="4" fill="#1b365d" />
                <path d="M5,5 Q50,0 50,50 Q0,50 5,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-4 left-4 w-16 h-16 pointer-events-none text-[#c59b27] -scale-y-100">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90">
                <path d="M5,5 L45,5 C40,15 35,25 25,25 C25,35 15,40 5,45 Z M10,10 L30,10 C26,16 20,20 10,22 Z" />
                <circle cx="20" cy="20" r="4" fill="#1b365d" />
                <path d="M5,5 Q50,0 50,50 Q0,50 5,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-4 right-4 w-16 h-16 pointer-events-none text-[#c59b27] -scale-x-100 -scale-y-100">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90">
                <path d="M5,5 L45,5 C40,15 35,25 25,25 C25,35 15,40 5,45 Z M10,10 L30,10 C26,16 20,20 10,22 Z" />
                <circle cx="20" cy="20" r="4" fill="#1b365d" />
                <path d="M5,5 Q50,0 50,50 Q0,50 5,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* TOP BAR: Académie / République Française + EILE Logo & Établissement Box */}
            <div className="flex items-start justify-between gap-4 z-10 pt-2 px-6">
              
              {/* Left Header: French Republic / Académie */}
              <div className="text-left max-w-[260px]">
                <div className="flex items-center gap-2 mb-1">
                  {/* French Republic Tricolor badge */}
                  <div className="flex h-5 w-7 shadow-xs border border-slate-300">
                    <div className="w-1/3 bg-[#002395]" />
                    <div className="w-1/3 bg-white" />
                    <div className="w-1/3 bg-[#ED2939]" />
                  </div>
                  <div className="leading-tight">
                    <span className="block font-black text-[10px] tracking-wider text-[#1b365d]">RÉPUBLIQUE FRANÇAISE</span>
                  </div>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#1b365d] uppercase tracking-wide leading-snug">
                  {academie}
                </h4>
                <p className="text-[9px] text-slate-500 italic font-serif">
                  Liberté • Égalité • Fraternité
                </p>
                {diplomaMode !== 'fr' && (
                  <p className="text-[10px] text-slate-700 font-arabic font-bold mt-0.5">
                    {academieAr}
                  </p>
                )}
              </div>

              {/* Center Top Gold Crown/Baroque Filigree */}
              <div className="hidden sm:flex flex-col items-center text-[#c59b27]">
                <svg className="w-24 h-8" viewBox="0 0 200 60" fill="currentColor">
                  <path d="M100,10 C120,5 140,20 160,15 C170,12 180,25 190,20 C180,30 160,25 150,35 C130,30 110,45 100,50 C90,45 70,30 50,35 C40,25 20,30 10,20 C20,25 30,12 40,15 C60,20 80,5 100,10 Z" />
                  <circle cx="100" cy="18" r="4" fill="#1b365d" />
                  <circle cx="70" cy="24" r="2.5" />
                  <circle cx="130" cy="24" r="2.5" />
                </svg>
              </div>

              {/* Right Header: EILE Logo & Établissement Box */}
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white text-xs shadow-xs font-bold">
                    🌍
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#1b365d] tracking-tighter block leading-none">eile</span>
                    <span className="text-[7.5px] text-slate-600 uppercase font-semibold block leading-tight">
                      Enseignement International<br />des Langues Étrangères
                    </span>
                  </div>
                </div>

                {/* Établissement / École Box */}
                <div className="border border-slate-400 bg-white/80 rounded-md p-1.5 min-w-[170px] text-left shadow-2xs">
                  <span className="text-[8px] font-extrabold text-[#1b365d] uppercase block">
                    Établissement / École :
                  </span>
                  {diplomaMode !== 'fr' && (
                    <span className="text-[8px] font-bold text-slate-600 font-arabic block text-right">
                      المؤسسة / المدرسة :
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-900 block mt-0.5 border-b border-dotted border-slate-400 pb-0.5">
                    {school || '...........................................'}
                  </span>
                </div>
              </div>

            </div>

            {/* ===================================================================== */}
            {/* DIPLOMA CENTER: TITLE & CEFR LEVEL BADGE                             */}
            {/* ===================================================================== */}
            <div className="text-center z-10 my-1 sm:my-2 px-4">
              
              {/* French Title */}
              {diplomaMode !== 'ar' && (
                <div className="mb-1">
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-[#1b365d] tracking-widest uppercase mb-0.5">
                    {titleFr.includes('ATTESTATION') && titleFr.includes('EILE') ? (
                      <>
                        <span className="block text-3xl sm:text-4xl md:text-5xl tracking-widest">ATTESTATION</span>
                        <span className="block text-xs sm:text-sm font-bold tracking-widest text-[#c59b27] uppercase mt-0.5">
                          EN EILE ARABE
                        </span>
                      </>
                    ) : (
                      titleFr
                    )}
                  </h1>
                </div>
              )}

              {/* Arabic Title */}
              {diplomaMode !== 'fr' && (
                <div className="my-0.5">
                  <h2 className="font-arabic text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1b365d] leading-snug">
                    {titleAr}
                  </h2>
                </div>
              )}

              {/* CEFR Level with Golden Laurels (🌿 A1 🌿) */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 my-1.5">
                {/* Left Laurel Branch */}
                <span className="text-[#c59b27] text-2xl sm:text-3xl select-none">🪻</span>

                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 via-amber-100/80 to-amber-50 border-2 border-[#c59b27] px-6 sm:px-8 py-1.5 rounded-2xl shadow-sm">
                  <span className="font-serif font-black text-2xl sm:text-3xl text-[#1b365d] tracking-wider">
                    ( {selectedLevel} )
                  </span>
                  {diplomaMode !== 'fr' && (
                    <span className="font-arabic font-extrabold text-sm sm:text-base text-emerald-900">
                      - {levelLabels[selectedLevel].ar}
                    </span>
                  )}
                </div>

                {/* Right Laurel Branch */}
                <span className="text-[#c59b27] text-2xl sm:text-3xl select-none -scale-x-100">🪻</span>
              </div>

            </div>

            {/* ===================================================================== */}
            {/* ATTESTATION BODY: TEACHER & STUDENT DETAILS & VALIDATION             */}
            {/* ===================================================================== */}
            <div className="z-10 px-6 sm:px-12 text-center text-slate-800 space-y-2">
              
              {/* Teacher Attestation Statement */}
              <div className="text-xs sm:text-sm leading-relaxed">
                {diplomaMode !== 'ar' && (
                  <p className="font-medium text-slate-800">
                    <strong className="text-[#1b365d] font-bold">{teacherName}</strong>, enseignant(e) de langue arabe dans le cadre de l'Enseignement International des Langues Étrangères (EILE), atteste que :
                  </p>
                )}
                {diplomaMode !== 'fr' && (
                  <p className="font-arabic text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                    {teacherNameAr.includes('أستاذ') ? teacherNameAr : `الأستاذ(ة) ${teacherNameAr}`}، أستاذ(ة) اللغة العربية في إطار برنامج التعليم الدولي للغات الأجنبية (EILE)، يشهد / تشهد بأن:
                  </p>
                )}
              </div>

              {/* Student Name & Birthdate Dotted Rows */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3 max-w-2xl mx-auto shadow-2xs space-y-2">
                
                {/* Row 1: Student Name (FR + AR) */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dotted border-slate-400 pb-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-[#1b365d]">Nom et prénom :</span>
                    <span className="font-serif text-base sm:text-lg font-black text-slate-950 tracking-wide">
                      {studentName || '................................................'}
                    </span>
                  </div>
                  {diplomaMode !== 'fr' && (
                    <div className="flex items-baseline gap-2 font-arabic text-right">
                      <span className="text-base sm:text-lg font-black text-slate-950">
                        {studentNameAr || studentName}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#1b365d]">: الاِسْمُ وَالنَّسَبُ</span>
                    </div>
                  )}
                </div>

                {/* Row 2: Birth Date (FR + AR) */}
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-[#1b365d]">Date de naissance :</span>
                    <span className="font-serif text-xs sm:text-sm font-bold text-slate-900">
                      {birthDate || '................................................'}
                    </span>
                  </div>
                  {diplomaMode !== 'fr' && (
                    <div className="flex items-baseline gap-2 font-arabic text-right">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {birthDate}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#1b365d]">: تَارِيخُ الاِزْدِيَادِ</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Achievement Summary Sentence */}
              <div className="text-[11px] sm:text-xs leading-relaxed max-w-2xl mx-auto text-slate-700">
                {diplomaMode !== 'ar' && (
                  <p className="font-medium">
                    a suivi avec succès la formation de langue arabe et a atteint le <strong>niveau {selectedLevel}</strong> (CECRL).
                    Cette attestation est délivrée dans le cadre du programme <strong>EILE</strong> (Enseignement International des Langues Étrangères).
                  </p>
                )}
                {diplomaMode !== 'fr' && (
                  <p className="font-arabic font-semibold text-slate-900 mt-1">
                    قَدْ تَابَعَ(تْ) بِنَجَاحٍ دُرُوسَ وَتَكْوِينَ اللُّغَةِ العَرَبِيَّةِ وَحَصَلَ(تْ) عَلَى <strong>المُسْتَوَى {selectedLevel}</strong>.
                    تُسَلَّمُ هَذِهِ الشَّهَادَةُ فِي إِطَارِ بَرْنَامَجِ التَّعْلِيمِ الدَّوْلِيِّ لِلُّغَاتِ الأَجْنَبِيَّةِ (EILE).
                  </p>
                )}
              </div>

            </div>

            {/* ===================================================================== */}
            {/* FOOTER: DATES, PLACE, SIGNATURES & OFFICIAL SEAL                     */}
            {/* ===================================================================== */}
            <div className="z-10 pt-3 pb-1 px-6 sm:px-10 flex items-end justify-between gap-4 border-t border-slate-300/80 mt-2">
              
              {/* Left: Location and Date */}
              <div className="text-left text-xs space-y-1 max-w-[200px]">
                <p className="text-slate-800">
                  <strong className="text-[#1b365d]">Fait à / حُرِّرَ بِـ :</strong>{' '}
                  <span className="font-bold">{city} {diplomaMode !== 'fr' && `(${cityAr})`}</span>
                </p>
                <p className="text-slate-800">
                  <strong className="text-[#1b365d]">Le / فِي :</strong>{' '}
                  <span className="font-bold">{issueDate}</span>
                </p>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-500 font-serif block">
                    Cadre Européen Commun de Référence (CECRL)
                  </span>
                  <span className="text-[9px] text-emerald-800 font-bold block">
                    XP Acquis : {xp} pts • Programme Officiel
                  </span>
                </div>
              </div>

              {/* Center: Official Golden Arabesque Stamp */}
              <div className="hidden sm:flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#c59b27] bg-amber-50/60 p-1 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-[#1b365d] font-black text-xs font-serif leading-none">EILE</span>
                  <span className="text-[#c59b27] text-[7px] font-bold uppercase tracking-tighter">SCEAU OFFICIEL</span>
                  <span className="font-arabic text-[8px] font-bold text-emerald-900 leading-none">ختم النجاح</span>
                  <span className="text-[#1b365d] text-[8px] font-extrabold">★ ★ ★</span>
                </div>
              </div>

              {/* Right: Signatures (Teacher & Director) */}
              <div className="flex items-end gap-3 text-right">
                
                {/* Teacher Signature Box */}
                <div className="text-center min-w-[120px]">
                  <span className="text-[10px] font-extrabold text-[#1b365d] block leading-tight">
                    Signature de l'enseignant(e)
                  </span>
                  {diplomaMode !== 'fr' && (
                    <span className="text-[9px] font-bold text-slate-600 font-arabic block leading-tight">
                      توقيع الأستاذ(ة)
                    </span>
                  )}
                  <div className="h-10 border-b border-dotted border-slate-400 flex items-center justify-center font-serif text-sm text-emerald-800 italic select-none">
                    {teacherName.replace('Mme ', '').replace('M. ', '')}
                  </div>
                </div>

                {/* Director Signature Box */}
                <div className="text-center min-w-[130px]">
                  <span className="text-[10px] font-extrabold text-[#1b365d] block leading-tight">
                    Signature du directeur
                  </span>
                  {diplomaMode !== 'fr' && (
                    <span className="text-[9px] font-bold text-slate-600 font-arabic block leading-tight">
                      توقيع وخاتم الإدارة
                    </span>
                  )}
                  <div className="h-10 border border-slate-400 bg-white/90 rounded-md flex items-center justify-center text-[9px] text-slate-400 font-mono shadow-2xs">
                    [ Cachet / Visa ]
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Ornamental Centerpiece */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[#c59b27] pointer-events-none opacity-80">
              <svg className="w-16 h-4" viewBox="0 0 100 20" fill="currentColor">
                <path d="M50,0 C60,10 80,5 100,10 C80,15 60,10 50,20 C40,10 20,15 0,10 C20,5 40,10 50,0 Z" />
                <circle cx="50" cy="10" r="2.5" fill="#1b365d" />
              </svg>
            </div>

          </div>
        </div>

        {/* Bottom Actions Modal (Hidden on Print) */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Format optimisé pour impression directe ou exportation PDF au format Paysage A4.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Sauvegarder en PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
