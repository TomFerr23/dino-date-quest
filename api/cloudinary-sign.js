// api/cloudinary-sign.js
import crypto from "crypto";

/**
 * POST /api/cloudinary-sign
 * body: { password: string, folder?: string }
 * returns: { cloudName, apiKey, folder, timestamp, signature }
 */
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "method_not_allowed" });
    }

    // Vercel parses JSON automatically when content-type: application/json
    const body = req.body || {};
    const password = (body.password || "").toString().trim();
    const folder = (body.folder || "gallery").toString().trim() || "gallery";

    const {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
      UPLOAD_PASSWORD,
    } = process.env;

    // Helpful, explicit env checks (surface which one is missing)
    const required = {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
      UPLOAD_PASSWORD,
    };
    for (const [key, val] of Object.entries(required)) {
      if (!val) {
        console.error(`[cloudinary-sign] Missing env: ${key}`);
        return res.status(500).json({ error: `missing_env:${key}` });
      }
    }

    if (!password) {
      return res.status(400).json({ error: "missing_password" });
    }
    if (password !== UPLOAD_PASSWORD) {
      return res.status(401).json({ error: "wrong_password" });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    // Cloudinary signature: sha1("folder=...&timestamp=...<API_SECRET>")
    const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    return res.status(200).json({
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
    });
  } catch (err) {
    console.error("[cloudinary-sign] unexpected error:", err);
    return res
      .status(500)
      .json({ error: "server_error", detail: String(err?.message || err) });
  }
}
