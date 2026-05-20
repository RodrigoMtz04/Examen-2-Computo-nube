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

    this.classes = [...new Set(labels)];
    this.classes.forEach((cls) => {
      this.classCounts[cls] = 0;
    });

    const featureNames = Object.keys(features[0]);
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
  }

  private calculatePrior(classLabel: string): number {
    return this.classCounts[classLabel] / this.totalSamples;
  }

  private calculateLikelihood(
    featureName: string,
    featureValue: string,
    classLabel: string
  ): number {
    const count = this.featureCounts[featureName][classLabel][featureValue] || 0;
    const classTotal = this.classCounts[classLabel];
    const numValues = this.featureValues[featureName].length;

    return (count + 1) / (classTotal + numValues);
  }

  predict(features: Record<string, string>): PredictionResult {
    const probabilities: Record<string, number> = {};

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

    return { predictedClass, probabilities };
  }
}
