const mongoose = require("mongoose");

// Select: false permet de rendre le champ non visible dans les résultats de query par défaut
// timestamps: true permet d'avoir les timestamps de création et modification enregistrés dans la BDD par défaut
const userSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, select: false },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true, select: false },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    isEmailValidated: { type: Boolean, default: false, select: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
