const FailedTransactionsData = require("../Models/FailedTransactionsData");
const OperatorGame = require("../Models/OperatorGame");
const qs = require("qs");
const axios = require("axios");
exports.getFailedTransactions = async (req, res) => {
  try {
    const { game_code, fromDate, toDate } = req.query;
    if (!game_code || !fromDate || !toDate) {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "game_code, fromDate, and toDate are required parameters",
      });
    }
    const query = {
      "transaction.game_code": game_code,
      createDate: { $gte: new Date(fromDate), $lte: new Date(toDate) },
    };

    const transactions = await FailedTransactionsData.find(query);

    res.json({ status: "RS_OK", message: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal server error" });
  }
};

exports.ReSendFailedTransactions = async (req, res) => {
  try {
    console.log("Yaha tak aaya");
    const requestData = req.body;
    const { transactionType, transaction, createDate } = requestData;
    if (!transactionType || !transaction || !createDate) {
      return res.status(400).json({
        status: "RS_ERROR",
        message:
          "All components of FailedTransactionsData model are required in the request body",
      });
    }

    const FailedCollections = await FailedTransactionsData.find({
      "transaction.operatorId": transaction.operatorId,
    });
    for (const entry of FailedCollections) {
      if (entry.transactionType === "Result") {
        console.log("Resending Result transaction");
        const requestObject = entry.transaction;
        const response = await ResultBet(requestObject);
        const filter = { _id: entry._id };
        if (response.status === "RS_Exception") {
          console.log("Kya hum yaha hai");
          let count = entry.retry + 1 || 0;
          entry.retry = count;
          await FailedTransactionsData.updateOne(
            filter,
            { $set: entry },
            { returnDocument: "after" }
          );
          console.log(entry.retry);
        } else {
          await FailedTransactionsData.deleteOne(filter);
        }
      } else if (entry.transactionType === "Rollback") {
        console.log("Resending Rollback transaction");
        const requestObject = entry.transaction;
        const response = await rollbackRequest(requestObject);
        const filter = { _id: entry._id };
        if (response.status === "RS_Exception") {
          // Similar logic for Rollback transaction
        } else {
          await FailedTransactionsData.deleteOne(filter);
        }
      }
    }

    res.json({
      status: "RS_OK",
      message: "Resending failed transactions completed",
    });
  } catch (error) {
    console.error("Error resending failed transactions:", error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal server error" });
  }
};

async function ResultBet(reqData) {
  return new Promise(async function (resolve, reject) {
    let data = qs.stringify(reqData);
    let operatorId = reqData.operatorId;
    let endpoint = await OperatorGame.findOne({ operatorId });
    let baseurl = endpoint.operatorEndpoint;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseurl}/resultbet`,
      // url: "http://localhost:3000/api/v1/resultbet",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    axios
      .request(config)
      .then(function (response) {
        console.log(response.data);
        resolve(response.data);
      })
      .catch((error) => {
        resolve({ status: "RS_Exception", message: "No response received" });
      });
  });
}

async function rollbackRequest(reqData) {
  return new Promise(async function (resolve, reject) {
    let data = qs.stringify(reqData);
    let operatorId = reqData.operatorId;
    let endpoint = await OperatorGame.findOne({ operatorId });
    let baseurl = endpoint.operatorEndpoint;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseurl}/rollback`,
      // url:"http://localhost:3000/api/v1/rollback",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    axios
      .request(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch((error) => {
        resolve({ status: "RS_Exception", message: "No response received" });
      });
  });
}
