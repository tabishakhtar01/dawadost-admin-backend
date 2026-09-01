const mongoose = require("mongoose");
require("./user.model");

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "awaiting_payment",
        "placed",
        "processing",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      required: true,
    },

    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const orderItemSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: {
        type: String,
        enum: ["actual", "generic"],
        required: true,
      },

      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(items) => items.length > 0, "Order cannot be empty"],
    },

    deliveryAddress: {
      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      houseNo: {
        type: String,
        required: true,
      },

      street: {
        type: String,
        required: true,
      },

      landmark: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      addressType: {
        type: String,
        enum: ["home", "work", "other"],
        required: true,
      },
    },

    subtotal: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "awaiting_payment",
        "placed",
        "processing",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
