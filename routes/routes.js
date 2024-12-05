import express from "express";
import {
  registerPasien,
  registerDokter,
} from "../controllers/registerController.js";
import {
  getHistoryPasien,
  getProfilePasien,
  homePasien,
  saveHistoryPasien,
  updateProfilePasien,
  updateUserPasien,
} from "../controllers/pasienController.js";
import { login } from "../controllers/loginController.js";
import CekToken from "../middleware/cekToken.js";
import {
  getProfileDokter,
  getAllDokter,
  updateProfileDokter,
  updateUserDokter,
  getAllHistory,
  dashboardDokter,
  saveHistoryDokter,
  saveHistoryNewPasien,
} from "../controllers/dokterController.js";
import { cekTypeDokter, cekTypePasien } from "../middleware/cekUserType.js";
import { cekImg } from "../middleware/cekImg.js";
import { xrayPredictionController } from "../controllers/historyController.js";
import { uploadImg } from "../services/storeData.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    status: "success",
    message: "Berhasil Connect! Deploy V1",
  });
});

// Register and Login
router.post("/register/pasien", registerPasien);
router.post("/register/dokter", registerDokter);
router.post("/login", login);

// Pasien Routes
router.get("/home", CekToken, cekTypePasien, homePasien);
router.get("/pasien/profile", CekToken, cekTypePasien, getProfilePasien);
router.put("/pasien/profile/update-profile", CekToken, updateProfilePasien);
router.put("/pasien/profile/update-user", CekToken, cekTypePasien, updateUserPasien);
router.get("/pasien/history", CekToken, cekTypePasien, getHistoryPasien);
router.post("/pasien/history/save", CekToken, cekTypePasien, saveHistoryPasien);

// Dokter Routes
router.get("/dashboard", CekToken, cekTypeDokter, dashboardDokter);
router.get("/dokter", CekToken, cekTypeDokter, cekTypeDokter, getAllDokter);
router.get("/dokter/history", CekToken, cekTypeDokter, getAllHistory);
router.get("/dokter/profile", CekToken, cekTypeDokter, getProfileDokter);
router.put("/dokter/profile/update-profile", CekToken, cekTypeDokter, updateProfileDokter);
router.put("/dokter/profile/update-user", CekToken, cekTypeDokter, updateUserDokter);
router.post("/dokter/history/save", CekToken, cekTypeDokter,saveHistoryDokter);
router.post("/dokter/history/save-new-pasien", CekToken, cekTypeDokter,saveHistoryNewPasien);

// predict
router.post(
  "/predict",
  CekToken,
  cekImg.single("img"),
  uploadImg,
  xrayPredictionController
);
export default router;
