const models = require('../models');

const Friends = models.Friends;

// Its on the app page, so no new page render neccessary

// Set up makeArchive
const makeFriend = (req, res) => {
  if (!req.body.username || !req.body.link || !req.body.librarySize) {
    return res.status(400).json({ error: 'Not all fields were found' });
  }

  const friendData = {
    username: req.body.username,
    link: req.body.link,
    librarySize: req.body.librarySize,
  };

  const newFriend = new Friends.FriendsModel(friendData);

  const friendPromise = newFriend.save();

// Since adding friends happens on the view of that user, it should redirect
// to whatever user that is
  friendPromise.then(() => res.json({
    redirect: req.body.link,
  }));

  friendPromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(401).json({ error: 'You\'re already friends with this user' });
    }

    return res.status(400).json({ error: 'Something went wrong, damnit Paul' });
  });

  return friendPromise;
};

// Get those friends
const getFriends = (request, response) => {
  const res = response;

  return Friends.FriendsModel.getData((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Something went wrong. Damnit Paul' });
    }

    return res.json({ friends: docs });
  });
};

// Export all the things
module.exports.makeFriend = makeFriend;
module.exports.getFriends = getFriends;
