const OperatorGame = require("../Models/OperatorGame");

exports.createOpGame = async (req, res) => {
  try {
    const { operatorId, name, gameDetails } = req.body;

    if (
      !operatorId ||
      !name ||
      !gameDetails ||
      !Array.isArray(gameDetails) ||
      gameDetails.length === 0
    ) {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "Invalid or missing fields in the configuration",
      });
    }

    const existingOperator = await OperatorGame.findOne({
      operatorId: operatorId,
      name: name,
    });

    if (existingOperator) {
      if (
        existingOperator.gameDetails.some(
          (existingGame) => existingGame.game === gameDetails[0].game
        )
      ) {
        return res.status(409).json({
          status: "RS_ERROR",
          message: "Operator game already exists",
        });
      }

      existingOperator.gameDetails.push(gameDetails[0]);

      const updatedOperatorGame = await existingOperator.save();

      return res.json({
        status: "RS_OK",
        message: updatedOperatorGame,
      });
    }

    const newOperatorGame = new OperatorGame({
      operatorId,
      name,
      gameDetails: [gameDetails[0]],
    });

    const savedOperatorGame = await newOperatorGame.save();
    res.json({ status: "RS_OK", message: savedOperatorGame });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.getAllOpGamesForOperator = async (req, res) => {
  try {
    const { operatorId } = req.params;
    if (!operatorId) {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "Operator ID is required",
      });
    }
    const operatorGames = await OperatorGame.find({ operatorId });

    res.json({ status: "RS_OK", message: operatorGames });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.updateOpGame = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const updatedGameDetails = req.body;

    if (!updatedGameDetails || typeof updatedGameDetails !== "object") {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "Invalid or missing updated game details in the configuration",
      });
    }
    console.log("OperatorId:", operatorId);
    console.log("Updated Game Details:", updatedGameDetails);

    const updatedOperatorGame = await OperatorGame.findOneAndUpdate(
      { operatorId, "gameDetails.game": updatedGameDetails.game },
      { $set: { "gameDetails.$": updatedGameDetails } },
      { new: true }
    );

    console.log("MongoDB Query:", updatedOperatorGame);

    if (!updatedOperatorGame) {
      console.error("Operator game not found. Details:", updatedOperatorGame);

      return res.status(404).json({
        status: "RS_ERROR",
        message: "Operator game not found",
      });
    }

    res.json({ status: "RS_OK", message: updatedOperatorGame });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.deleteOpGame = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const { game } = req.body;

    if (!game) {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "Invalid or missing game in the configuration",
      });
    }

    const updatedOperatorGame = await OperatorGame.findOneAndUpdate(
      { operatorId },
      { $pull: { gameDetails: { game } } },
      { new: true }
    );

    if (!updatedOperatorGame) {
      return res.status(404).json({
        status: "RS_ERROR",
        message: "Operator game not found",
      });
    }

    res.json({ status: "RS_OK", message: updatedOperatorGame });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};
