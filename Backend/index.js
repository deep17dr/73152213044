const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { nanoid } = require("nanoid"); // npm install nanoid

const PORT = process.env.PORT || 8080;
const BASE_URL = `http://localhost:${PORT}`;
const app = express();

app.use(express.json());
app.use(cors());

// In-memory store
const urlDatabase = new Map();

// POST /shorten
app.post("/shorten", (req, res) => {
  const { longUrl, validity = 30, shortcode } = req.body;

  if (!longUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(longUrl)) {
    return res.status(400).json({ error: "Invalid long URL" });
  }

  let finalCode = shortcode;

  // Check if shortcode exists
  if (shortcode) {
    if (urlDatabase.has(shortcode)) {
      return res.status(400).json({ error: "Shortcode already taken" });
    }
  } else {
    // Generate random code if not provided
    do {
      finalCode = nanoid(6); // 6-character ID
    } while (urlDatabase.has(finalCode));
  }

  const expiry = Date.now() + validity * 60 * 1000; // Validity in ms

  urlDatabase.set(finalCode, { longUrl, expiry });

  return res.status(201).json({ shortUrl: `${BASE_URL}/${finalCode}` });
});

// GET /:shortcode (Redirection)
app.get("/:code", (req, res) => {
  const { code } = req.params;

  if (!urlDatabase.has(code)) {
    return res.status(404).send("Short URL not found.");
  }

  const { longUrl, expiry } = urlDatabase.get(code);

  if (Date.now() > expiry) {
    urlDatabase.delete(code); // Expired link cleanup
    return res.status(410).send("Link expired.");
  }

  return res.redirect(longUrl);
});

// Start server
app.listen(PORT, () => {
  console.log(`The server is running on ${BASE_URL}`);
});
