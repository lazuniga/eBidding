(function () {
  'use strict';

  angular
    .module('bids.admin')
    .controller('BidsAdminListController', BidsAdminListController);

  BidsAdminListController.$inject = ['BidsService'];

  function BidsAdminListController(BidsService) {
    var vm = this;

    vm.bids = BidsService.query();
  }
}());
