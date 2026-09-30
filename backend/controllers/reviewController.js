import Review from "../models/Review.js";
import Food from "../models/Food.js";

export const getReviews = async (req, res, next) => {
  try {
    const { foodId } = req.query;
    const query = { isApproved: true };
    if (foodId) query.food = foodId;
    const reviews = await Review.find(query).populate("user", "name").sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { food, rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required" });
    }
    const review = await Review.create({ user: req.user._id, food, rating, comment });
    if (food) {
      const agg = await Review.aggregate([
        { $match: { food: review.food, isApproved: true } },
        { $group: { _id: "$food", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]);
      if (agg[0]) {
        await Food.findByIdAndUpdate(food, { rating: Math.round(agg[0].avg * 10) / 10, ratingCount: agg[0].count });
      }
    }
    const populated = await review.populate("user", "name");
    res.status(201).json({ success: true, message: "Review submitted", review: populated });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "You cannot delete this review" });
    }
    await review.deleteOne();
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};
