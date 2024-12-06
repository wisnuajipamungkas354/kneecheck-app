import dokterModel from "../models/dokterModel.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import historyXrayModel from "../models/historyXrayModel.js";
import dateFormat from "dateformat";
import pasienModel from "../models/pasienModel.js";
import tipsPengobatanModel from "../models/tipsPengobatanModel.js";
import moment from "moment";

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

  profileDokter.email = req.email;
  profileDokter.userType = req.userType;

  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil data",
    data: profileDokter,
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
    const id_dokter = await dokterModel
      .where("id_user", "=", req.id_user)
      .value("id_dokter");
    let result = await historyXrayModel.customQuery(
      `SELECT pasien.id_pasien, pasien.name, pasien.gender,pasien.birth, pasien.address, history_xray.id_xray, history_xray.img, history_xray.confidence_score, history_xray.label, history_xray.tgl_scan, tips_pengobatan.tips as pengobatan FROM history_xray JOIN pasien ON pasien.id_pasien = history_xray.id_pasien JOIN tips_pengobatan ON tips_pengobatan.id = history_xray.confidence_score WHERE history_xray.id_scanner = "${id_dokter}" ORDER BY history_xray.tgl_scan DESC`
    );
    if (result.code !== undefined) {
      throw new Error("Failed to get History");
    } else {
      const fixResult = result.map((r) => {
        const { gender, birth, tgl_scan } = r;
        gender === "L" ? (r.gender = "Laki-laki") : (r.gender = "Perempuan");
        r.birth = dateFormat(birth, "dddd, dd mmmm yyyy");
        r.tgl_scan = dateFormat(tgl_scan, "dddd, dd mmmm yyyy");
        return r;
      });
      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil data",
        data: fixResult,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message,
    });
  }
};

const saveHistoryDokter = async (req, res) => {
  try {
    const { id_xray, img, confidence_score, label, id_pasien } = req.body;
    const id_scanner = await dokterModel
      .where("id_user", "=", req.id_user)
      .value("id_dokter");
    // const id_pasien = id_scanner;
    const timestamp = new Date();
    const currentDate = dateFormat(timestamp, "yyyy-mm-dd");

    const result = await historyXrayModel.create(
      id_xray,
      id_scanner,
      id_pasien,
      img,
      confidence_score,
      label,
      currentDate
    );

    if (result.code !== undefined) {
      throw new Error("Update Profile Failed");
    } else {
      return res.status(201).json({
        status: "success",
        message: "Berhasil menyimpan ke histori",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Gagal menyimpan ke history",
    });
  }
};

const saveHistoryNewPasien = async (req, res) => {
  try {
    const {
      id_xray,
      img,
      confidence_score,
      label,
      name,
      gender,
      birth,
      address,
    } = req.body;
    const id_pasien = pasienModel.generateId();

    const resultPasien = await pasienModel.create(
      id_pasien,
      null,
      name,
      gender,
      birth,
      address
    );
    if (resultPasien.code !== undefined) {
      throw new Error("Gagal menambahkan data pasien");
    }

    const id_scanner = await dokterModel
      .where("id_user", "=", req.id_user)
      .value("id_dokter");
    const timestamp = new Date();
    const currentDate = dateFormat(timestamp, "yyyy-mm-dd");

    const result = await historyXrayModel.create(
      id_xray,
      id_scanner,
      id_pasien,
      img,
      confidence_score,
      label,
      currentDate
    );

    if (result.code !== undefined) {
      throw new Error("Update Profile Failed");
    } else {
      return res.status(201).json({
        status: "success",
        message: "Berhasil menyimpan ke histori",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Gagal menyimpan ke history",
    });
  }
};

const dashboardDokter = async (req, res) => {
  try {
    const age = await dokterModel.customQuery(
      "SELECT TIMESTAMPDIFF(YEAR, pasien.birth, CURDATE()) AS average, COUNT(*) AS total FROM pasien JOIN history_xray ON pasien.id_pasien = history_xray.id_pasien GROUP BY average ORDER BY total DESC LIMIT 1;"
    );
    const gender = await dokterModel.customQuery(
      "SELECT pasien.gender AS average, COUNT(*) AS total FROM pasien JOIN history_xray ON pasien.id_pasien = history_xray.id_pasien GROUP BY average ORDER BY total DESC LIMIT 1;"
    );
    age[0].average = `${age[0].average} Tahun`;
    gender[0].average = gender[0].average === "L" ? "Laki-laki" : "Perempuan";
    // const keseluruhan = await historyXrayModel.count("id_xray");
    const keseluruhan = await historyXrayModel.customQuery(
      "SELECT COUNT(*) as total FROM history_xray"
    );
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
  saveHistoryDokter,
  saveHistoryNewPasien,
  dashboardDokter,
};
