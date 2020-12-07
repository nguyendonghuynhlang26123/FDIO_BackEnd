import * as express from "express";
import { FoodService } from "./food.service";
const router = express.Router();

let foodService: FoodService = new FoodService();

router.get("/", async (req, res) => {
  const foods = await foodService.findAllFood();
  res.json(foods);
});

router.get("/:foodId", async (req, res) => {
  const food = await foodService.findFoodById(
    req.params.foodId
  );
  res.json(food);
});

router.post("/", async (req, res) => {
  const food = await foodService.createFood(req.body);
  res.json({ _id: food.id });
});

router.put("/:foodId", async (req, res) => {
  const result = await foodService.updateFood(
    req.params.foodId,
    req.body
  );
  res.json(result);
});

router.delete("/:foodId", async (req, res) => {
  const result = await foodService.deleteFood(req.params.foodId);
  res.json(result);
});

module.exports = router;
