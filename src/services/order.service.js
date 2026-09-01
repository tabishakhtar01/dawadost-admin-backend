const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getAllOrders({
  page = 1,
  limit = 10,
  sort = "desc",
  status,
  paymentStatus,
  search,
}) {
  const currentPage = Math.max(Number(page) || 1, 1);
  const ordersPerPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const skip = (currentPage - 1) * ordersPerPage;

  const filter = {};

  if (status) {
    filter.orderStatus = status;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (search?.trim()) {
    const searchTerm = search.trim();

    const users = await User.find({
      $or: [
        {
          name: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ],
    }).select("_id");

    const userIds = users.map((user) => user._id);

    filter.$or = [
      {
        user: {
          $in: userIds,
        },
      },
    ];

    if (/^[0-9a-fA-F]{24}$/.test(searchTerm)) {
      filter.$or.push({
        _id: searchTerm,
      });
    }
  }

  const sortOrder = sort === "asc" ? 1 : -1;

  const [orders, totalOrders] = await Promise.all([
    Order.find(filter)
      .populate("user", "name phone age gender")
      .sort({
        createdAt: sortOrder,
      })
      .skip(skip)
      .limit(ordersPerPage),

    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  return {
    orders,
    pagination: {
      page: currentPage,
      limit: ordersPerPage,
      totalOrders,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}

async function getOrderById(orderId) {
  const order = await Order.findById(orderId).populate(
    "user",
    "name phone age gender",
  );

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;

    throw error;
  }

  return order;
}

const VALID_STATUS_TRANSITIONS = {
  placed: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped"],
  shipped: ["delivered"],
  awaiting_payment: ["placed", "cancelled"],
  delivered: [],
  cancelled: [],
};

async function updateOrderStatus(orderId, orderStatus) {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;

    throw error;
  }

  const allowedStatuses = VALID_STATUS_TRANSITIONS[order.orderStatus];

  if (!allowedStatuses) {
    const error = new Error(
      `Invalid current order status: ${order.orderStatus}`,
    );

    error.statusCode = 400;

    throw error;
  }

  if (!allowedStatuses.includes(orderStatus)) {
    const error = new Error(
      `Order cannot be changed from ${order.orderStatus} to ${orderStatus}`,
    );

    error.statusCode = 400;

    throw error;
  }

  const statusChangedAt = new Date();

  order.orderStatus = orderStatus;

  order.statusHistory.push({
    status: orderStatus,
    updatedAt: statusChangedAt,
  });

  await order.save();

  await order.populate({
    path: "user",
    select: "name phone age gender",
  });

  return order;
}

const VALID_PAYMENT_STATUS_TRANSITIONS = {
  pending: ["paid", "failed"],
  paid: ["refunded"],
  failed: [],
  refunded: [],
};

async function updatePaymentStatus(orderId, paymentStatus) {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;

    throw error;
  }

  const allowedStatuses = VALID_PAYMENT_STATUS_TRANSITIONS[order.paymentStatus];

  if (!allowedStatuses) {
    const error = new Error(
      `Invalid current payment status: ${order.paymentStatus}`,
    );

    error.statusCode = 400;

    throw error;
  }

  if (!allowedStatuses.includes(paymentStatus)) {
    const error = new Error(
      `Payment cannot be changed from ${order.paymentStatus} to ${paymentStatus}`,
    );

    error.statusCode = 400;

    throw error;
  }

  order.paymentStatus = paymentStatus;

  await order.save();

  await order.populate({
    path: "user",
    select: "name phone age gender",
  });

  return order;
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
};
