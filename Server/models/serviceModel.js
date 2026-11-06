const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    duration: {
      type: Number,
      required: [true, "Duration (in minutes) is required"],
      min: [1, "Duration must be at least 1 minute"],
      default: 60,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Provider is required"],
    },
    // Plain image links (https://...). The website shows a default picture if empty.
    images: { type: [String], default: [] },
    address: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

serviceSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "service",
  justOne: false,
});

module.exports = mongoose.model("Service", serviceSchema);
