const express = require("express");

const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/", orderController.getAllOrders);

router.get("/:orderId", orderController.getOrderById);

router.patch("/:orderId/status", orderController.updateOrderStatus);

router.patch("/:orderId/payment-status", orderController.updatePaymentStatus);

module.exports = router;
