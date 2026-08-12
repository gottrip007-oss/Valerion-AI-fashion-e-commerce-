/**
 * Valerion AI Fashion Assistant — natural-language product matching engine.
 *
 * This is a lightweight, dependency-free NLP-style matcher: it parses intent
 * (occasion, color, category, price ceiling, style keywords) out of free text
 * and scores products against that intent. It ships with zero external API
 * dependency so the project runs end-to-end without any paid key.
 *
 * To upgrade to a true LLM-backed assistant later, swap `interpretQuery()`
 * for a call to an LLM API (e.g. the Anthropic Messages API) that returns the
 * same shape: { occasion, color, category, maxPrice, keywords, reply }.
 * Everything downstream (matchProducts, buildReply) stays the same.
 */

const COLOR_WORDS = [
  "black", "white", "ivory", "cream", "gold", "silver", "red", "burgundy",
  "navy", "blue", "green", "emerald", "pink", "blush", "beige", "nude",
  "grey", "gray", "brown", "tan", "purple", "lavender", "champagne",
];

const CATEGORY_WORDS = {
  dress: "Dresses",
  dresses: "Dresses",
  gown: "Dresses",
  outfit: "Dresses",
  coat: "Outerwear",
  jacket: "Outerwear",
  outerwear: "Outerwear",
  suit: "Suits",
  blazer: "Suits",
  tux: "Suits",
  tuxedo: "Suits",
  shoes: "Footwear",
  heels: "Footwear",
  footwear: "Footwear",
  bag: "Bags",
  handbag: "Bags",
  clutch: "Bags",
  accessory: "Accessories",
  accessories: "Accessories",
  belt: "Accessories",
  scarf: "Accessories",
  jewelry: "Jewelry",
  necklace: "Jewelry",
  earrings: "Jewelry",
  ring: "Jewelry",
};

const OCCASION_WORDS = {
  formal: "Formal Evening",
  evening: "Formal Evening",
  gala: "Formal Evening",
  "black tie": "Formal Evening",
  wedding: "Wedding",
  bride: "Wedding",
  bridal: "Wedding",
  guest: "Wedding Guest",
  office: "Business",
  work: "Business",
  business: "Business",
  meeting: "Business",
  casual: "Casual",
  weekend: "Casual",
  everyday: "Casual",
  vacation: "Resort",
  resort: "Resort",
  beach: "Resort",
  party: "Party",
  cocktail: "Party",
  date: "Date Night",
};

function extractMaxPrice(text) {
  const under = text.match(/under\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (under) return Number(under[1].replace(/,/g, ""));
  const below = text.match(/below\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (below) return Number(below[1].replace(/,/g, ""));
  const budget = text.match(/budget\s*(?:of|is)?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (budget) return Number(budget[1].replace(/,/g, ""));
  return null;
}

export function interpretQuery(rawText) {
  const text = rawText.toLowerCase();

  const color = COLOR_WORDS.find((c) => text.includes(c)) || null;

  let category = null;
  for (const [word, cat] of Object.entries(CATEGORY_WORDS)) {
    if (text.includes(word)) {
      category = cat;
      break;
    }
  }

  let occasion = null;
  for (const [word, occ] of Object.entries(OCCASION_WORDS)) {
    if (text.includes(word)) {
      occasion = occ;
      break;
    }
  }

  const maxPrice = extractMaxPrice(text);

  // Remaining meaningful words become loose keyword fallbacks for text search
  const stopwords = new Set([
    "i", "need", "want", "a", "an", "the", "for", "to", "with", "in", "on",
    "of", "and", "me", "some", "looking", "find", "show", "please", "have",
  ]);
  const keywords = text
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !stopwords.has(w) && w.length > 2);

  return { color, category, occasion, maxPrice, keywords, rawText };
}

export function buildProductFilter(intent) {
  const filter = {};
  if (intent.category) filter.category = intent.category;
  if (intent.color) filter.color = { $regex: intent.color, $options: "i" };
  if (intent.occasion) filter.occasion = { $regex: intent.occasion, $options: "i" };
  if (intent.maxPrice) filter.price = { $lte: intent.maxPrice };
  return filter;
}

export function buildFallbackTextSearch(intent) {
  return intent.keywords.length ? { $text: { $search: intent.keywords.join(" ") } } : {};
}

export function buildAssistantReply(intent, products) {
  if (!products.length) {
    return (
      "I couldn't find an exact match in our current collection for that. " +
      "Try describing the occasion, a color, or a category (e.g. \"a gold clutch for a wedding\") " +
      "and I'll pull the closest pieces for you."
    );
  }

  const top = products[0];
  const occasionPhrase = intent.occasion ? ` for a ${intent.occasion.toLowerCase()}` : "";
  const colorPhrase = intent.color ? `${intent.color} ` : "";

  let reply = `Based on your preference${occasionPhrase ? occasionPhrase : ""}, I recommend our ${top.name}`;

  if (products.length > 1) {
    const second = products[1];
    reply += `, paired beautifully with our ${second.name}`;
  }

  reply += ". ";

  if (colorPhrase && intent.category) {
    reply += `Both work well if you're set on something ${colorPhrase}for ${intent.category.toLowerCase()}. `;
  }

  reply += `I've pulled ${products.length} piece${products.length > 1 ? "s" : ""} below that match what you're after.`;

  return reply;
}
