(function () {
  'use strict';

  // Configuring the Bids Admin module
  angular
    .module('bids.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Bids',
      state: 'admin.bids.list'
    });
    Menus.addSubMenuItem('topbar', 'appmanager', {
      title: 'Manage Bids',
      state: 'admin.bids.list'
    });
           
  }
}());
