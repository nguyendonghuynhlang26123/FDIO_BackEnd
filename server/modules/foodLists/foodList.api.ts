import * as express from "express";
import { FoodListService } from "./foodList.service";
const router = express.Router();

let foodListService: FoodListService = new FoodListService();

router.get("/", async (req, res) => {
  const foodLists = await foodListService.findAllFoodList();
  res.json(foodLists);
});

router.get("/:foodListId", async (req, res) => {
  const foodList = await foodListService.findFoodListById(
    req.params.foodListId
  );
  res.json(foodList);
});

router.post("/", async (req, res) => {
  const foodList = await foodListService.createFoodList(req.body);
  res.json({ _id: foodList.id });
});

router.put("/:foodListId", async (req, res) => {
  const result = await foodListService.updateFoodList(
    req.params.foodListId,
    req.body
  );
  res.json(result);
});

router.delete("/:foodListId", async (req, res) => {
  const result = await foodListService.deleteFoodList(req.params.foodListId);
  res.json(result);
});

module.exports = router;
