import * as express from 'express';
import { AuthService } from '../auth/auth.service';
import { FoodService } from './../foods/food.service';
import { OrderQueueService } from './orderQueue.service';
const router = express.Router();

const orderQueueService: OrderQueueService = new OrderQueueService();
const foodService: FoodService = new FoodService();
const authService: AuthService = new AuthService();

//TODO: AUTH RESTRICT

router.get('/', async (req, res) => {
  let orderQueues = await orderQueueService.findAllOrderQueue();

  res.json(orderQueues);
});

router.get('/:orderQueueId', async (req, res) => {
  const orderQueue = await orderQueueService.findOrderQueueById(
    req.params.orderQueueId
  );
  res.json(orderQueue);
});

router.post('/', async (req, res) => {
  console.log(
    'log ~ file: orderQueue.api.ts ~ line 27 ~ router.post ~ req.body',
    req.body
  );
  orderQueueService
    .createOrderQueue(req.body)
    .then((orderQueue) => res.json({ err: null, status: 'successful' }))
    .catch((err) => res.json({ err: err, status: 'unsuccessful' }));
});

router.put('/deny', async (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

router.put('/:orderQueueId', authService.restrict, async (req, res) => {
  const result = await orderQueueService.updateOrderQueue(
    req.params.orderQueueId,
    req.body
  );
  res.json(result);
});

router.put('/update-status/:orderQueueId', async (req, res) => {
  console.log('PUT RECEIEVED', req.body);

  const result = await orderQueueService.updateStatusFoodOrderQueue(
    req.params.orderQueueId,
    req.body.foodId,
    req.body.status
  );
  res.json(result);
});

router.delete('/:orderQueueId', authService.restrict, async (req, res) => {
  const result = await orderQueueService.deleteOrderQueue(
    req.params.orderQueueId
  );
  res.json(result);
});

router.delete(
  '/complete/:orderQueueId',
  authService.restrict,
  async (req, res) => {
    const result = await orderQueueService.completeOrderQueue(
      req.params.orderQueueId
    );
    res.json(result);
  }
);

module.exports = router;
