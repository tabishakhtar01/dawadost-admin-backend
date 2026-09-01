const express = require("express");
const cors = require("cors");

const app = express();
const orderRoute = require("./routes/order.route");
const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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

app.use("/api/admin/orders", orderRoute);

module.exports = app;
