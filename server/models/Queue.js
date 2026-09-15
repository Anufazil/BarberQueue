const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
  {
    accessTokenHash: { type: String, select: false },
    activePhone: { type: String, select: false },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    tokenNumber: {
      type: Number,
      required: true,
    },

    queuePosition: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "WAITING",
        "SERVING",
        "COMPLETED",
        "CANCELLED",
        "SKIPPED",
        "NO_SHOW",
      ],
      default: "WAITING",
    },

    // Time when customer joined the queue
    joinedAt: {
      type: Date,
      default: Date.now,
    },

    // Time when barber started serving
    servedAt: {
      type: Date,
      default: null,
    },

    // Time when service was completed
    completedAt: {
      type: Date,
      default: null,
    },

    // Actual service duration in minutes
    serviceDuration: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Used for daily token reset
    queueDate: {
      type: Date,
      default: () => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return today;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for faster queries
queueSchema.index({ barber: 1, status: 1 });
queueSchema.index({ barber: 1, queueDate: 1 });
queueSchema.index({ barber: 1, tokenNumber: 1 }, { unique: true });
queueSchema.index({ accessTokenHash: 1 }, { unique: true, sparse: true });
queueSchema.index({ activePhone: 1 }, { unique: true, sparse: true });
queueSchema.index({ barber: 1 }, { unique: true, partialFilterExpression: { status: 'SERVING' }, name: 'one_serving_per_barber' });

// Recent records
queueSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Queue", queueSchema);