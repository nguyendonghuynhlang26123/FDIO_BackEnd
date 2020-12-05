import { FoodListRepository } from "../../models/index";
import { FoodListInterface } from "./foodList.interface";

export class FoodListService {
  async createFoodList(data: FoodListInterface) {
    try {
      return await FoodListRepository.add(data);
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Create Food List.");
    }
  }

  async findFoodListById(id: string): Promise<FoodListInterface> {
    try {
      let doc = await FoodListRepository.doc(id).get();
      if (!doc.exists) {
        throw new Error("Not Found Food List.");
      }
      const foodList: FoodListInterface = {
        _id: doc.id,
        created_at: doc.data().created_at,
      };
      return foodList;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find Food List.");
    }
  }

  async findAllFoodList(): Promise<FoodListInterface[]> {
    try {
      let collection = await FoodListRepository.get();
      if (collection.empty) {
        throw new Error("No documents..");
      }
      const foodLists: FoodListInterface[] = [];
      collection.forEach((doc) => {
        const foodList: FoodListInterface = {
          _id: doc.id,
          created_at: doc.data().created_at,
        };
        foodLists.push(foodList);
      });
      return foodLists;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find All Food List.");
    }
  }

  async updateFoodList(id: string, dataUpdate: FoodListInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.created_at;
      const result = await FoodListRepository.doc(id).update(dataUpdate);
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update Food List.");
    }
  }

  async deleteFoodList(id: string) {
    try {
      const result = await FoodListRepository.doc(id).delete();
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete Food List.");
    }
  }
}
