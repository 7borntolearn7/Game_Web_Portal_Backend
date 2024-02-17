const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the transaction
const TransactionDataSchema = new Schema(
  {
    transactionType: {
      type: String,
      required: true,
    },
    transaction: {
      userId: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
      operatorId: {
        type: String,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      request_uuid: {
        type: String,
        required: true,
      },
      bet_id: {
        type: String,
        required: true,
      },
      bet_time: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      roundId: {
        type: String,
        required: true,
      },
      game_id: {
        type: String,
        required: true,
      },
      game_code: {
        type: String,
        required: true,
      },
      reference_request_uuid: {
        type: String,
        required: true,
      },
    },
    createDate: {
      type: Date,
      required: true,
    },
  },
  { collection: "transactionsdatas" }
);

// Create a model using the schema
const TransactionData = mongoose.model(
  "TransactionData",
  TransactionDataSchema
);

module.exports = TransactionData;
