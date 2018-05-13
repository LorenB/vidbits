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

router.get('/videos/:videoId', async (req, res) => {
  const video = await Video.findById(req.params.videoId);
  res
    .status(201)
    .render('videos/show', {video} );
});

router.post('/videos', async (req, res) => {
  const {title, description, url} = req.body;
  if(!!title && title.length > 0) {
    const video = await Video.create({title, description, url});
    res
      .status(201)
      .render('videos/show', {video});
  } else {

    res
      .status(400)
      .render('videos/create', {title, description, error: 'could not find title input'});
  }

});

module.exports = router;
