app.controller('AlertController', function($scope, $modalInstance, message) {
    $scope.message = message;
    $scope.ok = function () {
        $modalInstance.close();
    };
});
