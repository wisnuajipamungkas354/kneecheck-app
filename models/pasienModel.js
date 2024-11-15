import { customAlphabet, nanoid } from "nanoid";
import Model from "./connect.js";

class Pasien extends Model {

  constructor(tableName) {
    super(tableName);
  }

  generateIdPasien() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1; // getMonth() mengembalikan number 0-11 bukan 1-12
    const suffix = customAlphabet('1234567890', 4);

    return year + month.toString() + suffix().toString();
  }
}

const pasienModel = new Pasien('pasien');

export default pasienModel;