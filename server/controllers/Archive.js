const models = require('../models');

const Archive = models.Archive;

// Render a page for the archives
const archivePage = (req, res) => {
  res.render('archive', { csrfToken: req.csrfToken() });
};

// Make an archives entry
const makeArchive = (req, res) => {
  if (!req.body.name || !req.body.link) {
    return res.status(400).json({ error: 'Name and link required' });
  }

  const archiveData = {
    name: req.body.name,
    link: req.body.link,
  };

  const newArchive = new Archive.ArchiveModel(archiveData);

  const archivePromise = newArchive.save();

  archivePromise.then(() => res.json({
    redirect: '/archive',
  }));

  archivePromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Archive already exists' });
    }

    return res.status(400).json({ error: 'Something went wrong, damnit Paul' });
  });

  return archivePromise;
};

// Get the entries
const getArchives = (request, response) => {
  const res = response;

  return Archive.ArchiveModel.getData((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Something went wrong. Damnit Paul' });
    }

    return res.json({ archives: docs });
  });
};
// Export all the functions
module.exports.archivePage = archivePage;
module.exports.makeArchive = makeArchive;
module.exports.getArchives = getArchives;
