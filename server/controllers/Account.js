// Set up account controller to go with account model
// const models = require('../models');

// const Account = models.Account;

// Set up getting the homepage
const homePage = (req, res) => {
  res.render('homePage');
};

// Export all the functions
module.exports.homePage = homePage;
