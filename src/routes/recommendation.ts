import { Router } from "express";
import { getSurvey, recommend, history } from "../controllers/recommendationController";

const router = Router();

router.get("/survey", getSurvey);
router.post("/recommend", recommend);
router.get("/history", history);

export default router;
