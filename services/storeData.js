import { Storage } from "@google-cloud/storage";
import path from "path";
import historyXrayModel from "../models/historyXrayModel.js";

// const pathKey = path.resolve("./serviceaccountkey.json");

const gcs = new Storage({
  projectId: "knee-check-app",
  // keyFile: pathKey,
});

const bucketName = "kneecheck-app-storage";
const bucket = gcs.bucket(bucketName);

const generateFileName = (originName, generateId) => {
  const ext = path.extname(originName);
  return `${generateId}${ext}`;
};

const uploadImg = async (req, res, next) => {
  const id = historyXrayModel.generateId();
  const newFileName = generateFileName(req.file.originalname, id);
  const file = bucket.file(`xray-histories/${newFileName}`);

  const stream = file.createWriteStream({
    resumable: false,
  });

  stream.on("error", (err) => {
    res
      .status(500)
      .json({ status: "fail", message: "Tidak bisa terhubung dengan GCS" });
  });

  stream.on("finish", () => {
    req.url = `https://storage.googleapis.com/${bucketName}/${file.name}`;
    req.folderFile = file.name;
    req.id = id;
    next();
  });

  stream.end(req.file.buffer);
};

export { uploadImg, bucket };
