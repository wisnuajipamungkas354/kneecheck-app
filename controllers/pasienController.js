import bcrypt from "bcryptjs";
import pasienModel from "../models/pasienModel.js";
import userModel from "../models/userModel.js";
import historyXrayModel from "../models/historyXrayModel.js";
import dateFormat from "dateformat";

const homePasien = async (req, res) => {
  const caseTotal = await historyXrayModel.count();
  let caseGender = await historyXrayModel.customQuery(
    "SELECT pasien.gender AS average, COUNT(*) AS total_kasus FROM pasien JOIN history_xray ON pasien.id_user = history_xray.id_user GROUP BY average ORDER BY total_kasus DESC LIMIT 1;"
  );
  let caseAge = await historyXrayModel.customQuery(
    "SELECT TIMESTAMPDIFF(YEAR, pasien.birth, CURDATE()) AS average, COUNT(*) AS total_kasus FROM pasien JOIN history_xray ON pasien.id_user = history_xray.id_user GROUP BY average ORDER BY total_kasus DESC LIMIT 1;"
  );
  caseGender.map((d) => d.average == 'L' ? d.average = 'Laki-laki' : d.average = 'Perempuan');
  caseAge.map((d) => d.average = `${d.average} Tahun`);

  res.status(200).json({
    status: "success",
    message: "Fetch data Success",
    data: {
      totalScanned: caseTotal[0]?.total || 0,
      gender: caseGender[0] || 0,
      age: caseAge[0] || 0,
    }
  });
}

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

const saveHistoryPasien = async (req, res) => {
  try{
    const { id_xray, img, confidence_score, label } = req.body;
    const id_scanner = await pasienModel.where('id_user', '=', req.id_user).value('id_pasien');
    const id_pasien = id_scanner;
    const timestamp = new Date();
    const currentDate = dateFormat(timestamp, "yyyy-mm-dd");

    const result = await historyXrayModel.create(id_xray, id_scanner, id_pasien, img, confidence_score, label, currentDate);

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

export {
  homePasien,
  getProfilePasien,
  updateProfilePasien,
  updateUserPasien,
  getHistoryPasien,
  getDetailHistoryPasien,
  saveHistoryPasien,
};
