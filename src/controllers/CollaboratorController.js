import axios from "axios";
import pool from "../config/database";
import ServiceCollaborator from "../models/CollaboratorModal";
import bcrypt, { hash } from "bcrypt";
import { createJwtApp } from "../middleware/JwtAction";
const salt = 10;
const randomNumberCodeVerfify = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const registerAccount = async (req, res) => {
  try {
    //name_collaborator	password_collaborator	email_collaborator	gender	address_collaborator	phone	presenter_phone	status_collaborator
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.phone;
    pool.query(
      "SELECT * FROM collaborator WHERE email_collaborator=? AND phone=?",
      [email, phone],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(200).json({ message: "fails" });
        }
        if (result.length > 0) {
          console.log(result);
          return res.status(200).json({ message: "account already exits" });
        } else {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              return res.status(200).json({ message: "fails to register" });
            } else {
              pool.query(
                "INSERT INTO collaborator(name_collaborator, password_collaborator, email_collaborator, phone, status_collaborator, status_leader, status_verify, code_verify) VALUES(?,?,?,?,?,?,?,?)",
                [name, hash, email, phone, 1, 1, 0, randomNumberCodeVerfify()],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return res.status(200).json({ message: "failt" });
                  }
                  if (result) {
                    pool.query(
                      "INSERT INTO payment (total_recived, total_withdrawn, id_collaborator) VALUES (?,?,?)",
                      [0, 0, result.insertId],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                        }
                        if (result) {
                          console.log(result);
                          return res
                            .status(200)
                            .json({ message: "success to register" });
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const loginAccount = (req, res) => {
  try {
    let email = req.body.payload.email;
    let password = req.body.payload.password;
    pool.query(ServiceCollaborator.login, [email, email], (err, data) => {
      if (err) {
        return res.status(200).json({ message: "fails" });
      }
      if (data.length > 0) {
        console.log(data[0]);
        bcrypt.compare(
          password.toString(),
          data[0].password_collaborator,
          (err, response) => {
            if (err) {
              console.error(err);
              return res.status(200).json({ message: "fails" });
            }
            if (response) {
              pool.query(
                ServiceCollaborator.login,
                [email, email],
                (err, data) => {
                  if (err) {
                    console.log(err);
                  }
                  if (data) {
                    let payload = {
                      data: data,
                    };
                    let token = createJwtApp(payload);
                    if (data && token) {
                      res.cookie("jwt", token, { httpOnly: true });
                    }
                    return res.status(200).json({
                      message: "success",
                      data,
                      access_token: token,
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "fails" });
  }
};

const codeVerify = (req, res) => {
  try {
    let code_verify = req.body.code;
    pool.query(ServiceCollaborator.verify, [code_verify], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(200).json({ message: "fails" });
      }
      if (data) {
        pool.query(
          ServiceCollaborator.updateStatusVerify,
          [1, code_verify],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(200).json({ message: "fails" });
            }
            if (result) {
              return res.status(200).json({ message: "success" });
            }
          }
        );
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "fails" });
  }
};

const presenterPhone = (req, res) => {
  let id_collaborator = req.body.id;
  let phone = req.body.phone;
  let presenter_phone = req.body.presenter_phone;
  pool.query(
    ServiceCollaborator.presenter,
    [presenter_phone, 2, id_collaborator, phone],
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(200).json({ message: "fails" });
      }
      if (data) {
        return res.status(200).json({ message: "success" });
      }
    }
  );
};

const getAccount = (req, res) => {
  return res.status(200).json({
    message: "success",
    data: {
      access_token: req.token,
      email: req.user,
    },
  });
};

const signOutAccount = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "fails" });
  }
};

module.exports = {
  registerAccount,
  loginAccount,
  codeVerify,
  presenterPhone,
  getAccount,
  signOutAccount,
};
