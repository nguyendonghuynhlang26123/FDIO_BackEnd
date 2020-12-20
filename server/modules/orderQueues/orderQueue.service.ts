import { FoodService } from './../foods/food.service';
import { OrderQueueModel } from '../../models';
import { OrderQueueInterface } from '../../interfaces';
import { OrderService } from '../orders/order.service';

export class OrderQueueService {
  constructor(private orderService: OrderService = new OrderService()) {}

  async createOrderQueue(data: OrderQueueInterface) {
    try {
      if (
        !data.table_id ||
        !data.manager ||
        !data.list_order_item ||
        !data.token
      ) {
        throw new Error('Cannot Create Order Queue. Has Null Field.');
      }
      data.created_at = Date.now();
      data.time_order = Date.now();
      data.list_order_item.forEach((e) => {
        e.status = 'waiting';
      });
      delete data._id;

      return await OrderQueueModel.add(data);
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Create Order Queue.');
    }
  }

  async findOrderQueueById(id: string): Promise<OrderQueueInterface> {
    try {
      let doc = await OrderQueueModel.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      const orderQueue: OrderQueueInterface = {
        _id: doc.id,
        table_id: doc.data().table_id,
        time_order: doc.data().time_order,
        manager: doc.data().manager,
        list_order_item: doc.data().list_order_item,
        discount: doc.data().discount,
        token: doc.data().token,
        note: doc.data().note,
        created_at: doc.data().created_at,
      };
      return orderQueue;
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Find Order Queue.');
    }
  }

  async getPopulatedOrderQueueById(id) {
    try {
      let order = await this.findOrderQueueById(id);
      let foodService = new FoodService();
      for (let i = 0; i < order.list_order_item.length; i++) {
        let food = await foodService.findFoodById(
          order.list_order_item[i].food
        );
        order.list_order_item[i]['food_name'] = food.name;
      }
      return order;
    } catch (e) {
      console.error(e);
      throw new Error(`Get order ${id} failed! Error: ${e}`);
    }
  }

  async findAllOrderQueue(): Promise<OrderQueueInterface[]> {
    try {
      let collection = await OrderQueueModel.orderBy('created_at').get();
      if (collection.empty) {
        return [];
      }
      const orderQueues: OrderQueueInterface[] = [];
      collection.forEach((doc) => {
        const orderQueue: OrderQueueInterface = {
          _id: doc.id,
          table_id: doc.data().table_id,
          time_order: doc.data().time_order,
          manager: doc.data().manager,
          list_order_item: doc.data().list_order_item,
          discount: doc.data().discount,
          token: doc.data().token,
          note: doc.data().note,
          created_at: doc.data().created_at,
        };
        orderQueues.push(orderQueue);
      });
      return orderQueues;
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Find All Order Queue.');
    }
  }

  async updateOrderQueue(id: string, dataUpdate: OrderQueueInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.list_order_item;
      delete dataUpdate.created_at;
      const result = await OrderQueueModel.doc(id).update(dataUpdate);
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Update Order Queue.');
    }
  }

  async updateStatusFoodOrderQueue(
    id: string,
    food_id: string,
    status: 'processing' | 'deny' | 'completed' | 'waiting'
  ) {
    try {
      const orderQueue = await this.findOrderQueueById(id);
      if (!orderQueue) {
        throw new Error('Not Found Order Queue.');
      }
      orderQueue.list_order_item.forEach((item) => {
        if (item.food == food_id) {
          item.status = status;
          return item;
        }
      });
      const result = await OrderQueueModel.doc(id).update(orderQueue);
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Update Status Food Of Order Queue.');
    }
  }

  async deleteOrderQueue(id: string) {
    try {
      const result = await OrderQueueModel.doc(id).delete();
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Delete Order Queue.');
    }
  }

  async completeOrderQueue(id: string) {
    try {
      const orderQueue = await this.findOrderQueueById(id);
      if (!orderQueue) {
        throw new Error('Not Found Order Queue.');
      }
      const order = await this.orderService.createOrder(orderQueue);
      const result = OrderQueueModel.doc(id).delete();
      return { order_id: order.id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Complete Order Queue.');
    }
  }
}
