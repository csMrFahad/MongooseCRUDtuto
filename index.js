const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const todoHandler = require("./routeHandler/todoHandler.js");

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGO_ADMIN_NAME +
      ":" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.dhpqr.mongodb.net/MongooseCRUD?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));


app.use('/todo', todoHandler)

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(process.env.PORT, () => {
  console.log(`listening at port ${process.env.PORT}`);
});
