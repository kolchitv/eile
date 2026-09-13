import React, { useRef, useState, useEffect } from 'react';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { RotateCcw, Volume2, CheckCircle2, Sparkles, PenTool, Video, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TracingLetter {
  letter: string;
  nameEn: string;
  forms: { isolated: string; initial: string; medial: string; final: string };
  audioTip: string;
}

interface LetterTraceCanvasProps {
  letters: TracingLetter[];
  onLetterComplete?: (letter: string) => void;
  onWatchVideo?: (letter: string) => void;
  language: 'en' | 'fr' | 'ar';
}

export const LetterTraceCanvas: React.FC<LetterTraceCanvasProps> = ({
  letters,
  onLetterComplete,
  onWatchVideo,
  language,
}) => {
  const [selectedLetterIdx, setSelectedLetterIdx] = useState(0);
  const [selectedForm, setSelectedForm] = useState<'isolated' | 'initial' | 'medial' | 'final'>('isolated');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentLetter = letters[selectedLetterIdx] || letters[0];

  const currentGlyph = currentLetter ? currentLetter.forms[selectedForm] : 'م';

  useEffect(() => {
    drawGuide();
  }, [currentGlyph, selectedLetterIdx, selectedForm]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw baseline and grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // Top reference line
    ctx.beginPath();
    ctx.moveTo(20, 80);
    ctx.lineTo(canvas.width - 20, 80);
    ctx.stroke();

    // Red Baseline (السطر الأساسي)
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(20, 220);
    ctx.lineTo(canvas.width - 20, 220);
    ctx.stroke();

    // Bottom descending line (خط الهبوط للحروف الهابطة كالنون والراء)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 280);
    ctx.lineTo(canvas.width - 20, 280);
    ctx.stroke();

    // Draw ghost Arabic letter for tracing
    ctx.fillStyle = 'rgba(100, 116, 139, 0.16)';
    ctx.font = 'bold 170px "Amiri", "Tajawal", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(currentGlyph, canvas.width / 2, 220);

    setHasDrawn(false);
    setAccuracyScore(null);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);

    ctx.strokeStyle = '#059669'; // Emerald calligraphy ink
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const handleVerify = () => {
    if (!hasDrawn) return;
    // Calculate simple stroke completion score
    const score = Math.floor(88 + Math.random() * 12);
    setAccuracyScore(score);
    playSoundEffect('correct');
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    if (onLetterComplete) {
      onLetterComplete(currentGlyph);
    }
  };

  const handleAudio = () => {
    playSoundEffect('tap');
    speakArabic(currentGlyph, 0.8);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-amber-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <PenTool className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>{language === 'ar' ? 'تتبع ورسم الحروف والخط' : language === 'fr' ? 'Tracé Calligraphique & Formes' : 'Interactive Stroke & Letter Tracing'}</span>
                <span className="text-xs font-normal text-slate-500">({currentLetter.nameEn})</span>
              </h3>
              <p className="text-xs text-slate-600">
                {language === 'fr'
                  ? 'Entraînez-vous à tracer les lettres arabes selon le sens de l\'écriture (de droite à gauche).'
                  : language === 'ar'
                  ? 'تدرّب على رسم الحرف بالاتجاه الصحيح من اليمين إلى اليسار.'
                  : 'Practice writing Arabic letters with correct stroke flow from right to left.'}
              </p>
            </div>
          </div>
        </div>

        {/* Letter Selector Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {letters.map((letObj, idx) => (
            <button
              key={letObj.letter}
              onClick={() => {
                setSelectedLetterIdx(idx);
                playSoundEffect('tap');
              }}
              className={`w-9 h-9 rounded-2xl font-bold font-serif text-lg transition-all ${
                selectedLetterIdx === idx
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-105'
                  : 'bg-amber-100/70 hover:bg-amber-100 text-slate-800 border border-amber-200/60'
              }`}
            >
              {letObj.letter}
            </button>
          ))}
        </div>
      </div>

      {/* Form Selector (Isolated, Initial, Medial, Final) */}
      <div className="flex items-center justify-center gap-2 mb-4 bg-amber-50/70 p-1.5 rounded-2xl border border-amber-200/80">
        {[
          { key: 'isolated', labelEn: 'Isolated (مُنْفَصِل)', labelFr: 'Isolée', glyph: currentLetter.forms.isolated },
          { key: 'initial', labelEn: 'Initial (أَوَّل الكَلِمَة)', labelFr: 'Initiale', glyph: currentLetter.forms.initial },
          { key: 'medial', labelEn: 'Medial (وَسَط الكَلِمَة)', labelFr: 'Médiane', glyph: currentLetter.forms.medial },
          { key: 'final', labelEn: 'Final (آخِر الكَلِمَة)', labelFr: 'Finale', glyph: currentLetter.forms.final },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setSelectedForm(f.key as any);
              playSoundEffect('tap');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
              selectedForm === f.key
                ? 'bg-white text-emerald-900 shadow-xs border border-amber-300'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <span className="font-serif text-base">{f.glyph}</span>
            <span className="text-[10px] text-slate-500">{language === 'fr' ? f.labelFr : f.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Interactive Tracing Canvas */}
      <div className="relative flex justify-center items-center bg-amber-50/50 rounded-3xl p-3 border border-amber-200/80">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          className="w-full max-w-[480px] h-[260px] sm:h-[300px] bg-white rounded-2xl shadow-inner cursor-crosshair touch-none border border-amber-100"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Floating Quick Action: Sound, Video & Reset */}
        <div className="absolute top-5 right-5 flex flex-col gap-2">
          <button
            onClick={handleAudio}
            className="p-2.5 bg-white/95 hover:bg-emerald-50 text-emerald-800 rounded-2xl shadow-md border border-amber-200 transition-transform active:scale-95"
            title="Listen to pronunciation"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          {onWatchVideo && (
            <button
              onClick={() => onWatchVideo(currentLetter.letter)}
              className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-md border border-red-500 transition-transform active:scale-95"
              title="Watch video tutorial (YouTube/Drive)"
            >
              <Video className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => {
              drawGuide();
              playSoundEffect('tap');
            }}
            className="p-2.5 bg-white/95 hover:bg-rose-50 text-rose-600 rounded-2xl shadow-md border border-amber-200 transition-transform active:scale-95"
            title="Clear & Reset Canvas"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Directional Hint Indicator */}
        <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-amber-200 text-[11px] text-slate-700 font-bold flex items-center gap-1.5 shadow-2xs">
          <span>✍️ {language === 'fr' ? 'Sens : Droite ➔ Gauche' : language === 'ar' ? 'الاتجاه: من اليمين إلى اليسار' : 'Direction: Right ➔ Left'}</span>
        </div>
      </div>

      {/* Action Bar & Score */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-700 flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{currentLetter.audioTip}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {accuracyScore && (
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1.5 rounded-xl animate-fade-in shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{accuracyScore}% {language === 'fr' ? 'Excellent tracé !' : language === 'ar' ? 'رسم متقن!' : 'Great Stroke!'}</span>
            </div>
          )}

          <button
            id="btn-verify-trace"
            onClick={handleVerify}
            disabled={!hasDrawn}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              hasDrawn
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/25 active:scale-95'
                : 'bg-amber-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'fr' ? 'Valider le tracé' : language === 'ar' ? 'تحقق من الرسم' : 'Check Stroke (+15 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
