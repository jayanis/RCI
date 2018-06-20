app.controller('MainController', function($scope, $rootScope, $timeout, $window, $modal, $compile, $analytics, CONFIG, resortService, safeApply) {
    $scope.region = null;
    $scope.subRegion = null;
    $scope.resort = null;
    $scope.regions = [];
    $scope.regionIndexes = {};
    $scope.showRegionHelp = false;
    $scope.showError = false;
    $scope.showNextArticle = false;
    $scope.showPreviousArticle = false;
    $scope.showNextResort = false;
    $scope.showPreviousResort = false;
    $scope.showNextRegion = false;
    $scope.showPreviousRegion = false;
    $scope.article = null;
    $scope.phrases = null;
    $scope.showResortList = false;
    $scope.model = {};
    $scope.previousPage = null;

    function saveStatus(resortId, regionId, pageIndex, articleIndex) {
        if (resortId) {
            $window.localStorage.setItem('resortId', resortId);
        } else {
            $window.localStorage.removeItem('resortId');
        }
        if (regionId) {
            $window.localStorage.setItem('regionId', regionId);
        } else {
            $window.localStorage.removeItem('regionId');
        }
        if (pageIndex != null) {
            $window.localStorage.setItem('pageIndex', pageIndex);
        } else {
            $window.localStorage.removeItem('pageIndex');
        }
        if (articleIndex != null) {
            $window.localStorage.setItem('articleIndex', articleIndex);
        } else {
            $window.localStorage.removeItem('articleIndex');
        }
    }

    function showPage(page, animationClass) {
        animatePage(animationClass, function() {
            $scope.model = {};
            $rootScope.currentPage = page + '?r=' + (new Date()).getTime();
            safeApply($rootScope);
            console.log($scope);
        });
    }

    $scope.showCoverPage = function(animationClass) {
        showPage(CONFIG.PAGE_COVER, animationClass);
    }

    $scope.showWelcomePage = function(animationClass) {
        showPage(CONFIG.PAGE_WELCOME, animationClass);
    }

    $scope.showUserGuidePage = function(animationClass) {
        showPage(CONFIG.PAGE_USER_GUIDE, animationClass);
    }

    $scope.showRCISubscribingMembershipPage = function(animationClass) {
        showPage(CONFIG.PAGE_MEMBERSHIP, animationClass);
    }

    $scope.showLegalPage = function(animationClass) {
        $scope.previousPage = $rootScope.currentPage;
        var index = $scope.previousPage.indexOf('?r=');
        if (index > 0) {
            $scope.previousPage = $scope.previousPage.substr(0, index);
        }
        showPage(CONFIG.PAGE_LEGAL, animationClass);
    }

    $scope.showPreviousPage = function(animationClass) {
        showPage($scope.previousPage, animationClass);
    }

    $scope.showHome = function(animationClass) {
        animatePage(animationClass, function() {
            $scope.model = {};
            $rootScope.currentPage = CONFIG.PAGE_HOME + '?r=' + (new Date()).getTime();
            safeApply($rootScope);

            if( $rootScope.saveAndRestoreState )
                saveStatus(null, null, null, null);
        });
    }

    $scope.showResort = function(resortId, animationClass, ignoreError) {
        $scope.showError = false;
        var deferred = $.Deferred();
        resortService.getResort(resortId)
            .done(function(data) {
                animatePage(animationClass, function() {
                    $scope.resort = data;
                    $.each($scope.regionIndexes, function(iIndex, item){
                        if (item.locationid == data.locationId){
                            $scope.subRegion = $scope.regionIndexes[iIndex];
                        }
                    });
                    $scope.region = $scope.regionIndexes[$scope.subRegion.parentId];

                    $rootScope.currentPage = CONFIG.PAGE_RESORT + '?r=' + (new Date()).getTime();

                    var resortIndex = getResortIndex($scope.subRegion.children, $scope.resort);
                    var subRegionIndex = getRegionIndex($scope.region.children, $scope.subRegion);

                    $scope.showPreviousResort = resortIndex > 0 || subRegionIndex > 0;
                    $scope.showNextResort = resortIndex < $scope.subRegion.children.length - 1 || subRegionIndex < $scope.region.children.length - 1;

                    $analytics.pageTrack('/resort/'+resortId);

                    safeApply($rootScope);
                    safeApply($scope);
                    deferred.resolve();

                    if($rootScope.saveAndRestoreState)
                        saveStatus(resortId, null, null, null);
                })
            })
            .fail(function() {
                if (!ignoreError) {
                    $scope.showError = true;
                    safeApply($scope);
                }
                deferred.reject();
            });
        return deferred.promise();
    }

    $scope.showArticle = function(article, animationClass) {
        animatePage(animationClass, function() {
            var index = $scope.region.articles.indexOf(article);
            $scope.showNextArticle = index < $scope.region.articles.length - 1;
            $scope.showPreviousArticle = index > 0;
            $scope.article = article;
            $scope.article.url = "http://endlessvacation.com/Destinations/" + article.title + '.aspx';

            $rootScope.currentPage = CONFIG.PAGE_ARTICLE + '?r=' + (new Date()).getTime();

            $analytics.pageTrack('/media/article/'+article.title);

            if($rootScope.saveAndRestoreState)
                saveStatus(null, $scope.region.taxonomytermId, null, index);
        });
    }

    $scope.showEssentialPhrases = function(phrases, animationClass) {
        animatePage(animationClass, function() {
            $scope.phrases = phrases;
            $rootScope.currentPage = CONFIG.PAGE_PHRASES + '?r=' + (new Date()).getTime();
            safeApply($rootScope);
            safeApply($scope);
            $analytics.pageTrack('/media/phrases/'+phrases.title);
        });
    }

    $scope.getTranslationSource = function(url) {
        return CONFIG.GET_MP3_URL.replace('{{url}}',encodeURIComponent(url));
    }

    $scope.playAudioAtIndex = function(id) {
        document.getElementById('audio-'+id).load();
        document.getElementById('audio-'+id).play();
    }

    $scope.onResortIdKeyUp = function(event) {
        if (event.keyCode == 13) {
            if ($scope.model.resortId.length == 4) {
                $scope.showResort($scope.model.resortId.toUpperCase());
            } else {
                $scope.showError = true;
            }
        } else {
            $scope.showError = false;
        }
    }

    $scope.findRegionById = function(id) {
        var result = null;
        $.each($scope.regions, function(index, region) {
            if (region.taxonomytermId == id) {
                result = region;
                return false;
            }
        });
        return result;
    }

    function getRegionIndex(regions, region) {
        var result = -1;
        $.each(regions, function(index, r) {
            if (r.taxonomytermId == region.taxonomytermId) {
                result = index;
                return false;
            }
        })
        return result;
    }

    function getResortIndex(resorts, resort) {
        var result = -1;
        $.each(resorts, function(index, r) {
            if (r.resortId == resort.resortId) {
                result = index;
                return false;
            }
        })
        return result;
    }

    $scope.onPageLoaded = function() {
        if ($rootScope.pageAnimationClass) {
            $('#page-content-old').addClass(CONFIG.ANIMATION_PREFIX + ' ' + $rootScope.pageAnimationClass.out);
            $('#page-content').addClass(CONFIG.ANIMATION_PREFIX + ' ' + $rootScope.pageAnimationClass.in);
        }
    }

    function animatePage(animationClass, callback) {
        if (!$rootScope.pageAnimationClass) {
            $rootScope.pageAnimationClass = animationClass;
            if (animationClass) {
                var oldPage = $('#page-content').clone();
                oldPage.attr('id', 'page-content-old');
                oldPage.appendTo($('#body-content'));
                oldPage.on('webkitAnimationEnd', function (e) {
                    oldPage.remove();
                    $rootScope.pageAnimationClass = null;
                    $('#page-content').removeClass(CONFIG.ANIMATION_ALL.join(' '));
                });
                $timeout(callback, 50);
            } else {
                callback();
            }
        }
    }

    $scope.showRegion = function(region, animationClass, goToRegionListPage) {
        if (region.children) {
            $.each(region.children, function(index, sb) {
                sb.showResorts = false;
            })
        }
        resortService.updateResortInformationByRegion(region.taxonomytermId)
            .done(function(data) {
                var region = $scope.region;
                $.each(data.results.locations, function(iIndex, item) {
                    $.each(region.children, function(jIndex, j) {
                        if(item.name == j.label){
                            region.children[jIndex]["locationid"] = item.locationId;
                        }
                    });
                });
                safeApply($rootScope);
        });
        animatePage(animationClass, function() {
            $scope.region = region;
            var index = $scope.regions.indexOf($scope.region);
            $scope.showNextRegion = index < $scope.regions.length - 1;
            $scope.showPreviousRegion = index > 0;
            $rootScope.currentPage = (goToRegionListPage ? CONFIG.PAGE_REGION : CONFIG.PAGE_REGION_IMAGE) + '?r=' + (new Date()).getTime();
            safeApply($scope);
            safeApply($rootScope);

            if($rootScope.saveAndRestoreState)
                saveStatus(null, $scope.region.taxonomytermId, 0, null);
        });
    }

    $scope.showRegionFromList = function(animationClass) {
        animatePage(animationClass, function() {
            var index = $scope.regions.indexOf($scope.region);
            $scope.showNextRegion = index < $scope.regions.length - 1;
            $scope.showPreviousRegion = index > 0;
            $rootScope.currentPage = CONFIG.PAGE_REGION_IMAGE + '?r=' + (new Date()).getTime();
            safeApply($rootScope);

            if($rootScope.saveAndRestoreState)
                saveStatus(null, $scope.region.taxonomytermId, 0, null);
        })
    }

    $scope.showRegionList = function(animationClass) {
        animatePage(animationClass, function() {
            var index = $scope.regions.indexOf($scope.region);
            $scope.showNextRegion = index < $scope.regions.length - 1;
            $scope.showPreviousRegion = index > 0;
            $rootScope.currentPage = CONFIG.PAGE_REGION + '?r=' + (new Date()).getTime();
            safeApply($rootScope);

            if($rootScope.saveAndRestoreState)
                saveStatus(null, $scope.region.taxonomytermId, 1, null);
        })
    }

    function loadResorts(subRegion) {
        var deferred = $.Deferred();
        if (subRegion.children.length) {
            $timeout(function() {
                deferred.resolve();
            }, 10);
        } else {
            resortService.getResortList(subRegion.locationid)
                .done(function(data) {
                    var resorts = [];
                    $.each(data.results,function(index,resort){
                        //TODO:dont know why checking white listed Region.
                        // if( $rootScope.whitelistedRegions.indexOf(resort.resortId)!=-1 )
                            resorts.push(resort);
                    });
                    subRegion.children = resorts;
                    subRegion.children.sort(function(r1, r2) {
                        if (r1.name < r2.name) {
                            return -1;
                        } else if (r1.name > r2.name) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                    deferred.resolve();
                })
                .fail(function() {
                    deferred.reject();
                });
        }
        return deferred.promise();
    }

    $scope.toggleResortList = function(subRegion) {
        if (!subRegion.showResorts) {
            $.each($scope.regionIndexes[subRegion.parentId].children, function(index, r) {
                r.showResorts = false;
            });
        }
        subRegion.showResorts = !subRegion.showResorts;
        safeApply($scope);
        if (subRegion.showResorts) {
            loadResorts(subRegion)
                .done(function () {
                    if (subRegion.children.length == 0) {
                        $rootScope.alert('No resorts in this subregion');
                    }
                    safeApply($scope);
                })
                .fail(function () {
                    $rootScope.alert('No resorts in this subregion');
                });
        }
    }

    function loadLastResortOfSubRegion(subRegion, animationClass) {
        var deferred = $.Deferred();
        var loadLastResort = function() {
            loadResorts(subRegion)
                .done(function () {
                    if (subRegion.children.length) {
                        $scope.showResort(subRegion.children[subRegion.children.length - 1].resortId, animationClass)
                            .done(function() {
                                deferred.resolve();
                            })
                    } else {
                        var index = getRegionIndex($scope.region.children, subRegion);
                        if (index > 0) {
                            subRegion = $scope.region.children[index - 1];
                            loadLastResort();
                        }
                    }
                });
        }
        loadLastResort();
        return deferred.promise();
    }

    $scope.previousResort = function(animationClass) {
        var deferred = $.Deferred();
        loadResorts($scope.subRegion)
            .done(function () {
                var index = getResortIndex($scope.subRegion.children, $scope.resort);
                if (index < 0) {
                    $rootScope.alert('Cannot find the resort in region resort list');
                }
                else if (index > 0) {
                    $scope.showResort($scope.subRegion.children[index - 1].resortId, animationClass)
                        .done(function() {
                            deferred.resolve();
                        })
                } else {
                    index = getRegionIndex($scope.region.children, $scope.subRegion);
                    if (index > 0) {
                        loadLastResortOfSubRegion($scope.region.children[index - 1], animationClass)
                            .done(function() {
                                deferred.resolve();
                            });
                    }
                }
            });
        return deferred.promise();
    }

    function loadFirstResortOfSubRegion(subRegion, animationClass) {
        var deferred = $.Deferred();
        var loadFirstResort = function() {
            loadResorts(subRegion)
                .done(function () {
                    if (subRegion.children.length) {
                        $scope.showResort(subRegion.children[0].resortId, animationClass)
                            .done(function() {
                                deferred.resolve();
                            })
                    } else {
                        var index = getRegionIndex($scope.region.children, subRegion);
                        if (index < $scope.region.children.length - 1) {
                            subRegion = $scope.region.children[index + 1];
                            loadFirstResort();
                        }
                    }
                });
        }
        loadFirstResort();
        return deferred.promise();
    }

    $scope.nextResort = function(animationClass) {
        var deferred = $.Deferred();
        loadResorts($scope.subRegion)
            .done(function () {
                var index = getResortIndex($scope.subRegion.children, $scope.resort);
                if (index < 0) {
                    $rootScope.alert('Cannot find the resort in region resort list');
                }
                else if (index < $scope.subRegion.children.length - 1) {
                    $scope.showResort($scope.subRegion.children[index + 1].resortId, animationClass)
                        .done(function() {
                            deferred.resolve();
                        })
                } else {
                    index = getRegionIndex($scope.region.children, $scope.subRegion);
                    if (index < $scope.region.children.length - 1) {
                        loadFirstResortOfSubRegion($scope.region.children[index + 1], animationClass)
                            .done(function () {
                                deferred.resolve();
                            });
                    } else {
                        index = getRegionIndex($scope.regions, $scope.region);
                        if (index == $scope.regions.length - 1) {
                            $scope.showLegalPage(animationClass);
                        }
                    }
                }
            });
        return deferred.promise();
    }

    $scope.previousRegion = function() {
        var index = $scope.regions.indexOf($scope.region);
        if (index > 0) {
            $scope.showRegion($scope.regions[index - 1], CONFIG.ANIMATION_LEFT_TO_RIGHT);
        }
    }

    $scope.nextRegion = function() {
        var index = $scope.regions.indexOf($scope.region);
        if (index < $scope.regions.length - 1) {
            $scope.showRegion($scope.regions[index + 1], CONFIG.ANIMATION_RIGHT_TO_LEFT);
        } else {
            $scope.showLegalPage(CONFIG.ANIMATION_RIGHT_TO_LEFT);
        }
    }

    $scope.previousArticle = function(animationClass) {
        var index = $scope.region.articles.indexOf($scope.article);
        if (index > 0) {
            $scope.showArticle($scope.region.articles[index - 1], animationClass);
        }
    }

    $scope.nextArticle = function(animationClass) {
        var index = $scope.region.articles.indexOf($scope.article);
        if (index < $scope.region.articles.length - 1) {
            $scope.showArticle($scope.region.articles[index + 1], animationClass);
        }
    }

    function loadAllRegions() {
        resortService.getAllRegions()
            .done(function(data) {
                var regions = data.results;
                var oldLength = 0;
                while (regions.length && oldLength != regions.length) {
                    oldLength = regions.length;
                    for (var i = regions.length - 1; i >= 0; --i) {
                        var r = regions[i];
                        if (r.parentId != null) {
                            var parent = $scope.regionIndexes[r.parentId];
                            if (parent) {
                                r.children = [];
                                parent.children.push(r);
                                $scope.regionIndexes[r.taxonomytermId] = r;
                                regions.splice(i, 1);
                            }
                        } else {
                            r.children = [];
                            $scope.regions.push(r);
                            $scope.regionIndexes[r.taxonomytermId] = r;
                            regions.splice(i, 1);
                        }
                    }
                }
                var orderedRegions = [];
                $.each(CONFIG.REGIONS['usa'], function(index, r) {
                    orderedRegions.push(r);
                });
                $.each(CONFIG.REGIONS['america'], function(index, r) {
                    orderedRegions.push(r);
                });
                $.each(CONFIG.REGIONS['international'], function(index, r) {
                    orderedRegions.push(r);
                });
                $scope.regions.sort(function(r1, r2) {
                    return getRegionIndex(orderedRegions, r1) - getRegionIndex(orderedRegions, r2);
                });
                $.each($scope.regions, function(index, r) {
                    if (index < orderedRegions.length) {
                        r.color = orderedRegions[index].color;
                        r.align = orderedRegions[index].align;
                        r.bounds = orderedRegions[index].bounds;
                        r.mapTop = orderedRegions[index].mapTop;
                        r.languages = orderedRegions[index].languages;
                        r.videos = [];
                        r.articles = [];
                    }
                    if (r.children) {
                        r.children.sort(function(sb1, sb2) {
                            // var name1 = sb1.label + (sb1.subtitle ? ' ' + sb1.subtitle : '');
                            // var name2 = sb2.label + (sb2.subtitle ? ' ' + sb2.subtitle : '');
                            var name1 = sb1.label;
                            var name2 = sb2.label;
                            if (name1 < name2)  {
                                return -1;
                            } if (name1 > name2) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    }
                });
                safeApply($scope);
            })
            .fail(function() {
                $rootScope.alert('Cannot load regions');
            });
    }

    function loadResortWhitelist() {
        resortService.getWhitelistedResorts()
            .done(function(data){
                $rootScope.whitelistedRegions = data.whitelist;
            });
    }

    function loadDynamicCover() {
        $scope.coverImage = null;
        $.ajax({
            url: 'http://rci-static.stryplt.com.s3.amazonaws.com/digital-directory/dynamic-cover/data.json',
            dataType: 'json'
        }).done(function(data) {
            if( data && data.length ) {
                var now = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
                angular.forEach (
                    data,
                    function(item) {
                        if( item.date_from
                            && item.date_to
                            && !$scope.coverImage ) {
                            if( Date.parse(now)>=Date.parse(item.date_from) && Date.parse(now)<=Date.parse(item.date_to) ) {
                                $scope.coverImage = item.image;
                            }
                        }
                    }
                );

                if( !$scope.coverImage )
                    $scope.coverImage = 'images/background/home_1.jpg';
            }

        }).fail(function() {
            $scope.coverImage = 'images/background/home_1.jpg';
        });
    }

    $scope.init = function() {
        loadAllRegions();
        loadResortWhitelist();
        loadDynamicCover();
    }

    $scope.clear = function() {
        $scope.showError = false;
        safeApply($scope);
    }

    $scope.hideMenu = function() {
        $timeout(function() {
            $rootScope.showMenu = false;
            safeApply($rootScope);
        }, 50);
    }
});
