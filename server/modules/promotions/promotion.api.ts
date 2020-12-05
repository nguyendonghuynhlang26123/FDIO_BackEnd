import * as express from "express";
import { PromotionService } from "./promotion.service";
const router = express.Router();

let promotionService: PromotionService = new PromotionService();

router.get("/", async (req, res) => {
  const promotions = await promotionService.findAllPromotion();
  res.json(promotions);
});

router.get("/:promotionId", async (req, res) => {
  const promotion = await promotionService.findPromotionById(
    req.params.promotionId
  );
  res.json(promotion);
});

router.post("/", async (req, res) => {
  const promotion = await promotionService.createPromotion(req.body);
  res.json({ _id: promotion.id });
});

router.put("/:promotionId", async (req, res) => {
  const result = await promotionService.updatePromotion(
    req.params.promotionId,
    req.body
  );
  res.json(result);
});

router.delete("/:promotionId", async (req, res) => {
  const result = await promotionService.deletePromotion(req.params.promotionId);
  res.json(result);
});

module.exports = router;
