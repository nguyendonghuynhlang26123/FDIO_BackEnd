import * as express from "express";
import { AuthService } from "../auth/auth.service";
import { FoodService } from "./food.service";
const router = express.Router();

const foodService: FoodService = new FoodService();
const authService: AuthService = new AuthService();

router.get("/", authService.restrict, async (req, res) => {
  const foods = await foodService.findAllFood();
  res.json(foods);
});

router.get("/:foodId", authService.restrict, async (req, res) => {
  const food = await foodService.findFoodById(
    req.params.foodId
  );
  res.json(food);
});

router.post("/", authService.restrict, async (req, res) => {
  const food = await foodService.createFood(req.body);
  res.json({ _id: food.id });
});

router.put("/:foodId", authService.restrict, async (req, res) => {
  const result = await foodService.updateFood(
    req.params.foodId,
    req.body
  );
  res.json(result);
});

router.delete("/:foodId", authService.restrict, async (req, res) => {
  const result = await foodService.deleteFood(req.params.foodId);
  res.json(result);
});

module.exports = router;
