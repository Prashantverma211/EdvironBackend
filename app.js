const bodyParser = require("body-parser");
const express = require("express");
const schoolForm = require("./routes/form");
const form = require("./routes/form");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

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
  .connect(
    "mongodb+srv://Akash:Y2F0DTamMRUoUX2l@cluster0.tq8kb.mongodb.net/testing"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    throw err;
  });
