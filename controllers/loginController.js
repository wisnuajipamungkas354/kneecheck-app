import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dokterModel from "../models/dokterModel.js";
import pasienModel from "../models/pasienModel.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCheck = await userModel.select().where("email", "=", email).get();

    if (userCheck.length > 0) {
      const user = userCheck[0];
      const checkPassword = await bcrypt.compare(password, user.password);
      let name;
      if (checkPassword) {
        const payload = {
          id_user: user.id,
          email: user.email,
          userType: user.user_type,
        };

        if(user.user_type === 'Dokter') {
          name = await dokterModel.where('id_user', '=', user.id).value('name');
        } else {
          name = await pasienModel.where('id_user', '=', user.id).value('name');
        }

        const token = jwt.sign(payload, "kN33cH3k", { expiresIn: "1day" });
        res.json({ token, id_user: user.id, name, userType: user.user_type });
      } else {
        res
          .status(400)
          .send({ 
            status: "fail",
            message: "Incorrect password. Please try again" 
          });
      }
    } else {
      res.status(404).send({
        status: "fail",
        message: "Email address not found" 
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export { login };
