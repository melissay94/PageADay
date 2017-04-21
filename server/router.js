// Import controllers
const controllers = require('./controllers');

// Set up the different routes for the app using the controllers
const router = (app) => {
  app.get('/', controllers.Account.homePage);
};

// Export the router
module.exports = router;
