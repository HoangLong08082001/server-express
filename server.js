const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
import CollaboratorRoute from "./src/routes/CollaboratorRoute";
import TeamRoutes from "./src/routes/TeamRoutes";
import "./src/config/database";
import WebhookRoute from "./src/routes/WebhookRoute";

const socketIO = require("socket.io");
const io = socketIO();
dotenv.config();
const app = express();
const server = http.createServer(app);
let port = process.env.PORT_SERVER || 3031;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
WebhookRoute(app);
CollaboratorRoute(app);
TeamRoutes(app);
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server is running on the port " + port);
  }
});
