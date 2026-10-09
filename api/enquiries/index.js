const url = require('url');
const {
  EnquiryModel,
  memoryStore,
  connectMongo,
  extractClientInfo,
  verifyAuth,
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

  const parsed = url.parse(req.url, true);

  // POST: Create Enquiry (Public)
  if (req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const { name, email, subject, message, platform = 'Web', source = 'web' } = body || {};

      if (!name || !email || !subject || !message) {
        return sendJson(res, 400, { error: 'Bad Request', message: 'All fields (name, email, subject, message) are required.' });
      }

      const client = extractClientInfo(req);
      const enq = {
        _id: 'enq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        subject: String(subject).trim(),
        message: String(message).trim(),
        ipAddress: client.ipAddress,
        country: client.country,
        city: client.city,
        region: client.region,
        userAgent: client.userAgent,
        deviceType: client.deviceType,
        platform,
        source,
        status: 'new',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        const isConnected = await connectMongo();
        if (isConnected && EnquiryModel) {
          const doc = await EnquiryModel.create(enq);
          return sendJson(res, 201, {
            success: true,
            message: 'Your enquiry has been received successfully. I will get back to you promptly!',
            id: String(doc._id)
          });
        }
      } catch (dbErr) {
        console.warn('[Enquiry Create DB warning]:', dbErr.message);
      }

      memoryStore.enquiries.unshift(enq);
      return sendJson(res, 201, {
        success: true,
        message: 'Your enquiry has been received successfully. I will get back to you promptly!',
        id: enq._id
      });
    } catch (err) {
      console.error('[Enquiry Create Error]:', err);
      return sendJson(res, 500, { error: 'Internal Error', message: err?.message });
    }
  }

  // Admin Protected endpoints: GET, PATCH, DELETE
  const user = verifyAuth(req);
  if (!user) {
    return sendJson(res, 401, { error: 'Unauthorized', message: 'Valid token required' });
  }

  // GET: List enquiries
  if (req.method === 'GET') {
    try {
      const { search, status, source, limit = 50, offset = 0 } = parsed.query || {};
      const l = Math.min(Number(limit) || 50, 100);
      const o = Number(offset) || 0;

      try {
        const isConnected = await connectMongo();
        if (isConnected && EnquiryModel) {
          const filter = {};
          if (status && status !== 'all') filter.status = status;
          if (source && source !== 'all') filter.source = source;
          if (search) {
            const regex = new RegExp(String(search), 'i');
            filter.$or = [{ name: regex }, { email: regex }, { subject: regex }, { message: regex }];
          }
          const [total, docs] = await Promise.all([
            EnquiryModel.countDocuments(filter),
            EnquiryModel.find(filter).sort({ createdAt: -1 }).skip(o).limit(l).lean()
          ]);
          return sendJson(res, 200, { items: docs.map((d) => ({ ...d, _id: String(d._id) })), total });
        }
      } catch (dbErr) {
        console.warn('[Enquiries List DB warning]:', dbErr.message);
      }

      let items = [...memoryStore.enquiries];
      if (status && status !== 'all') items = items.filter((e) => e.status === status);
      if (source && source !== 'all') items = items.filter((e) => e.source === source);
      if (search) {
        const q = String(search).toLowerCase();
        items = items.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.subject.toLowerCase().includes(q) ||
            e.message.toLowerCase().includes(q)
        );
      }
      return sendJson(res, 200, { items: items.slice(o, o + l), total: items.length });
    } catch (err) {
      return sendJson(res, 500, { error: 'Internal Error', message: err?.message });
    }
  }

  // PATCH or DELETE by query ID
  const id = parsed.query?.id || (req.url.split('/').pop() !== 'enquiries' ? req.url.split('/').pop() : null);

  if (req.method === 'PATCH') {
    try {
      const body = await getRequestBody(req);
      const { status, notes } = body || {};

      try {
        const isConnected = await connectMongo();
        if (isConnected && EnquiryModel && id) {
          const update = { updatedAt: new Date() };
          if (status) update.status = status;
          if (notes !== undefined) update.notes = notes;
          const updated = await EnquiryModel.findByIdAndUpdate(id, update, { new: true }).lean();
          if (updated) return sendJson(res, 200, { success: true, item: { ...updated, _id: String(updated._id) } });
        }
      } catch (e) {}

      const item = memoryStore.enquiries.find((e) => e._id === id);
      if (!item) return sendJson(res, 404, { error: 'Not Found', message: 'Enquiry not found.' });
      if (status) item.status = status;
      if (notes !== undefined) item.notes = notes;
      item.updatedAt = new Date().toISOString();
      return sendJson(res, 200, { success: true, item });
    } catch (err) {
      return sendJson(res, 500, { error: 'Internal Error', message: err?.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      try {
        const isConnected = await connectMongo();
        if (isConnected && EnquiryModel && id) {
          await EnquiryModel.findByIdAndDelete(id);
        }
      } catch (e) {}

      const idx = memoryStore.enquiries.findIndex((e) => e._id === id);
      if (idx !== -1) memoryStore.enquiries.splice(idx, 1);
      return sendJson(res, 200, { success: true, message: 'Enquiry removed successfully.' });
    } catch (err) {
      return sendJson(res, 500, { error: 'Internal Error', message: err?.message });
    }
  }

  return sendJson(res, 405, { error: 'Method Not Allowed' });
};
