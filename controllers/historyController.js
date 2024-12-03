import historyXrayModel from "../models/historyXrayModel.js";
import tipsPengobatanModel from "../models/tipsPengobatanModel.js";
import path from "path";
import { bucket } from "../services/storeData.js";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";
import { fileURLToPath } from "url";

const xrayPredictionController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const id = req.id;
    const filePath = req.url;
    const folderFile = req.folderFile;
    const file = bucket.file(folderFile);
    const fileStream = file.createReadStream();
    const form = new FormData();
    form.append("imagefile", fileStream, filePath);
    const flaskResponse = await axios.post(
      "https://kneecheck-app-python-91798386303.asia-southeast2.run.app/",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );
    if (flaskResponse.data.status !== "success") {
      res
        .status(500)
        .json({ status: "fail", message: "Failed connect to flask" });
      return false;
    }
    const data = flaskResponse.data.data;
    data.url = filePath;
    const pengobatan = await tipsPengobatanModel
      .select("tips")
      .where("id", "=", data.confidenceScore)
      .first();
    data.pengobatan = pengobatan[0];
    res.json({
      status: "success",
      message: "File berhasil dikirim ke Flask",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { xrayPredictionController };
