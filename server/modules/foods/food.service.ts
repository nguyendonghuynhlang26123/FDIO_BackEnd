import { FoodModel } from "../../models";
import { FoodInterface } from "./food.interface";

export class FoodService {
  async createFood(data: FoodInterface) {
    try {
      if (
        !data.name ||
        !data.thumbnail ||
        !data.description ||
        !data.type ||
        !data.price
      ) {
        throw new Error("Cannot Create Food. Has Null Field.");
      }
      data.created_at = Date.now();
      delete data._id;
      return await FoodModel.add(data);
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Create Food.");
    }
  }

  async findFoodById(id: string): Promise<FoodInterface> {
    try {
      let doc = await FoodModel.doc(id).get();
      if (!doc.exists) {
        throw new Error("Not Found Food .");
      }
      const food: FoodInterface = {
        _id: doc.id,
        name: doc.data().name,
        thumbnail: doc.data().thumbnail,
        description: doc.data().description,
        type: doc.data().type,
        price: doc.data().price,
        created_at: doc.data().created_at,
      };
      return food;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find Food.");
    }
  }

  async findAllFood(): Promise<FoodInterface[]> {
    try {
      let collection = await FoodModel.get();
      if (collection.empty) {
        throw new Error("No documents..");
      }
      const foods: FoodInterface[] = [];
      collection.forEach((doc) => {
        const food: FoodInterface = {
          _id: doc.id,
          name: doc.data().name,
          thumbnail: doc.data().thumbnail,
          description: doc.data().description,
          type: doc.data().type,
          price: doc.data().price,
          created_at: doc.data().created_at,
        };
        foods.push(food);
      });
      return foods;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find All Food.");
    }
  }

  async updateFood(id: string, dataUpdate: FoodInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.created_at;
      const result = await FoodModel.doc(id).update(dataUpdate);
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update Food.");
    }
  }

  async deleteFood(id: string) {
    try {
      const result = await FoodModel.doc(id).delete();
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete Food.");
    }
  }
}
