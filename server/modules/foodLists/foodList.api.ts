import * as express from 'express';
import { AuthService } from '../auth/auth.service';
import { FoodListService } from './foodList.service';
const router = express.Router();

const foodListService: FoodListService = new FoodListService();
const authService: AuthService = new AuthService();
//TODO: authService.restrict

router.get('/', async (req, res) => {
  const foodLists = await foodListService.findAndPopulateAllFoodList();
  console.log(foodLists);
  res.json(foodLists);
});

router.get('/:foodListId', async (req, res) => {
  const foodList = await foodListService.findPopulatedFoodListById(
    req.params.foodListId
  );

  console.log(foodList);
  res.json(foodList);
});

router.post('/', async (req, res) => {
  let newFood = req.body;
  console.log(newFood);

  try {
    const foodList = await foodListService.createFoodList(newFood);
    res.json({ _id: foodList.id, status: 'successful' });
  } catch (error) {
    res.json({ err: error, status: 'unsuccessful' });
  }
});

router.put('/:foodListId', async (req, res) => {
  try {
    const result = await foodListService.updateFoodList(
      req.params.foodListId,
      req.body
    );
    res.json({ _id: result._id, status: 'successful' });
  } catch (error) {
    res.json({ err: error, status: 'unsuccessful' });
  }
});

router.delete('/:foodListId', async (req, res) => {
  try {
    const result = await foodListService.deleteFoodList(req.params.foodListId);
    res.json({ _id: result._id, status: 'successful' });
  } catch (error) {
    res.json({ err: error, status: 'unsuccessful' });
  }
});

module.exports = router;
