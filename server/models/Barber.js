const mongoose = require("mongoose");

const barberSchema = new mongoose.Schema(
  {
    queueRevision: { type: Number, default: 0, select: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    chairNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },

    phone: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
    },

    specialization: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "BREAK", "OFFLINE"],
      default: "AVAILABLE",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Barber", barberSchema);