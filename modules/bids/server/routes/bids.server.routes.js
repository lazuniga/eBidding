'use strict';

/**
 * Module dependencies
 */
var bidsPolicy = require('../policies/bids.server.policy'),
  bids = require('../controllers/bids.server.controller');

module.exports = function (app) {
  // Bids collection routes
  app.route('/api/bids').all(bidsPolicy.isAllowed)
    .get(bids.list)
    .post(bids.create);

  // Single bid routes
  app.route('/api/bids/:bidId').all(bidsPolicy.isAllowed)
    .get(bids.read)
    .put(bids.update)
    .delete(bids.delete);

  app.route('/api/bids/picture').post(bids.changePhoto);

  // Finish by binding the bid middleware
  app.param('bidId', bids.bidByID);
};
