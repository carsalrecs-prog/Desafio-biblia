import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  BookOpen,
  Sparkles,
  RotateCcw,
  Share2,
  UserCheck,
  CheckCircle2,
  Flame,
  Award,
  Filter,
  Check,
} from 'lucide-react';
import { challengeData } from './data/challengeData';
import { DayItem, DayProgress, PartnerNames, ReflectionAnswers } from './types';
import { WeekCard } from './components/WeekCard';
import { CelebrationModal } from './components/CelebrationModal';
import { BiblePassageModal } from './components/BiblePassageModal';
import { PartnerNamesModal } from './components/PartnerNamesModal';
import { ShareNotesModal } from './components/ShareNotesModal';
import { CertificatePdfModal } from './components/CertificatePdfModal';

// Storage keys
const STORAGE_CHECKS_KEY = 'desafioMateo_checks_v5';
const STORAGE_ANSWERS_KEY = 'desafioMateo_answers_v5';
const STORAGE_NAMES_KEY = 'desafioMateo_names_v5';

// Synchronous initial state loaders to avoid empty-state flash / race condition
const loadInitialChecks = (): Record<number, DayProgress> => {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STORAGE_CHECKS_KEY) || localStorage.getItem('desafioBiblicoProgress');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading saved checks from localStorage', e);
  }
  return {};
};

const loadInitialAnswers = (): Record<number, ReflectionAnswers> => {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STORAGE_ANSWERS_KEY) || localStorage.getItem('desafioBiblicoAnswers');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading saved answers from localStorage', e);
  }
  return {};
};

const loadInitialNames = (): PartnerNames => {
  if (typeof window === 'undefined') {
    return { flor: 'Flor de desierto', tereque: 'TEREQUE' };
  }
  try {
    const saved = localStorage.getItem(STORAGE_NAMES_KEY) || localStorage.getItem('desafioBiblicoNames');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading saved names from localStorage', e);
  }
  return { flor: 'Flor de desierto', tereque: 'TEREQUE' };
};

export default function App() {
  // Synchronously hydrated state from localStorage
  const [checkedDays, setCheckedDays] = useState<Record<number, DayProgress>>(loadInitialChecks);
  const [answers, setAnswers] = useState<Record<number, ReflectionAnswers>>(loadInitialAnswers);
  const [partnerNames, setPartnerNames] = useState<PartnerNames>(loadInitialNames);
  const [celebration, setCelebration] = useState<{ day: number; message: string } | null>(null);

  // Modals & filters
  const [activeReadingModal, setActiveReadingModal] = useState<DayItem | null>(null);
  const [isNamesModalOpen, setIsNamesModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');

  // Multi-tier persistence guarantee: Save whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHECKS_KEY, JSON.stringify(checkedDays));
      localStorage.setItem('desafioBiblicoProgress', JSON.stringify(checkedDays));
    } catch (e) {
      console.error('Error saving checks', e);
    }
  }, [checkedDays]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(answers));
      localStorage.setItem('desafioBiblicoAnswers', JSON.stringify(answers));
    } catch (e) {
      console.error('Error saving answers', e);
    }
  }, [answers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NAMES_KEY, JSON.stringify(partnerNames));
      localStorage.setItem('desafioBiblicoNames', JSON.stringify(partnerNames));
    } catch (e) {
      console.error('Error saving names', e);
    }
  }, [partnerNames]);

  const toggleDay = (dayNum: number, person: 'flor' | 'tereque') => {
    setCheckedDays((prev) => {
      let currentDay = prev[dayNum];
      if (typeof currentDay !== 'object' || currentDay === null) {
        currentDay = { flor: false, tereque: false };
      }

      const isFlor = person === 'flor' ? !currentDay.flor : !!currentDay.flor;
      const isTereque = person === 'tereque' ? !currentDay.tereque : !!currentDay.tereque;

      const newState: Record<number, DayProgress> = {
        ...prev,
        [dayNum]: {
          flor: isFlor,
          tereque: isTereque,
        },
      };

      // Immediate synchronous persistence
      try {
        localStorage.setItem(STORAGE_CHECKS_KEY, JSON.stringify(newState));
        localStorage.setItem('desafioBiblicoProgress', JSON.stringify(newState));
      } catch (err) {
        console.error('Immediate save failed:', err);
      }

      // If both completed just now, trigger team celebration!
      const wasBothCheckedBefore = !!currentDay.flor && !!currentDay.tereque;
      const isBothCheckedNow = isFlor && isTereque;

      if (isBothCheckedNow && !wasBothCheckedBefore) {
        triggerCelebration(dayNum);
      }

      return newState;
    });
  };

  const triggerCelebration = (dayNum: number) => {
    const messages = [
      '¡Qué bendición avanzar juntos leyendo el Evangelio de Mateo!',
      '¡Un paso más cerca de Jesús, y en verdadero equipo de amor!',
      '¡La fe y la comunión crecen al compartir la Palabra de Dios!',
      '¡Excelente capítulo completado juntos hoy! Que dé frutos abundantes.',
      '¡El Señor bendice grandemente su constancia y devoción mutua!',
      '«Estaré con ustedes todos los días» — ¡Adelante en la presencia del Señor!',
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setCelebration({ day: dayNum, message: randomMsg });
  };

  const updateAnswer = (weekIdx: number, person: 'flor' | 'tereque', text: string) => {
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [weekIdx]: {
          ...(prev[weekIdx] || {}),
          [person]: text,
        },
      };
      try {
        localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(updated));
        localStorage.setItem('desafioBiblicoAnswers', JSON.stringify(updated));
      } catch (err) {
        console.error('Immediate answers save failed:', err);
      }
      return updated;
    });
  };

  const handleSaveNames = (newNames: PartnerNames) => {
    setPartnerNames(newNames);
    try {
      localStorage.setItem(STORAGE_NAMES_KEY, JSON.stringify(newNames));
      localStorage.setItem('desafioBiblicoNames', JSON.stringify(newNames));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        '¿Estás seguro de que deseas reiniciar los checks de los 14 días (28 capítulos)? (Tus reflexiones escritas NO se borrarán)'
      )
    ) {
      const emptyState = {};
      setCheckedDays(emptyState);
      try {
        localStorage.setItem(STORAGE_CHECKS_KEY, JSON.stringify(emptyState));
        localStorage.setItem('desafioBiblicoProgress', JSON.stringify(emptyState));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Calculations for 14 days (28 consecutive chapters of Matthew at 2 chapters/day)
  const totalDays = 14;
  let completedFlor = 0;
  let completedTereque = 0;
  let completedBothDays = 0;

  for (let i = 1; i <= totalDays; i++) {
    const dayState = checkedDays[i];
    if (dayState?.flor) completedFlor++;
    if (dayState?.tereque) completedTereque++;
    if (dayState?.flor && dayState?.tereque) completedBothDays++;
  }

  const totalCompleted = completedFlor + completedTereque;
  const progressPercent = Math.round((totalCompleted / (totalDays * 2)) * 100);
  const isFullyCompleted = progressPercent === 100;

  // Filtered sections
  const displayedSections =
    selectedWeekFilter === 'all'
      ? challengeData
      : challengeData.filter((_, idx) => idx === selectedWeekFilter);

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-slate-800 font-sans selection:bg-rose-200">
      {/* Interactive web application content (hidden when printing) */}
      <div className="no-print">
        {/* Top Floating Badge for Desktop */}
        <header className="pt-8 pb-4 px-4 max-w-5xl mx-auto text-center relative">
          <div className="hidden md:flex absolute top-6 right-4 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 px-4 py-2.5 rounded-2xl shadow-xs border border-rose-200/80 transform rotate-2 flex-col items-center justify-center">
            <span className="font-bold text-[10px] uppercase tracking-wider text-rose-500">
              Ritmo Diario
            </span>
            <span className="font-bold text-xs leading-tight">2 capítulos por día</span>
            <span className="font-bold text-xs leading-tight">en pareja</span>
            <Heart className="w-3.5 h-3.5 mt-1 text-rose-500 fill-rose-500" />
          </div>

          {/* Title Header */}
          <div className="flex justify-center items-center gap-3 mb-2">
            <div className="p-2.5 sm:p-3.5 bg-white rounded-2xl shadow-xs border border-slate-200 text-slate-700">
              <BookOpen className="w-8 h-8 sm:w-11 sm:h-11 text-[#1a2f4c]" />
            </div>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-rose-600 block">
                28 Capítulos de Mateo · 2 Capítulos al Día
              </span>
              <h1
                className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1a2f4c] tracking-tight leading-none"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Desafío de Mateo
              </h1>
            </div>
          </div>

          <div
            className="flex justify-center items-center gap-3 text-lg sm:text-2xl md:text-3xl font-semibold text-rose-500 my-2"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-rose-400 text-rose-400" />
            <span>2 capítulos por día en pareja</span>
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-rose-400 text-rose-400" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto bg-white/80 backdrop-blur-xs py-1.5 px-5 rounded-full shadow-xs border border-slate-200 inline-flex items-center gap-2">
            <span>14 días para completar todo el Evangelio de Mateo juntos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          </p>

          {/* Action buttons bar (PDF, Nombres, Compartir Notas, Reiniciar) */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-4">
            {/* Main PDF Certificate Button */}
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              title="Ver y descargar certificado en PDF con todas las reflexiones"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>Certificado & PDF</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </button>

            <button
              onClick={() => setIsNamesModalOpen(true)}
              className="px-3.5 py-2 rounded-full bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:text-rose-600 border border-slate-200 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Personalizar nombres de la pareja"
            >
              <UserCheck className="w-4 h-4 text-rose-500" />
              <span>{partnerNames.flor} & {partnerNames.tereque}</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 rounded-full bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:text-sky-600 border border-slate-200 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Compartir o exportar reflexiones en texto"
            >
              <Share2 className="w-4 h-4 text-sky-500" />
              <span>Copiar Texto</span>
            </button>

            <button
              onClick={handleResetProgress}
              className="px-3 py-2 rounded-full bg-white text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-600 border border-slate-200 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reiniciar checks de lecturas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Checks</span>
            </button>
          </div>

          {/* Global Progress Dashboard Card */}
          <div className="max-w-2xl mx-auto mt-6 bg-white p-5 sm:p-6 rounded-3xl shadow-xs border border-rose-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-left">
                  Progreso Conjunto (Mateo 1 al 28 · 14 Días)
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-800">
                  {totalCompleted} de 28 lecturas completadas ({completedFlor + completedTereque > 0 ? (completedFlor + completedTereque) : 0} / 28)
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-2xl font-black text-rose-600">{progressPercent}%</span>
              </div>
            </div>

            {/* Combined Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/50">
              <div
                className="bg-gradient-to-r from-rose-400 via-purple-400 to-sky-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Individual Breakdown Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 pt-3 border-t border-slate-100 text-center">
              <div className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                <div className="flex items-center justify-center gap-1 text-rose-600 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="truncate">{partnerNames.flor}</span>
                </div>
                <span className="text-lg font-black text-rose-900 mt-0.5 block">
                  {completedFlor}/14
                </span>
                <span className="text-[11px] text-rose-700 font-medium">
                  {completedFlor * 2} caps ({Math.round((completedFlor / 14) * 100)}%)
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center justify-center gap-1 text-amber-700 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Días Juntos</span>
                </div>
                <span className="text-lg font-black text-amber-900 mt-0.5 block">
                  {completedBothDays}/14
                </span>
                <span className="text-[11px] text-amber-700 font-medium">
                  Sincronizados
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <div className="flex items-center justify-center gap-1 text-sky-600 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span className="truncate">{partnerNames.tereque}</span>
                </div>
                <span className="text-lg font-black text-sky-900 mt-0.5 block">
                  {completedTereque}/14
                </span>
                <span className="text-[11px] text-sky-700 font-medium">
                  {completedTereque * 2} caps ({Math.round((completedTereque / 14) * 100)}%)
                </span>
              </div>
            </div>

            {/* Completion celebratory card */}
            {isFullyCompleted && (
              <div className="mt-5 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-2 animate-bounce">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-base">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>¡Gloria a Dios! ¡Completaron los 28 Capítulos de Mateo!</span>
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-emerald-700">
                  Ya pueden generar y guardar su Certificado Devocional de Recuerdo en PDF.
                </p>
                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Ver y Descargar Certificado Oficial</span>
                </button>
              </div>
            )}
          </div>

          {/* Week Filter Chips */}
          <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-6">
            <button
              onClick={() => setSelectedWeekFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedWeekFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todos los 14 Días (28 Capítulos)
            </button>
            {challengeData.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedWeekFilter(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedWeekFilter === idx
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {typeof sec.week === 'number' ? `Semana ${sec.week}` : sec.week}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 pb-16 space-y-6">
          {/* Weekly Challenge Cards */}
          {displayedSections.map((section) => {
            const originalIdx = challengeData.findIndex((s) => s.week === section.week);
            return (
              <WeekCard
                key={originalIdx}
                section={section}
                sectionIdx={originalIdx}
                checkedDays={checkedDays}
                onToggleDay={toggleDay}
                answers={answers}
                onUpdateAnswer={updateAnswer}
                partnerNames={partnerNames}
                onOpenReading={(day) => setActiveReadingModal(day)}
              />
            );
          })}

          {/* Lower Inspiration & Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* Tip Diario */}
            <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 text-center shadow-xs flex flex-col justify-center">
              <div className="flex justify-center items-center gap-2 mb-2 text-rose-600">
                <Heart className="w-5 h-5 fill-rose-500" />
                <h3 className="font-bold text-rose-900 text-base">Oración para Mateo</h3>
              </div>
              <p className="text-xs sm:text-sm text-rose-950 leading-relaxed">
                Antes de comenzar cada capítulo:
                <br />
                <span className="font-serif italic font-semibold text-rose-800 block mt-2">
                  "Señor Jesús, háblame a través de tu Palabra y ayúdanos a vivir según tu Evangelio".
                </span>
              </p>
            </div>

            {/* Central Verse / Love Letter Card */}
            <div className="bg-white border-2 border-dashed border-rose-200 rounded-3xl p-6 text-center shadow-xs flex flex-col justify-center items-center">
              <p
                className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                «Y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo.»
                <span className="text-xs font-bold text-rose-600 mt-2 block tracking-wider uppercase">
                  — Mateo 28:20
                </span>
              </p>
              <Heart className="w-5 h-5 text-rose-300 mt-3 animate-pulse fill-rose-300" />
            </div>

            {/* Sugerencias */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 shadow-xs flex flex-col justify-center">
              <h3 className="font-bold text-emerald-900 mb-3 flex items-center justify-center md:justify-start gap-2 text-base">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Consejos devocionales</span>
              </h3>
              <ul className="text-xs sm:text-sm text-emerald-950 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>Leé 1 capítulo completo cada día en orden consecutivo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>Tus checks y reflexiones quedan guardados de forma permanente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span className="font-semibold text-emerald-900">
                    ¡Caminen juntos de la mano de Cristo!
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center pt-8 pb-4 text-rose-500 font-medium flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
              <span>¡Ustedes pueden! 28 capítulos transformarán sus vidas</span>
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            </div>
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 underline underline-offset-4 mt-1 transition-colors cursor-pointer"
            >
              Imprimir o descargar Certificado de Mateo en PDF
            </button>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <CelebrationModal
        celebration={celebration}
        onClose={() => setCelebration(null)}
        partnerNames={partnerNames}
      />

      <BiblePassageModal
        day={activeReadingModal}
        onClose={() => setActiveReadingModal(null)}
      />

      <PartnerNamesModal
        isOpen={isNamesModalOpen}
        onClose={() => setIsNamesModalOpen(false)}
        partnerNames={partnerNames}
        onSave={handleSaveNames}
      />

      <ShareNotesModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        partnerNames={partnerNames}
        challengeData={challengeData}
        checkedDays={checkedDays}
        answers={answers}
      />

      <CertificatePdfModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        partnerNames={partnerNames}
        challengeData={challengeData}
        checkedDays={checkedDays}
        answers={answers}
      />
    </div>
  );
}
