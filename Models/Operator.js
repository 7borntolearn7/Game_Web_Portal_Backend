const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema({
  operatorId: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, required: true, default: false }, // Adjust the default value as needed
  updatedBy: { type: String, required: true },
});

const Operator = mongoose.model("Operator", operatorSchema);

module.exports = Operator;
