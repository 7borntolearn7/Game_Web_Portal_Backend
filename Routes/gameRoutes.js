const express = require("express");
const router = express.Router();
const gameController = require("../Controllers/GameController");
const operatorController = require("../Controllers/operatorController");
const userController = require("../Controllers/userController");
const opGamesController = require("../Controllers/OpGamesController");
const transactionData = require("../Controllers/TransactionData");
const FailedTransactionData = require("../Controllers/FailedTransactionData");
const TransactionLogsController = require("../Controllers/TransactionLogsController");
const { auth } = require("../Middleware/auth");

router.post("/games/createGame", auth, gameController.addGame);
router.get("/games/getGames", auth, gameController.getAllGames);
router.get("/games/getGame/:gameId", auth, gameController.getGameById);
router.put("/games/updateGame/:gameId", auth, gameController.updateGame);
router.delete("/games/deleteGame/:gameId", auth, gameController.deleteGame);
router.post("/operator/createOperator", auth, operatorController.addOperator);
router.get("/operator/getOperators", auth, operatorController.getAllOperators);
router.get(
  "/operator/getOperator/:operatorName",
  auth,

  operatorController.getOperatorByName
);
router.put(
  "/operator/updateOperator/:operatorId",
  auth,

  operatorController.updateOperator
);
router.delete(
  "/operator/deleteOperator/:operatorId",
  auth,

  operatorController.deleteOperator
);
router.post("/OpGames/createOpGames", auth, opGamesController.createOpGame);
router.get(
  "/OpGames/getOpGames/:operatorId",
  auth,
  opGamesController.getAllOpGamesForOperator
);
router.put(
  "/OpGames/updateOpGame/:operatorId",
  auth,
  opGamesController.updateOpGame
);
router.put(
  "/OpGames/deleteOpGame/:operatorId",
  auth,
  opGamesController.deleteOpGame
);
router.post("/login", userController.login);
router.put("/changePassword", auth, userController.changePassword);
router.post("/createUser", auth, userController.createUser);
router.post("/logout", auth, userController.logout);
router.put("/updateUser/:userId", auth, userController.updateUser);
router.delete("/deleteUser/:userId", auth, userController.deleteUser);
router.get("/getUsers", auth, userController.getAllUsers);
router.get("/getTransactions", auth, transactionData.getTransactions);
router.get(
  "/getFailedTransactions",
  auth,
  FailedTransactionData.getFailedTransactions
);
router.post(
  "/resendTransaction",
  FailedTransactionData.ReSendFailedTransactions
);
router.get(
  "/getTransactionLogs",
  auth,
  TransactionLogsController.getTransactionLogs
);
module.exports = router;
