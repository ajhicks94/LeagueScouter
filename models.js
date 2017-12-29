const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
  });

mongoose.model("User", nameSchema);