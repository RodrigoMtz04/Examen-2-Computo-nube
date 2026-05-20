export interface FitnessBand {
  id: number;
  name: string;
  hm: string;
  cel: string;
  mi: string;
}

export const fitnessBands: FitnessBand[] = [
  { id: 1, name: "iHealth Band 100", hm: "M", cel: "S", mi: "H" },
  { id: 2, name: "iHealth Band 100", hm: "M", cel: "A", mi: "A" },
  { id: 3, name: "iHealth Band 100", hm: "A", cel: "S", mi: "H" },
  { id: 4, name: "iHealth Band 100", hm: "M", cel: "M", mi: "B" },
  { id: 5, name: "iHealth Band 100", hm: "A", cel: "A", mi: "A" },
  { id: 6, name: "iHealth Band 100", hm: "M", cel: "S", mi: "A" },
  { id: 7, name: "iHealth Band 100", hm: "M", cel: "M", mi: "H" },
  { id: 8, name: "iHealth Band 100", hm: "A", cel: "M", mi: "B" },
  { id: 9, name: "iHealth Band 500", hm: "A", cel: "A", mi: "H" },
  { id: 10, name: "iHealth Band 500", hm: "M", cel: "S", mi: "A" },
  { id: 11, name: "iHealth Band 500", hm: "A", cel: "M", mi: "H" },
  { id: 12, name: "iHealth Band 500", hm: "M", cel: "A", mi: "B" },
  { id: 13, name: "iHealth Band 500", hm: "A", cel: "S", mi: "A" },
  { id: 14, name: "iHealth Band 500", hm: "M", cel: "M", mi: "H" },
  { id: 15, name: "iHealth Band 500", hm: "A", cel: "A", mi: "B" },
];

export const surveyQuestions = {
  hm: {
    question: "¿Cuál es tu nivel de ejercicio actual?",
    options: [
      { value: "M", label: "Moderado" },
      { value: "A", label: "Avanzado" },
    ],
  },
  cel: {
    question: "¿Qué tan acostumbrado estás a los dispositivos electrónicos?",
    options: [
      { value: "S", label: "Poco acostumbrado" },
      { value: "A", label: "Acostumbrado" },
      { value: "M", label: "Muy acostumbrado" },
    ],
  },
  mi: {
    question: "¿Qué tan motivado estás?",
    options: [
      { value: "H", label: "Highly motivated" },
      { value: "A", label: "Moderately motivated" },
      { value: "B", label: "Baja motivación" },
    ],
  },
};
