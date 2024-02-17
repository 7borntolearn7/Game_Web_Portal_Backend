const TransactionsData = require("../Models/TransactionsData");

exports.getTransactions = async (req, res) => {
  try {
    const { game_code, fromDate, toDate } = req.query;

    // Checking if game_code, fromDate, and toDate are present
    if (!game_code || !fromDate || !toDate) {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "game_code, fromDate, and toDate are required parameters",
      });
    }

    // Constructing the query based on provided parameters
    const query = {
      "transaction.game_code": game_code,
      createDate: { $gte: new Date(fromDate), $lte: new Date(toDate) },
    };

    // Execute the query
    const transactions = await TransactionsData.find(query);

    res.json({ status: "RS_OK", message: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal server error" });
  }
};
