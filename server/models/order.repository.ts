import { db } from "../connectFirebase";

export const OrderRepository = db.collection("orders");