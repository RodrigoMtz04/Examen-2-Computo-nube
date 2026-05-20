import { Request, Response } from "express";
import { RecommendationService } from "../services/recommendation";
import { saveRecommendation, getRecommendations } from "../models/recommendation";

const recommendationService = new RecommendationService();

export async function getSurvey(req: Request, res: Response) {
  try {
    const questions = recommendationService.getSurveyQuestions();
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: "Error fetching survey questions" });
  }
}

export async function recommend(req: Request, res: Response) {
  try {
    const { int, ex, mot, tech } = req.body;

    if (!int || !ex || !mot || !tech) {
      return res.status(400).json({
        error: "Missing required fields: int, ex, mot, tech",
      });
    }

    const result = recommendationService.recommend({ int, ex, mot, tech });

    const confidence = result.probabilities[result.predictedClass] || 0;

    const recordId = await saveRecommendation({
      int,
      ex,
      mot,
      tech,
      predicted_band: result.predictedClass,
      confidence,
    });

    res.json({
      id: recordId,
      predictedBand: result.predictedClass,
      probabilities: result.probabilities,
      confidence,
    });
  } catch (error) {
    console.error("Error making recommendation:", error);
    res.status(500).json({ error: "Error making recommendation" });
  }
}

export async function history(req: Request, res: Response) {
  try {
    const recommendations = await getRecommendations();
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: "Error fetching recommendations history" });
  }
}
