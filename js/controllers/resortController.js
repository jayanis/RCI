app.controller('ResortController', function($scope, $rootScope, $analytics, $window, resortService, CONFIG, safeApply) {
    $scope.region = null;
    $scope.subRegion = null;
    $scope.tab = null;
    $scope.id = null;
    $scope.title = null;
    $scope.overview = null;
    $scope.address = null;
    $scope.hasRCI = false;
    $scope.video = false;
    $scope.isPointResort = false;
    $scope.strataIcon = null;
    $scope.allInclusiveIcon = null;

    $scope.roomDescription = null;
    $scope.rooms = null;

    $scope.resortDescription = null;
    $scope.resortBounds = null;

    $scope.checkinDays = null;
    $scope.checkinTime = null;
    $scope.checkoutTime = null;

    $scope.onSiteAmenities = null;
    $scope.offSiteAmenities = null;
    $scope.accessibilityFeatures = null;
    $scope.unitAmenities = null;

    $scope.areaInfo = null;
    $scope.airportDirection = null;

    $scope.showSecondImage = true;

    $scope.showCurrentInfo = true;
    $scope.hasLocalInfo = false;
    $scope.hasAttractions = false;
    $scope.localAttractions = null;
    $scope.localAttractionPage = 0;
    $scope.localAttractionPageSize = 20;
    $scope.localAttractionPageCount = 0;
    $scope.localAttractionPages = null;
    $scope.localAttractionResultIndex = null;

    $scope.localEvents = null;
    $scope.localEventsPage = 0;
    $scope.localEventsPageSize = 20;
    $scope.localEventsPageCount = 0;
    $scope.localEventsPages = null;

    $scope.localTime = null;
    $scope.localWeather = null;

    $scope.resorts = [];
    $scope.showOverlay = true;
    $scope.online = $rootScope.online;

    $scope.loadingAttractions = false;
    $scope.loadingEvents = false;

    function getString(value) {
        if (value == null) {
            return '';
        } else if ($.isArray(value)) {
            return value.join(', ');
        } else {
            return value.toString();
        }
    }

    function getBoolean(value) {
        return value && value.toLowerCase() == "true";
    }

    function getAddress(resort) {
        var result = '';
        var address = resort.logisticProperty.contact.addresses;
        if (address['address-line1'] && address['address-line1'].length) {
            result += address['address-line1'] + '<br/>';
        }
        if (address['address-line2'] && address['address-line2'].length) {
            result += address['address-line2'] + '<br/>';
        }
        if (address['address-line3'] && address['address-line3'].length) {
            result += address['address-line3'] + '<br/>';
        }
        if (address['address-line4'] && address['address-line4'].length) {
            result += address['address-line4'] + '<br/>';
        }
        if (address['address-line5'] && address['address-line5'].length) {
            result += address['address-line5'] + '<br/>';
        }
        var state = null;
        if (address['address-state']) {
            state = address['address-state'];
        } else if (address['address-province']) {
            state = address['address-province'];
        }
        result += address['address-city'];
        if (state) {
            result += ', ' + state;
        }
        if (address['address-postalCode']) {
            result += ' ' + address['address-postalCode'];
        }
        result += '<br>';
        result += address['address-countryname'] + '<br/>';
        result += resort.logisticProperty.contact.telephones + '<br/>';
        if (resort.logisticProperty.contact.webAddresses && resort.online ) {
            result += '<a href="http://' + resort.logisticProperty.contact.webAddresses + '"><b>' + resort.logisticProperty.contact.webAddresses + '</b></a>';
        }

        return result;
    }

    function getRooms(resort) {
        var rooms = [];
        if (resort.unit) {
            var unitInfo = resort.unit.unitInfo;
            if (!$.isArray(unitInfo)) {
                unitInfo = [unitInfo];
            }
            $.each(unitInfo, function (index, info) {
                var room = {};
                room.type = info.roomFacts.bedroom.bedroomType;
                room.sleeps = info.roomFacts.maxOccupancy;
                room.privacy = info.roomFacts.privateOccupancy;
                room.kitchen = '';
                var features = info.kitchen.features.feature;
                if (!$.isArray(features)) {
                    features = [features];
                }
                $.each(features, function (index, feature) {
                    if (feature.name && feature.name.toLowerCase() == 'kitchen size') {
                        room.kitchen = feature.details.detail;
                    }
                });
                room.bathroom = info.roomFacts.bathroom;
                rooms.push(room);
            });
            rooms.sort(function(r1, r2) {
                var result = parseInt(r1.sleeps) - parseInt(r2.sleeps);
                if (result) {
                    return result;
                } else {
                    result = parseInt(r1.privacy) - parseInt(r2.privacy);
                    if (result) {
                        return result;
                    } else if (r1.type < r2.type) {
                        return -1;
                    } else if (r1.type > r2.type) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
        }
        return rooms;
    }

    function getAmenityName(amenity) {
        var brackets = '';
        if (amenity.proximity && amenity.proximity.toLowerCase() == 'nearby') {
            brackets = ' (Nearby)';
        } else if (amenity.distanceInMiles && amenity.distanceInMiles.length) {
            brackets = ' (' + amenity.distanceInMiles + ' mi)';
        }

        var detailName = '';
        var detailValue = null;
        if (amenity.details) {
            var detail = amenity.details.detail;
            if (detail) {
                if ($.isArray(detail) && detail.length) {
                    detail = detail[0];
                }
                detailValue = detail.value;
                if (detailValue) {
                    detailValue = getString(detailValue);
                    if (detailValue.toLowerCase() == 'no') {
                        detailValue = null;
                    }
                }
            }
            var attributes = amenity.details['@attributes'];
            if (attributes) {
                detailName = attributes.name;
            }
        }
        if (!detailName || !detailName.length) {
            detailName = amenity.name;
        }
        return detailValue ? detailName + brackets + ': ' + detailValue : detailName + brackets;
    }

    function getProximity(amenity) {
        if (amenity.proximity) {
            return amenity.proximity.toLowerCase();
        }
        return '';
    }

    function getOnSiteAmenities(resort) {
        var result = '';
        if (resort.amenity && resort.amenity.amenities) {
            var amenities = resort.amenity.amenities.amenity;
            if (amenities) {
                if (!$.isArray(amenities)) {
                    amenities = [amenities];
                }
                $.each(amenities, function (index, amenity) {
                    var proximity = getProximity(amenity);
                    if (proximity != 'offsite' && proximity != 'nearby' && proximity != 'no') {
                        result += getAmenityName(amenity) + '; ';
                    }
                });
                if (result.length) {
                    result = result.substring(0, result.length - 2);
                }
            }
        }
        return result;
    }

    function getOffSiteAmenities(resort) {
        var result = '';
        if (resort.amenity && resort.amenity.amenities) {
            var amenities = resort.amenity.amenities.amenity;
            if (!$.isArray(amenities)) {
                amenities = [amenities];
            }
            $.each(amenities, function (index, amenity) {
                var proximity = getProximity(amenity);
                if (proximity == 'nearby' || proximity == 'offsite') {
                    result += getAmenityName(amenity) + '; ';
                }
            });
            if (result.length) {
                result = result.substring(0, result.length - 2);
            }
        }
        return result;
    }

    function getUnitAmenities(resort) {
        var amenities = [];
        if (resort.unit && resort.unit.unitInfo) {
            var unitInfo = resort.unit.unitInfo;
            if (!$.isArray(unitInfo)) {
                unitInfo = [unitInfo];
            }
            $.each(unitInfo, function (index, info) {
                if (info.amenities) {
                    var items = info.amenities.amenity;
                    if (items) {
                        if (!$.isArray(items)) {
                            items = [items];
                        }
                        $.each(items, function (itemIndex, item) {
                            var name = item.name;
                            if (item.details) {
                                var detail = item.details.detail;
                                if (detail && detail.toString().toLowerCase() != 'no') {
                                    var amenity = null;
                                    $.each(amenities, function (amenityIndex, ame) {
                                        if (ame.name == name) {
                                            amenity = ame;
                                            return false;
                                        }
                                    })
                                    if (amenity) {
                                        amenity.count++;
                                    } else {
                                        amenity = {name: name, count: 1};
                                        amenities.push(amenity);
                                    }
                                }
                            }
                        });
                    }
                }
            });
            amenities.sort(function (a, b) {
                return a.name - b.name;
            });
        }
        var result = '';
        $.each(amenities, function (index, amenity) {
            if (amenity.count) {
                result += amenity.name;
                if (amenity.count != amenities.length) {
                    result += ' (some units)';
                }
                result += '; ';
            }
        })
        if (result.length) {
            result = result.substring(0, result.length - 2);
        }
        return result;
    }

    function getAllInclusiveIcon(resort) {
        var result = null;
        var status = resort.inclusivityStatus;
        if (!status || !status.length) {
            status = resort.logisticProperty['all-inclusive'];
        }
        var distinction = resort.inclusivityDistinction;
        if (status && status.toLowerCase() == 'mandatory') {
            if (!distinction) {
                result = 'all-inclusive.png';
            } else {
                distinction = distinction.toLowerCase();
                if (distinction == 'premier plus all-inclusive') {
                    result = 'all-inclusive-premier-plus.png';
                } else if (distinction == 'premier all-inclusive') {
                    result = 'all-inclusive-premier.png';
                } else {
                    result = 'all-inclusive.png';
                }
            }
        }
        return result;
    }

    $scope.init = function (resort) {
        try {
            $scope.hasLocalInfo = false;
            $scope.hasLocalAttractions = false;
            $scope.hasLocalEvents = false;
            $scope.localAttractionPage = 0;
            $scope.localEventsPage = 0;
            $scope.region = $scope.$parent.region;
            $scope.subRegion = $scope.$parent.subRegion;
            $scope.id = resort.results.resortId;
            $scope.title = resort.results.name;
            $scope.resortId = '#' + resort.results.resortId;
            $scope.overview = resort.results.logisticProperty.highlights['legacy-highlights'] ? resort.results.logisticProperty.highlights['legacy-highlights'] : resort.results.logisticProperty.highlights['nonmem-highlights'];
            $scope.address = getAddress(resort.results);
            $scope.hasRCI = getBoolean(resort.hasRciTv);
            $scope.video = resort.videos && resort.videos['0'] ? resort.videos['0'] : null;
            $scope.resortCoords = resort.results.coords ? [resort.results.coords.lat,resort.results.coords.lng] : null;
            if (!$scope.video || !$scope.video.length) {
                $scope.hasRCI = false;
            }
            $scope.isPointResort = resort.results.type && (resort.results.type.toLowerCase() == 'both' || resort.results.type.toLowerCase() == 'points');
            $scope.strataIcon = resort.results.strata == '70' || resort.results.strata == '75' || resort.results.strata == '90' ? 'strata-' + resort.results.strata + '.png' : null;
            $scope.allInclusiveIcon = getAllInclusiveIcon(resort.results);

            $scope.roomDescription = resort.results.logisticProperty.highlights['unit-highlights'];
            $scope.rooms = getRooms(resort.results);

            $scope.resortDescription = resort.results.logisticProperty.highlights['resort-highlights'];
            $scope.checkinDays = getString(resort.results.logisticProperty.checkInCheckOutInfo.weeksResortCheckInDays.day);
            $scope.checkinTime = resort.results.logisticProperty.checkInCheckOutInfo.checkInTime;
            $scope.checkoutTime = resort.results.logisticProperty.checkInCheckOutInfo.checkOutTime;

            $scope.onSiteAmenities = getOnSiteAmenities(resort.results);
            $scope.offSiteAmenities = getOffSiteAmenities(resort.results);
            $scope.accessibilityFeatures = resort.results.accessibility ? getString(resort.results.accessibility.features.feature) : '';
            $scope.unitAmenities = getUnitAmenities(resort.results);

            $scope.areaInfo = resort.results.logisticProperty.highlights['destination-highlights'];
            $scope.airportDirection = resort.results.logisticProperty.location.drivingDirectionsFromNearestAirport;
            $scope.hasLocalInfo = $scope.resortCoords != null;

            if( $scope.resortCoords ) {
                $scope.getAttractions();
                $scope.getEvents();
            }

            $scope.showOverlay = ($window.localStorage.resortOverlayDismissed!=='true');
            $scope.resorts = [resort.results];
            safeApply($rootScope);
        } catch(error) {
            $rootScope.alert('Data parsing error');
        }

        $scope.tab = CONFIG.RESORT_TAB_OVERVIEW;
        $scope.showSecondImage = true;
        safeApply($scope);
    };

    $scope.getAttractions = function() {
        //$scope.localAttractionPageCount = 0;
        //$scope.localAttractionPages = null;
        $scope.localAttractionResultIndex = [];
        $scope.loadingAttractions = true;
        safeApply($scope);

        resortService.getLocalTime($scope.resortCoords[0],$scope.resortCoords[1]).then(
            function(response){
                var date = moment.utc(response.response.timestamp*1000)._d;
                $scope.localTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            }
        );
        resortService.getLocalWeather($scope.resortCoords[0],$scope.resortCoords[1]).then(
            function(response){
                $scope.localWeather = response;
            }
        );
        resortService.getLocalAttractions($scope.resortCoords[0],$scope.resortCoords[1],'yelp',$scope.localAttractionPageSize*$scope.localAttractionPage).then(
            function(response){
                var results = response.results;
                angular.forEach(response.results,function(result) {
                    if( !$scope.localAttractionResultIndex[result.name] )
                        $scope.localAttractionResultIndex[result.name] = result;
                });
                resortService.getLocalAttractions($scope.resortCoords[0],$scope.resortCoords[1],'factual',$scope.localAttractionPageSize*$scope.localAttractionPage).then(
                    function(response){
                        var results = [];
                        angular.forEach(response.results,function(result,index) {
                            if( $scope.localAttractionResultIndex[result.name] )
                                results.push( $scope.localAttractionResultIndex[result.name] );
                            else
                                results.push( result );

                            results[results.length-1].id = index;
                            results[results.length-1].index = $scope.localAttractionPage*$scope.localAttractionPageSize+index+1;
                        });
                        $scope.localAttractions = results;
                        $scope.hasLocalAttractions = results.length;
                        $scope.localAttractionPageCount = Math.ceil(response.total/$scope.localAttractionPageSize);
                        $scope.loadingAttractions = false;

                        //  paging
                        var pages = [];
                        var start = Math.max($scope.localAttractionPage-2,0);
                        var end = Math.min(start+5,$scope.localAttractionPageCount);
                        for(var $i = start;$i<end;$i++)
                            pages.push( $i );
                        $scope.localAttractionPages = pages;

                        safeApply($scope);
                    }
                );
            }
        );
    }

    $scope.getEvents = function() {
        //$scope.localEventsPageCount = 0;
        //$scope.localEventsPages = null;
        $scope.loadingEvents = true;
        safeApply($scope);

        resortService.getLocalEvents($scope.resortCoords[0],$scope.resortCoords[1],$scope.localEventsPageSize*$scope.localEventsPage).then(
            function(response){
                angular.forEach(response.results,function(result,index) {
                    if( result.timeStart != null ) {
                        if( result.timeStop != null && result.timeStop != result.timeStart ) {
                            result.dateStop = new Date(result.timeStop.replace(/-/g, "/"));
                            result.timeStop = result.dateStop.toString().indexOf('00:00:00') == -1 ? result.dateStop : null;
                        }
                        result.dateStart = new Date(result.timeStart.replace(/-/g, "/"));
                        result.timeStart = result.dateStart.toString().indexOf('00:00:00') == -1 ? result.dateStart : null;
                    }
                    result.id = index+1;
                    result.displayAddress = [result.location.address,result.location.locality,result.location.region,result.location.postcode].filter(function(item){ return item!=null && item.trim()!=''; }).join(', ');
                });

                $scope.localEvents = response.results;
                $scope.hasLocalEvents = response.results.length > 0;
                $scope.localEventsPageCount = Math.ceil(response.total/$scope.localEventsPageSize);
                $scope.loadingEvents = false;

                //  paging
                var pages = [];
                var start = Math.max($scope.localEventsPage-2,0);
                var end = Math.min(start+5,$scope.localEventsPageCount);
                for(var $i = start;$i<end;$i++)
                    pages.push( $i );
                $scope.localEventsPages = pages;

                safeApply($scope);
            }
        );
    }

    $scope.setLocalAttractionPage = function(page) {
        $scope.localAttractionPage = page;
        $scope.getAttractions();
        $('#attractions').scrollTop(0);
    }

    $scope.setLocalEventsPage = function(page) {
        $scope.localEventsPage = page;
        $scope.getEvents();
        $('#events').scrollTop(0);
    }

    $scope.showTab = function(tabID) {
       $scope.tab = tabID;
       $analytics.pageTrack('/resort/'+$scope.id+'/'+tabID);
       safeApply($scope);
    }

    $scope.showAvailability = function(resortID) {
        var url = 'http://rci.to/' + resortID;
        $window.open(url,'_blank');
        $analytics.pageTrack('/resort/'+resortID+'/view');
    }

    $scope.showLocalInfo = function() {
        $scope.showingLocalInfo = true;
        safeApply($scope);
    }

    $scope.hideLocalInfo = function() {
        $scope.showingLocalInfo = false;
        safeApply($scope);
    }

    $scope.onLoadImage1Error = function (event) {
        if (event.target.src.indexOf('unsafe:') == 0) {
            event.target.src = event.target.src.substring(7);
        } else if (event.target.src.indexOf(CONFIG.RESORT_IMAGE_URL) >= 0) {
            event.target.src = $rootScope.baseUrl + 'images/resort' + event.target.src.substring(event.target.src.lastIndexOf('/'));
        } else {
            event.target.src = $rootScope.baseUrl + 'images/photo-not-available.jpg';
        }
        safeApply($scope);
    }

    $scope.onLoadImage2Error = function (event) {
        $scope.showSecondImage = false;
        safeApply($scope);
    }

    $scope.onLoadWeatherIconError = function (event) {
        if (event.target.src.indexOf('unsafe:') == 0) {
            event.target.src = event.target.src.substring(7);
        } else {
            event.target.src = $rootScope.baseUrl + 'images/weather/default.png';
        }
        safeApply($scope);
    }

    $scope.closeOverlay = function(persist) {
        $scope.showOverlay = false;
        $rootScope.helpOverlayShown = true;
        $window.localStorage.resortOverlayDismissed = (persist === true);
    }

    $scope.selectAttractionMapMarker = function(data) {
        $scope.showTab(CONFIG.RESORT_TAB_AREA_INFO);

        if( $('#attractions') ) {
            if( !$('#attraction-'+data.id).position() )
                return setTimeout(function(){$scope.selectAttractionMapMarker(data);},1000);

            $('#attractions').scrollTop(0);
            $('#attractions').scrollTop($('#attraction-'+data.id).position().top-85);
        }
    }

    $scope.selectEventMapMarker = function(data) {
        $scope.showTab(CONFIG.RESORT_TAB_AREA_EVENTS);

        if( $('#events') ) {
            if( !$('#event-'+data.id).position() )
                return setTimeout(function(){$scope.selectEventMapMarker(data);},1000);

            $('#events').scrollTop(0);
            $('#events').scrollTop($('#event-'+data.id).position().top-85);
        }
    }
});
