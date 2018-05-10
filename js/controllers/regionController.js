app.controller('RegionController', function($scope,$rootScope,$window,resortService,safeApply,CONFIG) {
    $rootScope.isOnline();
    $scope.region = null;

    $scope.$watch
    (
        'showRegionHelp',
        function(newVal,oldVal)
        {
            if(newVal!=oldVal)
                if( newVal )
                   $("#region-help").parent().animate({scrollTop: $("#region-help").offset().top}, 500);
                else
                    $("#region-help").parent().animate({scrollTop: 0}, 0);
        }
    );

    $scope.init = function() {
        $scope.region = $scope.$parent.region;
        $scope.regionBounds = $scope.region.bounds;
        $scope.getRegionMedia();
        $scope.getResortLocations();
        $scope.getRegionTranslations();
    }

    $scope.getResortLocations = function() {
        if( $scope.region && $scope.region.resorts ) {
            $scope.resorts = $scope.region.resorts;
            return;
        }
        resortService.getResorts($scope.region.label)
            .done(function(data) {
                var resorts = [];
                $.each(data.results,function(index,resort){
                        if( $rootScope.whitelistedRegions.indexOf(resort.resortId)!=-1 )
                            resorts.push(resort);
                    });
                $scope.resorts = $scope.region.resorts = resorts;
                safeApply($rootScope);
            }
        );
    }

    $scope.selectResortMapMarker = function(data) {
        $scope.showResort(data.resortId);
    }

    $scope.getRegionMedia = function() {
        if( $scope.region.mediaFetched )
            return;
        $scope.region.mediaFetched = true;
        resortService.getRegionMedia($scope.region.label)
            .done(function(data) {
                if(data != null ) {
                    var region = $scope.region;
                    $.each(data.results, function(iIndex, item) {
                        if (item.type == 'video') {
                            if (!region.videos) region.videos = [];
                            if (item.url != undefined)
                                region.videos.push({title: item.title, url: item.url.replace(/ /g, '%20')});
                        } else if (item.type == 'article') {
                            if (!region.articles) region.articles = [];
                            region.articles.push({title: item.title, content: item});
                        } else if (item.type == 'phrases') {
                            if (!region.essentialPhrases) region.essentialPhrases = [];
                            region.essentialPhrases.push({
                                title: item.content.title,
                                code: item.content.code,
                                tcode: item.content.tcode,
                                charset: item.content.charset,
                                translations: item.content.translations
                            });
                        }

                    });
                    var itemComparer = function (item1, item2) {
                        if (item1.title < item2.title) {
                            return -1;
                        } else if (item1.title > item2.title) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                    region.videos.sort(itemComparer);
                    region.articles.sort(itemComparer);
                    safeApply($rootScope);
                }
            });
    }

    $scope.getRegionTranslations = function() {
        if( !$scope.region || $scope.region.essentialPhrases || !$scope.region.languages )
            return;

        resortService.getTranslations($scope.region.languages)
            .done(function(data) {
                var region = $scope.region;
                $.each(data.results, function(iIndex, item) {
                    if( !region.essentialPhrases ) region.essentialPhrases = [];
                    region.essentialPhrases.push(item);
                });
                safeApply($rootScope);
            });
    }
});
