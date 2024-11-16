// import connection from "../models/connect.js";
import pasienModel from "../models/pasienModel.js";
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";

const registerPasien = async (req, res) => {
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
    res.status(400).send({ message: "Please fill out the form correctly" });
    return false;
  }

  if (validator.isEmail(email) === true) {
    const checkEmail = await userModel
      .select()
      .where("email", "=", email)
      .get();

    if (checkEmail.length > 0) {
      res.status(400).send({
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
      res.send({ message: "Account created successfully! You can now log in" });
    }
  } else {
    res.status(400).send({
      message: "Invalid email format. Please enter a valid email address",
    });
  }
};

const getAllPasien = async (req, res) => {
  const result = await pasienModel.select().get();
  res.send(result);
};
const getAllUser = async (req, res) => {
  const result = await userModel.select().get();
  res.send(result);
};

const deletePasien = (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM pasien WHERE id_pasien = ?";
  connection.query(query, [id], (err, rows, fields) => {
    if (err) {
      res.status(500).send({ message: err.sqlMessage });
    } else {
      res.send({ message: "Delete successful" });
    }
  });
};
export { registerPasien, getAllPasien, deletePasien, getAllUser };
