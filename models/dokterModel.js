import { customAlphabet, nanoid } from "nanoid";
import Model from "./connect.js";

class Dokter extends Model {

  constructor() {
    super('dokter');
  }

  generateId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1; // getMonth() mengembalikan number 0-11 bukan 1-12
    const suffix = customAlphabet('1234567890', 4);

    return 'D' + year + month.toString() + suffix().toString();
  }
}

const dokterModel = new Dokter();

export default dokterModel;