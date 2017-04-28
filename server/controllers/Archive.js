
const archivePage = (req, res) => {
  res.render('archivePage', { csrfToken: req.csrfToken() });
};


// Export all the functions
module.exports.archivePage = archivePage;
