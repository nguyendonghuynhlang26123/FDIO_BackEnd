import * as express from "express";
import { AuthService } from "../auth/auth.service";
import { FoodListService } from "./foodList.service";
const router = express.Router();

const foodListService: FoodListService = new FoodListService();
const authService: AuthService = new AuthService();

router.get("/", authService.restrict, async (req, res) => {
  const foodLists = await foodListService.findAllFoodList();
  res.json(foodLists);
});

router.get("/:foodListId", authService.restrict, async (req, res) => {
  const foodList = await foodListService.findFoodListById(
    req.params.foodListId
  );
  res.json(foodList);
});

router.post("/", authService.restrict, async (req, res) => {
  const foodList = await foodListService.createFoodList(req.body);
  res.json({ _id: foodList.id });
});

router.put("/:foodListId", authService.restrict, async (req, res) => {
  const result = await foodListService.updateFoodList(
    req.params.foodListId,
    req.body
  );
  res.json(result);
});

router.delete("/:foodListId", authService.restrict, async (req, res) => {
  const result = await foodListService.deleteFoodList(req.params.foodListId);
  res.json(result);
});

module.exports = router;
