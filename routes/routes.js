import express from "express";
import {
  registerPasien,
  registerDokter,
} from "../controllers/registerController.js";
import {
  getHistoryPasien,
  getProfilePasien,
  updateProfilePasien,
  updateUserPasien,
} from "../controllers/pasienController.js";
import { login } from "../controllers/loginController.js";
import CekToken from "../middleware/cekToken.js";
const router = express.Router();

router.get("/", CekToken, (req, res) => {
  res.send("Welcome to KneeCheck App");
});

// Register and Login
router.post("/register/pasien", registerPasien);
router.post("/register/dokter", registerDokter);
router.post("/login", login);

router.get("/about", (req, res) => {
  res.send("This is about pages");
});

// Pasien Routes
router.get("/pasien/profile/:id", CekToken, getProfilePasien);
router.post(
  "/pasien/profile/:id/update-profile",
  CekToken,
  updateProfilePasien
);
router.post("/pasien/profile/:id/update-user", CekToken, updateUserPasien);
router.get("/pasien/history/:id", CekToken, getHistoryPasien);

export default router;
