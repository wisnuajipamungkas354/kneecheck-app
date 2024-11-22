import { customAlphabet, nanoid } from "nanoid";
import Model from "./connect.js";

class HistoryXray extends Model {
  constructor() {
    super("history_xray");
  }

  generateId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1; // getMonth() mengembalikan number 0-11 bukan 1-12
    const suffix = customAlphabet("1234567890axray", 6);

    return "XRAY-" + year + month.toString() + suffix().toString();
  }
}

const historyXrayModel = new HistoryXray();

export default historyXrayModel;
