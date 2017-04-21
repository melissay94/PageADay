// Set up account controller to go with account model
const models = require('../models');

const Account = models.Account;

// Set up getting the homepage
const homePage = (req, res) => {
  res.render('homePage');
};

// Set up logging a user out
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Set up logging into the app
const login = (request, response) => {
// Reassign passed in params
  const req = request;
  const res = response;

// Cast to string to help with security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'You need both fields bro ' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/profile' });
  });
};

// Set up signing up for the app
const signup = (request, response) => {
  const req = request;
  const res = response;

// Cast to string
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass = `${req.body.pass2}`;

// Check for lack of fields
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Hey there, we need all the fields filled' });
  }

// Check that the same password was entered in both fields
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Your passwords do not match, try again' });
  }

// Generate a new encrypted password hash and salt
// They will be stored in the db and send a JSON response for success/failure
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/profile' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username is taken. You were too slow.' });
      }

      return res.status(400).json({ error: 'Uh oh, something went wrong. Darn it Paul.' });
    });
  });
};

// Export all the functions
module.exports.homePage = homePage;
module.exports.signup = signup;
module.exports.login = login;
module.exports.logout = logout;
