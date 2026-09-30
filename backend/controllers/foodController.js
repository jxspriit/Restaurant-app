import Food from "../models/Food.js";

export const getFoods = async (req, res, next) => {
  try {
    const { search, category, veg, sort, featured, popular } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") query.category = category;
    if (veg === "true") query.isVeg = true;
    if (veg === "false") query.isVeg = false;
    if (featured === "true") query.isFeatured = true;
    if (popular === "true") query.isPopular = true;

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "popularity") sortOption = { orderCount: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const foods = await Food.find(query).sort(sortOption);
    res.json({ success: true, count: foods.length, foods });
  } catch (error) {
    next(error);
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food item not found" });
    res.json({ success: true, food });
  } catch (error) {
    next(error);
  }
};

export const createFood = async (req, res, next) => {
  try {
    const foodData = { ...req.body };
    if (req.file) {
      foodData.image = `/uploads/${req.file.filename}`;
    }
    const food = await Food.create(foodData);
    res.status(201).json({ success: true, message: "Food item created", food });
  } catch (error) {
    next(error);
  }
};

export const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food item not found" });
    const updates = { ...req.body };
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }
    Object.assign(food, updates);
    await food.save();
    res.json({ success: true, message: "Food item updated", food });
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food item not found" });
    await food.deleteOne();
    res.json({ success: true, message: "Food item deleted" });
  } catch (error) {
    next(error);
  }
};
