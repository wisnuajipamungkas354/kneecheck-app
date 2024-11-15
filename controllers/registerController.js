// import connection from "../models/connect.js";
import pasienModel from "../models/pasienModel.js";
import userModel from "../models/userModel.js";
import validator from "validator";
import mysql from "mysql";
import bcrypt from "bcryptjs";

const registerPasien = (req, res) => {
  const id_user = userModel.generateId();
  const id_pasien = pasienModel.generateId();
  const userType = "Pasien";

  const { email, password, name, gender, birth, address } = req.body;

  if (validator.isEmail(email) === true) {
    userModel
      .connect()
      .query(
        userModel.select().where("email", "=", email).get(),
        async (err, rows, fields) => {
          if (err) {
            res.status(500).send({ message: err.sqlMessage });
          }
          if (rows.length > 0) {
            res
              .status(400)
              .send({ message: "that email has already been used" });
            return false;
          }
          const hashPassword = await bcrypt.hash(password, 8);
          userModel
            .connect()
            .query(
              userModel.create(id_user, email, hashPassword, userType),
              (err, rows) => {
                if (err) {
                  res.status(500).send({ message: err.sqlMessage });
                } else {
                  pasienModel
                    .connect()
                    .query(
                      pasienModel.create(
                        id_pasien,
                        id_user,
                        name,
                        gender,
                        birth,
                        address
                      ),
                      (err, rows) => {
                        if (err) {
                          res.status(500).send({
                            message: err.sqlMessage,
                            pesan: userModel.create(
                              id_pasien,
                              id_user,
                              name,
                              gender,
                              birth,
                              address
                            ),
                          });
                        } else {
                          res.send({ message: "Success Register" });
                        }
                      }
                    );
                }
              }
            );
          // res.send({ id_user, id_pasien, email, password: hashPassword });
        }
      );
    // userModel.where('email', '=', email.toString());
    // const checkEmail = "SELECT * FROM user WHERE email = ?;";
    // connection.query(checkEmail, [email], async (err, rows, field) => {
    //   if (err) {
    //     res.status(500).send({ message: err.sqlMessage });
    //   }
    //   if (rows.length > 0) {
    //     res.send({ message: "That Email Has Already" });
    //     return false;
    //   }
    //   let hashPassword = await bcrypt.hash(password, 8);
    //   console.log(hashPassword);
    //   connection.query("INSERT INTO user SET ? ", { id: id_user });
    //   res.send({ email, password: hashPassword });
    // });
  } else {
    res.send({ message: "fail" });
  }

  // pasienModel.connection
  //   const checkEmail = "SELECT * FROM user WHERE email = ?;";
  //   connection.query(checkEmail ,[email], (err, rows, field) => {
  //     if(err){
  //       res.status(500).send({message: err.sqlMessage});
  //     }else{
  //       if(rows){
  //         res.status(400).send({message: 'email sudah ada'});
  //       }else{
  //         const addUser = "INSERT INTO user (id, email, password, user_type) VALUES (?, ?, ?, ?)";
  //         connection.query(addUser, [id_user, email, password, userType], (err, rows, fields) => {
  //              if(err){
  //                 res.status(500).send({message: err.sqlMessage});
  //             }else{
  //                 const addPasien = "INSERT INTO pasien (id_pasien, id_user, name, gender, birth, address)";
  //                 connection.query(addPasien, [id_pasien, id_user, name, gender, birth, address], (err, rows, fields) => {
  //                     if(err){
  //                         res.status(500).send({message: err.sqlMessage});
  //                     }else{
  //                         res.send({message: "Insert Successful"});
  //                     }
  //                 })
  //             }
  //         })
  //       }
  //     }
  //   })
};

const getAllPasien = (req, res) => {
  pasienModel.select();
  const pasien = pasienModel
    .connect()
    .query(pasienModel.select().get(), (err, rows, fields) => {
      if (err) {
        res.status(500).send({ message: err.sqlMessage });
      } else {
        const data = rows;
        res.json(data);
      }
    });
  // pasienModel.get();
};
const getAllUser = (req, res) => {
  const pasien = userModel
    .connect()
    .query(userModel.select().get(), (err, rows, fields) => {
      if (err) {
        res.status(500).send({ message: err.sqlMessage });
      } else {
        const data = rows;
        res.json(data);
      }
    });
  // pasienModel.get();
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
