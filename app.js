const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const Log = require("./helpers/Log");
const authCheck = require("./middlewares/authCheck");

// URL à renseigner
const mongodbUrl = process.env.MONGO_ATLAS_URL;

mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true // https://stackoverflow.com/a/51918795
  })
  .then(res => Log("Connected to MongoDB"))
  .catch(error => Log(error, "error"));

/* DEBUT MIDDLEWARES */
// Logging infos (morgan) https://github.com/expressjs/morgan
app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  }
  next();
});

/*
  HEALTH CHECK
  https://youtu.be/62ZRPJkHOX0?t=156
*/
app.get("/api/_health", (req, res) => res.status(200).send("OK"));
/* FIN HEALTH CHECK */

// Authentication
app.use(authCheck);

// Log connection infos
app.use((req, res, next) => {
  Log(`${req.isAuth ? req.userEmail : "No auth"} [${req.method}] ${req.url}`);
  next();
});
/* FIN MIDDLEWARES */

/* DEBUT ROUTES */
// => ce système permet de ne pas avoir à ajouter la ligne de route dans ce fichier à chaque ajout de route dans le dossier api/routes
const routeFiles = fs.readdirSync("./api/routes", (err, files) => {
  if (err) Log(err, "error");
  return files;
});

routeFiles.forEach(file => {
  const fileName = file.split(".")[0];
  app.use(`/api/${fileName}`, require(`./api/routes/${fileName}`));
});
/* FIN ROUTES */

/* DEBUT ERRORS HANDLING */
// if it reaches there, 404
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Handling all errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
/* FIN ERRORS HANDLING */

module.exports = app;
