// Render the main app page
const models = require('../models');

const Comic = models.Comic;

// Renders the page for the users comic library
const comicPage = (req, res) => {
  Comic.ComicModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), comics: docs });
  });
};

// Creates a new comic entry to add to the server
const addComic = (req, res) => {
  if (!req.body.name || !req.body.link) {
    return res.status(400).json({ error: 'Name and link required' });
  }

  const comicData = {
    name: req.body.name,
    link: req.body.link,
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

    return res.status(400).json({ error: 'Something went wrong. Damnit Paul' });
  });

  return comicPromise;
};

// Gets all comic entries from the server
const getComics = (request, response) => {
  const req = request;
  const res = response;

  return Comic.ComicModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Something went wrong. Damnit Paul' });
    }

    return res.json({ comics: docs });
  });
};

// Deletes a specified comic from their list
const deleteComic = (request, response) => {
  const req = request;
  const res = response;

  return Comic.ComicModel.findByIdAndRemove(req.body._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Something went wrong. Damnit Paul' });
    }

    return res.status(200).json({ message: 'Comic Deleted' });
  });
};

// Edit a comic from their list
const editComic = (request, response) => {

};

// Export function
module.exports.comicPage = comicPage;
module.exports.addComic = addComic;
module.exports.getComics = getComics;
module.exports.deleteComic = deleteComic;
module.exports.editComic = editComic;
