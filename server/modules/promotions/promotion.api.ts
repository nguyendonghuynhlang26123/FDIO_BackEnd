import * as express from "express";
import { AuthService } from "../auth/auth.service";
import { PromotionService } from "./promotion.service";
const router = express.Router();

const promotionService: PromotionService = new PromotionService();
const authService: AuthService = new AuthService();

router.get("/", authService.restrict, async (req, res) => {
  const promotions = await promotionService.findAllPromotion();
  res.json(promotions);
});

router.get("/:promotionId", authService.restrict, async (req, res) => {
  const promotion = await promotionService.findPromotionById(
    req.params.promotionId
  );
  res.json(promotion);
});

router.post("/", authService.restrict, async (req, res) => {
  const promotion = await promotionService.createPromotion(req.body);
  res.json({ _id: promotion.id });
});

router.put("/:promotionId", authService.restrict, async (req, res) => {
  const result = await promotionService.updatePromotion(
    req.params.promotionId,
    req.body
  );
  res.json(result);
});

router.delete("/:promotionId", authService.restrict, async (req, res) => {
  const result = await promotionService.deletePromotion(req.params.promotionId);
  res.json(result);
});

module.exports = router;
