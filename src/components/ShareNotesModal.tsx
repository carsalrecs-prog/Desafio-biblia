import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Copy, Check, X, BookHeart } from 'lucide-react';
import { WeekChallenge, PartnerNames, ReflectionAnswers, DayProgress } from '../types';

interface ShareNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerNames: PartnerNames;
  challengeData: WeekChallenge[];
  checkedDays: Record<number, DayProgress>;
  answers: Record<number, ReflectionAnswers>;
}

export const ShareNotesModal: React.FC<ShareNotesModalProps> = ({
  isOpen,
  onClose,
  partnerNames,
  challengeData,
  checkedDays,
  answers,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate summary text for 14 days (28 chapters of Mateo, 2 chapters/day)
  let totalFlor = 0;
  let totalTereque = 0;
  for (let i = 1; i <= 14; i++) {
    const day = checkedDays[i];
    if (day?.flor) totalFlor++;
    if (day?.tereque) totalTereque++;
  }

  let reportText = `📖 *Desafío Bíblico: El Evangelio de Mateo (28 Capítulos · 2 por día)*\n`;
  reportText += `💖 Progreso de ${partnerNames.flor}: ${totalFlor}/14 días completados (${totalFlor * 2} caps)\n`;
  reportText += `✨ Progreso de ${partnerNames.tereque}: ${totalTereque}/14 días completados (${totalTereque * 2} caps)\n`;
  reportText += `🎯 Días sincronizados: ${totalFlor + totalTereque}/28 lecturas (${Math.round(((totalFlor + totalTereque) / 28) * 100)}%)\n\n`;

  challengeData.forEach((section, idx) => {
    const secTitle = typeof section.week === 'number' ? `Semana ${section.week}: ${section.title}` : `${section.week}: ${section.title}`;
    reportText += `📌 *${secTitle}*\n`;
    
    const ansFlor = answers[idx]?.flor;
    const ansTereque = answers[idx]?.tereque;

    if (ansFlor) {
      reportText += `🌸 ${partnerNames.flor}: "${ansFlor}"\n`;
    }
    if (ansTereque) {
      reportText += `🌟 ${partnerNames.tereque}: "${ansTereque}"\n`;
    }
    reportText += `\n`;
  });

  reportText += `_«He aquí yo estoy con vosotros todos los días, hasta el fin del mundo.» — Mateo 28:20_`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Error copying to clipboard', e);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-left overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                <BookHeart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Resumen de Mateo (2 Caps/Día)
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  Exportar Reflexiones
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 flex-1 overflow-y-auto">
            <p className="text-xs text-slate-500 mb-2">
              Podés copiar este texto estructurado para enviarlo por WhatsApp o guardarlo en tus notas personales:
            </p>
            <pre className="w-full bg-[#FFFBF7] p-3 rounded-2xl border border-amber-200/80 text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto select-all">
              {reportText}
            </pre>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              {copied ? '¡Copiado con éxito!' : 'Listo para compartir'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={handleCopy}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
