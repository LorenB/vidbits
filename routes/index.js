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

router.get('/videos/:videoId/edit', async (req, res) => {
  const video = await Video.findById(req.params.videoId);
  res
    .status(201)
    .render('videos/edit', {video} );
});

router.post('/videos', async (req, res) => {
  const video = new Video({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url
  });
  const error = video.validateSync();
  let errorMessage = 'could not save video';
  if(!error) {
    await video.save();
    res
      .status(201)
      .render('videos/show', {video});
  } else {
    if(!!error && !!error.errors) {
      if(!!error.errors.title) {
        errorMessage = 'could not find title input';
      }
      if(!!error.errors.url) {
        errorMessage = 'a URL is required';
      }
    }

    res
      .status(400)
      .render('videos/create', {
        video: {
          title: req.body.title,
          description: req.body.description,
          url: req.body.url,
          error: errorMessage
        }
    });
  }
});

router.post('/videos/:videoId/updates', async (req, res) => {
  let errServer = {};
  if(!req.body.title || req.body.title.length === 0) {
    errServer.title = 'Title is required';
  }
  if(!req.body.url || req.body.url.length === 0) {
    errServer.url = 'URL is required';
  }

  if(Object.keys(errServer).length === 0 && errServer.constructor === Object){
    await Video.update(
      {_id: req.params.videoId},
      {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url
      },
      (err, video) => {
        if(err) {
          res.sendStatus(400);
        } else {
          res
            .redirect(`/videos/${req.params.videoId}`);
        }
      }
    );
  } else {
    res
      .status(400)
      .render('videos/create', {
        video: {
          title: req.body.title,
          description: req.body.description,
          url: req.body.url,
          error: errServer.title || errServer.url
        }
    });
  }
});

module.exports = router;
