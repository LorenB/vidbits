const router = require('express').Router();

const Video = require('../models/video');

router.get('/', async (req, res) => {
  res.render('index');
});

router.post('/videos', async (req, res) => {
  const {title, description} = req.body;
  await Video.create({title, description});

  res
    .status(201)
    .render('videos/show', req.body);
});

module.exports = router;
