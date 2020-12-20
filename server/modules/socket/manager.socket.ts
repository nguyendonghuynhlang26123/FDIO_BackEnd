import { sendFcmNotification } from './../../connectFirebase';
import { OrderService } from './../orders/order.service';
import { create } from 'ts-node';
import { OrderInterface } from '../../interfaces/order.interface';
import { FoodService } from './../foods/food.service';
import { OrderQueueService } from './../orderQueues/orderQueue.service';

const getData = async () => {
  const service = new OrderQueueService();
  const orderQueues = await service.findAllOrderQueue();
  const foodService = new FoodService();

  let newQueue = await Promise.all(
    orderQueues.map(async function (order) {
      let foodList = order.list_order_item;
      foodList = await Promise.all(
        foodList.map(async (food) => {
          const f = await foodService.findFoodById(food.food);
          food['food_name'] = f.name;
          return food;
        })
      );
      order.list_order_item = foodList;
      return order;
    })
  );
  return newQueue;
};

const checkCompleted = (data, orderQueue): boolean => {
  let order = orderQueue.find((o) => o._id === data.order_id);
  //If all order is processed
  let unprocessed = order.list_order_item.find(
    (f) => f.status === 'waiting' || f.status === 'processing'
  );
  return unprocessed == undefined;
};

const createOrder = async (data: any, orderQueue: any) => {
  const service = new OrderQueueService();
  let order = await service.findOrderQueueById(data.order_id);

  const orderService = new OrderService();
  orderService.createOrder(order);
};

export const managerSocket = (io) => {
  io.of('/manager').on('connection', async (socket) => {
    console.log('manager connected');
    let orderQueue = await getData();
    socket.emit('init', orderQueue);

    //ACCEPTING ORDER
    socket.on('processing', (data) => {
      io.of('/kitchen').emit('acceptOrder', data);

      //console.log(data);
      sendFcmNotification(data.token, 'TEST', 'TEST');
    });

    //COMPLETED ORDER
    socket.on('completed', async (data) => {
      await io.of('/kitchen').emit('removeOrder', data.order_id + data.food_id);

      if (checkCompleted(data, orderQueue)) {
        await createOrder(data, orderQueue);
      }
    });

    //DENY ORDER
    socket.on('deny', async (data) => {
      await io.of('/kitchen').emit('removeOrder', data.order_id + data.food_id);

      if (checkCompleted(data, orderQueue)) {
        await createOrder(data, orderQueue);
      }
    });
  });
};