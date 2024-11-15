import { nanoid } from "nanoid";
import Model from "./connect.js";

class User extends Model {
  constructor() {
    super('user');
  }

  generateId() {
    const idUser = nanoid(12);
    return idUser;
  }
}

const userModel = new User();

export default userModel;