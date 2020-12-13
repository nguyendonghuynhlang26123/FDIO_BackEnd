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

export const managerSocket = (socket) => {
  const service = new OrderQueueService();
  socket.of('/manager').on('connection', async (socket) => {
    console.log('manager connected');

    let result = await getData();
    socket.emit('init', result);
  });
};
