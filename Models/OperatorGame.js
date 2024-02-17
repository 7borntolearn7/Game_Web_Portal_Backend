const mongoose = require("mongoose");

const gameDetailsSchema = new mongoose.Schema({
  game: { type: String, required: true },
  secretKey: { type: String, required: true },
  currency: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: false },
  operatorEndpoint: { type: String, required: true },
  winPercentage: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const operatorGameSchema = new mongoose.Schema({
  operatorId: { type: String, required: true },
  name: { type: String, required: true },
  gameDetails: { type: [gameDetailsSchema], required: true }, // Use the gameDetailsSchema for the array
  createdAt: { type: Date, default: Date.now },
});

const OperatorGame = mongoose.model("OperatorGame", operatorGameSchema);

module.exports = OperatorGame;
