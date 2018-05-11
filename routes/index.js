const router = require('express').Router();

const Video = require('../models/video');

router.get('/', async (req, res) => {
  res.redirect('/videos');
});

router.get('/videos', async (req, res) => {
  const videos = await Video.find({});
  res.render('index', {videos});
});

router.get('/videos/create', async (req, res) => {
  res.render('videos/create');
});

router.post('/videos', async (req, res) => {
  const {title, description} = req.body;
  if(!!title && title.length > 0) {
    await Video.create({title, description});
    res
      .status(201)
      .render('videos/show', {title, description});
  } else {

    res
      .status(400)
      .render('videos/create', {title, description, error: 'could not find title input'});
  }

});

module.exports = router;
