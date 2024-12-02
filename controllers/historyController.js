import historyXrayModel from "../models/historyXrayModel.js";
import tipsPengobatanModel from "../models/tipsPengobatanModel.js";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";
import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const xrayPredictionController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = path.join(req.file.path);
    const form = new FormData();
    form.append("imagefile", fs.createReadStream(filePath));

    const flaskResponse = await axios.post(
      "https://kneecheck-app-91798386303.asia-southeast2.run.app/",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );
    fs.unlinkSync(filePath);
    const data = flaskResponse.data.data;
    const pengobatan = await tipsPengobatanModel
      .select("tips")
      .where("id", "=", data.confidenceScore)
      .first();
    data.pengobatan = pengobatan[0];
    res.json({
      message: "File berhasil dikirim ke Flask",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { xrayPredictionController };
