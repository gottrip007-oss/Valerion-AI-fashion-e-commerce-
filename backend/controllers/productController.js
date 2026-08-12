import Product from "../models/Product.js";

// @route GET /api/products
// Supports: ?search=&category=&minPrice=&maxPrice=&color=&occasion=&sort=&page=&limit=
export const getProducts = async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    color,
    occasion,
    sort = "-createdAt",
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) filter.category = category;
  if (color) filter.color = { $in: color.split(",") };
  if (occasion) filter.occasion = { $in: occasion.split(",") };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
};

// @route GET /api/products/featured
export const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ featured: true }).limit(8);
  res.json({ products });
};

// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product });
};

// @route POST /api/products (admin)
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
};

// @route PUT /api/products/:id (admin)
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product });
};

// @route DELETE /api/products/:id (admin)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
};
