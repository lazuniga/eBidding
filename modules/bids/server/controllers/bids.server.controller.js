'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bid = mongoose.model('Bid'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an bid
 */
exports.create = function (req, res) {
  var bid = new Bid(req.body);
  bid.user = req.user;

  bid.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bid);
    }
  });
};

/**
 * Show the current bid
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var bid = req.bid ? req.bid.toJSON() : {};

  // Add a custom field to the Bid, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Bid model.
  bid.isCurrentUserOwner = !!(req.user && bid.user && bid.user._id.toString() === req.user._id.toString());

  res.json(bid);
};

/**
 * Update an bid
 */
exports.update = function (req, res) {
  var bid = req.bid;

  bid.bidCode = req.body.bidCode;
  bid.bidName = req.body.bidName;
  bid.bidOwner = req.body.bidOwner;
  bid.bidPrice = req.body.bidPrice;
  bid.bidType = req.body.bidType;

  bid.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bid);
    }
  });
};

/**
 * Delete an bid
 */
exports.delete = function (req, res) {
  var bid = req.bid;

  bid.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bid);
    }
  });
};

/**
 * List of Bids
 */
exports.list = function (req, res) {
  Bid.find().sort('-created').populate('user', 'displayName').exec(function (err, bids) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bids);
    }
  });
};

/**
 * Bid middleware
 */
exports.bidByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bid is invalid'
    });
  }

  Bid.findById(id).populate('user', 'displayName').exec(function (err, bid) {
    if (err) {
      return next(err);
    } else if (!bid) {
      return res.status(404).send({
        message: 'No bid with that identifier has been found'
      });
    }
    req.bid = bid;
    next();
  });
};

exports.changePhoto = function (req, res) {
  var user = req.user;
  var existingImageUrl;
  var multerConfig;


  if (useS3Storage) {
    multerConfig = {
      storage: multerS3({
        s3: s3,
        bucket: config.aws.s3.bucket,
        acl: 'public-read'
      })
    };
  } else {
    multerConfig = config.uploads.profile.image;
  }

  // Filtering to upload only images
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

  var upload = multer(multerConfig).single('newPhoto');

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateImage() {
    return new Promise(function (resolve, reject) {
      bid.bidImageURL = config.uploads.storage === 's3' && config.aws.s3 ?
        req.file.location :
        '/' + req.file.path;
      user.save(function (err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};