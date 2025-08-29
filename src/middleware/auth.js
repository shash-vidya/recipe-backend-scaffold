const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'Missing authorization header' });
  const parts = auth.split(' ');
  if(parts.length!==2) return res.status(401).json({ error: 'Invalid authorization header' });
  const token = parts[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.userId = payload.sub;
    next();
  }catch(err){
    return res.status(401).json({ error: 'Invalid token' });
  }
};
