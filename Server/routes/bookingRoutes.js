const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  UpdateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.put("/:id", UpdateBookingStatus);
router.put("/:id/cancel", cancelBooking);

module.exports = router;
