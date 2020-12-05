import { OrderRepository } from "../../models/index";
import { OrderInterface } from "./order.interface";

export class OrderService {
  async createOrder(data: OrderInterface) {
    try {
      return await OrderRepository.add(data);
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Create Order.");
    }
  }

  async findOrderById(id: string): Promise<OrderInterface> {
    try {
      let doc = await OrderRepository.doc(id).get();
      if (!doc.exists) {
        throw new Error("Not Found Order.");
      }
      const order: OrderInterface = {
        _id: doc.id,
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
      let collection = await OrderRepository.get();
      if (collection.empty) {
        throw new Error("No documents..");
      }
      const orders: OrderInterface[] = [];
      collection.forEach((doc) => {
        const order: OrderInterface = {
          _id: doc.id,
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

  async updateOrder(id: string, dataUpdate: OrderInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.created_at;
      const result = await OrderRepository.doc(id).update(dataUpdate);
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update Order.");
    }
  }

  async deleteOrder(id: string) {
    try {
      const result = await OrderRepository.doc(id).delete();
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete Order.");
    }
  }
}
