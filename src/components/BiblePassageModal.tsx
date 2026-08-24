import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ExternalLink, X, Heart, Sparkles } from 'lucide-react';
import { DayItem } from '../types';

interface BiblePassageModalProps {
  day: DayItem | null;
  onClose: () => void;
}

export const BiblePassageModal: React.FC<BiblePassageModalProps> = ({ day, onClose }) => {
  if (!day) return null;

  const encodedQuery = encodeURIComponent(day.reading);
  const bibleGatewayUrl = `https://www.biblegateway.com/passage/?search=${encodedQuery}&version=RVR1960`;
  const youVersionUrl = `https://www.bible.com/search/bible?q=${encodedQuery}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-left overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Día {day.num} de 30
                </span>
                <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                  {day.reading}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-amber-100/80 text-sm text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Guía para tu lectura:
              </p>
              <p>
                Antes de comenzar a leer <strong>{day.reading}</strong>, toma un momento para respirar hondo, 
                hacer una oración en silencio y buscar la enseñanza que Dios tiene para vos y tu pareja en este pasaje.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Abrir pasaje en línea (Reina-Valera 1960 / NVI):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={bibleGatewayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all group"
                >
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-rose-700">
                    BibleGateway (RVR1960)
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
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
            >
              Listo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
