import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { AdminUserSchema } from '../../schemas/admin-user.schema';
import { EnquirySchema } from '../../schemas/enquiry.schema';
import { VisitorSchema } from '../../schemas/visitor.schema';
import { DownloadSchema } from '../../schemas/download.schema';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

export interface StoredEnquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  userAgent: string;
  deviceType: string;
  platform: string;
  source: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredVisitor {
  _id: string;
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  timezone: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: string;
  pageUrl: string;
  referrer: string;
  source: string;
  visitCount: number;
  firstVisitedAt: string;
  lastVisitedAt: string;
}

export interface StoredDownload {
  _id: string;
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  userAgent: string;
  deviceType: string;
  platform: string;
  referrer: string;
  version: string;
  source: string;
  timestamp: string;
}

export interface StoredAdmin {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  lastLoginAt: string;
  createdAt: string;
}

@Injectable()
export class StoreService implements OnModuleInit {
  private readonly logger = new Logger(StoreService.name);
  private isMongoConnected = false;
  private connection?: Connection;
  private readonly storageFilePath = path.join(process.cwd(), 'admin', 'data', 'portfolio-store.json');

  // Local fallback storage
  private enquiries: StoredEnquiry[] = [];
  private visitors: StoredVisitor[] = [];
  private downloads: StoredDownload[] = [];
  private admins: StoredAdmin[] = [];

  constructor() {}

  async onModuleInit() {
    this.loadFromDisk();
    await this.seedDefaultAdmin();

    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && mongoUri.trim().length > 0) {
      try {
        this.connection = mongoose.createConnection(mongoUri, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
          autoIndex: true
        });

        this.connection.model('AdminUser', AdminUserSchema);
        this.connection.model('Enquiry', EnquirySchema);
        this.connection.model('Visitor', VisitorSchema);
        this.connection.model('Download', DownloadSchema);

        this.connection.on('connected', () => {
          this.isMongoConnected = true;
          this.logger.log('Connected to MongoDB database successfully.');
          this.seedAdminInMongo();
        });

        this.connection.on('disconnected', () => {
          this.isMongoConnected = false;
          this.logger.warn('Disconnected from MongoDB. Using resilient local store.');
        });

        this.connection.on('error', (err) => {
          this.isMongoConnected = false;
          this.logger.warn(`MongoDB issue: ${err.message}. Operating in resilient mode.`);
        });
      } catch (err: any) {
        this.isMongoConnected = false;
        this.logger.warn(`Could not initialize MongoDB connection: ${err.message}`);
      }
    } else {
      this.logger.log('No MONGODB_URI configured. Running in resilient local store mode. Set MONGODB_URI to persist to MongoDB Atlas.');
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.enquiries)) this.enquiries = parsed.enquiries;
        if (Array.isArray(parsed.visitors)) this.visitors = parsed.visitors;
        if (Array.isArray(parsed.downloads)) this.downloads = parsed.downloads;
        if (Array.isArray(parsed.admins)) this.admins = parsed.admins;
        this.logger.log(`Loaded ${this.visitors.length} visitors, ${this.enquiries.length} enquiries, ${this.downloads.length} downloads from disk.`);
      }
    } catch (e: any) {
      // Ignored
    }
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.storageFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        this.storageFilePath,
        JSON.stringify(
          {
            enquiries: this.enquiries,
            visitors: this.visitors,
            downloads: this.downloads,
            admins: this.admins
          },
          null,
          2
        ),
        'utf8'
      );
    } catch (e: any) {
      // Read-only storage on serverless ignored
    }
  }

  private checkMongoStatus(): boolean {
    if (this.connection && this.connection.readyState === 1) {
      this.isMongoConnected = true;
    } else {
      this.isMongoConnected = false;
    }
    return this.isMongoConnected;
  }

  get isConnected(): boolean {
    return this.checkMongoStatus();
  }

  // ============================================================================
  // ADMIN AUTH METHODS
  // ============================================================================
  private async seedDefaultAdmin() {
    const adminEmail = (process.env.ADMIN_EMAIL || 'shubh-tech96@gmail.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'Shubham Prajapati';

    const hash = await bcrypt.hash(adminPassword, 10);
    const existing = this.admins.find((a) => a.email === adminEmail);
    if (!existing) {
      this.admins.push({
        _id: 'admin_' + Date.now(),
        email: adminEmail,
        passwordHash: hash,
        name: adminName,
        role: 'admin',
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      this.saveToDisk();
    }
  }

  private async seedAdminInMongo() {
    try {
      if (!this.connection) return;
      const adminModel = this.connection.model('AdminUser');
      const adminEmail = (process.env.ADMIN_EMAIL || 'shubh-tech96@gmail.com').toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
      const adminName = process.env.ADMIN_NAME || 'Shubham Prajapati';

      const existing = await adminModel.findOne({ email: adminEmail });
      if (!existing) {
        const hash = await bcrypt.hash(adminPassword, 10);
        await adminModel.create({
          email: adminEmail,
          passwordHash: hash,
          name: adminName,
          role: 'admin'
        });
        this.logger.log(`Default admin account seeded into MongoDB: ${adminEmail}`);
      }
    } catch (e: any) {
      this.logger.warn(`Could not seed admin in MongoDB: ${e.message}`);
    }
  }

  async findAdminByEmail(email: string): Promise<StoredAdmin | null> {
    const normEmail = email.toLowerCase().trim();
    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('AdminUser');
        const user = await model.findOne({ email: normEmail }).lean();
        if (user) {
          return {
            _id: String((user as any)._id),
            email: (user as any).email,
            passwordHash: (user as any).passwordHash,
            name: (user as any).name || 'Admin',
            role: (user as any).role || 'admin',
            lastLoginAt: (user as any).lastLoginAt?.toISOString() || new Date().toISOString(),
            createdAt: (user as any).createdAt?.toISOString() || new Date().toISOString()
          };
        }
      } catch (err: any) {
        this.logger.warn(`Mongo findAdminByEmail error: ${err.message}`);
      }
    }
    return this.admins.find((a) => a.email === normEmail) || null;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('AdminUser');
        await model.findByIdAndUpdate(id, { lastLoginAt: new Date() });
      } catch (e) {}
    }
    const local = this.admins.find((a) => a._id === id);
    if (local) {
      local.lastLoginAt = new Date().toISOString();
      this.saveToDisk();
    }
  }

  // ============================================================================
  // ENQUIRIES METHODS
  // ============================================================================
  async createEnquiry(data: Partial<StoredEnquiry>): Promise<StoredEnquiry> {
    const now = new Date().toISOString();
    const enquiry: StoredEnquiry = {
      _id: 'enq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: data.name || '',
      email: data.email || '',
      subject: data.subject || '',
      message: data.message || '',
      ipAddress: data.ipAddress || '127.0.0.1',
      country: data.country || 'Unknown Country',
      city: data.city || 'Unknown City',
      region: data.region || 'Unknown Region',
      userAgent: data.userAgent || 'Unknown',
      deviceType: data.deviceType || 'desktop',
      platform: data.platform || 'Web',
      source: data.source || 'web',
      status: 'new',
      notes: '',
      createdAt: now,
      updatedAt: now
    };

    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('Enquiry');
        const doc: any = await model.create(enquiry);
        enquiry._id = String(doc._id);
      } catch (err: any) {
        this.logger.warn(`Failed writing enquiry to Mongo: ${err.message}`);
      }
    }

    this.enquiries.unshift(enquiry);
    this.saveToDisk();
    return enquiry;
  }

  async getEnquiries(params?: {
    search?: string;
    status?: string;
    source?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: StoredEnquiry[]; total: number }> {
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('Enquiry');
        const filter: any = {};
        if (params?.status && params.status !== 'all') {
          filter.status = params.status;
        }
        if (params?.source && params.source !== 'all') {
          filter.source = params.source;
        }
        if (params?.search) {
          const regex = new RegExp(params.search, 'i');
          filter.$or = [{ name: regex }, { email: regex }, { subject: regex }, { message: regex }];
        }

        const [total, docs] = await Promise.all([
          model.countDocuments(filter),
          model.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean()
        ]);

        const items: StoredEnquiry[] = docs.map((d: any) => ({
          _id: String(d._id),
          name: d.name,
          email: d.email,
          subject: d.subject,
          message: d.message,
          ipAddress: d.ipAddress,
          country: d.country,
          city: d.city,
          region: d.region,
          userAgent: d.userAgent,
          deviceType: d.deviceType,
          platform: d.platform,
          source: d.source,
          status: d.status,
          notes: d.notes || '',
          createdAt: d.createdAt?.toISOString?.() || d.createdAt,
          updatedAt: d.updatedAt?.toISOString?.() || d.updatedAt
        }));

        return { items, total };
      } catch (err: any) {
        this.logger.warn(`Mongo getEnquiries error: ${err.message}`);
      }
    }

    let filtered = [...this.enquiries];
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter((e) => e.status === params.status);
    }
    if (params?.source && params.source !== 'all') {
      filtered = filtered.filter((e) => e.source === params.source);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
      );
    }

    const items = filtered.slice(offset, offset + limit);
    return { items, total: filtered.length };
  }

  async updateEnquiryStatus(id: string, status: string, notes?: string): Promise<StoredEnquiry | null> {
    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('Enquiry');
        const update: any = { status, updatedAt: new Date() };
        if (notes !== undefined) update.notes = notes;
        const updated = await model.findByIdAndUpdate(id, update, { new: true }).lean();
        if (updated) {
          return {
            _id: String((updated as any)._id),
            ...(updated as any),
            createdAt: (updated as any).createdAt?.toISOString?.() || (updated as any).createdAt,
            updatedAt: (updated as any).updatedAt?.toISOString?.() || (updated as any).updatedAt
          };
        }
      } catch (e) {}
    }

    const item = this.enquiries.find((e) => e._id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      item.updatedAt = new Date().toISOString();
      this.saveToDisk();
      return item;
    }
    return null;
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('Enquiry');
        await model.findByIdAndDelete(id);
      } catch (e) {}
    }
    const idx = this.enquiries.findIndex((e) => e._id === id);
    if (idx !== -1) {
      this.enquiries.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return true;
  }

  // ============================================================================
  // VISITORS METHODS
  // ============================================================================
  async trackVisitor(data: Partial<StoredVisitor>): Promise<StoredVisitor> {
    const now = new Date().toISOString();
    const ip = data.ipAddress || '127.0.0.1';
    const source = data.source || 'web';

    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('Visitor');
        // Find recent visitor with same IP and source in the last 24h
        const recent: any = await model.findOne({
          ipAddress: ip,
          source
        });

        if (recent) {
          recent.visitCount += 1;
          recent.lastVisitedAt = new Date();
          if (data.pageUrl) recent.pageUrl = data.pageUrl;
          if (data.country && data.country !== 'Unknown Country') recent.country = data.country;
          if (data.city && data.city !== 'Unknown City') recent.city = data.city;
          await recent.save();
          return {
            _id: String(recent._id),
            ipAddress: recent.ipAddress,
            country: recent.country,
            city: recent.city,
            region: recent.region,
            timezone: recent.timezone,
            userAgent: recent.userAgent,
            browser: recent.browser,
            os: recent.os,
            deviceType: recent.deviceType,
            pageUrl: recent.pageUrl,
            referrer: recent.referrer,
            source: recent.source,
            visitCount: recent.visitCount,
            firstVisitedAt: recent.firstVisitedAt?.toISOString() || now,
            lastVisitedAt: recent.lastVisitedAt?.toISOString() || now
          };
        } else {
          const doc: any = await model.create({
            ipAddress: ip,
            country: data.country || 'Unknown Country',
            city: data.city || 'Unknown City',
            region: data.region || 'Unknown Region',
            timezone: data.timezone || 'UTC',
            userAgent: data.userAgent || 'Unknown',
            browser: data.browser || 'Unknown Browser',
            os: data.os || 'Unknown OS',
            deviceType: data.deviceType || 'desktop',
            pageUrl: data.pageUrl || '/',
            referrer: data.referrer || 'Direct',
            source,
            visitCount: 1,
            firstVisitedAt: new Date(),
            lastVisitedAt: new Date()
          });
          return {
            _id: String(doc._id),
            ...(doc.toObject() as any)
          };
        }
      } catch (err: any) {
        this.logger.warn(`Mongo trackVisitor error: ${err.message}`);
      }
    }

    // Local Store Handling
    const existing = this.visitors.find((v) => v.ipAddress === ip && v.source === source);
    if (existing) {
      existing.visitCount += 1;
      existing.lastVisitedAt = now;
      if (data.pageUrl) existing.pageUrl = data.pageUrl;
      this.saveToDisk();
      return existing;
    }

    const visitor: StoredVisitor = {
      _id: 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      ipAddress: ip,
      country: data.country || 'Unknown Country',
      city: data.city || 'Unknown City',
      region: data.region || 'Unknown Region',
      timezone: data.timezone || 'UTC',
      userAgent: data.userAgent || 'Unknown',
      browser: data.browser || 'Unknown Browser',
      os: data.os || 'Unknown OS',
      deviceType: data.deviceType || 'desktop',
      pageUrl: data.pageUrl || '/',
      referrer: data.referrer || 'Direct',
      source,
      visitCount: 1,
      firstVisitedAt: now,
      lastVisitedAt: now
    };
    this.visitors.unshift(visitor);
    this.saveToDisk();
    return visitor;
  }

  async getVisitors(params?: {
    country?: string;
    deviceType?: string;
    source?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: StoredVisitor[]; total: number; totalVisits: number }> {
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('Visitor');
        const filter: any = {};
        if (params?.country && params.country !== 'all') filter.country = params.country;
        if (params?.deviceType && params.deviceType !== 'all') filter.deviceType = params.deviceType;
        if (params?.source && params.source !== 'all') filter.source = params.source;
        if (params?.search) {
          const regex = new RegExp(params.search, 'i');
          filter.$or = [{ ipAddress: regex }, { country: regex }, { city: regex }, { browser: regex }, { os: regex }];
        }

        const [total, docs, aggregateVisits] = await Promise.all([
          model.countDocuments(filter),
          model.find(filter).sort({ lastVisitedAt: -1 }).skip(offset).limit(limit).lean(),
          model.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }])
        ]);

        const totalVisits = aggregateVisits[0]?.total || total;
        const items: StoredVisitor[] = docs.map((d: any) => ({
          _id: String(d._id),
          ipAddress: d.ipAddress,
          country: d.country,
          city: d.city,
          region: d.region,
          timezone: d.timezone,
          userAgent: d.userAgent,
          browser: d.browser,
          os: d.os,
          deviceType: d.deviceType,
          pageUrl: d.pageUrl,
          referrer: d.referrer,
          source: d.source,
          visitCount: d.visitCount || 1,
          firstVisitedAt: d.firstVisitedAt?.toISOString?.() || d.firstVisitedAt,
          lastVisitedAt: d.lastVisitedAt?.toISOString?.() || d.lastVisitedAt
        }));

        return { items, total, totalVisits };
      } catch (err: any) {
        this.logger.warn(`Mongo getVisitors error: ${err.message}`);
      }
    }

    let filtered = [...this.visitors];
    if (params?.country && params.country !== 'all') filtered = filtered.filter((v) => v.country === params.country);
    if (params?.deviceType && params.deviceType !== 'all') filtered = filtered.filter((v) => v.deviceType === params.deviceType);
    if (params?.source && params.source !== 'all') filtered = filtered.filter((v) => v.source === params.source);
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.ipAddress.toLowerCase().includes(q) ||
          v.country.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.browser.toLowerCase().includes(q) ||
          v.os.toLowerCase().includes(q)
      );
    }

    const totalVisits = this.visitors.reduce((acc, v) => acc + (v.visitCount || 1), 0);
    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
      totalVisits
    };
  }

  // ============================================================================
  // DOWNLOADS METHODS
  // ============================================================================
  async trackDownload(data: Partial<StoredDownload>): Promise<StoredDownload> {
    const now = new Date().toISOString();
    const download: StoredDownload = {
      _id: 'dl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      ipAddress: data.ipAddress || '127.0.0.1',
      country: data.country || 'Unknown Country',
      city: data.city || 'Unknown City',
      region: data.region || 'Unknown Region',
      userAgent: data.userAgent || 'Unknown',
      deviceType: data.deviceType || 'desktop',
      platform: data.platform || 'Android',
      referrer: data.referrer || 'Direct',
      version: data.version || '1.0.0',
      source: data.source || 'web_button',
      timestamp: now
    };

    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('Download');
        const doc: any = await model.create(download);
        download._id = String(doc._id);
      } catch (err: any) {
        this.logger.warn(`Mongo trackDownload error: ${err.message}`);
      }
    }

    this.downloads.unshift(download);
    this.saveToDisk();
    return download;
  }

  async getDownloads(params?: {
    country?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: StoredDownload[]; total: number }> {
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    if (this.checkMongoStatus()) {
      try {
        const model = this.connection!.model('Download');
        const filter: any = {};
        if (params?.country && params.country !== 'all') filter.country = params.country;

        const [total, docs] = await Promise.all([
          model.countDocuments(filter),
          model.find(filter).sort({ timestamp: -1 }).skip(offset).limit(limit).lean()
        ]);

        const items: StoredDownload[] = docs.map((d: any) => ({
          _id: String(d._id),
          ipAddress: d.ipAddress,
          country: d.country,
          city: d.city,
          region: d.region,
          userAgent: d.userAgent,
          deviceType: d.deviceType,
          platform: d.platform,
          referrer: d.referrer,
          version: d.version,
          source: d.source,
          timestamp: d.timestamp?.toISOString?.() || d.timestamp
        }));

        return { items, total };
      } catch (err: any) {
        this.logger.warn(`Mongo getDownloads error: ${err.message}`);
      }
    }

    let filtered = [...this.downloads];
    if (params?.country && params.country !== 'all') {
      filtered = filtered.filter((d) => d.country === params.country);
    }
    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length
    };
  }

  // ============================================================================
  // STATS & AGGREGATIONS
  // ============================================================================
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [enquiriesRes, visitorsRes, downloadsRes] = await Promise.all([
      this.getEnquiries({ limit: 1000 }),
      this.getVisitors({ limit: 1000 }),
      this.getDownloads({ limit: 1000 })
    ]);

    const enquiries = enquiriesRes.items;
    const visitors = visitorsRes.items;
    const downloads = downloadsRes.items;

    // Counts
    const totalEnquiries = enquiriesRes.total;
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
    const totalVisitors = visitorsRes.total;
    const totalVisits = visitorsRes.totalVisits;
    const totalDownloads = downloadsRes.total;

    // Today's counts
    const todayVisitors = visitors.filter((v) => new Date(v.lastVisitedAt) >= today).length;
    const todayDownloads = downloads.filter((d) => new Date(d.timestamp) >= today).length;
    const todayEnquiries = enquiries.filter((e) => new Date(e.createdAt) >= today).length;

    // Country distribution
    const countryMap = new Map<string, number>();
    visitors.forEach((v) => {
      const c = v.country || 'Unknown';
      countryMap.set(c, (countryMap.get(c) || 0) + 1);
    });
    const topCountries = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Source distribution (Web vs APK)
    const webVisitors = visitors.filter((v) => v.source === 'web').length;
    const apkVisitors = visitors.filter((v) => v.source === 'apk').length;

    // Device breakdown
    const mobileCount = visitors.filter((v) => v.deviceType === 'mobile').length;
    const desktopCount = visitors.filter((v) => v.deviceType === 'desktop').length;
    const tabletCount = visitors.filter((v) => v.deviceType === 'tablet').length;

    return {
      databaseStatus: this.checkMongoStatus() ? 'Connected (MongoDB)' : 'Resilient Mode (In-Memory/Local)',
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
      sourceBreakdown: {
        web: webVisitors,
        apk: apkVisitors
      },
      deviceBreakdown: {
        desktop: desktopCount,
        mobile: mobileCount,
        tablet: tabletCount
      },
      topCountries,
      recentActivity: [
        ...enquiries.slice(0, 4).map((e) => ({
          type: 'enquiry',
          title: `New enquiry from ${e.name}`,
          subtitle: e.subject,
          meta: `${e.city}, ${e.country} · ${e.source.toUpperCase()}`,
          timestamp: e.createdAt
        })),
        ...downloads.slice(0, 4).map((d) => ({
          type: 'download',
          title: `APK Downloaded`,
          subtitle: `${d.platform} · ${d.deviceType}`,
          meta: `${d.city}, ${d.country}`,
          timestamp: d.timestamp
        })),
        ...visitors.slice(0, 4).map((v) => ({
          type: 'visitor',
          title: `Visitor from ${v.city}, ${v.country}`,
          subtitle: `${v.browser} on ${v.os}`,
          meta: `Source: ${v.source.toUpperCase()} (${v.visitCount} visits)`,
          timestamp: v.lastVisitedAt
        }))
      ]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8)
    };
  }
}
