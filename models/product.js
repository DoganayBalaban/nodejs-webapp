const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Ürün ismi girmelisiniz"],
    minlengthh: [5, "Ürün ismi minimum 5 karakter olmalı"],
    maxlength: [255, "Ürün ismi maksimum 255 karakter olmalı"],
  },
  price: {
    type: Number,
    required: function () {
      return this.isActive;
    },
    min: 0,
    max: 1000000,
  },
  description: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 255,
  },
  imageUrl: String,
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
  ],
  tags: {
    type: Array,
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: "Tags must be an array and must have at least one element",
    },
  },
  isActive: Boolean,
});

module.exports = mongoose.model("Product", productSchema);
