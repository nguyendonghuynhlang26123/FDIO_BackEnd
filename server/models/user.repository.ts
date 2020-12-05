import { db } from "../connectFirebase";

export const UserRepository = db.collection("users");