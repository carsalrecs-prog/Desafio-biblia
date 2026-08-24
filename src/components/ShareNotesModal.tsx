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

  // Generate summary text
  let totalFlor = 0;
  let totalTereque = 0;
  Object.values(checkedDays).forEach((day: DayProgress) => {
    if (day?.flor) totalFlor++;
    if (day?.tereque) totalTereque++;
  });

  let reportText = `📖 *Desafío Bíblico de 30 Días*\n`;
  reportText += `💖 Progreso de ${partnerNames.flor}: ${totalFlor}/30 lecturas\n`;
  reportText += `✨ Progreso de ${partnerNames.tereque}: ${totalTereque}/30 lecturas\n`;
  reportText += `🎯 Progreso total compartido: ${totalFlor + totalTereque}/60 (${Math.round(((totalFlor + totalTereque) / 60) * 100)}%)\n\n`;

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

  reportText += `_«La Biblia no es solo un libro para leer, es una carta de amor de Dios para vos.»_`;

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
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <BookHeart className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-slate-800">Resumen y Reflexiones Compartidas</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">
              Podés copiar este texto para guardarlo o enviárselo a tu pareja por WhatsApp/Telegram:
            </p>
            <pre className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {reportText}
            </pre>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-400">
              {copied ? '¡Copiado en portapapeles!' : 'Listo para compartir'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={handleCopy}
                className="px-5 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '¡Copiado!' : 'Copiar Texto'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
