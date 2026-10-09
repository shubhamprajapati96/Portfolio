const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_NAME,
  AdminModel,
  memoryStore,
  connectMongo,
  setCors,
  sendJson,
  getRequestBody
} = require('../_lib/db');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed', message: 'Use POST for login' });
  }

  try {
    const body = await getRequestBody(req);
    const { email, password } = body || {};
    if (!email || !password) {
      return sendJson(res, 400, { error: 'Bad Request', message: 'Email and password required.' });
    }

    const normEmail = String(email).toLowerCase().trim();
    let adminUser = null;

    // Try MongoDB if configured
    try {
      const isConnected = await connectMongo();
      if (isConnected && AdminModel) {
        adminUser = await AdminModel.findOne({ email: normEmail }).lean();
      }
    } catch (dbErr) {
      console.warn('[Login DB warning]:', dbErr.message);
    }

    // Fallback to in-memory store
    if (!adminUser) {
      adminUser = memoryStore.admins.find((a) => a.email === normEmail);
    }

    if (!adminUser) {
      return sendJson(res, 401, { error: 'Unauthorized', message: 'Invalid credentials.' });
    }

    const isValid = bcrypt.compareSync(String(password), adminUser.passwordHash);
    if (!isValid) {
      return sendJson(res, 401, { error: 'Unauthorized', message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: String(adminUser._id), email: adminUser.email, name: adminUser.name, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendJson(res, 200, {
      success: true,
      token,
      user: {
        id: String(adminUser._id),
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });
  } catch (err) {
    console.error('[Login API Error]:', err);
    return sendJson(res, 500, { error: 'Internal Error', message: err?.message || 'Server error' });
  }
};
