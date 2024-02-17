const Game = require("../Models/Games");

exports.addGame = async (req, res) => {
  try {
    const { gameId, gameName, gameUrl, isActive, description } = req.body;

    if (
      !gameId ||
      !gameName ||
      !gameUrl ||
      isActive === undefined ||
      !description
    ) {
      return res
        .status(400)
        .json({ status: "RS_ERROR", message: "All fields are required" });
    }

    const existingGame = await Game.findOne({ gameId });

    if (existingGame) {
      return res
        .status(409)
        .json({ status: "RS_ERROR", message: "Game already exists" });
    }

    const newGame = new Game({
      gameId,
      gameName,
      gameUrl,
      isActive,
      description,
      updatedBy: req.user.username,
    });

    const savedGame = await newGame.save();
    res.json({ status: "RS_OK", message: savedGame });
  } catch (error) {
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json({ status: "RS_OK", message: games });
  } catch (error) {
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};
exports.getGameById = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findOne({ gameId });

    if (!game) {
      return res
        .status(404)
        .json({ status: "RS_ERROR", message: "Game not found" });
    }

    res.json({ status: "RS_OK", message: game });
  } catch (error) {
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};
exports.updateGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { gameName, gameUrl, isActive, description } = req.body;

    const existingGame = await Game.findOne({ gameId });

    if (!existingGame) {
      return res
        .status(404)
        .json({ status: "RS_ERROR", message: "Game not found" });
    }

    if (gameName !== undefined) {
      existingGame.gameName = gameName;
    }

    if (gameUrl !== undefined) {
      existingGame.gameUrl = gameUrl;
    }

    if (isActive !== undefined) {
      existingGame.isActive = isActive;
    }

    if (description !== undefined) {
      existingGame.description = description;
    }

    existingGame.updatedBy = req.user.username; // Update the updatedBy field with the current user's name
    const updatedGame = await existingGame.save();
    res.json({ status: "RS_OK", message: updatedGame });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};
exports.deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const existingGame = await Game.findOne({ gameId });

    if (!existingGame) {
      return res
        .status(404)
        .json({ status: "RS_ERROR", message: "Game not found" });
    }

    await existingGame.deleteOne();
    res.json({ status: "RS_OK", message: "Game deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};
