const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    gameUrl: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    description: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
