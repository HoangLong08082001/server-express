const express = require("express");
const router = express.Router();
import CollaboratorController from "../controllers/CollaboratorController";
export default function CollaboratorRoute(app) {
  router.post("/register", CollaboratorController.registerAccount);
  router.post("/login", CollaboratorController.loginAccount);
  router.post("/logout", CollaboratorController.signOutAccount);
  router.post("/verify", CollaboratorController.codeVerify);
  router.post("/presenter-phone", CollaboratorController.presenterPhone);
  router.get("/account", CollaboratorController.getAccount);
  return app.use("/collaborator", router);
}
