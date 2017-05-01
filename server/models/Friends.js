const mongoose = require('mongoose');
const _ = require('underscore');

mongoose.Promise = global.Promise;

let FriendsModel = {};

const setLink = link => _.escape(link).trim();

const FriendsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    required: true,
    trim: true,
    set: setLink,
  },
  librarySize: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

FriendsSchema.statics.toAPI = doc => ({
  username: doc.username,
  link: doc.link,
  librarySize: doc.librarySize,
});

FriendsSchema.statics.getData = callback => FriendsModel.find().select('username link librarySize').exec(callback);


FriendsModel = mongoose.model('Friends', FriendsSchema);

module.exports.FriendsModel = FriendsModel;
module.exports.FriendsSchema = FriendsSchema;
