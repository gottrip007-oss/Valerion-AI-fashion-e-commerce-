import Product from "../models/Product.js";
import {
  interpretQuery,
  buildProductFilter,
  buildFallbackTextSearch,
  buildAssistantReply,
} from "../utils/aiEngine.js";

// @route POST /api/ai/assistant
// body: { message: "I need a black outfit for a formal evening." }
export const askAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Please describe what you're looking for." });
  }

  const intent = interpretQuery(message);
  const structuredFilter = buildProductFilter(intent);

  let products = await Product.find(structuredFilter).limit(4);

  // Fall back to free-text search across name/description/tags if the
  // structured parse (occasion/color/category) didn't match anything.
  if (!products.length) {
    const textFilter = buildFallbackTextSearch(intent);
    if (Object.keys(textFilter).length) {
      products = await Product.find(textFilter).limit(4);
    }
  }

  // Last resort: surface featured products so the assistant never dead-ends.
  if (!products.length) {
    products = await Product.find({ featured: true }).limit(4);
  }

  const reply = buildAssistantReply(intent, products);

  res.json({
    reply,
    intent,
    products,
  });
};
