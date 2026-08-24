import { WeekChallenge } from '../types';

export const challengeData: WeekChallenge[] = [
  {
    week: 1,
    title: "Conociendo a Jesús",
    subtitle: "Enfócate en lo que Jesús enseña y cómo ama a las personas.",
    theme: {
      bg: "bg-rose-50/70",
      border: "border-rose-200",
      text: "text-rose-900",
      lightText: "text-rose-700",
      accentBg: "bg-rose-500",
      circleUnchecked: "bg-rose-200 text-rose-800 hover:bg-rose-300",
      circleChecked: "bg-rose-500 text-white shadow-inner shadow-rose-700/50"
    },
    days: [
      { num: 1, reading: "Mateo 1" },
      { num: 2, reading: "Mateo 5" },
      { num: 3, reading: "Mateo 6" },
      { num: 4, reading: "Mateo 7" },
      { num: 5, reading: "Marcos 1" },
      { num: 6, reading: "Marcos 5" },
      { num: 7, reading: "Juan 3" }
    ],
    reflections: [
      "¿Qué aprendí sobre Jesús?",
      "¿Qué enseñanza me habló hoy?",
      "¿Cómo puedo aplicar esto en mi día a día?"
    ]
  },
  {
    week: 2,
    title: "Crecer en la fe",
    subtitle: "Pensá: ¿qué puedo aplicar hoy a mi vida?",
    theme: {
      bg: "bg-purple-50/70",
      border: "border-purple-200",
      text: "text-purple-900",
      lightText: "text-purple-700",
      accentBg: "bg-purple-500",
      circleUnchecked: "bg-purple-200 text-purple-800 hover:bg-purple-300",
      circleChecked: "bg-purple-500 text-white shadow-inner shadow-purple-700/50"
    },
    days: [
      { num: 8, reading: "Juan 10" },
      { num: 9, reading: "Juan 15" },
      { num: 10, reading: "Hechos 1" },
      { num: 11, reading: "Hechos 2" },
      { num: 12, reading: "Romanos 8" },
      { num: 13, reading: "1 Corintios 13" },
      { num: 14, reading: "Gálatas 5:22-23" }
    ],
    reflections: [
      "¿Qué me enseña este texto sobre Dios?",
      "¿Qué cambia en mí cuando lo aplico?",
      "¿Cómo puedo compartirlo con otros?"
    ]
  },
  {
    week: 3,
    title: "Dios en el inicio",
    subtitle: "Acá ves cómo Dios actúa desde el principio.",
    theme: {
      bg: "bg-emerald-50/70",
      border: "border-emerald-200",
      text: "text-emerald-900",
      lightText: "text-emerald-700",
      accentBg: "bg-emerald-500",
      circleUnchecked: "bg-emerald-200 text-emerald-800 hover:bg-emerald-300",
      circleChecked: "bg-emerald-500 text-white shadow-inner shadow-emerald-700/50"
    },
    days: [
      { num: 15, reading: "Génesis 1" },
      { num: 16, reading: "Génesis 3" },
      { num: 17, reading: "Génesis 12" },
      { num: 18, reading: "Éxodo 3" },
      { num: 19, reading: "Éxodo 14" },
      { num: 20, reading: "Salmo 23" },
      { num: 21, reading: "Salmo 91" }
    ],
    reflections: [
      "¿Qué aprendí sobre el carácter de Dios?",
      "¿Cómo me da esto seguridad hoy?",
      "¿Qué agradezco después de leerlo?"
    ]
  },
  {
    week: 4,
    title: "Sabiduría y propósito",
    subtitle: "Descubrí consejos de vida eterna y propósito divino.",
    theme: {
      bg: "bg-amber-50/70",
      border: "border-amber-200",
      text: "text-amber-900",
      lightText: "text-amber-700",
      accentBg: "bg-amber-500",
      circleUnchecked: "bg-amber-200 text-amber-800 hover:bg-amber-300",
      circleChecked: "bg-amber-500 text-white shadow-inner shadow-amber-700/50"
    },
    days: [
      { num: 22, reading: "Proverbios 1" },
      { num: 23, reading: "Proverbios 3" },
      { num: 24, reading: "Eclesiastés 3" },
      { num: 25, reading: "Isaías 40" },
      { num: 26, reading: "Jeremías 29:11" },
      { num: 27, reading: "Jonás 1" },
      { num: 28, reading: "Jonás 2" }
    ],
    reflections: [
      "¿Qué sabiduría o consejo recibí hoy?",
      "¿Cómo me anima este versículo?",
      "¿Qué propósito tiene Dios para mí?"
    ]
  },
  {
    week: "ÚLTIMOS DÍAS",
    title: "Reflexión y conexión",
    subtitle: "Consolidá el hábito y celebrá la transformación.",
    theme: {
      bg: "bg-sky-50/70",
      border: "border-sky-200",
      text: "text-sky-900",
      lightText: "text-sky-700",
      accentBg: "bg-sky-500",
      circleUnchecked: "bg-sky-200 text-sky-800 hover:bg-sky-300",
      circleChecked: "bg-sky-500 text-white shadow-inner shadow-sky-700/50"
    },
    days: [
      { num: 29, reading: "Jonás 3 y 4" },
      { num: 30, reading: "Filipenses 4" }
    ],
    reflections: [
      "Cerrá el desafío pensando:",
      "¿Qué aprendí a lo largo de estos 30 días?",
      "¿Qué cambió en mí y en nuestra relación con Dios?"
    ]
  }
];

export const devotionalTips = [
  {
    title: "Tip diario",
    prayer: "Dios, hablame a través de tu palabra y ayudame a entenderla.",
    description: "Antes de leer, hacé una oración simple y abrí tu corazón."
  },
  {
    title: "Consejo para dos",
    prayer: "Señor, bendice este tiempo juntos y danos sabiduría mutua.",
    description: "Compartan al final del día qué frase o versículo les resonó más."
  },
  {
    title: "Oración de gratitud",
    prayer: "Gracias Jesús por tu amor incondicional en nuestras vidas.",
    description: "Anotá 3 cosas concretas por las que agradecés hoy al terminar tu lectura."
  }
];
