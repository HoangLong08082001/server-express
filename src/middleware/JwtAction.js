import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const createJwtWebsite = () => {};
const createJwtApp = (payload) => {
  let token = null;
  try {
    token = jwt.sign(payload, "apec-global-0827778666", {
      expiresIn: 2629800,
    });
  } catch (error) {
    console.log(error);
  }
  return token;
};

module.exports = { createJwtApp, createJwtWebsite };
