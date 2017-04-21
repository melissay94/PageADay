const mongoose = require('mongoose');
const _ = require('underscore');

mongoose.Promise = global.Promise;

let ComicModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = name => _.escape(name).trim();
const setLink = link => _.escape(link).trim();
const setReview = review => _.escape(review).trim();

const ComicSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  link: {
    type: String,
    required: true,
    trim: true,
    set: setLink,
  },
  review: {
    type: String,
    trim: true,
    set: setReview,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

ComicSchema.statics.toAPI = doc => ({
  name: doc.name,
  link: doc.link,
  review: doc.review,
});

ComicSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ComicModel.find(search).select('name link').exec(callback);
};

ComicModel = mongoose.model('Comic', ComicSchema);

module.exports.ComicModel = ComicModel;
module.exports.ComicSchema = ComicSchema;
