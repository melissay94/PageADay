
const mongoose = require('mongoose');
const _ = require('underscore');

mongoose.Promise = global.Promise;

let ArchiveModel = {};

const setName = name => _.escape(name).trim();
const setLink = link => _.escape(link).trim();

const ArchiveSchema = new mongoose.Schema({

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
  users: [
    { type: mongoose.Schema.ObjectId, required: true, ref: 'Account' },
  ],
});

ArchiveSchema.statics.toAPI = doc => ({
  name: doc.name,
  link: doc.link,
});

ArchiveSchema.statics.findByLink = (link, callback) => {
  const search = {
    archiveLink: link,
  };

  return ArchiveModel.find(search).select('name link users').exec(callback);
};

ArchiveModel = mongoose.model('Archive', ArchiveSchema);

module.exports.ArchiveModel = ArchiveModel;
module.exports.ArchiveSchema = ArchiveSchema;
