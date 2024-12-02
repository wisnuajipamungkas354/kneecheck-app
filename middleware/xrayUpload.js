import multer from "multer";
import crypto from "crypto";

const TYPE_IMAGE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};
// menyimpan
const storage = multer.diskStorage({
  // menyimpan file di folder images
  destination(req, file, cb) {
    cb(null, "images");
  },
  // nama file
  filename(req, file, cb) {
    const uuid = crypto.randomUUID();
    const ext = TYPE_IMAGE[file.mimetype];
    cb(null, `${uuid}.${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  const acceptMime = Object.keys(TYPE_IMAGE);
  if (!acceptMime.includes(file.mimetype)) {
    cb({ message: "Tidak bisa" }, false);
  } else {
    cb(null, true);
  }
};
const maxSized = 1 * 1024 * 1024;
const uploadXray = multer({
  storage,
  fileFilter,
  limits: { fullSize: maxSized },
});

export { uploadXray };
