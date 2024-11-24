import dokterModel from "../models/dokterModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import historyXrayModel from "../models/historyXrayModel.js";

const getProfileDokter = async (req, res) => {
  const profileDokter = await dokterModel
    .where("id_user", "=", req.id_user)
    .first();
  if (profileDokter.length < 0) {
    res.status(404).send({
      status: "fail",
      message: "Dokter tidak ditemukan",
    });
    return;
  }

  profileDokter[0].email = req.email;
  profileDokter[0].userType = req.userType;

  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil data",
    data: profileDokter
  });
};

const getAllDokter = async (req, res) => {
  const allDokter = await dokterModel.select().get();
  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil data",
    data: allDokter
  });
};

const updateProfileDokter = async (req, res) => {
  const { name, gender, address, hospital } = req.body;

  if (
    userModel.checkEmptyOrUndefined(name, gender, address, hospital) === true
  ) {
    res.status(400).send({ 
      status: "fail",
      message: "Please fill out the form correctly" 
    });
    return;
  }

  try {
    const result = await dokterModel.where("id_user", "=", req.id_user).update({
      name,
      gender,
      address,
      hospital,
    });

    if (result.code !== undefined) {
      throw new Error("Update Profile Failed");
    } else {
      res.status(200).send({
        status: "success",
        message: "Update Profile Success!"
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message
    });
  }
};

const updateUserDokter = async (req, res) => {
  const { email, password, verifyPassword } = req.body;
  if (
    userModel.checkEmptyOrUndefined(email, password, verifyPassword) === true
  ) {
    res.status(400).send({ 
      status: "fail",
      message: "Please fill out the form correctly" 
    });
    return;
  }

  if (password !== verifyPassword) {
    res.status(401).send({
      status: "fail",
      message: "Password and Verify Password does not macth!"
    });
    return;
  }
  try {
    const hashPassword = await bcrypt.hash(password, 8);
    const result = await userModel.where("id", "=", req.id_user).update({
      email,
      password: hashPassword,
    });

    if (result.code !== undefined) {
      throw new Error("Update Profile Failed");
    } else {
      res.status(200).send({
        status: "success",
        message: "Update Profile Success!"
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message
    });
  }
};

const getAllHistory = async (req, res) => {
  try {
    const historyPasien = await historyXrayModel.select().get();
    res.send({ historyPasien });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export {
  getProfileDokter,
  getAllDokter,
  updateProfileDokter,
  updateUserDokter,
  getAllHistory,
};
