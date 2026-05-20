export interface FitnessBand {
  id: number;
  name: string;
  int: string;  // Main Interest: both, health, appearance
  ex: string;   // Exercise Level: sedentary, active, moderate
  mot: string;  // Motivation: moderate, aggressive
  tech: string; // Comfortable with tech: yes, no
}

export const fitnessBands: FitnessBand[] = [
  // Datos de la tabla del proyecto original (Data Mining)
  { id: 1, name: "iHealth Band 100", int: "B", ex: "S", mot: "M", tech: "Y" },
  { id: 2, name: "iHealth Band 100", int: "B", ex: "S", mot: "M", tech: "N" },
  { id: 3, name: "iHealth Band 500", int: "H", ex: "S", mot: "M", tech: "Y" },
  { id: 4, name: "iHealth Band 500", int: "A", ex: "A", mot: "M", tech: "Y" },
  { id: 5, name: "iHealth Band 500", int: "A", ex: "M", mot: "A", tech: "Y" },
  { id: 6, name: "iHealth Band 100", int: "A", ex: "M", mot: "A", tech: "N" },
  { id: 7, name: "iHealth Band 500", int: "H", ex: "M", mot: "A", tech: "N" },
  { id: 8, name: "iHealth Band 100", int: "B", ex: "A", mot: "M", tech: "Y" },
  { id: 9, name: "iHealth Band 500", int: "B", ex: "M", mot: "A", tech: "Y" },
  { id: 10, name: "iHealth Band 500", int: "A", ex: "A", mot: "A", tech: "Y" },
  { id: 11, name: "iHealth Band 500", int: "B", ex: "A", mot: "A", tech: "N" },
  { id: 12, name: "iHealth Band 500", int: "H", ex: "A", mot: "M", tech: "N" },
  { id: 13, name: "iHealth Band 500", int: "H", ex: "S", mot: "A", tech: "Y" },
  { id: 14, name: "iHealth Band 100", int: "A", ex: "A", mot: "M", tech: "N" },
  { id: 15, name: "iHealth Band 100", int: "H", ex: "S", mot: "M", tech: "N" },
];

export const surveyQuestions = {
  int: {
    question: "¿Cuál es tu interés principal?",
    options: [
      { value: "B", label: "Ambos (Salud y Apariencia)" },
      { value: "H", label: "Salud" },
      { value: "A", label: "Apariencia" },
    ],
  },
  ex: {
    question: "¿Cuál es tu nivel de ejercicio actual?",
    options: [
      { value: "S", label: "Sedentario" },
      { value: "M", label: "Moderado" },
      { value: "A", label: "Activo" },
    ],
  },
  mot: {
    question: "¿Qué tan motivado estás?",
    options: [
      { value: "M", label: "Moderadamente motivado" },
      { value: "A", label: "Muy motivado (Agresivo)" },
    ],
  },
  tech: {
    question: "¿Te sientes cómodo con dispositivos tecnológicos?",
    options: [
      { value: "Y", label: "Sí, muy cómodo" },
      { value: "N", label: "No, prefiero lo simple" },
    ],
  },
};
