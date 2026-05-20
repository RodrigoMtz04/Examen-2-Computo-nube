export interface TrainingData {
  features: Record<string, string>[];
  labels: string[];
}

export interface PredictionResult {
  predictedClass: string;
  probabilities: Record<string, number>;
}

export class NaiveBayesLaplace {
  private classes: string[] = [];
  private classCounts: Record<string, number> = {};
  private featureCounts: Record<string, Record<string, Record<string, number>>> = {};
  private featureValues: Record<string, string[]> = {};
  private totalSamples: number = 0;

  train(data: TrainingData): void {
    const { features, labels } = data;
    this.totalSamples = labels.length;

    console.log("📚 Entrenando Naive Bayes con", this.totalSamples, "muestras");

    this.classes = [...new Set(labels)];
    console.log("📊 Clases identificadas:", this.classes);

    this.classes.forEach((cls) => {
      this.classCounts[cls] = 0;
    });

    const featureNames = Object.keys(features[0]);
    console.log("🔑 Características:", featureNames);

    featureNames.forEach((feature) => {
      this.featureCounts[feature] = {};
      this.featureValues[feature] = [];
      this.classes.forEach((cls) => {
        this.featureCounts[feature][cls] = {};
      });
    });

    features.forEach((feature, idx) => {
      const label = labels[idx];
      this.classCounts[label]++;

      Object.entries(feature).forEach(([featureName, featureValue]) => {
        if (!this.featureValues[featureName].includes(featureValue)) {
          this.featureValues[featureName].push(featureValue);
        }
        if (!this.featureCounts[featureName][label][featureValue]) {
          this.featureCounts[featureName][label][featureValue] = 0;
        }
        this.featureCounts[featureName][label][featureValue]++;
      });
    });

    console.log("✅ Entrenamiento completado");
    console.log("📈 Conteo de clases:", this.classCounts);
  }

  private calculatePrior(classLabel: string): number {
    return this.classCounts[classLabel] / this.totalSamples;
  }

  private calculateLikelihood(
    featureName: string,
    featureValue: string,
    classLabel: string
  ): number {
    // Validar que las estructuras existan
    if (!this.featureCounts[featureName]) {
      console.warn(`Feature not found: ${featureName}`);
      return 1 / this.classes.length; // Probabilidad uniforme como fallback
    }

    if (!this.featureCounts[featureName][classLabel]) {
      console.warn(`Class not found: ${classLabel} for feature ${featureName}`);
      return 1 / this.classes.length;
    }

    const count = this.featureCounts[featureName][classLabel][featureValue] || 0;
    const classTotal = this.classCounts[classLabel];
    const numValues = this.featureValues[featureName]?.length || 1;

    if (classTotal === 0) {
      return 1 / numValues;
    }

    return (count + 1) / (classTotal + numValues);
  }

  predict(features: Record<string, string>): PredictionResult {
    const probabilities: Record<string, number> = {};

    console.log("🤖 Prediciendo con features:", features);
    console.log("📊 Clases conocidas:", this.classes);

    this.classes.forEach((cls) => {
      let logProb = Math.log(this.calculatePrior(cls));

      Object.entries(features).forEach(([featureName, featureValue]) => {
        const likelihood = this.calculateLikelihood(
          featureName,
          featureValue,
          cls
        );
        logProb += Math.log(likelihood);
      });

      probabilities[cls] = Math.exp(logProb);
    });

    const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
    Object.keys(probabilities).forEach((key) => {
      probabilities[key] /= sum;
    });

    const predictedClass = Object.entries(probabilities).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];

    console.log("✅ Predicción:", { predictedClass, probabilities });

    return { predictedClass, probabilities };
  }
}
