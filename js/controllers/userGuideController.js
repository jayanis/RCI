app.controller('UserGuideController', function($scope, $rootScope) {
    $scope.status = 1;
    $scope.buttonPositions = [
        {x:228, y: 842, width: 56, height: 78}, // button to show page 1
        {x:356, y: 842, width: 56, height: 78}, // button to show page 2
        {x:484, y: 842, width: 56, height: 78}, // button to show page 3
        {x:43, y: 548, width: 161, height: 76}, // button to show page 4
        {x:86, y: 934, width: 172, height: 40}, // button to show page 5
        {x:36, y: 876, width: 688, height: 110}, // button to hide page 5
        {x:73, y: 501, width: 64, height: 30}, // button to go to rci.com
        {x:581, y: 759, width: 64, height: 30}, // button to go to rci.com
        {x:660, y: 579, width: 64, height: 30}, // button to go to rci.com
        {x:616, y: 400, width: 64, height: 30} // button to go to rci.com
    ];
    $scope.onScreenTap = function(event) {
        var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
        var y = event.pageY || event.originalEvent.changedTouches[0].pageY;
        var buttonIndex = -1;
        for (var i = 0; i < $scope.buttonPositions.length; ++i) {
            if (x >= $scope.buttonPositions[i].x && x <= $scope.buttonPositions[i].x + $scope.buttonPositions[i].width &&
                y >= $scope.buttonPositions[i].y && y <= $scope.buttonPositions[i].y + $scope.buttonPositions[i].height) {
                buttonIndex = i;
                break;
            }
        }
        if (buttonIndex >= 0) {
            buttonIndex++;
            switch ($scope.status) {
                case 1:
                case 2:
                    if (buttonIndex <= 3) {
                        $scope.status = buttonIndex;
                    }
                    break;
                case 3:
                    if (buttonIndex <= 4) {
                        $scope.status = buttonIndex;
                    } else if (buttonIndex >= 7) {
                        $rootScope.openUrl("http://www.rci.com");
                    }
                    break;
                case 4:
                    if (buttonIndex == 5) {
                        $scope.status = buttonIndex;
                    } else {
                        $scope.status = 3;
                    }
                    break;
                case 5:
                    if (buttonIndex == 6) {
                        $scope.status = 4;
                    }
                    break;
            }
        } else {
            if ($scope.status == 4 || $scope.status == 5) {
                $scope.status = 3;
            }
        }
    };
});
