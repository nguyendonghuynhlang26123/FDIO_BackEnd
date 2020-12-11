import { PromotionModel } from "../../models";
import { PromotionInterface } from "../../interfaces";

export class PromotionService {
  async createPromotion(data: PromotionInterface) {
    try {
      if (
        !data.name ||
        !data.start_date ||
        !data.closing_date ||
        !data.thumbnail ||
        !data.discount
      ) {
        throw new Error("Cannot Create Promotion. Has Null Field.");
      }
      data.created_at = Date.now();
      delete data._id;
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
        return null;
      }
      const promotion: PromotionInterface = {
        _id: doc.id,
        name: doc.data().name,
        start_date: doc.data().start_date,
        closing_date: doc.data().closing_date,
        thumbnail: doc.data().stthumbnailring,
        discount: doc.data().discount,
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
        return [];
      }
      const promotions: PromotionInterface[] = [];
      collection.forEach((doc) => {
        const promotion: PromotionInterface = {
          _id: doc.id,
          name: doc.data().name,
          start_date: doc.data().start_date,
          closing_date: doc.data().closing_date,
          thumbnail: doc.data().stthumbnailring,
          discount: doc.data().discount,
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
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update Promotion.");
    }
  }

  async deletePromotion(id: string) {
    try {
      const result = await PromotionModel.doc(id).delete();
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete Promotion.");
    }
  }
}
