const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const { username } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }
      
      const roomId = uuidv4().substring(0, 8);
      const link = `${process.env.VERCEL_URL || 'https://your-app-name.vercel.app'}?room=${roomId}&name=${encodeURIComponent(username)}`;
      
      res.status(200).json({ 
        roomId, 
        link,
        message: 'Room created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};