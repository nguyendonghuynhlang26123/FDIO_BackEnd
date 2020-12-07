import { OrderModel } from "../../models";
import { OrderInterface } from "./order.interface";

export class OrderService {
  async createOrder(data: OrderInterface) {
    try {
      if (!data.table_id || !data.manager || !data.list_order_item) {
        throw new Error("Cannot Create Order. Has Null Field.");
      }
      data.created_at = Date.now();
      data.time_order = Date.now();
      data.status = "waiting for acceptance";
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
        throw new Error("Not Found Order.");
      }
      const order: OrderInterface = {
        _id: doc.id,
        table_id: doc.data().table_id,
        time_order: doc.data().time_order,
        manager: doc.data().manager,
        list_order_item: doc.data().list_order_item,
        status: doc.data().status,
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
        throw new Error("No documents..");
      }
      const orders: OrderInterface[] = [];
      collection.forEach((doc) => {
        const order: OrderInterface = {
          _id: doc.id,
          table_id: doc.data().table_id,
          time_order: doc.data().time_order,
          manager: doc.data().manager,
          list_order_item: doc.data().list_order_item,
          status: doc.data().status,
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

  async updateOrder(id: string, dataUpdate: OrderInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.created_at;
      const result = await OrderModel.doc(id).update(dataUpdate);
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update Order.");
    }
  }

  async deleteOrder(id: string) {
    try {
      const result = await OrderModel.doc(id).delete();
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete Order.");
    }
  }
}
