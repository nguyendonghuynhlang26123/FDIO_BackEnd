import { db } from "../connectFirebase";

export const FoodListRepository = db.collection("food-lists");
