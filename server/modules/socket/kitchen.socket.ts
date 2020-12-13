import { FoodService } from './../foods/food.service';
import { OrderQueueService } from './../orderQueues/orderQueue.service';

let getQueue = async () => {
  const service = new OrderQueueService();
  const orderQueues = await service.findAllOrderQueue();
  const foodService = new FoodService();
  let result = [];

  for (const order of orderQueues) {
    for (const food of order.list_order_item) {
      if (food.status === 'processing') {
        let f = await foodService.findFoodById(food.food);
        result.push({
          food_name: f.name,
          quantity: food.quantity,
          table_id: order.table_id,
          note: order.note,
        });
      }
    }
  }
  return result;
};

export const kitchenSocket = (socket) => {
  socket.of('/kitchen').on('connection', async (socket) => {
    console.log('kitchen connected');

    console.log('getQueue');
    let result = await getQueue();
    console.log(result);
    socket.emit('init', result);
  });
};
