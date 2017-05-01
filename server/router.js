// Set up route to controllers
const controllers = require('./controllers');
const mid = require('./middleware');

// Set up the route for the app in app.js
// Connect all our routes for the different necessary controllers
// Add middleware to all the calls
const router = (app) => {
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/profile', mid.requiresLogin, controllers.Comic.comicPage);
  app.get('/getComics', mid.requiresLogin, controllers.Comic.getComics);
  app.get('/archive', mid.requiresLogin, controllers.Archive.archivePage);
  app.get('/getArchives', mid.requiresLogin, controllers.Archive.getArchives);
  app.get('/options', mid.requiresLogin, controllers.Options.optionsPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/profile', mid.requiresLogin, controllers.Comic.makeComic);
  app.post('/archive', mid.requiresLogin, controllers.Archive.makeArchive);
  app.post('/options', mid.requiresLogin, controllers.Options.changePassword);
};

// Export so we can use it in app.js
module.exports = router;
