const TransactionLogs = require("../Models/TransactionLogs");

module.exports = {
  getTransactionLogs: async (req, res) => {
    try {
      const { game_code, fromDate, toDate } = req.query;
      if (!game_code || !fromDate || !toDate) {
        return res.status(400).json({
          status: "RS_ERROR",
          message: "game_code, fromDate, and toDate are required parameters",
        });
      }
      const query = {
        "requestObject.game_code": game_code,
        createDate: { $gte: new Date(fromDate), $lte: new Date(toDate) },
      };
      const transactions = await TransactionLogs.find(query);

      res.json({ status: "RS_OK", message: transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res
        .status(500)
        .json({ status: "RS_ERROR", message: "Internal server error" });
    }
  },
};
