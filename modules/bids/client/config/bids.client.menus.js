(function () {
  'use strict';

  angular
    .module('bids')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Bids',
      state: 'bids',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'bids', {
      title: 'List Bids',
      state: 'bids.list',
      roles: ['user', 'accounting', 'buyer', 'receiver', 'stock custodian', 'travel booker']
    });
  }
}());
