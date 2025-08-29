const express = require('express');
const router = express.Router();
const { Recipe, User, Review } = require('../models');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });

// create recipe
router.post('/', auth, async (req,res)=>{
  try{
    const data = req.body;
    data.authorId = req.userId;
    const recipe = await Recipe.create(data);
    res.status(201).json({ data: recipe });
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// upload image for recipe (multipart/form-data: file field 'image')
router.post('/:id/image', auth, upload.single('image'), async (req,res)=>{
  try{
    const recipe = await Recipe.findByPk(req.params.id);
    if(!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if(recipe.authorId !== req.userId) return res.status(403).json({ error: 'Not owner' });
    const rel = '/uploads/' + path.basename(req.file.path);
    recipe.mainImageUrl = rel;
    await recipe.save();
    res.json({ data: { url: rel } });
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// list recipes (simple)
router.get('/', async (req,res)=>{
  const q = req.query.q;
  const where = {};
  if(q) where.title = { [require('sequelize').Op.like]: '%' + q + '%' };
  const recipes = await Recipe.findAll({ where, include: [{ model: User, as: 'author', attributes: ['id','name','username'] }], order:[['createdAt','DESC']], limit: 50 });
  res.json({ data: recipes });
});

// get recipe
router.get('/:id', async (req,res)=>{
  const recipe = await Recipe.findByPk(req.params.id, { include: [{ model: User, as: 'author', attributes:['id','name','username'] }, { model: Review, as: 'reviews', include: [{ model: User, as: 'user', attributes:['id','name','username'] }] }] });
  if(!recipe) return res.status(404).json({ error: 'Not found' });
  res.json({ data: recipe });
});

// update recipe (owner only)
router.patch('/:id', auth, async (req,res)=>{
  const recipe = await Recipe.findByPk(req.params.id);
  if(!recipe) return res.status(404).json({ error: 'Not found' });
  if(recipe.authorId !== req.userId) return res.status(403).json({ error: 'Not owner' });
  Object.assign(recipe, req.body);
  await recipe.save();
  res.json({ data: recipe });
});

// delete recipe
router.delete('/:id', auth, async (req,res)=>{
  const recipe = await Recipe.findByPk(req.params.id);
  if(!recipe) return res.status(404).json({ error: 'Not found' });
  if(recipe.authorId !== req.userId) return res.status(403).json({ error: 'Not owner' });
  await recipe.destroy();
  res.status(204).end();
});

// reviews
router.post('/:id/reviews', auth, async (req,res)=>{
  try{
    const { rating, comment } = req.body;
    const recipe = await Recipe.findByPk(req.params.id);
    if(!recipe) return res.status(404).json({ error: 'Recipe not found' });
    const review = await Review.create({ recipeId: recipe.id, userId: req.userId, rating, comment });
    res.status(201).json({ data: review });
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
