'use strict';

// Naive Bayes (con suavizado de Laplace) para recomendar iHealth100 vs iHealth500.
// Dataset de la diapositiva (conteos por característica y clase):
// CTD:  Y -> (i100=2, i500=6), N -> (i100=4, i500=3)
// HM:   M -> (i100=5, i500=3), A -> (i100=1, i500=6)
// CEL:  S -> (i100=3, i500=2), A -> (i100=2, i500=4), M -> (i100=1, i500=3)
// MI:   H -> (i100=1, i500=4), A -> (i100=2, i500=3), B -> (i100=3, i500=2)
// Priors por clase (total en cada tabla): i100=15, i500=15

const CLASSES = ['i100', 'i500'];

const FEATURES = {
  ctd: { values: ['Y', 'N'] },
  hm: { values: ['M', 'A'] },
  cel: { values: ['S', 'A', 'M'] },
  mi: { values: ['H', 'A', 'B'] },
};

// counts[feature][value][class] = n
const counts = {
  ctd: {
    Y: { i100: 2, i500: 6 },
    N: { i100: 4, i500: 3 },
  },
  hm: {
    M: { i100: 5, i500: 3 },
    A: { i100: 1, i500: 6 },
  },
  cel: {
    S: { i100: 3, i500: 2 },
    A: { i100: 2, i500: 4 },
    M: { i100: 1, i500: 3 },
  },
  mi: {
    H: { i100: 1, i500: 4 },
    A: { i100: 2, i500: 3 },
    B: { i100: 3, i500: 2 },
  },
};

const classTotals = { i100: 15, i500: 15 };

function laplaceProb(featureKey, value, klass) {
  const values = FEATURES[featureKey].values;
  const N = values.length;

  const count = (counts[featureKey]?.[value]?.[klass] ?? 0);
  // Laplace: (count + 1) / (total + N)
  // total = sum_{v in values} count(v, klass)
  const total = values.reduce((acc, v) => acc + (counts[featureKey]?.[v]?.[klass] ?? 0), 0);
  return (count + 1) / (total + N);
}

function recommend(input) {
  // input: { ctd, hm, cel, mi }
  const priors = {
    i100: classTotals.i100 / (classTotals.i100 + classTotals.i500),
    i500: classTotals.i500 / (classTotals.i100 + classTotals.i500),
  };

  const perClass = {};
  for (const klass of CLASSES) {
    let logp = Math.log(priors[klass]);
    const featureBreakdown = {};

    for (const featureKey of Object.keys(FEATURES)) {
      const value = input[featureKey];
      const prob = laplaceProb(featureKey, value, klass);
      logp += Math.log(prob);
      featureBreakdown[featureKey] = { value, prob };
    }

    perClass[klass] = { logp, featureBreakdown };
  }

  // Convertir log-probs a probs normalizadas (softmax)
  const maxLog = Math.max(perClass.i100.logp, perClass.i500.logp);
  const p100 = Math.exp(perClass.i100.logp - maxLog);
  const p500 = Math.exp(perClass.i500.logp - maxLog);
  const sum = p100 + p500;

  const probabilities = {
    i100: p100 / sum,
    i500: p500 / sum,
  };

  const recommended = probabilities.i500 >= probabilities.i100 ? 'i500' : 'i100';

  return {
    input,
    priors,
    probabilities,
    recommended,
    debug: perClass,
  };
}

module.exports = {
  recommend,
  FEATURES,
  CLASSES,
};

