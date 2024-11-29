import multer from "multer";

const xrayUpload = multer({
  storage: multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024,
});

export default xrayUpload;
