export class UserInterface {
  _id?: string;
  username: string;
  password: string;
  role: "manager" | "admin";
  created_at: number;
}
