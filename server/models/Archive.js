
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
});

ArchiveSchema.statics.toAPI = doc => ({
  name: doc.name,
  link: doc.link,
});

ArchiveSchema.statics.getData = callback => ArchiveModel.find().select('name link').exec(callback);

ArchiveModel = mongoose.model('Archive', ArchiveSchema);

module.exports.ArchiveModel = ArchiveModel;
module.exports.ArchiveSchema = ArchiveSchema;
