const { verifyAuth, setCors, sendJson } = require('../_lib/db');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const user = verifyAuth(req);
  if (!user) {
    return sendJson(res, 401, { error: 'Unauthorized', message: 'Valid token required' });
  }

  return sendJson(res, 200, { success: true, user });
};
