const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'shubham_portfolio_secure_jwt_secret_token_2026_xyz';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'shubh-tech96@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Shubham Prajapati';
const MONGODB_URI = process.env.MONGODB_URI;

// In-Memory fallback store
const memoryStore = {
  admins: [
    {
      _id: 'admin_root',
      email: ADMIN_EMAIL,
      passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
      name: ADMIN_NAME,
      role: 'admin',
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ],
  visitors: [],
  downloads: [],
  enquiries: []
};

// Mongoose Schemas
const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Shubham Prajapati' },
    role: { type: String, default: 'admin' },
    lastLoginAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const VisitorSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, default: '127.0.0.1', index: true },
    country: { type: String, default: 'Unknown Country', index: true },
    city: { type: String, default: 'Unknown City' },
    region: { type: String, default: 'Unknown Region' },
    timezone: { type: String, default: 'UTC' },
    userAgent: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown Browser' },
    os: { type: String, default: 'Unknown OS' },
    deviceType: { type: String, default: 'desktop' },
    pageUrl: { type: String, default: '/' },
    referrer: { type: String, default: 'Direct' },
    source: { type: String, default: 'web', index: true },
    visitCount: { type: Number, default: 1 },
    firstVisitedAt: { type: Date, default: Date.now },
    lastVisitedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

const DownloadSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, default: '127.0.0.1', index: true },
    country: { type: String, default: 'Unknown Country', index: true },
    city: { type: String, default: 'Unknown City' },
    region: { type: String, default: 'Unknown Region' },
    userAgent: { type: String, default: 'Unknown' },
    deviceType: { type: String, default: 'mobile' },
    platform: { type: String, default: 'Android' },
    referrer: { type: String, default: 'Direct' },
    version: { type: String, default: '1.0.0' },
    source: { type: String, default: 'web_button' },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    ipAddress: { type: String, default: '127.0.0.1' },
    country: { type: String, default: 'Unknown Country' },
    city: { type: String, default: 'Unknown City' },
    region: { type: String, default: 'Unknown Region' },
    userAgent: { type: String, default: 'Unknown' },
    deviceType: { type: String, default: 'desktop' },
    platform: { type: String, default: 'Web' },
    source: { type: String, default: 'web' },
    status: { type: String, default: 'new' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

let AdminModel = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminSchema);
let VisitorModel = mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
let DownloadModel = mongoose.models.Download || mongoose.model('Download', DownloadSchema);
let EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

let isMongoConnected = false;
let mongoPromise = null;

async function connectMongo() {
  if (isMongoConnected) return true;
  if (!MONGODB_URI) return false;

  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return true;
  }

  if (!mongoPromise) {
    mongoPromise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000
      })
      .then(async () => {
        isMongoConnected = true;
        // Seed default admin in DB if missing
        try {
          const exists = await AdminModel.findOne({ email: ADMIN_EMAIL });
          if (!exists) {
            await AdminModel.create({
              email: ADMIN_EMAIL,
              passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
              name: ADMIN_NAME,
              role: 'admin'
            });
          }
        } catch (e) {}
        return true;
      })
      .catch((err) => {
        isMongoConnected = false;
        console.warn('MongoDB connection note (resilient memory fallback):', err.message);
        return false;
      })
      .finally(() => {
        mongoPromise = null;
      });
  }

  return mongoPromise;
}

// Telemetry helper
function extractClientInfo(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ipAddress = (
    (typeof forwarded === 'string' ? forwarded.split(',')[0] : Array.isArray(forwarded) ? forwarded[0] : req.socket?.remoteAddress) || '127.0.0.1'
  ).trim();

  const country = req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || 'Unknown Country';
  const city = req.headers['x-vercel-ip-city'] || 'Unknown City';
  const region = req.headers['x-vercel-ip-country-region'] || 'Unknown Region';
  const timezone = req.headers['x-vercel-ip-timezone'] || 'UTC';
  const userAgent = req.headers['user-agent'] || 'Unknown';

  let browser = 'Unknown Browser';
  if (/chrome|crios/i.test(userAgent) && !/edg/i.test(userAgent)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
  else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) browser = 'Safari';
  else if (/edg/i.test(userAgent)) browser = 'Edge';
  else if (/opera|opr/i.test(userAgent)) browser = 'Opera';

  let os = 'Unknown OS';
  if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
  else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';

  let deviceType = 'desktop';
  if (/mobile/i.test(userAgent) || /android/i.test(userAgent) || /iphone/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    deviceType = 'tablet';
  }

  return { ipAddress, country, city, region, timezone, userAgent, browser, os, deviceType };
}

// Auth verification helper
function verifyAuth(req) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// CORS helper
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

// Universal JSON responder
function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data));
}

// Universal body reader
async function getRequestBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => raw += c);
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); } catch (e) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = {
  JWT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_NAME,
  MONGODB_URI,
  memoryStore,
  AdminModel,
  VisitorModel,
  DownloadModel,
  EnquiryModel,
  connectMongo,
  extractClientInfo,
  verifyAuth,
  setCors,
  sendJson,
  getRequestBody
};
