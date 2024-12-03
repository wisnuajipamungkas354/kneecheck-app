import Multer from "multer";
import crypto from "crypto";
// import { updateProfileDokter } from "../controllers/dokterController";

const TYPE_IMAGE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};
const fileFilter = (req, file, cb) => {
  const acceptMime = Object.keys(TYPE_IMAGE);
  if (!acceptMime.includes(file.mimetype)) {
    cb(new Error("Format file tidak didukung!"), false);
  } else {
    cb(null, true);
  }
};

const cekImg = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024,
  fileFilter,
});
export { cekImg };
