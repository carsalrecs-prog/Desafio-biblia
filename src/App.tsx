import React, { useState, useEffect } from 'react';
import {
  Heart,
  BookOpen,
  Sparkles,
  RotateCcw,
  Share2,
  UserCheck,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  Filter,
} from 'lucide-react';
import { challengeData } from './data/challengeData';
import { DayItem, DayProgress, PartnerNames, ReflectionAnswers } from './types';
import { WeekCard } from './components/WeekCard';
import { CelebrationModal } from './components/CelebrationModal';
import { BiblePassageModal } from './components/BiblePassageModal';
import { PartnerNamesModal } from './components/PartnerNamesModal';
import { ShareNotesModal } from './components/ShareNotesModal';

export default function App() {
  // State for checked days
  const [checkedDays, setCheckedDays] = useState<Record<number, DayProgress>>({});
  const [answers, setAnswers] = useState<Record<number, ReflectionAnswers>>({});
  const [partnerNames, setPartnerNames] = useState<PartnerNames>({
    flor: 'Flor de desierto',
    tereque: 'TEREQUE',
  });
  const [mounted, setMounted] = useState(false);
  const [celebration, setCelebration] = useState<{ day: number; message: string } | null>(null);

  // Modals & filters
  const [activeReadingModal, setActiveReadingModal] = useState<DayItem | null>(null);
  const [isNamesModalOpen, setIsNamesModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');

  // Load saved progress on launch
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('desafioBiblicoProgress');
      if (savedProgress) {
        setCheckedDays(JSON.parse(savedProgress));
      }

      const savedAnswers = localStorage.getItem('desafioBiblicoAnswers');
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }

      const savedNames = localStorage.getItem('desafioBiblicoNames');
      if (savedNames) {
        setPartnerNames(JSON.parse(savedNames));
      }
    } catch (e) {
      console.error('Error loading saved state', e);
    }
    setMounted(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('desafioBiblicoProgress', JSON.stringify(checkedDays));
      localStorage.setItem('desafioBiblicoAnswers', JSON.stringify(answers));
      localStorage.setItem('desafioBiblicoNames', JSON.stringify(partnerNames));
    }
  }, [checkedDays, answers, partnerNames, mounted]);

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
      '¡Qué hermoso avanzar juntos en la presencia del Señor!',
      '¡Un pasito más cerca de Dios, y en verdadero equipo!',
      '¡El amor y la fe crecen al compartir Su bendita palabra!',
      '¡Excelente lectura juntos hoy! Que dé frutos abundantes.',
      '¡Dios bendice grandemente su constancia y devoción!',
      '¡Juntos iluminan su camino con la verdad de Dios!',
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setCelebration({ day: dayNum, message: randomMsg });
  };

  const updateAnswer = (weekIdx: number, person: 'flor' | 'tereque', text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [weekIdx]: {
        ...(prev[weekIdx] || {}),
        [person]: text,
      },
    }));
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        '¿Estás seguro de que querés reiniciar el progreso de lecturas? (Las notas de reflexión no se borrarán)'
      )
    ) {
      setCheckedDays({});
    }
  };

  // Calculations
  let completedFlor = 0;
  let completedTereque = 0;
  let completedBothDays = 0;

  for (let i = 1; i <= 30; i++) {
    const dayState = checkedDays[i];
    if (dayState?.flor) completedFlor++;
    if (dayState?.tereque) completedTereque++;
    if (dayState?.flor && dayState?.tereque) completedBothDays++;
  }

  const totalCompleted = completedFlor + completedTereque;
  const progressPercent = Math.round((totalCompleted / 60) * 100);

  // Filtered sections
  const displayedSections =
    selectedWeekFilter === 'all'
      ? challengeData
      : challengeData.filter((_, idx) => idx === selectedWeekFilter);

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-slate-800 font-sans selection:bg-rose-200">
      {/* Top Floating Badge for Desktop */}
      <header className="pt-8 pb-4 px-4 max-w-5xl mx-auto text-center relative">
        <div className="hidden md:flex absolute top-6 right-4 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 px-4 py-2.5 rounded-2xl shadow-sm border border-rose-200/80 transform rotate-2 flex-col items-center justify-center">
          <span className="font-bold text-xs uppercase tracking-wider text-rose-500">
            Lema devocional
          </span>
          <span className="font-bold text-sm leading-tight">Cada día, un paso más</span>
          <span className="font-bold text-sm leading-tight">cerca de Él</span>
          <Heart className="w-3.5 h-3.5 mt-1 text-rose-500 fill-rose-500" />
        </div>

        {/* Title Header */}
        <div className="flex justify-center items-center gap-3 mb-2">
          <div className="p-2.5 sm:p-3.5 bg-white rounded-2xl shadow-sm border border-slate-200/80 text-slate-700">
            <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-[#1a2f4c]" />
          </div>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1a2f4c] tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Desafío Bíblico
          </h1>
        </div>

        <div
          className="flex justify-center items-center gap-3 text-xl sm:text-3xl md:text-4xl font-semibold text-rose-500 mb-3"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          <Heart className="w-5 h-5 sm:w-7 sm:h-7 fill-rose-400 text-rose-400" />
          <span>de 30 días</span>
          <Heart className="w-5 h-5 sm:w-7 sm:h-7 fill-rose-400 text-rose-400" />
        </div>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto bg-white/70 backdrop-blur-xs py-2 px-5 rounded-full shadow-xs border border-slate-200/70 inline-flex items-center gap-2">
          <span>30 días para conocer más a Dios a través de su Palabra</span>
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 flex-shrink-0" />
        </p>

        {/* Action buttons bar (Personalizar Nombres, Compartir Notas, Reiniciar) */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-5">
          <button
            onClick={() => setIsNamesModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:text-rose-600 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
            title="Personalizar nombres de la pareja"
          >
            <UserCheck className="w-4 h-4 text-rose-500" />
            <span>Nombres: {partnerNames.flor} & {partnerNames.tereque}</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:text-sky-600 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
            title="Compartir o exportar reflexiones"
          >
            <Share2 className="w-4 h-4 text-sky-500" />
            <span>Compartir Reflexiones</span>
          </button>

          <button
            onClick={handleResetProgress}
            className="px-3.5 py-1.5 rounded-full bg-white text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-700 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
            title="Reiniciar checks"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Checks</span>
          </button>
        </div>

        {/* Global Progress Dashboard Card */}
        <div className="max-w-2xl mx-auto mt-6 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-rose-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-left">
                Progreso Conjunto
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-800">
                {totalCompleted} de 60 lecturas completadas
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
            <div className="p-2 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center justify-center gap-1 text-rose-600 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="truncate">{partnerNames.flor}</span>
              </div>
              <span className="text-lg font-black text-rose-900 mt-0.5 block">
                {completedFlor}/30
              </span>
              <span className="text-[11px] text-rose-700 font-medium">
                {Math.round((completedFlor / 30) * 100)}%
              </span>
            </div>

            <div className="p-2 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center justify-center gap-1 text-amber-700 font-bold text-xs">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Días Juntos</span>
              </div>
              <span className="text-lg font-black text-amber-900 mt-0.5 block">
                {completedBothDays}/30
              </span>
              <span className="text-[11px] text-amber-700 font-medium">
                Sincronizados
              </span>
            </div>

            <div className="p-2 rounded-2xl bg-sky-50/60 border border-sky-100">
              <div className="flex items-center justify-center gap-1 text-sky-600 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span className="truncate">{partnerNames.tereque}</span>
              </div>
              <span className="text-lg font-black text-sky-900 mt-0.5 block">
                {completedTereque}/30
              </span>
              <span className="text-[11px] text-sky-700 font-medium">
                {Math.round((completedTereque / 30) * 100)}%
              </span>
            </div>
          </div>

          {progressPercent === 100 && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>¡Gloria a Dios! Han completado los 30 días del desafío bíblico juntos.</span>
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
          )}
        </div>

        {/* Week Filter Chips */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-6">
          <button
            onClick={() => setSelectedWeekFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedWeekFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Ver Todas las Semanas
          </button>
          {challengeData.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWeekFilter(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
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
          // Find original index in challengeData
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
              <h3 className="font-bold text-rose-900 text-base">Tip diario</h3>
            </div>
            <p className="text-sm text-rose-950 leading-relaxed">
              Antes de leer, hacé una oración simple:
              <br />
              <span className="font-serif italic font-semibold text-rose-800 block mt-2">
                "Dios, hablame a través de tu palabra y ayudame a entenderla".
              </span>
            </p>
          </div>

          {/* Central Verse / Love Letter Card */}
          <div className="bg-white border-2 border-dashed border-rose-200 rounded-3xl p-6 text-center shadow-xs flex flex-col justify-center items-center">
            <p
              className="text-base font-medium text-slate-700 leading-relaxed"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              La Biblia no es solo un libro para leer,
              <span className="text-xl sm:text-2xl font-bold text-rose-500 mt-2 block leading-tight">
                es una carta de amor de Dios para vos.
              </span>
            </p>
            <Heart className="w-6 h-6 text-rose-300 mt-4 animate-pulse fill-rose-300" />
          </div>

          {/* Sugerencias */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 shadow-xs flex flex-col justify-center">
            <h3 className="font-bold text-emerald-900 mb-3 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Sugerencias para el viaje</span>
            </h3>
            <ul className="text-xs sm:text-sm text-emerald-950 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>Leé 1 capítulo por día con calma y atención.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>Tomate unos minutos para reflexionar y orar juntos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span className="font-semibold text-emerald-900">
                  ¡No se trata de correr, sino de conectar con Dios!
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 pb-4 text-rose-500 font-medium flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
          <span>¡Ustedes pueden! 30 días transformarán sus corazones</span>
          <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
        </footer>
      </main>

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
        onSave={(newNames) => setPartnerNames(newNames)}
      />

      <ShareNotesModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        partnerNames={partnerNames}
        challengeData={challengeData}
        checkedDays={checkedDays}
        answers={answers}
      />
    </div>
  );
}
