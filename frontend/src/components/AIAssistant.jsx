import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const STARTER_PROMPTS = [
  "I need a black outfit for a formal evening.",
  "Something gold for a wedding under ₹20,000",
  "A minimal everyday bag",
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I'm your Valerion AI Fashion Assistant. Tell me the occasion, a color, or a budget — I'll style it for you.",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: message, products: [] }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/assistant", { message });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply, products: res.data.products || [] },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong reaching the styling engine. Please try again in a moment.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 bg-ink text-stone rounded-full w-16 h-16 shadow-xl flex items-center justify-center font-display text-xl hover:bg-oxblood transition-colors"
        aria-label="Open Valerion AI Fashion Assistant"
      >
        {open ? "×" : "AI"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[600px] bg-white shadow-2xl border border-stoneDark flex flex-col">
          <div className="bg-ink text-stone px-5 py-4">
            <div className="eyebrow text-goldLight">Valerion</div>
            <div className="font-display text-lg">AI Fashion Assistant</div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block px-4 py-2.5 text-sm max-w-[85%] ${
                    m.role === "user" ? "bg-ink text-stone" : "bg-stone text-ink"
                  }`}
                >
                  {m.text}
                </div>
                {m.products?.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {m.products.map((p) => (
                      <Link
                        to={`/products/${p._id}`}
                        key={p._id}
                        className="block text-left border border-stoneDark/60 hover:border-gold transition-colors"
                      >
                        <img src={p.images?.[0]} alt={p.name} className="w-full h-24 object-cover" />
                        <div className="p-2">
                          <div className="text-xs leading-tight">{p.name}</div>
                          <div className="text-xs text-muted mt-0.5">₹{p.price.toLocaleString("en-IN")}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-xs text-muted">Styling your recommendation…</div>}
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-xs border border-stoneDark px-2.5 py-1.5 hover:border-gold transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-stoneDark flex"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you're looking for…"
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
            <button type="submit" className="px-5 text-sm uppercase tracking-wide text-gold hover:text-oxblood transition-colors">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
