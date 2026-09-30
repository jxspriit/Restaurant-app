import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Food from "../models/Food.js";

dotenv.config();

const foods = [
  { name: "Margherita Pizza", description: "Classic pizza with San Marzano tomato, fresh mozzarella and basil.", price: 349, category: "Pizza", isVeg: true, isFeatured: true, isPopular: true },
  { name: "Pepperoni Pizza", description: "Wood-fired crust loaded with pepperoni and mozzarella.", price: 399, category: "Pizza", isVeg: false, isPopular: true },
  { name: "Classic Cheeseburger", description: "Grilled beef patty, cheddar, lettuce and house sauce in a brioche bun.", price: 289, category: "Burgers", isVeg: false, isFeatured: true },
  { name: "Paneer Tikka Burger", description: "Char-grilled paneer tikka patty with mint mayo.", price: 259, category: "Burgers", isVeg: true },
  { name: "Fettuccine Alfredo", description: "Silky parmesan cream sauce tossed with fresh fettuccine.", price: 329, category: "Pasta", isVeg: true, isPopular: true },
  { name: "Spaghetti Bolognese", description: "Slow-simmered beef ragu over al dente spaghetti.", price: 349, category: "Pasta", isVeg: false },
  { name: "Butter Chicken", description: "Tandoori chicken simmered in a rich tomato-butter gravy.", price: 379, category: "Indian", isVeg: false, isFeatured: true, isPopular: true },
  { name: "Paneer Butter Masala", description: "Cottage cheese cubes in a velvety tomato-cashew sauce.", price: 329, category: "Indian", isVeg: true },
  { name: "Kung Pao Chicken", description: "Wok-tossed chicken, peanuts and chilies in a tangy glaze.", price: 339, category: "Chinese", isVeg: false },
  { name: "Veg Hakka Noodles", description: "Stir-fried noodles with garden vegetables and soy.", price: 249, category: "Chinese", isVeg: true, isPopular: true },
  { name: "Molten Chocolate Cake", description: "Warm chocolate cake with a gooey molten center.", price: 199, category: "Desserts", isVeg: true, isFeatured: true },
  { name: "New York Cheesecake", description: "Classic baked cheesecake with a buttery biscuit base.", price: 219, category: "Desserts", isVeg: true },
  { name: "Fresh Watermelon Cooler", description: "Chilled watermelon juice with mint and lime.", price: 129, category: "Drinks", isVeg: true },
  { name: "Cold Brew Coffee", description: "Slow-steeped cold brew served over ice.", price: 149, category: "Drinks", isVeg: true, isPopular: true },
];

const run = async () => {
  await connectDB();

  const adminEmail = "admin@copperleaf.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({ name: "Restaurant Admin", email: adminEmail, password: "Admin@123", role: "admin" });
    console.log(`Admin account created: ${adminEmail} / Admin@123`);
  } else {
    console.log("Admin account already exists, skipping.");
  }

  const foodCount = await Food.countDocuments();
  if (foodCount === 0) {
    await Food.insertMany(foods);
    console.log(`Seeded ${foods.length} menu items.`);
  } else {
    console.log("Foods collection already has data, skipping seed.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
