import { UserRepository } from "../../models/user.repository";
import { UserInterface } from "./user.interface";
import * as bcrypt from "bcrypt";

export class UserService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hashSync(password, saltRounds);
  }

  async createUser(data: UserInterface) {
    try {
      if (!data.username || !data.password) {
        throw new Error("Cannot Create User.");
      }
      data.created_at = Date.now();
      delete data._id;
      data.password = await this.hashPassword(data.password);
      return await UserRepository.add(data);
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Create User.");
    }
  }

  async findUserById(id: string): Promise<UserInterface> {
    try {
      let doc = await UserRepository.doc(id).get();
      if (!doc.exists) {
        throw new Error("Not Found User.");
      }
      const user: UserInterface = {
        _id: doc.id,
        username: doc.data().username,
        password: null,
        created_at: doc.data().created_at,
      };
      return user;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find User.");
    }
  }

  async findAllUser(): Promise<UserInterface[]> {
    try {
      let collection = await UserRepository.get();
      if (collection.empty) {
        throw new Error("No documents..");
      }
      const users: UserInterface[] = [];
      collection.forEach((doc) => {
        const user: UserInterface = {
          _id: doc.id,
          username: doc.data().username,
          password: null,
          created_at: doc.data().created_at,
        };
        users.push(user);
      });
      return users;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Find All User.");
    }
  }

  async updateUser(id: string, dataUpdate: UserInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.username;
      delete dataUpdate.password;
      delete dataUpdate.created_at;
      const result = await UserRepository.doc(id).update(dataUpdate);
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update User.");
    }
  }

  async changePasswordUser(id: string, newPassword: string) {
    try {
      newPassword = await this.hashPassword(newPassword);
      const result = await UserRepository.doc(id).update({
        password: newPassword,
      });
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Update User.");
    }
  }

  async deleteUser(id: string) {
    try {
      const result = await UserRepository.doc(id).delete();
      return result;
    } catch (e) {
      console.log(e);
      throw new Error("Cannot Delete User.");
    }
  }
}
