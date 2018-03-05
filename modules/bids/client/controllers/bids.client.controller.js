(function () {
  'use strict';

  angular
    .module('bids')
    .controller('BidsController', BidsController);

  BidsController.$inject = ['$scope', '$state', '$window', 'bidResolve', 'Authentication', 'Notification', 'UserService', '$timeout', 'Upload'];

  function BidsController($scope, $state, $window, bid, Authentication, Notification, UserService, $timeout, Upload) {
    var vm = this;

    UserService.query(function (data) {
      vm.users = data;
    });

    vm.bid = bid;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.user = Authentication.user;  
    vm.progress = 0;

    // Remove existing Bid
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.bid.$remove(function () {
          $state.go('bids.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bid deleted successfully!' });
        });
      }
    }

    // Save Bid
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bidForm');
        return false;
      }

      // Create a new bid, or update the current instance
      vm.bid.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('bids.list'); // should we send the User to the list or the updated Bid's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bid saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Bid save error!' });
      }
    }

    vm.upload = function (dataUrl) {

      Upload.upload({
        url: '/api/bids/picture',
        data: { 
          newPhoto: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully uploaded picture' });

      // Populate user object
      vm.user = Authentication.user = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to upload picture' });
    }

  }
}());
