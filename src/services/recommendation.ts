import { NaiveBayesLaplace, TrainingData, PredictionResult } from "./naiveBayes";
import { fitnessBands } from "../models/fitnessBands";

export interface SurveyResponse {
  hm: string;
  cel: string;
  mi: string;
}

export class RecommendationService {
  private classifier: NaiveBayesLaplace;

  constructor() {
    this.classifier = new NaiveBayesLaplace();
    this.trainClassifier();
  }

  private trainClassifier(): void {
    const features = fitnessBands.map((band) => ({
      hm: band.hm,
      cel: band.cel,
      mi: band.mi,
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
      hm: response.hm,
      cel: response.cel,
      mi: response.mi,
    };

    return this.classifier.predict(features);
  }

  getSurveyQuestions() {
    return {
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
          { value: "H", label: "Alta motivación" },
          { value: "A", label: "Motivación moderada" },
          { value: "B", label: "Baja motivación" },
        ],
      },
    };
  }
}
