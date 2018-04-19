app.controller('MembershipController', function($scope, $rootScope) {
    $scope.pageNo = 0;

    $scope.selectPage = function(pageNo) {
        $scope.pageNo = pageNo;
    }
});
