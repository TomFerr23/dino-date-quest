// /api/cloudinary-sign.js  (root-level, NOT inside src/)
const crypto = require("crypto");

module.exports = async (req, res) => {
  // CORS for local dev + Vercel
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    UPLOAD_PASSWORD,
  } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: "missing_env" });
  }

  // Vercel sometimes gives string or parsed object; normalize it:
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: "bad_json" });
  }

  const password = (body.password || body.pass || "").toString().trim();
  const folder = (body.folder || "gallery").toString().trim();

  // Check password
  if (!UPLOAD_PASSWORD || password !== UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "wrong_password" });
  }

  // Cloudinary signature requires params sorted alphabetically
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(toSign + CLOUDINARY_API_SECRET)
    .digest("hex");

  return res.status(200).json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    folder,
    timestamp,
    signature,
  });
};
