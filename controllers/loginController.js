import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const { email, password } = req.body;
  const userCheck = await userModel.select().where("email", "=", email).get();

  if (userCheck.length > 0) {
    const user = userCheck[0];
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      const payload = { email: user.email };
      const token = jwt.sign(payload, "kN33cH3k", { expiresIn: "1day" });
      res.send({
        email: email,
        success: true,
        token: token,
        user_type: user.user_type,
      });
    } else {
      res.status(400).send({ message: "password salah" });
    }
  } else {
    res.status(404).send({ email: "Email not Found" });
  }
};

export { login };
