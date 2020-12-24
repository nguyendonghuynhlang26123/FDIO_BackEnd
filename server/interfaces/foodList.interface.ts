export class FoodListInterface {
  _id?: string;
  name: string;
  listId: string[]; // array Food id
  thumbnail: string;
  created_at: number;
  ui_type: number;
}
