import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Trophy, X } from 'lucide-react';
import { PartnerNames } from '../types';

interface CelebrationModalProps {
  celebration: { day: number; message: string } | null;
  onClose: () => void;
  partnerNames: PartnerNames;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ celebration, onClose, partnerNames }) => {
  return (
    <AnimatePresence>
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-rose-200 text-center overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sparkle badge */}
            <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-rose-400 to-amber-300 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 mb-4 transform rotate-3">
              <Sparkles className="w-7 h-7" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" /> ¡Meta Diaria Compartida!
            </span>

            <h3
              className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              ¡Día {celebration.day} completado!
            </h3>

            <p className="text-base sm:text-lg text-rose-600 font-medium px-2 mb-5 leading-snug">
              {celebration.message}
            </p>

            <div className="bg-gradient-to-r from-rose-50 to-sky-50 rounded-2xl p-3 border border-rose-100/80 mb-5 flex items-center justify-around">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-400 text-white flex items-center justify-center text-xs font-bold">
                  {partnerNames.flor.charAt(0) || 'F'}
                </span>
                <span className="text-xs font-semibold text-rose-800">{partnerNames.flor}</span>
              </div>
              <Heart className="w-4 h-4 text-rose-400 animate-pulse fill-rose-400" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-400 text-white flex items-center justify-center text-xs font-bold">
                  {partnerNames.tereque.charAt(0) || 'T'}
                </span>
                <span className="text-xs font-semibold text-sky-800">{partnerNames.tereque}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-2xl shadow-md shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              ¡Continuar con gozo!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
