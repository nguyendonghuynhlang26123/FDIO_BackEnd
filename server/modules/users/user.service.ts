import { UserModel } from '../../models';
import { UserInterface } from '../../interfaces';
import * as bcrypt from 'bcrypt';

export class UserService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hashSync(password, saltRounds);
  }

  async createUser(data: UserInterface) {
    try {
      if (!data.username || !data.password) {
        throw new Error('Cannot Create User.');
      }
      data.created_at = Date.now();
      data.role = 'manager';
      delete data._id;
      data.password = await this.hashPassword(data.password);
      return await UserModel.add(data);
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Create User.');
    }
  }

  async findUserById(id: string): Promise<UserInterface> {
    try {
      let doc = await UserModel.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      const user: UserInterface = {
        _id: doc.id,
        username: doc.data().username,
        password: null,
        role: doc.data().role,
        created_at: doc.data().created_at,
      };
      return user;
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Find User.');
    }
  }

  async findAllUser(): Promise<UserInterface[]> {
    try {
      let collection = await UserModel.get();
      if (collection.empty) {
        return [];
      }
      const users: UserInterface[] = [];
      collection.forEach((doc) => {
        const user: UserInterface = {
          _id: doc.id,
          username: doc.data().username,
          password: null,
          role: doc.data().role,
          created_at: doc.data().created_at,
        };
        users.push(user);
      });
      return users;
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Find All User.');
    }
  }

  async updateUser(id: string, dataUpdate: UserInterface) {
    try {
      delete dataUpdate._id;
      delete dataUpdate.username;
      delete dataUpdate.password;
      delete dataUpdate.created_at;
      delete dataUpdate.role;
      const result = await UserModel.doc(id).update(dataUpdate);
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Update User.');
    }
  }

  async changePasswordUser(id: string, newPassword: string) {
    try {
      newPassword = await this.hashPassword(newPassword);
      const result = await UserModel.doc(id).update({
        password: newPassword,
      });
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Update User.');
    }
  }

  async deleteUser(id: string) {
    try {
      const result = await UserModel.doc(id).delete();
      return { _id: id, result: result };
    } catch (e) {
      console.log(e);
      throw new Error('Cannot Delete User.');
    }
  }

  async findUserByUsername(username: string): Promise<UserInterface> {
    try {
      let doc = await UserModel.where('username', '==', username)
        .limit(1)
        .get();
      if (!doc.empty) {
        throw new Error('Not Found User.');
      }

      const user: UserInterface = {
        _id: doc[0].id,
        username: doc[0].data().username,
        password: doc[0].data().password,
        role: doc[0].data().role,
        created_at: doc[0].data().created_at,
      };
      return user;
    } catch (e) {
      throw new Error('Cannot Find User.');
    }
  }
}
