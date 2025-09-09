// api/cloudinary-sign.js  (CommonJS, works in vercel dev & on Vercel)
const crypto = require('node:crypto');

module.exports = async function handler(req, res) {
  try {
    // Only JSON POST
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    const body = req.body || {};
    const password = (body.password || '').trim();
    const folder = (body.folder || 'gallery').trim() || 'gallery';

    // Check envs first so we fail loudly
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, UPLOAD_PASSWORD } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: 'missing_cloudinary_env' });
    }
    if (!UPLOAD_PASSWORD) {
      return res.status(500).json({ error: 'missing_upload_password_env' });
    }

    // Validate input
    if (!password) return res.status(400).json({ error: 'missing_password' });
    if (password !== UPLOAD_PASSWORD) return res.status(401).json({ error: 'wrong_password' });

    // Build signature
    const timestamp = Math.floor(Date.now() / 1000);
    // IMPORTANT: Cloudinary expects the params in alpha order joined with &
    const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET ? '' : ''}`;
    const signature = crypto.createHash('sha1').update(toSign + CLOUDINARY_API_SECRET).digest('hex');

    return res.status(200).json({
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
    });
  } catch (err) {
    console.error('cloudinary-sign error:', err);
    return res.status(500).json({ error: 'exception', message: String(err && err.message || err) });
  }
};
