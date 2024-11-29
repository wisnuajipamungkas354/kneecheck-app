import { nanoid } from "nanoid";
import Model from "./connect.js";

class User extends Model {
  constructor() {
    super("user");
  }

  generateId() {
    const idUser = nanoid(12);
    return idUser;
  }

  checkEmptyOrUndefined(...values) {
    const result = values.map((value) => value === undefined || value === "");

    return result.includes(true);
  }
}

const userModel = new User();

export default userModel;
