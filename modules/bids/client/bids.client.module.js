(function (app) {
  'use strict';

  app.registerModule('bids', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('bids.admin', ['core.admin']);
  app.registerModule('bids.admin.routes', ['core.admin.routes']);
  app.registerModule('bids.services');
  app.registerModule('bids.routes', ['ui.router', 'core.routes', 'bids.services']);
}(ApplicationConfiguration));
