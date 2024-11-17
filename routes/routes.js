import express from "express";
import {
  registerPasien,
  getAllPasien,
  deletePasien,
  getAllUser,
  registerDokter,
} from "../controllers/registerController.js";
import { getProfilePasien } from "../controllers/pasienController.js";
import { login } from "../controllers/loginController.js";
import CekToken from "../middleware/cekToken.js";
const router = express.Router();

router.get("/", CekToken, (req, res) => {
  res.send("Welcome to KneeCheck App");
});

router.get("/pasien", CekToken, getAllPasien);
router.get("/user", CekToken, getAllUser);
router.delete("/pasien/:id", deletePasien);
router.post("/register/pasien", registerPasien);
router.post("/register/dokter", registerDokter);
router.post("/login", login);
router.get("/about", (req, res) => {
  res.send("This is about pages");
});

// Pasien Routes
router.get("/pasien/profile/:id", getProfilePasien);
router.get("/pasien/profile/:id/update", getProfilePasien);

export default router;
