import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Printer,
  X,
  Sparkles,
  Heart,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Loader2,
  Layers,
  FileCheck,
  Flame,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WeekChallenge, PartnerNames, DayProgress, ReflectionAnswers } from '../types';

interface CertificatePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerNames: PartnerNames;
  challengeData: WeekChallenge[];
  checkedDays: Record<number, DayProgress>;
  answers: Record<number, ReflectionAnswers>;
}

export const CertificatePdfModal: React.FC<CertificatePdfModalProps> = ({
  isOpen,
  onClose,
  partnerNames,
  challengeData,
  checkedDays,
  answers,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionDate, setCompletionDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });
  const [customDedication, setCustomDedication] = useState(
    'Por haber caminado juntos a través de los 28 capítulos del Santo Evangelio de Mateo, fortaleciendo su fe, su amor y su devoción mutua a los pies de Jesús.'
  );
  const [activeTab, setActiveTab] = useState<'all' | 'certificate' | 'checklist' | 'reflections'>('all');

  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Calculate statistics for all 28 chapters
  let totalFlor = 0;
  let totalTereque = 0;
  let synchronizedDays = 0;

  for (let i = 1; i <= 28; i++) {
    const d = checkedDays[i];
    if (d?.flor) totalFlor++;
    if (d?.tereque) totalTereque++;
    if (d?.flor && d?.tereque) synchronizedDays++;
  }

  const totalReadings = totalFlor + totalTereque;
  const progressPercent = Math.round((totalReadings / 56) * 100);

  // Download PDF handler using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      const element = printRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1000,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add remaining pages if content overflows A4 height
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const modeName =
        activeTab === 'certificate'
          ? 'Certificado'
          : activeTab === 'checklist'
          ? 'Lecturas_Mateo'
          : activeTab === 'reflections'
          ? 'Reflexiones'
          : 'Album_Completo';

      const fileName = `Desafio_Mateo_${modeName}_${partnerNames.flor}_y_${partnerNames.tereque}.pdf`
        .replace(/\s+/g, '_');
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un inconveniente al generar el archivo. Podés pulsar el botón "Imprimir" y elegir "Guardar como PDF".');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showCertificate = activeTab === 'all' || activeTab === 'certificate';
  const showChecklist = activeTab === 'all' || activeTab === 'checklist';
  const showReflections = activeTab === 'all' || activeTab === 'reflections';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto printable-modal-overlay">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs no-print"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden printable-modal-card"
        >
          {/* Header (No print) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-[#FFFDFB] gap-3 no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span>Certificado & Álbum de Mateo</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h2>
                <p className="text-xs text-slate-500">
                  Imprimí o descargá en PDF el certificado de los 28 capítulos y sus reflexiones
                </p>
              </div>
            </div>

            {/* Actions: Print / Download PDF / Close */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Imprimir o guardar como PDF"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Imprimir</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-rose-200 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generando PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Descargar PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Configuration toolbar (No print) */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-600">Fecha de entrega:</span>
                <input
                  type="text"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rose-400"
                  placeholder="Fecha de culminación"
                />
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Pareja: <strong>{partnerNames.flor} & {partnerNames.tereque}</strong></span>
              </div>
            </div>

            {/* View / Print scope tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todo el Álbum
              </button>
              <button
                onClick={() => setActiveTab('certificate')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'certificate'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Solo Certificado
              </button>
              <button
                onClick={() => setActiveTab('checklist')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'checklist'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                28 Capítulos
              </button>
              <button
                onClick={() => setActiveTab('reflections')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'reflections'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reflexiones
              </button>
            </div>
          </div>

          {/* Scrollable Printable Document Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center printable-content-wrapper">
            <div
              ref={printRef}
              id="printable-keepsake-album"
              className="printable-document bg-white w-full max-w-[850px] shadow-lg rounded-2xl p-6 sm:p-10 text-slate-800 space-y-10 border border-slate-200"
            >
              {/* PAGE 1: DIPLOMA / CERTIFICATE OF COMPLETION */}
              {showCertificate && (
                <div className="certificate-page relative border-[6px] border-double border-amber-400/90 rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#FFFDF9] via-[#FFFAF4] to-[#FFF8F2] text-center overflow-hidden shadow-xs">
                  {/* Decorative background corners */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

                  {/* Header Badge */}
                  <div>
                    <div className="flex justify-center mb-2">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center shadow-md">
                        <Award className="w-8 h-8 sm:w-9 sm:h-9" />
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-amber-800 mb-1">
                      Certificado de Culminación Devocional
                    </p>

                    <h1
                      className="text-3xl sm:text-5xl font-black text-[#1a2f4c] tracking-tight mb-2"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      El Evangelio de Mateo
                    </h1>

                    <div className="flex items-center justify-center gap-3 my-2">
                      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-rose-300" />
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-rose-300" />
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 italic font-serif mt-2 mb-3">
                      Se otorga con bendición, gozo y gratitud a:
                    </p>

                    {/* Partner Names Highlight */}
                    <div className="my-3 py-3 px-6 sm:px-8 bg-white/95 rounded-2xl border border-rose-200/80 inline-block shadow-xs">
                      <h2
                        className="text-2xl sm:text-4xl font-extrabold text-rose-600 tracking-wide"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {partnerNames.flor} & {partnerNames.tereque}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed mt-2 mb-5">
                      {customDedication}
                    </p>
                  </div>

                  {/* Statistics Highlights */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto my-4 p-3 bg-white/95 rounded-2xl border border-amber-200/80 shadow-xs text-center">
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Lecturas Totales
                      </span>
                      <span className="text-lg sm:text-xl font-black text-rose-600">
                        {totalReadings}/56
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Capítulos Juntos
                      </span>
                      <span className="text-lg sm:text-xl font-black text-amber-600">
                        {synchronizedDays}/28
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Cumplimiento
                      </span>
                      <span className="text-lg sm:text-xl font-black text-emerald-600">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Scripture Quote */}
                  <div className="my-4 p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 max-w-xl mx-auto">
                    <p className="text-xs sm:text-sm font-serif italic text-amber-950">
                      «Y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.»
                    </p>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mt-1 block">
                      — Mateo 28:20
                    </span>
                  </div>

                  {/* Signatures and Date */}
                  <div className="pt-4 border-t border-slate-200/90">
                    <div className="grid grid-cols-2 gap-8 max-w-md mx-auto text-center">
                      <div>
                        <div className="h-8 flex items-end justify-center">
                          <span className="font-serif italic text-sm sm:text-base text-rose-600 font-semibold truncate px-2">
                            {partnerNames.flor}
                          </span>
                        </div>
                        <div className="border-t border-slate-400 mt-1 pt-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Firma Devocional
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="h-8 flex items-end justify-center">
                          <span className="font-serif italic text-sm sm:text-base text-sky-600 font-semibold truncate px-2">
                            {partnerNames.tereque}
                          </span>
                        </div>
                        <div className="border-t border-slate-400 mt-1 pt-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Firma Devocional
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-[11px] text-slate-500">
                      Culminado el <span className="font-semibold text-slate-700">{completionDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: 28 DAYS READING RECORD */}
              {showChecklist && (
                <div className={`${showCertificate ? 'print-page-break' : ''} pt-2`}>
                  <div className="text-center pb-4 border-b border-slate-200 mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
                      <BookOpen className="w-3.5 h-3.5" /> Registro Consecutivo
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                      Los 28 Capítulos de Mateo
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Lectura devocional compartida por {partnerNames.flor} y {partnerNames.tereque}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {challengeData.map((week, wIdx) => (
                      <div key={wIdx} className="print-avoid-break p-4 rounded-2xl border border-slate-200 bg-[#FAFAFA]">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                          <h3 className="font-bold text-sm sm:text-base text-slate-800">
                            {typeof week.week === 'number' ? `Semana ${week.week}:` : `${week.week}:`} {week.title}
                          </h3>
                          <div className="flex gap-4 text-xs font-bold">
                            <span className="text-rose-600">{partnerNames.flor.split(' ')[0]}</span>
                            <span className="text-sky-600">{partnerNames.tereque.split(' ')[0]}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {week.days.map((day) => {
                            const state = checkedDays[day.num] || { flor: false, tereque: false };
                            return (
                              <div
                                key={day.num}
                                className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0 pr-2">
                                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                                    {day.num}
                                  </span>
                                  <div className="truncate">
                                    <span className="font-medium text-slate-800 block truncate">{day.reading}</span>
                                    {day.topic && (
                                      <span className="text-[10px] text-slate-400 block truncate">{day.topic}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-3 items-center flex-shrink-0">
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                      state.flor
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                                  >
                                    {state.flor ? '✓' : '—'}
                                  </span>
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                      state.tereque
                                        ? 'bg-sky-500 text-white'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                                  >
                                    {state.tereque ? '✓' : '—'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAGE 3: KEEPSAKE DEVOTIONAL REFLECTIONS */}
              {showReflections && (
                <div className={`${(showCertificate || showChecklist) ? 'print-page-break' : ''} pt-2`}>
                  <div className="text-center pb-4 border-b border-slate-200 mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
                      <Heart className="w-3.5 h-3.5 fill-purple-500" /> Diario Devocional de la Pareja
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                      Nuestras Reflexiones de Mateo
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Pensamientos, oraciones y testimonios guardados durante los 28 capítulos
                    </p>
                  </div>

                  <div className="space-y-6">
                    {challengeData.map((week, idx) => {
                      const ansFlor = answers[idx]?.flor;
                      const ansTereque = answers[idx]?.tereque;

                      return (
                        <div
                          key={idx}
                          className="print-avoid-break p-5 rounded-2xl border border-slate-200 bg-[#FFFDFB] space-y-4 shadow-xs"
                        >
                          <div className="border-b border-slate-200 pb-2">
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                              {typeof week.week === 'number' ? `Semana ${week.week}` : week.week}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                              {week.title}
                            </h3>
                            {week.subtitle && (
                              <p className="text-xs text-slate-500 italic mt-0.5">{week.subtitle}</p>
                            )}
                          </div>

                          {/* Reflections of both partners */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Flor */}
                            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-2 uppercase tracking-wider">
                                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                                <span>{partnerNames.flor}</span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed flex-1">
                                {ansFlor ? (
                                  `"${ansFlor}"`
                                ) : (
                                  <span className="text-slate-400 italic">
                                    (Sin notas escritas para esta semana)
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Tereque */}
                            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 flex flex-col">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 mb-2 uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                                <span>{partnerNames.tereque}</span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed flex-1">
                                {ansTereque ? (
                                  `"${ansTereque}"`
                                ) : (
                                  <span className="text-slate-400 italic">
                                    (Sin notas escritas para esta semana)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Final Closing Blessing */}
                  <div className="print-avoid-break mt-8 p-6 text-center bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 rounded-2xl border border-rose-200">
                    <p className="font-serif italic text-sm sm:text-base text-slate-800">
                      «Lámpara es a mis pies tu palabra, y lumbrera a mi camino.»
                    </p>
                    <span className="text-xs font-bold text-slate-600 block mt-2">
                      — Salmo 119:105
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer toolbar (No print) */}
          <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
            <p className="text-xs text-slate-500">
              💡 <strong>Consejo:</strong> En el menú de impresión, seleccioná <em>"Guardar como PDF"</em> con <em>"Gráficos de fondo"</em> activado.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Descargar PDF</span>
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
