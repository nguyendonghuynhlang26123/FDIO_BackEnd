import { FoodListService } from './../foodLists/foodList.service';
import * as express from 'express';
import { AuthService } from '../auth/auth.service';
import { FoodService } from './food.service';
const router = express.Router();

const foodService: FoodService = new FoodService();
const authService: AuthService = new AuthService();

router.get('/', async (req, res) => {
  const foods = await foodService.findAllFood();
  res.json(foods);
});

router.get('/:foodId', async (req, res) => {
  const food = await foodService.findFoodById(req.params.foodId);
  res.json(food);
});

router.post('/', async (req, res) => {
  try {
    const food = await foodService.createFood(req.body);
    res.json({ _id: food.id, status: 'successful' });
  } catch (e) {
    res.json({ _id: null, status: 'unsuccessful' });
  }
});

router.post('/append/:foodListId', async (req, res) => {
  try {
    const food = await foodService.createFood(req.body);
    const foodListService = new FoodListService();
    await foodListService.appendAFoodToFoodList(req.params.foodListId, food.id);
    res.json({ _id: food.id, status: 'successful' });
  } catch (e) {
    res.json({ _id: null, status: 'unsuccessful' });
  }
});

router.put('/:foodId', async (req, res) => {
  try {
    const result = await foodService.updateFood(req.params.foodId, req.body);
    res.json({ status: 'successful', _id: result._id });
  } catch (error) {
    res.json({ status: 'unsuccessful', err: error });
  }
});

router.delete('/:foodId', async (req, res) => {
  try {
    const result = await foodService.deleteFood(req.params.foodId);

    res.json({ _id: result._id, status: 'successful' });
  } catch (error) {
    res.json({ err: error, status: 'unsuccessful' });
  }
});

router.delete('/', async (req, res) => {
  try {
    console.log(req.query.ids);
    if (req.query.ids && req.query.ids.length > 0) {
      for (const id of req.query.ids) {
        await foodService.deleteFood(id);
      }
      res.json({ status: 'successful' });
    }
  } catch (error) {
    res.json({ status: 'unsuccessful' });
  }
});

module.exports = router;
