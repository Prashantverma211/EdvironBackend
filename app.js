const bodyParser = require("body-parser");
const express = require("express");
const schoolForm = require("./routes/form");
const form = require("./routes/form");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept,Authorization,"
  );
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST,PUT,DELETE,OPTIONS"
    );
    return res.status(200).json({});
  }
  next();
});

app.use((req, res, next) => {
  console.log("starting...");
  next();
});
app.use("/", form);

app.use((req, res, next) => {
  throw new Error("not a correct URL");
});
app.use((error, req, res, next) => {
  const code = error.code || 500;
  const message = error.message || "An error occurred";
  const data = error.data || [];
  // console.log(code, message, data);
  res.status(code).json({ message: message, error: data });
});

mongoose
  .connect("mongodb+srv://assignment:edviron@cluster1.focovdw.mongodb.net/test")
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    throw err;
  });
