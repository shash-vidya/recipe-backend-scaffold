const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req,res)=>{
  try{
    const { name, username, email, password } = req.body;
    if(!name||!username||!email||!password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ where: { email } });
    if(exists) return res.status(409).json({ error: 'Email already used' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, email, passwordHash });
    return res.status(201).json({ data: { id: user.id, name: user.name, username: user.username, email: user.email } });
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    if(!email||!password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ where: { email } });
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return res.json({ data: { accessToken: token, user: { id: user.id, name: user.name, username: user.username, email: user.email } } });
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.get('/me', require('../middleware/auth'), async (req,res)=>{
  const user = await User.findByPk(req.userId, { attributes: ['id','name','username','email','bio','avatarUrl'] });
  res.json({ data: user });
});

module.exports = router;
