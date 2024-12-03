import { nanoid } from "nanoid";
import Model from "./connect.js";

class TipsPengobatan extends Model {
  constructor() {
    super("tips_pengobatan");
  }
}

const tipsPengobatanModel = new TipsPengobatan();

export default tipsPengobatanModel;
