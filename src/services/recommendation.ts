import { NaiveBayesLaplace, TrainingData, PredictionResult } from "./naiveBayes";
import { fitnessBands } from "../models/fitnessBands";

export interface SurveyResponse {
  int: string;
  ex: string;
  mot: string;
  tech: string;
}

export class RecommendationService {
  private classifier: NaiveBayesLaplace;

  constructor() {
    this.classifier = new NaiveBayesLaplace();
    this.trainClassifier();
  }

  private trainClassifier(): void {
    const features = fitnessBands.map((band) => ({
      int: band.int,
      ex: band.ex,
      mot: band.mot,
      tech: band.tech,
    }));

    const labels = fitnessBands.map((band) => band.name);

    const trainingData: TrainingData = {
      features,
      labels,
    };

    this.classifier.train(trainingData);
  }

  recommend(response: SurveyResponse): PredictionResult {
    const features = {
      int: response.int,
      ex: response.ex,
      mot: response.mot,
      tech: response.tech,
    };

    return this.classifier.predict(features);
  }

  getSurveyQuestions() {
    return {
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
  }
}
