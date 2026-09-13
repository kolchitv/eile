import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  MessageCircle,
  Share2,
  GraduationCap
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface FooterProps {
  language: SupportedLanguage;
  onOpenPhonetics?: () => void;
  onOpenVideoLibrary?: () => void;
  onOpenPlacement?: () => void;
  onOpenReadingLab?: () => void;
  onOpenSpeakingLab?: () => void;
  onOpenSpeedReading?: () => void;
  onOpenCompetencies?: () => void;
  onOpenChants?: (chantId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenPhonetics,
  onOpenVideoLibrary,
  onOpenPlacement,
  onOpenReadingLab,
  onOpenSpeakingLab,
  onOpenSpeedReading,
  onOpenCompetencies,
  onOpenChants,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 mt-16 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-slate-100">
          
          {/* Column 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="cursor-pointer inline-block" onClick={scrollToTop}>
              <div className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
                <span className="text-sky-700">Arab</span>
                <span className="text-amber-500">facile</span>
                <span className="text-slate-500 font-bold text-lg">.com</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {language === 'ar' ? 'العربية في متناول يدك • A1 - C2' : language === 'fr' ? "L'arabe à votre portée (A1 - C2)" : 'Arabic within your reach'}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              {language === 'ar'
                ? 'تعلم اللغة العربية بمتعة وسهولة بفضل طريقتنا التفاعلية والشاملة المعتمدة على أحدث المعايير البيداغوجية.'
                : language === 'fr'
                ? "Apprenez l'arabe avec plaisir grâce à notre méthode interactive et immersive."
                : 'Learn Arabic with joy through our interactive, immersive methodology.'}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{language === 'ar' ? 'منهاج تفاعلي متكامل A1 - C2' : 'Programme interactif A1 - C2'}</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
              {language === 'ar' ? 'التنقل' : 'Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={scrollToTop}
                  className="text-slate-600 hover:text-sky-700 transition-colors"
                >
                  {language === 'ar' ? 'الرئيسية' : 'Accueil'}
                </button>
              </li>
              <li>
                <button 
                  onClick={scrollToTop}
                  className="text-slate-600 hover:text-sky-700 transition-colors"
                >
                  {language === 'ar' ? 'المستويات (A1 - C2)' : 'Niveaux'}
                </button>
              </li>
              {onOpenCompetencies && (
                <li>
                  <button 
                    onClick={onOpenCompetencies}
                    className="text-emerald-700 hover:text-emerald-950 font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{language === 'ar' ? 'مصفوفة الكفايات الرسمية (CECRL A1 & A2)' : 'Cadre des Compétences (CECRL A1/A2)'}</span>
                  </button>
                </li>
              )}
              {onOpenChants && (
                <li>
                  <button 
                    onClick={() => onOpenChants()}
                    className="text-amber-800 hover:text-amber-950 font-black transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>{language === 'ar' ? 'الأناشيد والقصائد المترجمة (EILE)' : 'Chants & Poésies (EILE)'}</span>
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={onOpenPlacement}
                  className="text-slate-600 hover:text-sky-700 transition-colors"
                >
                  {language === 'ar' ? 'المنهجية وتحديد المستوى' : 'Méthodologie'}
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenVideoLibrary}
                  className="text-slate-600 hover:text-sky-700 transition-colors"
                >
                  {language === 'ar' ? 'تعلم العربية بسهولة' : "Apprendre l'arabe facilement"}
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSpeakingLab}
                  className="text-slate-600 hover:text-rose-700 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>{language === 'ar' ? 'التعبير الشفهي والاستماع (Parler en continu)' : 'Oral & Écoute (Parler en continu)'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenReadingLab}
                  className="text-slate-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{language === 'ar' ? 'مختبر القراءة والتهجئة (1 متقدم)' : 'Atelier Lecture (1re Avancé)'}</span>
                </button>
              </li>
              {onOpenSpeedReading && (
                <li>
                  <button 
                    onClick={onOpenSpeedReading}
                    className="text-amber-700 hover:text-amber-950 font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>⚡</span>
                    <span>{language === 'ar' ? 'لعبة: من يقرأ أسرع؟ (المؤقت الذكي)' : 'Jeu : Qui lit le plus vite ?'}</span>
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={onOpenPhonetics}
                  className="text-slate-600 hover:text-sky-700 transition-colors"
                >
                  {language === 'ar' ? 'الأبجدية والحروف' : 'Alphabet arabe'}
                </button>
              </li>
              <li>
                <button 
                  onClick={scrollToTop}
                  className="text-slate-600 hover:text-sky-700 transition-colors"
                >
                  {language === 'ar' ? 'دروس المبتدئين' : 'Cours arabe débutant'}
                </button>
              </li>
              <li>
                <a 
                  href="https://wa.me/33773659697" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-sky-700 transition-colors inline-flex items-center gap-1"
                >
                  <span>{language === 'ar' ? 'انضم إلينا' : 'Rejoignez-nous'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
              {language === 'ar' ? 'تواصل معنا' : 'Contact'}
            </h4>
            
            <div className="space-y-3 text-sm">
              <a 
                href="mailto:arabiaeasy@gmail.com"
                className="flex items-center gap-2.5 text-slate-600 hover:text-sky-700 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-sky-50 flex items-center justify-center transition-colors">
                  <Mail className="w-4 h-4 text-slate-600 group-hover:text-sky-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium">arabiaeasy@gmail.com</span>
              </a>

              <a 
                href="https://wa.me/33773659697" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-600 hover:text-emerald-700 transition-colors group"
                dir="ltr"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium">+33 7 73 65 96 97</span>
              </a>

              <a 
                href="https://www.tiktok.com/@arabfacile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-600 hover:text-slate-900 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <span className="text-xs font-black">🎵</span>
                </div>
                <span className="text-xs sm:text-sm font-medium">@arabfacile</span>
              </a>

              <a 
                href="https://www.facebook.com/alarabiaeasy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-600 hover:text-blue-600 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <span className="text-xs font-bold text-blue-700">f</span>
                </div>
                <span className="text-xs sm:text-sm font-medium">@alarabiaeasy</span>
              </a>

              <div className="pt-2">
                <a
                  href="mailto:arabiaeasy@gmail.com?subject=Contact%20ArabFacile"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إرسال بريد إلكتروني' : 'Envoyer un email'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
              {language === 'ar' ? 'النشرة الإخبارية' : 'Newsletter'}
            </h4>
            
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {language === 'ar'
                ? 'احصل على نصائحنا والجديد التعليمي مباشرة في بريدك الإلكتروني.'
                : language === 'fr'
                ? 'Recevez nos conseils et nouveautés directement dans votre boîte mail.'
                : 'Receive our tips and updates directly in your inbox.'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
              />

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-200" />
                    <span>{language === 'ar' ? 'تم الاشتراك بنجاح!' : 'Inscrit avec succès !'}</span>
                  </>
                ) : (
                  <span>{language === 'ar' ? 'اشتراك' : "S'inscrire"}</span>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright & Signature row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-extrabold text-slate-800">© 2026 Arabfacile.com</span>
            <span>•</span>
            <span>{language === 'ar' ? 'جميع الحقوق محفوظة' : 'Tous droits réservés'}</span>
            <span>•</span>
            <span className="text-slate-400">CECRL & EILE / ELCO</span>
          </div>

          {/* Signature: Prof SAID */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 via-emerald-50 to-sky-50 border border-amber-300/80 px-3.5 py-1.5 rounded-full shadow-2xs">
            <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-slate-600 font-medium font-arabic">
              {language === 'ar' ? 'توقيع:' : language === 'fr' ? 'Signature :' : 'Signature:'}
            </span>
            <span className="font-black text-slate-900 tracking-wide text-xs sm:text-sm bg-gradient-to-r from-sky-800 via-emerald-800 to-amber-700 bg-clip-text text-transparent">
              Prof SAID
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
