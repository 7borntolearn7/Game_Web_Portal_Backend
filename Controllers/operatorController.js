const Operator = require("../Models/Operator");
exports.addOperator = async (req, res) => {
  try {
    const { operatorId, name, isActive } = req.body;
    if (!operatorId || !name || !isActive) {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "Invalid or missing fields in the configuration",
      });
    }
    const existingOperator = await Operator.findOne({ operatorId });

    if (existingOperator) {
      return res
        .status(409)
        .json({ status: "RS_ERROR", message: "Operator already exists" });
    }

    const newOperator = new Operator({
      operatorId,
      name,
      isActive,
      updatedBy: req.user.username,
    });

    const savedOperator = await newOperator.save();
    res.json({ status: "RS_OK", message: savedOperator });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.getAllOperators = async (req, res) => {
  try {
    const operators = await Operator.find();
    res.json({ status: "RS_OK", message: operators });
  } catch (error) {
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.updateOperator = async (req, res) => {
  try {
    const operatorId = req.params.operatorId;
    const updatedOperatorDetails = req.body;

    const existingOperator = await Operator.findOne({ operatorId });

    if (!existingOperator) {
      return res.status(404).json({
        status: "RS_ERROR",
        message: "Operator not found",
      });
    }
    existingOperator.name =
      updatedOperatorDetails.name || existingOperator.name;
    existingOperator.isActive =
      updatedOperatorDetails.isActive !== undefined
        ? updatedOperatorDetails.isActive
        : false;

    existingOperator.updatedAt = new Date();

    // Set the updatedBy field to the username of the authenticated user
    existingOperator.updatedBy = req.user.username;

    const savedOperator = await existingOperator.save();

    res.json({ status: "RS_OK", message: savedOperator });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "RS_ERROR",
      message: "Internal Server Error",
    });
  }
};
exports.deleteOperator = async (req, res) => {
  try {
    const { operatorId } = req.params;

    const existingOperator = await Operator.findOne({ operatorId });

    if (!existingOperator) {
      return res
        .status(404)
        .json({ status: "RS_ERROR", message: "Operator not found" });
    }

    await existingOperator.deleteOne();
    res.json({ status: "RS_OK", message: "Operator deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.getOperatorByName = async (req, res) => {
  try {
    const { name } = req.params;
    const operator = await Operator.findOne({ name });

    if (!operator) {
      return res
        .status(404)
        .json({ status: "RS_ERROR", message: "Operator not found" });
    }

    res.json({ status: "RS_OK", message: operator });
  } catch (error) {
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};
