import bcrypt from "bcryptjs";
import pasienModel from "../models/pasienModel.js";
import userModel from "../models/userModel.js";
import historyXrayModel from "../models/historyXrayModel.js";

const getProfilePasien = async (req, res) => {
  let profilePasien = await pasienModel
    .where("id_user", "=", req.id_user)
    .first();

  if (!profilePasien) {
    res.status(404).send({
      status: "fail",
      message: "Pasien tidak ditemukan",
    });
    return;
  }

  profilePasien.email = req.email;
  profilePasien.user_type = req.user_type;

  res.status(200).json({
    status: "success",
    message: "Data pasien ditemukan!",
    data: profilePasien,
  });
};

const updateProfilePasien = async (req, res) => {
  const { name, gender, birth, address } = req.body;

  if (
    (name && gender && birth && address === undefined) ||
    (name && gender && birth && address === null)
  ) {
    res.status(400).send({
      status: "fail",
      message: "Please fill all the form input",
    });
    return;
  }

  try {
    const result = await pasienModel.where("id_user", "=", req.id_user).update({
      name,
      gender,
      birth,
      address,
    });

    if (result.code !== undefined) {
      throw new Error("Update Profile Failed");
    } else {
      res.status(200).send({
        status: "success",
        message: "Update Profile Success!",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message,
    });
  }
};

const updateUserPasien = async (req, res) => {
  const { email, password, verifyPassword } = req.body;

  if (
    (email && password && verifyPassword === undefined) ||
    (email && password && verifyPassword === null)
  ) {
    res.status(400).send({
      status: "fail",
      message: "Please fill out the form correctly",
    });
    return;
  }

  if (password !== verifyPassword) {
    res.status(400).send({
      status: "fail",
      message: "Password and Verify Password does not macth!",
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
        message: "Update Profile Success!",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message,
    });
  }
};

const getHistoryPasien = (req, res) => {
  try {
    const result = historyXrayModel.where("id_user", "=", req.id_user).get();

    if (result.code !== undefined) {
      throw new Error("Failed to get History");
    } else {
      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil data",
        data: result,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message,
    });
  }
};

const getDetailHistoryPasien = async (req, res) => {
  const idHistory = req.params.id;

  try {
    const result = await historyXrayModel.where("id", "=", idHistory).first();
    if (result.code !== undefined) {
      throw new Error("History not found!");
    } else {
      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil data",
        data: result,
      });
    }
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
    });
  }
};

const saveHistoryPasien = (req, res) => {
  //
};

export {
  getProfilePasien,
  updateProfilePasien,
  updateUserPasien,
  getHistoryPasien,
  getDetailHistoryPasien,
  saveHistoryPasien,
};
