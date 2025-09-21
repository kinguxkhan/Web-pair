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
      const { roomId, username } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      if (!roomId || !username) {
        return res.status(400).json({ error: 'Room ID and username are required' });
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Joined room successfully',
        roomId,
        username
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};