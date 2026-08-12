import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import products from "./products.js";

dotenv.config();

const run = async () => {
  await connectDB();

  console.log("Clearing existing products...");
  await Product.deleteMany();

  console.log("Seeding products...");
  await Product.insertMany(products);

  const adminExists = await User.findOne({ email: "admin@valerion.com" });
  if (!adminExists) {
    console.log("Creating default admin user...");
    await User.create({
      name: "Valerion Admin",
      email: "admin@valerion.com",
      password: "Admin@12345",
      role: "admin",
    });
    console.log("Admin login -> email: admin@valerion.com | password: Admin@12345");
  }

  console.log("Seed complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
