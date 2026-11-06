const Service = require("../models/serviceModel");
const Category = require("../models/categoryModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");

// Keeps only valid image links (max 5)
const cleanImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((url) => String(url).trim())
    .filter((url) => /^https?:\/\//i.test(url))
    .slice(0, 5);
};

// Stops special characters in the search box from breaking the search
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /api/v1/services   (provider only)
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category, address, phoneNumber, images } = req.body;

    if (!(await Category.findById(category))) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Save the provider's phone number so customers can contact them
    if (phoneNumber) {
      const user = await User.findById(req.user._id);
      if (user && !user.phoneNumber) {
        user.phoneNumber = phoneNumber;
        await user.save();
      }
    }

    const service = await Service.create({
      provider: req.user._id,
      category,
      name,
      description,
      price,
      duration,
      address,
      images: cleanImages(images),
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/v1/services?keyword=&category=&minPrice=&maxPrice=&sort=
const getAllServices = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

    const filters = {};

    if (keyword) {
      const pattern = escapeRegex(keyword);
      filters.$or = [
        { name: { $regex: pattern, $options: "i" } },
        { description: { $regex: pattern, $options: "i" } },
      ];
    }

    if (category) filters.category = category;

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };

    const services = await Service.find(filters)
      .populate("category", "name slug")
      .populate("provider", "name email profileImage")
      .populate("reviews")
      .sort(sortOption);

    res.json({ count: services.length, services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/v1/services/:id
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category", "name")
      .populate("provider", "name email profileImage bio")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name profileImage" },
      });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/v1/services/:id   (owner only)
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, description, price, duration, category, address, images } = req.body;

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;
    service.duration = duration || service.duration;
    service.category = category || service.category;
    service.address = address || service.address;
    if (images !== undefined) service.images = cleanImages(images);

    res.json(await service.save());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/v1/services/:id   (owner only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const activeBookings = await Booking.countDocuments({
      service: service._id,
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: `Cannot delete service. There are ${activeBookings} active bookings. Please cancel them first.`,
      });
    }

    await service.deleteOne();
    res.json({ message: "Service removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createService, getAllServices, getServiceById, updateService, deleteService };
