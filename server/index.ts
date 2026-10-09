import express, { Request, Response, NextFunction } from 'express';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global CORS handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// ============================================================================
// CONFIGURATION & SECRETS
// ============================================================================
const JWT_SECRET = process.env.JWT_SECRET || 'shubham_portfolio_secure_jwt_secret_token_2026_xyz';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'shubh-tech96@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Shubham Prajapati';
const MONGODB_URI = process.env.MONGODB_URI;

// ============================================================================
// IN-MEMORY RESILIENT CACHE (When MongoDB Atlas is connecting or not yet configured)
// ============================================================================
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
  visitors: [] as any[],
  downloads: [] as any[],
  enquiries: [] as any[]
};

// ============================================================================
// MONGOOSE SCHEMAS & CONNECTION
// ============================================================================
let isMongoConnected = false;

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Shubham Prajapati' },
    role: { type: String, default: 'admin' },
    lastLoginAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const VisitorSchema = new Schema(
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

const DownloadSchema = new Schema(
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

const EnquirySchema = new Schema(
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

const AdminModel = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminSchema);
const VisitorModel = mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
const DownloadModel = mongoose.models.Download || mongoose.model('Download', DownloadSchema);
const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

let mongoConnectingPromise: Promise<void> | null = null;

async function initMongo() {
  if (isMongoConnected) return;
  if (!MONGODB_URI) return;

  try {
    if (mongoose.connection.readyState === 1) {
      isMongoConnected = true;
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000
    });

    isMongoConnected = true;

    // Seed admin in MongoDB if not exists
    const existing = await AdminModel.findOne({ email: ADMIN_EMAIL });
    if (!existing) {
      await AdminModel.create({
        email: ADMIN_EMAIL,
        passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
        name: ADMIN_NAME,
        role: 'admin'
      });
    }
  } catch (err: any) {
    isMongoConnected = false;
    console.warn('MongoDB connection note (operating in resilient fallback mode):', err?.message || err);
  }
}

async function ensureMongo() {
  if (isMongoConnected || !MONGODB_URI) return;
  if (!mongoConnectingPromise) {
    mongoConnectingPromise = initMongo().finally(() => {
      mongoConnectingPromise = null;
    });
  }
  return mongoConnectingPromise;
}

// Background attempt on cold start
ensureMongo().catch(() => {});

// Middleware to ensure connection before handling routes
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (MONGODB_URI && !isMongoConnected) {
    try {
      await ensureMongo();
    } catch (e) {}
  }
  next();
});

// ============================================================================
// HELPER: CLIENT TELEMETRY EXTRACTION (Supports Vercel Edge Headers)
// ============================================================================
function extractClientInfo(req: Request) {
  const forwarded = req.headers['x-forwarded-for'];
  const ipAddress = (
    (typeof forwarded === 'string' ? forwarded.split(',')[0] : Array.isArray(forwarded) ? forwarded[0] : req.socket?.remoteAddress) || '127.0.0.1'
  ).trim();

  // Vercel Edge Geo IP Headers
  const country = (req.headers['x-vercel-ip-country'] as string) || (req.headers['cf-ipcountry'] as string) || 'Unknown Country';
  const city = (req.headers['x-vercel-ip-city'] as string) || 'Unknown City';
  const region = (req.headers['x-vercel-ip-country-region'] as string) || 'Unknown Region';
  const timezone = (req.headers['x-vercel-ip-timezone'] as string) || 'UTC';

  const userAgent = (req.headers['user-agent'] as string) || 'Unknown';
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
    deviceType = /tablet|ipad/i.test(userAgent) ? 'tablet' : 'mobile';
  }

  let browser = 'Unknown Browser';
  if (/chrome|crios/i.test(userAgent) && !/edg/i.test(userAgent)) browser = 'Chrome';
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
  else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
  else if (/edg/i.test(userAgent)) browser = 'Edge';

  let os = 'Unknown OS';
  if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
  else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';

  return { ipAddress, country, city, region, timezone, userAgent, deviceType, browser, os, platform: os };
}

// ============================================================================
// JWT AUTH MIDDLEWARE
// ============================================================================
function authGuard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token.' });
  }

  const token = authHeader.substring(7).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Session expired or token invalid.' });
  }
}

// ============================================================================
// ROUTES IMPLEMENTATION
// ============================================================================

// --- 1. AUTH ---
app.post(['/api/auth/login', '/auth/login'], async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email and password required.' });
    }

    const normEmail = String(email).toLowerCase().trim();
    let adminUser: any = null;

    if (isMongoConnected && AdminModel) {
      try {
        adminUser = await AdminModel.findOne({ email: normEmail }).lean();
      } catch (e) {}
    }

    if (!adminUser) {
      adminUser = memoryStore.admins.find((a) => a.email === normEmail);
    }

    if (!adminUser) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
    }

    const isValid = bcrypt.compareSync(String(password), adminUser.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: String(adminUser._id), email: adminUser.email, name: adminUser.name, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: String(adminUser._id),
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

app.get(['/api/auth/me', '/auth/me'], authGuard, (req: Request, res: Response) => {
  return res.json({ success: true, user: (req as any).user });
});

// --- 2. VISITORS TRACKING ---
app.post(['/api/visitors/track', '/visitors/track'], async (req: Request, res: Response) => {
  try {
    const client = extractClientInfo(req);
    const { pageUrl, referrer, source } = req.body || {};
    const src = source === 'apk' ? 'apk' : 'web';
    const now = new Date().toISOString();

    if (isMongoConnected && VisitorModel) {
      try {
        const existing: any = await VisitorModel.findOne({ ipAddress: client.ipAddress, source: src });
        if (existing) {
          existing.visitCount += 1;
          existing.lastVisitedAt = new Date();
          if (pageUrl) existing.pageUrl = pageUrl;
          await existing.save();
          return res.json({ success: true, visitorId: String(existing._id), visitCount: existing.visitCount });
        } else {
          const doc: any = await VisitorModel.create({
            ...client,
            pageUrl: pageUrl || '/',
            referrer: referrer || 'Direct',
            source: src,
            visitCount: 1
          });
          return res.json({ success: true, visitorId: String(doc._id), visitCount: 1 });
        }
      } catch (e) {}
    }

    // Memory Store
    const mem = memoryStore.visitors.find((v) => v.ipAddress === client.ipAddress && v.source === src);
    if (mem) {
      mem.visitCount += 1;
      mem.lastVisitedAt = now;
      if (pageUrl) mem.pageUrl = pageUrl;
      return res.json({ success: true, visitorId: mem._id, visitCount: mem.visitCount });
    }

    const newVis = {
      _id: 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...client,
      pageUrl: pageUrl || '/',
      referrer: referrer || 'Direct',
      source: src,
      visitCount: 1,
      firstVisitedAt: now,
      lastVisitedAt: now
    };
    memoryStore.visitors.unshift(newVis);
    return res.json({ success: true, visitorId: newVis._id, visitCount: 1 });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

app.get(['/api/visitors', '/visitors'], authGuard, async (req: Request, res: Response) => {
  try {
    const { country, deviceType, source, search, limit = 50, offset = 0 } = req.query as any;
    const l = Math.min(Number(limit) || 50, 100);
    const o = Number(offset) || 0;

    if (isMongoConnected && VisitorModel) {
      try {
        const filter: any = {};
        if (country && country !== 'all') filter.country = country;
        if (deviceType && deviceType !== 'all') filter.deviceType = deviceType;
        if (source && source !== 'all') filter.source = source;
        if (search) {
          const regex = new RegExp(search, 'i');
          filter.$or = [{ ipAddress: regex }, { country: regex }, { city: regex }, { browser: regex }];
        }

        const [total, docs, allVisits] = await Promise.all([
          VisitorModel.countDocuments(filter),
          VisitorModel.find(filter).sort({ lastVisitedAt: -1 }).skip(o).limit(l).lean(),
          VisitorModel.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }])
        ]);

        return res.json({
          items: docs.map((d: any) => ({ ...d, _id: String(d._id) })),
          total,
          totalVisits: allVisits[0]?.total || total
        });
      } catch (e) {}
    }

    let items = [...memoryStore.visitors];
    if (country && country !== 'all') items = items.filter((v) => v.country === country);
    if (deviceType && deviceType !== 'all') items = items.filter((v) => v.deviceType === deviceType);
    if (source && source !== 'all') items = items.filter((v) => v.source === source);
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter((v) => v.country?.toLowerCase().includes(q) || v.ipAddress?.includes(q) || v.city?.toLowerCase().includes(q));
    }

    const totalVisits = memoryStore.visitors.reduce((acc, v) => acc + (v.visitCount || 1), 0);
    return res.json({
      items: items.slice(o, o + l),
      total: items.length,
      totalVisits
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

// --- 3. DOWNLOADS TRACKING ---
app.post(['/api/downloads/track', '/downloads/track'], async (req: Request, res: Response) => {
  try {
    const client = extractClientInfo(req);
    const { referrer, version = '1.0.0', source = 'web_button' } = req.body || {};
    const now = new Date().toISOString();

    const record = {
      _id: 'dl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...client,
      referrer: referrer || 'Direct',
      version,
      source,
      timestamp: now
    };

    if (isMongoConnected && DownloadModel) {
      try {
        const doc: any = await DownloadModel.create(record);
        return res.json({ success: true, downloadId: String(doc._id), timestamp: doc.timestamp });
      } catch (e) {}
    }

    memoryStore.downloads.unshift(record);
    return res.json({ success: true, downloadId: record._id, timestamp: record.timestamp });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

app.get(['/api/downloads/apk', '/downloads/apk'], async (req: Request, res: Response) => {
  // Track download automatically
  try {
    const client = extractClientInfo(req);
    const record = {
      _id: 'dl_' + Date.now(),
      ...client,
      source: 'direct_url',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
    if (isMongoConnected && DownloadModel) {
      DownloadModel.create(record).catch(() => {});
    } else {
      memoryStore.downloads.unshift(record);
    }
  } catch (e) {}

  // Redirect to GitHub latest APK or hosted path
  return res.redirect('/downloads/Shubham-Portfolio.apk');
});

app.get(['/api/downloads', '/downloads'], authGuard, async (req: Request, res: Response) => {
  try {
    const { country, limit = 50, offset = 0 } = req.query as any;
    const l = Math.min(Number(limit) || 50, 100);
    const o = Number(offset) || 0;

    if (isMongoConnected && DownloadModel) {
      try {
        const filter: any = {};
        if (country && country !== 'all') filter.country = country;
        const [total, docs] = await Promise.all([
          DownloadModel.countDocuments(filter),
          DownloadModel.find(filter).sort({ timestamp: -1 }).skip(o).limit(l).lean()
        ]);
        return res.json({ items: docs.map((d: any) => ({ ...d, _id: String(d._id) })), total });
      } catch (e) {}
    }

    let items = [...memoryStore.downloads];
    if (country && country !== 'all') items = items.filter((d) => d.country === country);
    return res.json({ items: items.slice(o, o + l), total: items.length });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

// --- 4. ENQUIRIES ---
app.post(['/api/enquiries', '/enquiries'], async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, source } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Bad Request', message: 'Name, email, subject, and message are required.' });
    }

    const client = extractClientInfo(req);
    const now = new Date().toISOString();
    const enq = {
      _id: 'enq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      ...client,
      source: source === 'apk' ? 'apk' : 'web',
      status: 'new',
      notes: '',
      createdAt: now,
      updatedAt: now
    };

    if (isMongoConnected && EnquiryModel) {
      try {
        const doc: any = await EnquiryModel.create(enq);
        return res.json({
          success: true,
          message: 'Your enquiry has been received successfully. I will get back to you promptly!',
          id: String(doc._id)
        });
      } catch (e) {}
    }

    memoryStore.enquiries.unshift(enq);
    return res.json({
      success: true,
      message: 'Your enquiry has been received successfully. I will get back to you promptly!',
      id: enq._id
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

app.get(['/api/enquiries', '/enquiries'], authGuard, async (req: Request, res: Response) => {
  try {
    const { search, status, source, limit = 50, offset = 0 } = req.query as any;
    const l = Math.min(Number(limit) || 50, 100);
    const o = Number(offset) || 0;

    if (isMongoConnected && EnquiryModel) {
      try {
        const filter: any = {};
        if (status && status !== 'all') filter.status = status;
        if (source && source !== 'all') filter.source = source;
        if (search) {
          const regex = new RegExp(search, 'i');
          filter.$or = [{ name: regex }, { email: regex }, { subject: regex }, { message: regex }];
        }
        const [total, docs] = await Promise.all([
          EnquiryModel.countDocuments(filter),
          EnquiryModel.find(filter).sort({ createdAt: -1 }).skip(o).limit(l).lean()
        ]);
        return res.json({ items: docs.map((d: any) => ({ ...d, _id: String(d._id) })), total });
      } catch (e) {}
    }

    let items = [...memoryStore.enquiries];
    if (status && status !== 'all') items = items.filter((e) => e.status === status);
    if (source && source !== 'all') items = items.filter((e) => e.source === source);
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q) || e.message.toLowerCase().includes(q));
    }
    return res.json({ items: items.slice(o, o + l), total: items.length });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

app.patch(['/api/enquiries/:id/status', '/enquiries/:id/status'], authGuard, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body || {};

    if (isMongoConnected && EnquiryModel) {
      try {
        const update: any = { status, updatedAt: new Date() };
        if (notes !== undefined) update.notes = notes;
        const updated = await EnquiryModel.findByIdAndUpdate(id, update, { new: true }).lean();
        if (updated) return res.json({ success: true, item: { ...updated, _id: String((updated as any)._id) } });
      } catch (e) {}
    }

    const item = memoryStore.enquiries.find((e) => e._id === id);
    if (!item) return res.status(404).json({ error: 'Not Found', message: 'Enquiry not found.' });
    if (status) item.status = status;
    if (notes !== undefined) item.notes = notes;
    item.updatedAt = new Date().toISOString();
    return res.json({ success: true, item });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

app.delete(['/api/enquiries/:id', '/enquiries/:id'], authGuard, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && EnquiryModel) {
      try {
        await EnquiryModel.findByIdAndDelete(id);
      } catch (e) {}
    }
    const idx = memoryStore.enquiries.findIndex((e) => e._id === id);
    if (idx !== -1) memoryStore.enquiries.splice(idx, 1);
    return res.json({ success: true, message: 'Enquiry removed successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

// --- 5. DASHBOARD STATS ---
app.get(['/api/stats', '/stats'], authGuard, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let visitors: any[] = memoryStore.visitors;
    let downloads: any[] = memoryStore.downloads;
    let enquiries: any[] = memoryStore.enquiries;

    if (isMongoConnected && VisitorModel && DownloadModel && EnquiryModel) {
      try {
        const [vDocs, dDocs, eDocs] = await Promise.all([
          VisitorModel.find({}).sort({ lastVisitedAt: -1 }).limit(1000).lean(),
          DownloadModel.find({}).sort({ timestamp: -1 }).limit(1000).lean(),
          EnquiryModel.find({}).sort({ createdAt: -1 }).limit(1000).lean()
        ]);
        visitors = vDocs.map((d: any) => ({ ...d, _id: String(d._id) }));
        downloads = dDocs.map((d: any) => ({ ...d, _id: String(d._id) }));
        enquiries = eDocs.map((d: any) => ({ ...d, _id: String(d._id) }));
      } catch (e) {}
    }

    const totalVisitors = visitors.length;
    const totalVisits = visitors.reduce((acc, v) => acc + (v.visitCount || 1), 0);
    const todayVisitors = visitors.filter((v) => new Date(v.lastVisitedAt || v.updatedAt) >= today).length;
    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
    const todayEnquiries = enquiries.filter((e) => new Date(e.createdAt) >= today).length;
    const totalDownloads = downloads.length;
    const todayDownloads = downloads.filter((d) => new Date(d.timestamp || d.createdAt) >= today).length;

    const countryMap = new Map<string, number>();
    visitors.forEach((v) => {
      const c = v.country || 'Unknown';
      countryMap.set(c, (countryMap.get(c) || 0) + 1);
    });
    const topCountries = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const webVisitors = visitors.filter((v) => v.source === 'web').length;
    const apkVisitors = visitors.filter((v) => v.source === 'apk').length;

    const desktopCount = visitors.filter((v) => v.deviceType === 'desktop').length;
    const mobileCount = visitors.filter((v) => v.deviceType === 'mobile').length;
    const tabletCount = visitors.filter((v) => v.deviceType === 'tablet').length;

    const recentActivity = [
      ...enquiries.slice(0, 4).map((e) => ({
        type: 'enquiry' as const,
        title: `New enquiry from ${e.name}`,
        subtitle: e.subject,
        meta: `${e.city || 'Unknown'}, ${e.country || 'Unknown'} · ${(e.source || 'web').toUpperCase()}`,
        timestamp: e.createdAt
      })),
      ...downloads.slice(0, 4).map((d) => ({
        type: 'download' as const,
        title: `APK Downloaded (v${d.version || '1.0.0'})`,
        subtitle: `${d.platform || 'Android'} (${d.deviceType || 'mobile'})`,
        meta: `${d.city || 'Unknown'}, ${d.country || 'Unknown'}`,
        timestamp: d.timestamp
      })),
      ...visitors.slice(0, 4).map((v) => ({
        type: 'visitor' as const,
        title: `Visitor from ${v.country || 'Unknown'}`,
        subtitle: `${v.browser || 'Browser'} on ${v.os || 'OS'}`,
        meta: `${v.pageUrl || '/'} · ${(v.source || 'web').toUpperCase()}`,
        timestamp: v.lastVisitedAt || v.firstVisitedAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

    return res.json({
      databaseStatus: isMongoConnected ? 'Connected (MongoDB Atlas)' : 'Resilient Mode (In-Memory)',
      kpis: {
        totalVisitors,
        totalVisits,
        todayVisitors,
        totalEnquiries,
        newEnquiries,
        todayEnquiries,
        totalDownloads,
        todayDownloads
      },
      sourceBreakdown: { web: webVisitors, apk: apkVisitors },
      deviceBreakdown: { desktop: desktopCount, mobile: mobileCount, tablet: tabletCount },
      topCountries,
      recentActivity
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Error', message: err?.message });
  }
});

// Default catch-all for /api
app.use((req: Request, res: Response) => {
  return res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.url} not found` });
});

// Express Error Boundary
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Serverless Error]:', err);
  return res.status(500).json({
    error: 'Internal Server Error',
    message: err?.message || 'Unknown internal error'
  });
});

// Vercel Serverless Function Handler Wrapper
const handler = (req: any, res: any) => {
  try {
    return (app as any)(req, res);
  } catch (syncErr: any) {
    console.error('[Vercel Handler Crash]:', syncErr);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Serverless Function Crash', message: syncErr?.message }));
  }
};

(handler as any).default = handler;
export default handler;
