const orderService = require("../services/order.service");

async function getAllOrders(req, res) {
  try {
    const result = await orderService.getAllOrders({
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort,
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      search: req.query.search,
    });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderService.getOrderById(req.params.orderId);

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      orderStatus,
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

async function updatePaymentStatus(req, res) {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    const order = await orderService.updatePaymentStatus(
      req.params.orderId,
      paymentStatus,
    );

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
};
