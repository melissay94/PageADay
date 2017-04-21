// Render the main app page
const models = require('../models');

const Comic = models.Comic;

const comicPage = (req, res) => {
  Comic.ComicModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { comics: docs });
  });
};

const makeComic = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Name and link required' });
  }

  const comicData = {
    name: req.body.name,
    age: req.body.link,
    review: req.body.review,
    owner: req.session.account._id,
  };

  const newComic = new Comic.ComicModel(comicData);

  const comicPromise = newComic.save();

  comicPromise.then(() => res.json({
    redirect: '/profile',
  }));

  comicPromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Comic already added' });
    }

    return res.status(400).json({ error: 'Something went wrong' });
  });

  return comicPromise;
};

// Export function
module.exports.comicPage = comicPage;
module.exports.comic = makeComic;
