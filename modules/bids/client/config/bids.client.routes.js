(function () {
  'use strict';

  angular
    .module('bids.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bids', {
        abstract: true,
        url: '/bids',
        template: '<ui-view/>'
      })
      .state('bids.create', {
        url: '/create',
        templateUrl: '/modules/bids/client/views/form-bid.client.view.html',
        controller: 'BidsController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          bidResolve: newBid
        }
      })
      .state('bids.list', {
        url: '',
        templateUrl: '/modules/bids/client/views/list-bids.client.view.html',
        controller: 'BidsListController',
        controllerAs: 'vm'
      })
      .state('bids.view', {
        url: '/:bidId',
        templateUrl: '/modules/bids/client/views/view-bid.client.view.html',
        controller: 'BidsController',
        controllerAs: 'vm',
        resolve: {
          bidResolve: getBid
        },
        data: {
          pageTitle: '{{ bidResolve.title }}'
        }
      });
  }

  getBid.$inject = ['$stateParams', 'BidsService'];

  function getBid($stateParams, BidsService) {
    return BidsService.get({
      bidId: $stateParams.bidId
    }).$promise;
  }
}());
