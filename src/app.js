const express = require("express");
const cors = require("cors");

const app = express();
const orderRoute = require("./routes/order.route");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "DawaDost Admin API is running",
  });
});

app.use("/api/orders", orderRoute);

module.exports = app;
