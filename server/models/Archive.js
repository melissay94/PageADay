const mongoose = require('mongoose');
const _ = require('underscore');

mongoose.Promise = global.Promise;

let ArchiveModel = {};

const convertId = mongoose.Types.ObjectId;

const setLink = link => _.escape(link).trim();

const ArchiveSchema = new mongoose.Schema({


  link: {
    type: String,
    required: true,
    trim: true,
    set: setLink,
  },
  users: [{
  	type: mongoose.Schema.ObjectId,
  	required: true,
  	ref: 'Account',
  }],
});