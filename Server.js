const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const gameRoutes = require("./Routes/gameRoutes");
const dotenv = require("dotenv").config({ path: "./.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors());
app.options("*");
app.use(express.json());
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connection Successful");
  } catch (error) {
    console.error("Error occurred while connecting to DB:", error);
  }
};
app.use("/api/v1", gameRoutes);

connectDB();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
