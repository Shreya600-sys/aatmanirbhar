const Category = require("../models/categoryModel");

const DEFAULT_CATEGORIES = [
  "Tiffin Service",
  "Tailoring",
  "Beauty Services",
  "Handicrafts",
  "Baking",
  "Mehendi Art",
  "Home Tuition",
  "Homemade Snacks",
];

// Runs on every server start, but only adds categories when the table is empty.
const seedCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) return;

  await Category.insertMany(
    DEFAULT_CATEGORIES.map((name) => ({
      name,
      slug: name.toLowerCase().split(" ").join("-"),
    }))
  );
  console.log("Default categories added");
};

module.exports = seedCategories;
