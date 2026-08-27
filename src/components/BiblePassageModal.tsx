import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ExternalLink, X, Sparkles, Heart } from 'lucide-react';
import { DayItem } from '../types';

interface BiblePassageModalProps {
  day: DayItem | null;
  onClose: () => void;
}

export const BiblePassageModal: React.FC<BiblePassageModalProps> = ({ day, onClose }) => {
  if (!day) return null;

  // Reading query (e.g., "Mateo 1-2")
  const cleanRange = day.reading.replace(/\s+/g, '');
  const bibleGatewayUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(cleanRange)}&version=RVR1960`;
  const youVersionUrl = `https://www.bible.com/search/bible?q=${encodeURIComponent(day.reading)}`;

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
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-left overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Día {day.num} de 14 · 2 Capítulos al Día
                </span>
                <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                  {day.reading}
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

          <div className="py-5 space-y-4">
            {day.topic && (
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950">
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                  Temas Centrales de Hoy:
                </p>
                <p className="font-semibold text-sm text-slate-800">
                  {day.topic}
                </p>
                {day.summary && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {day.summary}
                  </p>
                )}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-amber-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Guía para su lectura en pareja (2 capítulos):
              </p>
              <p>
                Tomen unos minutos juntos antes de leer <strong>{day.reading}</strong>. Pueden leer un capítulo cada uno en voz alta o alternar párrafos, y al terminar anoten lo que Dios habló a sus corazones.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Leer pasaje completo de hoy en línea:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={bibleGatewayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all group"
                >
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-rose-700">
                    BibleGateway ({day.reading})
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                </a>

                <a
                  href={youVersionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all group"
                >
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-700">
                    YouVersion Bible
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
