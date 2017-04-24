// Set up route to controllers
const controllers = require('./controllers');
const mid = require('./middleware');

// Set up the route for the app in app.js
// Connect all our routes for the different necessary controllers
// Add middleware to all the calls
const router = (app) => {
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/profile', mid.requiresLogin, controllers.Comic.comicPage);
  app.post('/profile', mid.requiresLogin, controllers.Comic.makeComic);
  app.get('/getComics', mid.requiresLogin, controllers.Comic.getComics);
};

// Export so we can use it in app.js
module.exports = router;
