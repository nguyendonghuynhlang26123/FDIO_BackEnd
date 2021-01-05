import { OrderModel } from "../../models";
import {
  FoodInterface,
  OrderInterface,
  StatisticInterface,
  StatisticDetailInterface,
} from "../../interfaces";
import { FoodService } from "../foods/food.service";

export class OrderService {
  constructor(private foodService: FoodService = new FoodService()) {}

  async createOrder(data: OrderInterface) {
    try {
      if (!data.table_id || !data.manager || !data.list_order_item) {
        throw new Error("Cannot Create Order. Has Null Field.");
      }
      data.created_at = Date.now();
      delete data._id;
      return await OrderModel.add(data);
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Create Order.");
    }
  }

  async findOrderById(id: string): Promise<OrderInterface> {
    try {
      let doc = await OrderModel.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      const order: OrderInterface = {
        _id: doc.id,
        table_id: doc.data().table_id,
        time_order: doc.data().time_order,
        manager: doc.data().manager,
        list_order_item: doc.data().list_order_item,
        discount: doc.data().discount,
        note: doc.data().note,
        created_at: doc.data().created_at,
      };
      return order;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find Order.");
    }
  }

  async findAllOrder(): Promise<OrderInterface[]> {
    try {
      let collection = await OrderModel.get();
      if (collection.empty) {
        return [];
      }
      const orders: OrderInterface[] = [];
      collection.forEach((doc) => {
        const order: OrderInterface = {
          _id: doc.id,
          table_id: doc.data().table_id,
          time_order: doc.data().time_order,
          manager: doc.data().manager,
          list_order_item: doc.data().list_order_item,
          discount: doc.data().discount,
          note: doc.data().note,
          created_at: doc.data().created_at,
        };
        orders.push(order);
      });
      return orders;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find All Order.");
    }
  }

  async orderStatistics(): Promise<StatisticInterface> {
    try {
      let order = await this.findAllOrder();
      const statistic: StatisticInterface = {
        details: [],
        total_orders: 0,
        total_money: 0,
      };
      for (let i = 0; i < order.length; i++) {
        for (let j = 0; j < order[i].list_order_item.length; j++) {
          if (order[i].list_order_item[j].status != "completed") continue;
          const food: FoodInterface = await this.foodService.findFoodById(
            order[i].list_order_item[j].food
          );
          let flag = true;
          for (let k = 0; k < statistic.details.length; k++) {
            if (statistic.details[k].food_name == food.name) {
              flag = false;
              statistic.details[k].quantity_sold +=
                order[i].list_order_item[j].quantity;
              statistic.details[k].money +=
                food.price * order[i].list_order_item[j].quantity;
              break;
            }
          }
          if (flag) {
            const detail: StatisticDetailInterface = {
              food_name: food.name,
              quantity_sold: order[i].list_order_item[j].quantity,
              money: food.price * order[i].list_order_item[j].quantity,
            };
            statistic.details.push(detail);
          }
          statistic.total_orders += 1;
          statistic.total_money +=
            food.price * order[i].list_order_item[j].quantity;
        }
      }
      return statistic;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Order Statistics.");
    }
  }

  async updateOrder(id: string, dataUpdate: OrderInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.created_at;
      const result = await OrderModel.doc(id).update(dataUpdate);
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update Order.");
    }
  }

  async deleteOrder(id: string) {
    try {
      const result = await OrderModel.doc(id).delete();
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete Order.");
    }
  }
}
