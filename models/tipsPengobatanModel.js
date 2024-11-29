import { nanoid } from "nanoid";
import Model from "./connect.js";

class TipsPengobatan extends Model {

  constructor() {
    super('tips-pengobatan');
  }

  generateId() {
    const idPengobatan = nanoid(11);
    return idPengobatan;
  }
}

const tipsPengobatanModel = new TipsPengobatan();

export default tipsPengobatanModel;