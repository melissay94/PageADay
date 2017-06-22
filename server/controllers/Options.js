// User account options page
const models = require('../models');

const Account = models.Account;

// Renders the page for the users account options
const optionsPage = (req, res) => res.render('options', { csrfToken: req.csrfToken() });

const getUsername = (request, response) => {
  const req = request;
  const res = response;

  return req.session.account.username;
} ;

// Change user's password
const changePassword = (request, response) => {  

  const req = request;
  const res = response;

  // First validate old password before changing new one
  req.body.username = `${req.body.username}`;
  req.body.old_pass = `${req.body.old_pass}`;
  req.body.new_pass = `${req.body.new_pass}`;

  if (!req.body.username || !req.body.old_pass || !req.body.new_pass) {
    return res.status(400).json({ error: 'We need all fields there!' });
  }

  return Account.AccountModel.authenticate(req.body.username, req.body.old_pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Check those credentials again' });
    }

    const updateAccount = req.session.account;

    return Account.AccountModel.generateHash(req.body.new_pass, (salt, hash) => {
      updateAccount.password = hash;
      updateAccount.salt = salt;

      const savePromise = updateAccount.save();

      savePromise.then(() => res.json({
        password: updateAccount.password,
      }));

      savePromise.catch(() => { console.log(err); });

      return res.json({ redirect: '/options' });
    });
  });
};

const changeUsername = (request, response) => {
  const req = request;
  const res = response;

  // Will need a new username and the user's password
  req.body.new_username = `${req.body.new_username}`;
  req.body.password = `${req.body.passwrod}`;

  if (!req.body.new_username || !req.body.password) {
    return res.status(400).json({ error: 'We need both fields there!'});
  }

  return Account.AccountModel.authenticate(req.session.account.username, req.body.password, (err, account) => {

    return Account.AccountModel.generateHash(req.body.password, (salt, hash) => {

      const updateAccount = req.session.account;

      updateAccount.username = req.body.new_username;

      const savePromise = updateAccount.save();

      savePromise.then(() => res.json({
        username: updateAccount.username,
      }));

      savePromise.catch(() => { console.log(err); });

      return res.json({ redirect: '/options' });
    });
  });
};

module.exports.optionsPage = optionsPage;
module.exports.getUsername = getUsername;
module.exports.changePassword = changePassword;
module.exports.changeUsername = changeUsername;
