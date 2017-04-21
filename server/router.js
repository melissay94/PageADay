// Import controllers
const controllers = require('./controllers');

// Set up the different routes for the app using the controllers
const router = (app) => {
  app.get('/', controllers.Account.homePage);
  app.get('/logout', controllers.Account.logout);
  app.get('/profile', controllers.Profile.comicPage);
  app.post('/signup', controllers.Account.signup);
  app.post('/login', controllers.Account.login);
  app.post('/profile', controllers.Profile.comic);
};

// Export the router
module.exports = router;
