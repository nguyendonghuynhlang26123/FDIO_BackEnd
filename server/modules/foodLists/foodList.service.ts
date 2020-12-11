import { FoodListModel } from "../../models";
import { FoodListInterface } from "../../interfaces";

export class FoodListService {
  async createFoodList(data: FoodListInterface) {
    try {
      if (!data.thumbnail) {
        throw new Error("Cannot Create Food List. Has Null Field.");
      }
      data.created_at = Date.now();
      delete data._id;
      return await FoodListModel.add(data);
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Create Food List.");
    }
  }

  async findFoodListById(id: string): Promise<FoodListInterface> {
    try {
      let doc = await FoodListModel.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      const foodList: FoodListInterface = {
        _id: doc.id,
        list: doc.data().list,
        thumbnail: doc.data().thumbnail,
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
      let collection = await FoodListModel.get();
      if (collection.empty) {
        return [];
      }
      const foodLists: FoodListInterface[] = [];
      collection.forEach((doc) => {
        const foodList: FoodListInterface = {
          _id: doc.id,
          list: doc.data().list,
          thumbnail: doc.data().thumbnail,
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
      const result = await FoodListModel.doc(id).update(dataUpdate);
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update Food List.");
    }
  }

  async deleteFoodList(id: string) {
    try {
      const result = await FoodListModel.doc(id).delete();
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete Food List.");
    }
  }
}
