import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, X } from 'lucide-react';
import { PartnerNames } from '../types';

interface PartnerNamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerNames: PartnerNames;
  onSave: (names: PartnerNames) => void;
}

export const PartnerNamesModal: React.FC<PartnerNamesModalProps> = ({
  isOpen,
  onClose,
  partnerNames,
  onSave,
}) => {
  const [florName, setFlorName] = useState(partnerNames.flor);
  const [terequeName, setTerequeName] = useState(partnerNames.tereque);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      flor: florName.trim() || 'Flor de desierto',
      tereque: terequeName.trim() || 'TEREQUE',
    });
    onClose();
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
          className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-slate-800">Personalizar Nombres</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
                Participante 1 (Rosa)
              </label>
              <input
                type="text"
                value={florName}
                onChange={(e) => setFlorName(e.target.value)}
                placeholder="Ej. Flor de desierto"
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
                Participante 2 (Celeste)
              </label>
              <input
                type="text"
                value={terequeName}
                onChange={(e) => setTerequeName(e.target.value)}
                placeholder="Ej. TEREQUE"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 bg-sky-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                maxLength={30}
              />
            </div>

            <div className="pt-3 flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm transition-all"
              >
                Guardar Nombres
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
