/* global FastClick: false */
'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('defaultLibrary', ['ngSanitize', 'ngError', 'ngAnimate', 'ui.bootstrap', 'angular-gestures', 'angulartics.google.analytics', 'facebook']);

//Add module configuration here
app.config(['$compileProvider', '$analyticsProvider', '$sceDelegateProvider', 'hammerDefaultOptsProvider', 'FacebookProvider', function($compileProvider, $analyticsProvider, $sceDelegateProvider, hammerDefaultOptsProvider, FacebookProvider) {
    //var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|app\-storage):|data:image\//);
    $analyticsProvider.settings.pageTracking.autoTrackVirtualPages = false;
    $analyticsProvider.settings.ga.isApp = true;

    $sceDelegateProvider.resourceUrlWhitelist
    (
	   [
        	// Allow same origin resource loads.
        	'self',
            'http://localhost:8081/**',
            'http://rci.content-core.com/**'
    	]
	);

    hammerDefaultOptsProvider.set({
        recognizers: [[Hammer.Tap, {time: 250}],[Hammer.Swipe, {time: 250}]]
    });

    FacebookProvider.init('739206119534330');
}]);

app.factory('safeApply', [function($rootScope) {
    return function($scope, fn) {
        var phase = $scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if (fn) {
                $scope.$eval(fn);
            }
        } else {
            if (fn) {
                $scope.$apply(fn);
            } else {
                $scope.$apply();
            }
        }
    }
}]);

app.run(function($rootScope, $window, $modal, $analytics, safeApply, CONFIG) {
    $rootScope.currentPage = CONFIG.PAGE_HOME;
    $rootScope.pageAnimationClass = null;
    $rootScope.baseUrl = $window.baseUrl;
    $rootScope.config = CONFIG;
    $rootScope.spinner = null;
    $rootScope.math = $window.Math;
    $rootScope.showOfflinePrompt = true;
    $rootScope.showMenu = false;
    $rootScope.saveAndRestoreState = false;
    $rootScope.helpOverlayShown = false;

    //  see if we're online or not
    $rootScope.isOnline = function() {
        $.get(CONFIG.ONLINE_TEST_URL)
            .done(function(data) {
                $rootScope.online = CONFIG.ONLINE_OVERRIDE!==undefined?CONFIG.ONLINE_OVERRIDE:true;
                safeApply($rootScope);
            })
            .fail(function() {
                $rootScope.online = CONFIG.ONLINE_OVERRIDE?true:false;
                safeApply($rootScope);
            });
    }

    $rootScope.showSpinner = function() {
        if ($rootScope.spinner) {
            $rootScope.spinner.spin();
        } else {
            var opts = {
                lines: 13, // The number of lines to draw
                length: 6, // The length of each line
                width: 2, // The line thickness
                radius: 6, // The radius of the inner circle
                corners: 0, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#ffffff', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent in px
                left: '50%' // Left position relative to parent in px
            };
            $rootScope.spinner = new Spinner(opts).spin(document.body);
        }
    };

    $rootScope.hideSpinner = function() {
        if ($rootScope.spinner) {
            $rootScope.spinner.stop();
            $rootScope.spinner = null;
        }
    };

    $rootScope.openUrl = function(url) {
        $.get(CONFIG.ONLINE_TEST_URL)
            .done(function(data) {
                $window.open(url, '_blank');
            })
            .fail(function() {
                $rootScope.alert('Please go online to access web site.');
            })
    }

    $rootScope.playVideo = function(url) {
        $.get(CONFIG.ONLINE_TEST_URL)
            .done(function(data) {
                $analytics.pageTrack('/media/video/'+url);
                $window.open(url, '_blank');
            })
            .fail(function() {
                $rootScope.alert('Please go online to view video.');
            })
    }

    $rootScope.alert = function(msg) {
        $modal.open({
            templateUrl: 'alert-modal-window',
            controller: 'AlertController',
            size: 'sm',
            backdrop: 'static',
            windowClass: 'center-modal',
            resolve: {
                message: function () {
                    return msg;
                }
            }
        });
    }

    //Run any other setup
    $(function() {
        console.debug('Running setup.');
        FastClick.attach(document.body);
        $rootScope.isOnline();
    });
});
