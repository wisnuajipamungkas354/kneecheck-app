// import connection from "../models/connect.js";
import pasienModel from "../models/pasienModel.js";
import dokterModel from "../models/dokterModel.js";
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";

const registerPasien = async (req, res) => {
  try {
    const id_user = userModel.generateId();
    const id_pasien = pasienModel.generateId();
    const userType = "Pasien";
    const { email, password, name, gender, birth, address } = req.body;
    if (
      userModel.checkEmptyOrUndefined(
        email,
        password,
        name,
        gender,
        birth,
        address
      ) === true
    ) {
      res.status(400).send({
        status: "fail",
        message: "Please fill out the form correctly",
      });
      return false;
    }

    gender = gender.toUpperCase().substr(1,1);

    if (validator.isEmail(email) === true) {
      const checkEmail = await userModel
        .select()
        .where("email", "=", email)
        .exists();

      if (checkEmail === 1) {
        res.status(400).send({
          status: "fail",
          message: "This email is already taken. Please choose a different one",
        });
      } else {
        const hashPassword = await bcrypt.hash(password, 8);
        const user = await userModel.create(
          id_user,
          email,
          hashPassword,
          userType
        );
        const pasien = await pasienModel.create(
          id_pasien,
          id_user,
          name,
          gender,
          birth,
          address
        );
        res.send({
          status: "success",
          message: "Account created successfully! You can now log in",
        });
      }
    } else {
      res.status(400).send({
        status: "fail",
        message: "Invalid email format. Please enter a valid email address",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message,
    });
  }
};

const registerDokter = async (req, res) => {
  try {
    const id_user = userModel.generateId();
    const id_dokter = dokterModel.generateId();
    const userType = "Dokter";

    const { email, password, name, gender, address, hospital } = req.body;

    if (
      userModel.checkEmptyOrUndefined(
        email,
        password,
        name,
        gender,
        address,
        hospital
      ) === true
    ) {
      res.status(400).send({
        status: "fail",
        message: "Please fill out the form correctly",
      });
      return false;
    }

    gender = gender.toUpperCase().substr(1,1);

    if (validator.isEmail(email) === true) {
      const checkEmail = await userModel
        .select()
        .where("email", "=", email)
        .exists();

      if (checkEmail === 1) {
        res.status(400).send({
          statu: "fail",
          message: "This email is already taken. Please choose a different one",
        });
      } else {
        const hashPassword = await bcrypt.hash(password, 8);
        const user = await userModel.create(
          id_user,
          email,
          hashPassword,
          userType
        );
        const dokter = await dokterModel.create(
          id_dokter,
          id_user,
          name,
          gender,
          address,
          hospital
        );
        res.status(201).send({
          status: "success",
          message: "Account created successfully! You can now log in",
        });
      }
    } else {
      res.status(400).send({
        status: "fail",
        message: "Invalid email format. Please enter a valid email address",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "fail",
      message: err.message,
    });
  }
};

export {
  registerPasien,
  registerDokter,
};
