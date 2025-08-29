const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(express.json());

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Static serve uploaded images (for development)
app.use('/uploads', express.static(uploadsDir));

app.use('/v1/auth', authRoutes);
app.use('/v1/recipes', recipeRoutes);

app.get('/v1/health', (req,res)=>res.json({status:'ok'}));

// initialize DB & sync models
(async ()=>{
  try{
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database synced');
  }catch(err){
    console.error('DB init error', err);
  }
})();

module.exports = app;
