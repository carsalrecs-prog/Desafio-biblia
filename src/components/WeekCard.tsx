import React from 'react';
import { Check, Heart, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { WeekChallenge, DayProgress, PartnerNames, ReflectionAnswers, DayItem } from '../types';

interface WeekCardProps {
  section: WeekChallenge;
  sectionIdx: number;
  checkedDays: Record<number, DayProgress>;
  onToggleDay: (dayNum: number, person: 'flor' | 'tereque') => void;
  answers: Record<number, ReflectionAnswers>;
  onUpdateAnswer: (weekIdx: number, person: 'flor' | 'tereque', text: string) => void;
  partnerNames: PartnerNames;
  onOpenReading: (day: DayItem) => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({
  section,
  sectionIdx,
  checkedDays,
  onToggleDay,
  answers,
  onUpdateAnswer,
  partnerNames,
  onOpenReading,
}) => {
  // Count week completed
  const totalDaysInWeek = section.days.length;
  let florWeekCompleted = 0;
  let terequeWeekCompleted = 0;
  let bothWeekCompleted = 0;

  section.days.forEach((day) => {
    const dayState = checkedDays[day.num] || { flor: false, tereque: false };
    if (dayState.flor) florWeekCompleted++;
    if (dayState.tereque) terequeWeekCompleted++;
    if (dayState.flor && dayState.tereque) bothWeekCompleted++;
  });

  const hasFlorReflection = !!answers[sectionIdx]?.flor;
  const hasTerequeReflection = !!answers[sectionIdx]?.tereque;

  return (
    <section
      id={`week-section-${sectionIdx}`}
      className={`${section.theme.bg} ${section.theme.border} border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row`}
    >
      {/* Left Column: Week Title & Info */}
      <div
        className={`p-6 lg:w-[25%] flex flex-col justify-between items-center text-center border-b lg:border-b-0 lg:border-r ${section.theme.border} bg-white/50 backdrop-blur-xs`}
      >
        <div className="flex flex-col items-center w-full">
          <div
            className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest text-white mb-3 shadow-xs ${section.theme.accentBg}`}
          >
            {typeof section.week === 'number' ? `SEMANA ${section.week}` : section.week}
          </div>
          <h2
            className={`text-xl sm:text-2xl font-bold mb-2 ${section.theme.text}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {section.title}
          </h2>
          {section.subtitle && (
            <p className={`text-xs sm:text-sm ${section.theme.lightText} max-w-xs leading-relaxed`}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Week progress summary */}
        <div className="mt-4 pt-3 border-t border-black/5 w-full text-xs font-semibold text-slate-600 flex justify-around">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>{partnerNames.flor.split(' ')[0]}: {florWeekCompleted}/{totalDaysInWeek}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>{partnerNames.tereque.split(' ')[0]}: {terequeWeekCompleted}/{totalDaysInWeek}</span>
          </div>
        </div>
      </div>

      {/* Middle Column: Daily Readings & Dual Checkbox */}
      <div
        className={`p-4 sm:p-5 lg:w-[41%] flex flex-col justify-between border-b lg:border-b-0 lg:border-r ${section.theme.border}`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-black/5 text-xs font-bold uppercase tracking-wider text-slate-500 px-2">
            <span>Capítulos de Mateo</span>
            <div className="flex gap-4">
              <span className="text-rose-600 w-8 text-center truncate" title={partnerNames.flor}>
                {partnerNames.flor.charAt(0) || 'F'}
              </span>
              <span className="text-sky-600 w-8 text-center truncate" title={partnerNames.tereque}>
                {partnerNames.tereque.charAt(0) || 'T'}
              </span>
            </div>
          </div>

          {section.days.map((day) => {
            const dayState = checkedDays[day.num] || { flor: false, tereque: false };
            const isFlor = !!dayState.flor;
            const isTereque = !!dayState.tereque;
            const bothChecked = isFlor && isTereque;

            return (
              <div
                key={day.num}
                id={`day-row-${day.num}`}
                className={`flex items-center justify-between py-2 px-2.5 rounded-2xl transition-all ${
                  bothChecked
                    ? 'bg-white/80 border border-emerald-200/60 text-slate-500'
                    : 'bg-white/40 hover:bg-white/70 border border-transparent text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 transition-all duration-300 ${
                      bothChecked ? section.theme.circleChecked : section.theme.circleUnchecked
                    }`}
                  >
                    {bothChecked ? <Check className="w-4 h-4" /> : day.num}
                  </div>

                  <button
                    onClick={() => onOpenReading(day)}
                    className="text-left group flex flex-col hover:opacity-80 transition-opacity truncate flex-1 cursor-pointer"
                    title="Ver pasaje bíblico y tema"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm sm:text-base font-semibold truncate ${
                          bothChecked ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {day.reading}
                      </span>
                      <BookOpen className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 text-slate-500 flex-shrink-0 transition-opacity" />
                    </div>
                    {day.topic && (
                      <span className="text-[11px] text-slate-500 group-hover:text-slate-700 truncate leading-tight">
                        {day.topic}
                      </span>
                    )}
                  </button>
                </div>

                {/* Check buttons for both partners */}
                <div className="flex gap-2 flex-shrink-0 items-center">
                  <button
                    onClick={() => onToggleDay(day.num, 'flor')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ${
                      isFlor
                        ? 'bg-rose-500 border-rose-500 text-white shadow-xs'
                        : 'bg-rose-50/90 border-rose-200 text-rose-500 hover:bg-rose-100 hover:border-rose-300'
                    }`}
                    title={`Marcar para ${partnerNames.flor}`}
                    aria-label={`Marcar día ${day.num} para ${partnerNames.flor}`}
                  >
                    {isFlor ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-black">
                        {partnerNames.flor.charAt(0) || 'F'}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleDay(day.num, 'tereque')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ${
                      isTereque
                        ? 'bg-sky-500 border-sky-500 text-white shadow-xs'
                        : 'bg-sky-50/90 border-sky-200 text-sky-600 hover:bg-sky-100 hover:border-sky-300'
                    }`}
                    title={`Marcar para ${partnerNames.tereque}`}
                    aria-label={`Marcar día ${day.num} para ${partnerNames.tereque}`}
                  >
                    {isTereque ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-black">
                        {partnerNames.tereque.charAt(0) || 'T'}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Weekly Reflections & Notes */}
      <div className="p-5 sm:p-6 lg:w-[34%] bg-white/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold text-base sm:text-lg flex items-center gap-2 ${section.theme.lightText}`}>
              <Sparkles className="w-4 h-4 text-amber-500" /> Reflexionen juntos:
            </h3>
            <span className="text-[11px] text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Guardado
            </span>
          </div>

          <ul className="space-y-1.5 mb-4">
            {section.reflections.map((ref, i) => (
              <li key={i} className="flex items-start text-xs sm:text-sm text-slate-700 leading-snug">
                <span
                  className={`mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${section.theme.accentBg}`}
                />
                <span>{ref}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reflection journals for both partners */}
        <div className="space-y-3 pt-2">
          {/* Partner 1 (Flor) */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1 ml-1">
              <label className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>{partnerNames.flor}</span>
              </label>
              {hasFlorReflection && (
                <span className="text-[10px] text-rose-600 font-semibold">Guardado</span>
              )}
            </div>
            <textarea
              value={answers[sectionIdx]?.flor || ''}
              onChange={(e) => onUpdateAnswer(sectionIdx, 'flor', e.target.value)}
              placeholder={`Reflexiones y notas de ${partnerNames.flor}...`}
              rows={2}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all resize-y min-h-[68px] placeholder:text-rose-400/70 shadow-xs"
            />
          </div>

          {/* Partner 2 (Tereque) */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1 ml-1">
              <label className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>{partnerNames.tereque}</span>
              </label>
              {hasTerequeReflection && (
                <span className="text-[10px] text-sky-600 font-semibold">Guardado</span>
              )}
            </div>
            <textarea
              value={answers[sectionIdx]?.tereque || ''}
              onChange={(e) => onUpdateAnswer(sectionIdx, 'tereque', e.target.value)}
              placeholder={`Reflexiones y notas de ${partnerNames.tereque}...`}
              rows={2}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-200 bg-sky-50/70 text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all resize-y min-h-[68px] placeholder:text-sky-400/70 shadow-xs"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
