(function () {
  'use strict';

  angular
    .module('bids.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.bids', {
        abstract: true,
        url: '/bids',
        template: '<ui-view/>'
      })
      .state('admin.bids.list', {
        url: '',
        templateUrl: '/modules/bids/client/views/admin/list-bids.client.view.html',
        controller: 'BidsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'appmanager']
        }
      })
      .state('admin.bids.create', {
        url: '/create',
        templateUrl: '/modules/bids/client/views/admin/form-bid.client.view.html',
        controller: 'BidsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'appmanager']
        },
        resolve: {
          bidResolve: newBid
        }
      })
      .state('admin.bids.edit', {
        url: '/:bidId/edit',
        templateUrl: '/modules/bids/client/views/admin/form-bid.client.view.html',
        controller: 'BidsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'appmanager', 'user'],
          pageTitle: '{{ bidResolve.title }}'
        },
        resolve: {
          bidResolve: getBid
        }
      });
  }

  getBid.$inject = ['$stateParams', 'BidsService'];

  function getBid($stateParams, BidsService) {
    return BidsService.get({
      bidId: $stateParams.bidId
    }).$promise;
  }

  newBid.$inject = ['BidsService'];

  function newBid(BidsService) {
    return new BidsService();
  }
}());
