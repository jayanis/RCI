app.service('resortService', function($rootScope, CONFIG) {
    return {
        getAllRegions: function (promise) {
            var deferred = $.Deferred();
            $rootScope.showSpinner();
            var url = CONFIG.GET_ALL_REGIONS_V3_URL + '&' + CONFIG.V3_ACCESS_TOKEN;
            // var getLocal = function(promise) {
            //     $.getJSON($rootScope.baseUrl + 'libs/V2Regions.json')
            //         .done(function(data) {
            //             angular.forEach(data.results,function(item,index){
            //                 item.id = item.objectId;
            //                 if( item.parent )
            //                     item.parent.id = item.parent.objectId;
            //             });
            //             promise.resolve(data);
            //         })
            //         .fail(function(jqXHR, textStatus, errorThrown) {
            //             promise.reject(jqXHR, textStatus, errorThrown);
            //         })
            // }
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                deferred.resolve(data);
            }).fail(function() {
                $rootScope.hideSpinner();
                getLocal(deferred);
            });
            return deferred.promise();
        },
        getResortList: function (id) {
            var deferred = $.Deferred();
            $rootScope.showSpinner();
            var url = CONFIG.GET_RESORT_LIST_V3_URL.replace('{{locationID}}', id) + '&' + CONFIG.V3_ACCESS_TOKEN;
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if (data && $.isArray(data.results)) {
                    deferred.resolve(data);
                } else {
                    deferred.reject();
                }
            }).fail(function() {
                deferred.reject();
            });
            return deferred.promise();
        },
        getRegionMedia: function (location) {
            var deferred = $.Deferred();
            var url = CONFIG.GET_MEDIA_URL;
            url = url.replace('{{location}}',encodeURIComponent(location));
            $rootScope.showSpinner();
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if (data && data.success && $.isArray(data.response.results)) {
                    deferred.resolve(data.response);
                } else {
                    deferred.reject();
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $rootScope.hideSpinner();
                $.getJSON($rootScope.baseUrl + 'libs/locations/' + region.id + '.json')
                    .done(function(data) {
                        deferred.resolve(data);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        deferred.reject(jqXHR, textStatus, errorThrown);
                    })
            });
            return deferred.promise();
        },
        getResort: function (id) {
            var deferred = $.Deferred();
            $rootScope.showSpinner();
            var url = CONFIG.GET_RESORT_V3_URL.replace('{{resortID}}', id) + '?' + CONFIG.V3_ACCESS_TOKEN;
            //TODO:don't know what is white listed Regions. will remove it for now.
            // if($rootScope.whitelistedRegions.indexOf(id)===-1) {
            //     $rootScope.hideSpinner();
            //     deferred.reject();
            // }else{
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if (data) {
                    //TODO:dont have this property need o double check
                    // data.response.online = true;
                    deferred.resolve(data);
                } else {
                    deferred.reject();
                }
            }).fail(function() {
                deferred.reject();
            });
            // }
            return deferred.promise();
        },
        getResorts: function(location) {
            var deferred = $.Deferred();
            var url = CONFIG.GET_RESORTS_URL;
            url = url.replace('{{location}}', encodeURIComponent(location));
            $rootScope.showSpinner();
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if (data && data.success && data.response.results && data.response.results.length) {
                    deferred.resolve(data.response);
                } else {
                    deferred.reject();
                }
            }).fail(function() {
                $rootScope.hideSpinner();
            });
            return deferred.promise();
        },
        getTranslations: function (languageCodes) {
            var deferred = $.Deferred();
            var url = CONFIG.GET_TRANSLATIONS_URL;
            url = url.replace('{{languageCodes}}',languageCodes);
            $rootScope.showSpinner();
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if (data && data.success && data.response.results && data.response.results.length) {
                    deferred.resolve(data.response);
                } else {
                    deferred.reject();
                }
            }).fail(function() {
                $rootScope.hideSpinner();
            });
            return deferred.promise();
        },
        getWhitelistedResorts: function () {
            var deferred = $.Deferred();
            $.getJSON($rootScope.baseUrl + 'libs/resort-whitelist.json')
                .done(function(data) {
                   if( data )
                        deferred.resolve(data);
                    else
                        deferred.reject();
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                });
            return deferred.promise();
        },
        getLocalTime: function(lat,lng) {
            var deferred = $.Deferred();
            var url = CONFIG.GET_TIME_URL;
            url = url.replace('{{lat}}',lat);
            url = url.replace('{{lng}}',lng);
            $rootScope.showSpinner();
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if( data.success )
                    deferred.resolve(data);
                else
                    deferred.reject();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $rootScope.hideSpinner();
            });
            return deferred.promise();
        },
        getLocalWeather: function(lat,lng) {
            var deferred = $.Deferred();
            var url = CONFIG.GET_WEATHER_URL;
            url = url.replace('{{lat}}',lat);
            url = url.replace('{{lng}}',lng);
            $rootScope.showSpinner();
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if( data.success )
                    deferred.resolve(data.response);
                else
                    deferred.reject();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $rootScope.hideSpinner();
            });
            return deferred.promise();
        },
        getLocalAttractions: function(lat,lng,source,offset) {
            var source = typeof source !== 'undefined' ? source : 'factual';
            var deferred = $.Deferred();
            var url = CONFIG.GET_ATTRACTIONS_URL;
            url = url.replace('{{lat}}',lat);
            url = url.replace('{{lng}}',lng);
            url = url.replace('{{source}}',source);
            url = url.replace('{{offset}}',offset);
            url = url.replace('{{limit}}',20);
            $rootScope.showSpinner();
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if (data && data.success && data.response.results)
                    deferred.resolve(data.response);
                else
                    deferred.reject();
            }).fail(function(errorThrown) {
                $rootScope.hideSpinner();
            });
            return deferred.promise();
        },
        getLocalEvents: function(lat,lng,offset) {
            var deferred = $.Deferred();
            var url = CONFIG.GET_EVENTS_URL;
            url = url.replace('{{lat}}',lat);
            url = url.replace('{{lng}}',lng);
            url = url.replace('{{offset}}',offset);
            url = url.replace('{{limit}}',20);
            url = url.replace('{{radius}}',30);
            $rootScope.showSpinner();
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if (data && data.success && data.response.results)
                    deferred.resolve(data.response);
                else
                    deferred.reject();
            }).fail(function(errorThrown) {
                $rootScope.hideSpinner();
            });
            return deferred.promise();
        },
        updateResortInformationByRegion: function(id){
            var deferred = $.Deferred();
            $rootScope.showSpinner();
            var url = CONFIG.GET_LOCATION_ID_V3_URL.replace('{{regionID}}', id) + '&' + CONFIG.V3_ACCESS_TOKEN;
            $.ajax({
                url: url,
                dataType: 'json'
            }).done(function(data) {
                $rootScope.hideSpinner();
                if (data.results && $.isArray(data.results.locations)) {
                    deferred.resolve(data);
                } else {
                    deferred.reject();
                }
            }).fail(function() {
                deferred.reject();
            });
            return deferred.promise();
        }
    };
});
