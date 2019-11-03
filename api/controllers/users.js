const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Log = require("./../../helpers/Log");

const User = require("./../models/user");

exports.get_all_users = (req, res, next) => {
  User.find()
    .select("email nom prenom")
    .exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => Log(error, "error"));
};

exports.signup_user = async (req, res, next) => {
  const userDB = await User.findOne({ email: req.body.email }).exec();
  if (userDB) {
    return res.status(409).json({
      message: "Mail exists"
    });
  }

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      Log("Bcrypt error : " + err, "error");
      return res.status(500).json({
        error: err
      });
    }

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hash,
      nom: req.body.nom,
      prenom: req.body.prenom
    });

    user
      .save()
      .then(result => {
        console.log(result);
        // Pour éviter de se reconnecter après création de l'utilisateur, on le connecte directement
        const token = createJWT(user._id, user.email);
        return res.status(200).json({
          message: "Auth successful",
          token: token
        });
      })
      .catch(err => {
        Log("User save" + err, "error");
        res.status(500).json({
          error: err
        });
      });
  });
};

exports.login_user = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: "Login failed"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, success) => {
        // si erreur de comparaison ou mauvais mdp
        if (err || !success) {
          return res.status(401).json({
            error: "Login failed"
          });
        } else {
          // si mdp OK
          const token = createJWT(user._id, user.email);
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
      });
    })
    .catch(err => {
      Log("Login user error " + err, "error");
      res.status(401).json({
        error: "Login failed"
      });
    });
};

function createJWT(userId, userEmail) {
  return jwt.sign(
    {
      userEmail: userEmail,
      userId: userId
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h"
    }
  );
}
