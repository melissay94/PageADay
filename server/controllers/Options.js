// User account options page
const models = require('../models');

const Account = models.Account;

// Renders the page for the users account options
const optionsPage = (req, res) => res.render('options', { csrfToken: req.csrfToken() });

// Change user's password
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // First validate old password before changing new one
  req.body.username = `${req.body.username}`;
  req.body.old_pass = `${req.body.old_pass}`;
  req.body.new_pass = `${req.body.new_pass}`;

  if (!req.body.username || !req.body.old_pass || !req.body.new_pass) {
    return res.status(400).json({ error: 'We need both fields there!' });
  }

  return Account.AccountModel.authenticate(req.body.username, req.body.old_pass, (err, account) => {
    if (err) {
      return res.status(400).json({ error: 'Check those credentials again' });
    }

    const updateAccount = account;

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

module.exports.optionsPage = optionsPage;
module.exports.changePassword = changePassword;
