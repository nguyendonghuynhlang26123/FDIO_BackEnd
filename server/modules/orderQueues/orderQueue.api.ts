import * as express from 'express';
import { AuthService } from '../auth/auth.service';
import { FoodService } from './../foods/food.service';
import { OrderQueueService } from './orderQueue.service';
const router = express.Router();

const orderQueueService: OrderQueueService = new OrderQueueService();
const authService: AuthService = new AuthService();

//TODO: AUTH RESTRICT

router.get('/', async (req, res) => {
  let orderQueues = await orderQueueService.findAllOrderQueue();
  console.log('Get order queue');
  res.json(orderQueues);
});

router.get('/:orderQueueId', async (req, res) => {
  const orderQueue = await orderQueueService.findOrderQueueById(
    req.params.orderQueueId
  );
  res.json(orderQueue);
});

router.post('/', async (req, res) => {
  console.log(req.body)
  orderQueueService
    .createOrderQueue(req.body)
    .then(async (order) => {
      let generatedOrder = await orderQueueService.getPopulatedOrderQueueById(
        order.id
      );
      req.io.of('/manager').emit('addOrder', generatedOrder);
      return res.json({ _id: order.id, status: 'successful' });
    })
    .catch((err) => {
      console.error(err);
      return res.json({ err: err.getMessage(), status: 'unsuccessful' });
    });
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
  console.log('PUT RECEIVED', req.body);

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
