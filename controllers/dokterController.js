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
    data: profileDokter[0],
  });
};

const getAllDokter = async (req, res) => {
  const allDokter = await dokterModel.select().get();
  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil data",
    data: allDokter,
  });
};

const updateProfileDokter = async (req, res) => {
  const { name, gender, address, hospital } = req.body;

  if (
    userModel.checkEmptyOrUndefined(name, gender, address, hospital) === true
  ) {
    res.status(400).send({
      status: "fail",
      message: "Please fill out the form correctly",
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

const updateUserDokter = async (req, res) => {
  const { email, password, verifyPassword } = req.body;
  if (
    userModel.checkEmptyOrUndefined(email, password, verifyPassword) === true
  ) {
    res.status(400).send({
      status: "fail",
      message: "Please fill out the form correctly",
    });
    return;
  }

  if (password !== verifyPassword) {
    res.status(401).send({
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

const getAllHistory = async (req, res) => {
  try {
    const historyPasien = await historyXrayModel.select().get();
    res.send({ historyPasien });
  } catch (err) {
    res.status(500).send({ status: "fail", message: err.message });
  }
};

const saveHistoryDokter = async (req, res) => {
  try{
    const { id_xray, img, confidence_score, label, name, gender, birth,  } = req.body;
    const nm_scanner = await dokterModel.where('id_user', '=', req.id_user).value('name');
    const timestamp = new Date();
    const currentDate = dateFormat(timestamp, "yyyy-mm-dd");

    const result = await historyXrayModel.create(id_xray, req.id_user, nm_scanner, img, confidence_score, label, currentDate);

    if (result.code !== undefined) {
      throw new Error("Update Profile Failed");
    } else {
      return res.status(201).json({
        status: "success",
        message: "Berhasil menyimpan ke histori"
      });
    }
    
  } catch(err) {
    return res.status(500).json({
      status: "fail",
      message: "Gagal menyimpan ke history"
    });
  }
};

const dashboardDokter = async (req, res) => {
  try {
    const age = await dokterModel.customQuery(
      "SELECT TIMESTAMPDIFF(YEAR, pasien.birth, CURDATE()) AS average, COUNT(*) AS total FROM pasien JOIN history_xray ON pasien.id_user = history_xray.id_user GROUP BY average ORDER BY total DESC LIMIT 1;"
    );
    const gender = await dokterModel.customQuery(
      "SELECT pasien.gender AS average, COUNT(*) AS total FROM pasien JOIN history_xray ON pasien.id_user = history_xray.id_user GROUP BY average ORDER BY total DESC LIMIT 1;"
    );
    age[0].average = `${age[0].average} Tahun`;
    gender[0].average = gender[0].average === "L" ? "Laki-laki" : "Perempuan";
    const keseluruhan = await historyXrayModel.count();
    const level = {
      normal: await historyXrayModel
        .where("confidence_score", "=", 0)
        .value("COUNT(confidence_score)"),
      kneePain: await historyXrayModel
        .where("confidence_score", "=", 2)
        .value("COUNT(confidence_score)"),
      severeKneePain: await historyXrayModel
        .where("confidence_score", "=", 4)
        .value("COUNT(confidence_score)"),
    };
    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data",
      data: {
        age: age[0] === undefined ? { age: null, total: 0 } : age[0],
        gender:
          gender[0] === undefined ? { gender: null, total: 0 } : gender[0],
        totalScanned:
          keseluruhan[0].total === undefined ? 0 : keseluruhan[0].total,
        label: level,
      },
    });
  } catch (err) {
    res.status(500).send({ status: "fail", message: err.message });
  }
};

export {
  getProfileDokter,
  getAllDokter,
  updateProfileDokter,
  updateUserDokter,
  getAllHistory,
  dashboardDokter,
};
