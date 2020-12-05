import { PromotionModel } from "../../models";
import { PromotionInterface } from "./promotion.interface";

export class PromotionService {
  async createPromotion(data: PromotionInterface) {
    try {
      return await PromotionModel.add(data);
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Create Promotion.");
    }
  }

  async findPromotionById(id: string): Promise<PromotionInterface> {
    try {
      let doc = await PromotionModel.doc(id).get();
      if (!doc.exists) {
        throw new Error("Not Found Promotion.");
      }
      const promotion: PromotionInterface = {
        _id: doc.id,
        created_at: doc.data().created_at,
      };
      return promotion;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find Promotion.");
    }
  }

  async findAllPromotion(): Promise<PromotionInterface[]> {
    try {
      let collection = await PromotionModel.get();
      if (collection.empty) {
        throw new Error("No documents..");
      }
      const promotions: PromotionInterface[] = [];
      collection.forEach((doc) => {
        const promotion: PromotionInterface = {
          _id: doc.id,
          created_at: doc.data().created_at,
        };
        promotions.push(promotion);
      });
      return promotions;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find All Promotion.");
    }
  }

  async updatePromotion(id: string, dataUpdate: PromotionInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.created_at;
      const result = await PromotionModel.doc(id).update(dataUpdate);
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update Promotion.");
    }
  }

  async deletePromotion(id: string) {
    try {
      const result = await PromotionModel.doc(id).delete();
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete Promotion.");
    }
  }
}
