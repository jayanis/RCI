app.directive
(
	'map',
	function($timeout,$rootScope,$compile,$filter)
	{
		return {
			restrict: 'A',
			scope:{
				initialZoomLevel:'=initialZoomLevel',
				fitToMarkers:'=fitToMarkers',
				markers:'=markers',
				mapCenter:'=mapCenter',
				maxBounds:'&maxBounds',
				attractions:'=attractions',
				events:'=events',
				focus:'=focus',
				resorts:'=resorts',
				onSelectAttraction:'&',
				onSelectResort:'&',
				onSelectEvent:'&',
				useRciIconForResorts:'=useRciIconForResorts'
			},
			link: function(scope,element,attrs)
			{
				var map,updateDelay,popup;
				
				var resortIcon = L.icon
				(
					{
					    iconUrl: 'images/map/rci-marker.png',

					    iconSize:     [39, 41], // size of the icon
					    shadowSize:   [50, 64], // size of the shadow
					    iconAnchor:   [17, 41], // point of the icon which will correspond to marker's location
					    shadowAnchor: [4, 62],  // the same for the shadow
					    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
					}
				);

				angular.element(document).ready
				(
					function () 
					{
						var params = {attributionControl:false,zoom:10};
						if( scope.mapCenter )
							params.center = scope.mapCenter;

						map = L.map(element[0],params);
						map.addLayer( L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png') );

						if( scope.maxBounds() )
						{
							var bounds = scope.maxBounds();
							var maxBounds = new L.LatLngBounds(new L.LatLng(bounds[1], bounds[0]), new L.LatLng(bounds[3], bounds[2]));
							map.fitBounds(maxBounds,{reset:true});
						}

						scope.$watch
						(
							'initialZoomLevel',
							function(newVal,oldVal)
							{
								if( newVal!=oldVal && newVal )
								{
									map.zoomOut(scope.initialZoomLevel);
								}
							}
						);

						scope.$watch
						(
							'mapCenter',
							function(newVal,oldVal)
							{
								if( newVal!=oldVal )
								{
									map.setView(newVal,map.getZoom());
								}
							}
						);

						scope.$watch
						(
							'focus',
							function(newVal,oldVal)
							{
								if( newVal!=oldVal )
								{
									updateFocus(newVal);
								}
							}
						);
					}
				);
				
				var getPopup = function(data)
				{
					markup = "<div>";

					if( data.type == 'attraction' )
					{
						markup += '<p>' + data.title + ' <a href="#" ng-click="onSelectAttraction({data:data})"><img src="images/plus-alt.png"></a></p>';
					}
					else if( data.type == 'event' )
					{
						markup += '<p>' + data.title + ' <a href="#" ng-click="onSelectEvent({data:data})"><img src="images/plus-alt.png"></a></p>';
						//markup += '<p>' + $filter('date')(data.start, 'short') + '</p>';
					}
					else if( data.type == 'resort' )
					{
						markup += '<p>' + data.resortId + ' ' + data.title + ' <a href="#" ng-click="onSelectResort({data:data})"><img src="images/plus-alt.png"></a></p>';
					}
					
					markup += '</div>';

					return markup
				}

				var attractionLayer;
				var eventLayer;
				var resortLayer;

				var markers = {attractions:[],events:[],resorts:[]};

				var refresh = function()
				{
					if( scope.resorts 
						&& scope.resorts.length )
					{
						if( !resortLayer )
						{
							resortLayer = new L.markerClusterGroup
							(
								{
									iconCreateFunction: function(cluster) 
									{
										return new L.DivIcon({ html: '<span>' + cluster.getChildCount() + '</span>', className: 'cluster-marker', iconSize: L.point(25,25) });
									},
									maxClusterRadius:20,
									showCoverageOnHover:false,
									zoomToBoundsOnClick:true
								}
							);
							map.addLayer( resortLayer );
						}

						resortLayer.clearLayers();
						markers.resorts = [];

						var icon = L.AwesomeMarkers.icon({icon:'hotel',iconColor:'white',markerColor:'darkred',prefix:'fa'});
						
						angular.forEach
						(
							scope.resorts,
							function(point)
							{
								if( (point.coords && point.coords.latitude && point.coords.longitude) )
								{
									var data = {id:point.id,type:'resort',title:point.name,location:{lat:point.coords.latitude,lng:point.coords.longitude},resortId:point.resortId};
									var marker = new L.marker([data.location.lat, data.location.lng],{title:point.title,data:data,icon:icon});
									var html = getPopup(data);
									var compile = $compile(angular.element(html));
									var newScope = scope.$new();
									newScope.data = data;
									marker.bindPopup(compile(newScope)[0]);
									resortLayer.addLayer(marker);

									markers.resorts.push(marker);
									
								}
								else
								{
									console.log(point);
								}
							}
						);
					}

					if( scope.attractions 
						&& scope.attractions.length )
					{
						if( !attractionLayer )
						{
							attractionLayer = new L.layerGroup();
							map.addLayer( attractionLayer );
						}

						attractionLayer.clearLayers();
						markers.attractions = [];

						angular.forEach
						(
							scope.attractions,
							function(point)
							{
								var data = {type:'attraction',id:point.id,title:point.name,url:point.website,address:point.location.address,location:{lat:point.coords.latitude,lng:point.coords.longitude}};	
								var marker = L.marker([data.location.lat, data.location.lng],{title:point.name,data:data,icon:L.AwesomeMarkers.icon({icon:'star',markerColor:'black',prefix:'fa'})});
								var html = getPopup(data);
								var compile = $compile(angular.element(html));
								var newScope = scope.$new();
								newScope.data = data;
								marker.bindPopup(compile(newScope)[0]);
								attractionLayer.addLayer(marker);

								markers.attractions.push(marker);
							}
						);
					}

					if( scope.events 
						&& scope.events.length )
					{
						if( !eventLayer )
						{
							eventLayer = new L.layerGroup();
							map.addLayer( eventLayer );
						}

						eventLayer.clearLayers();
						markers.events = [];

						angular.forEach
						(
							scope.events,
							function(point)
							{
								var data = {type:'event',id:point.id,title:point.title,start:point.timeStart,url:point.url,location:{lat:point.coords.latitude,lng:point.coords.longitude}};	
								var marker = L.marker([data.location.lat, data.location.lng],{title:point.title,data:data,icon:L.AwesomeMarkers.icon({icon:'calendar',markerColor:'green',prefix:'fa'})});
								var html = getPopup(data);
								var compile = $compile(angular.element(html));
								var newScope = scope.$new();
								newScope.data = data;
								marker.bindPopup(compile(newScope)[0]);
								eventLayer.addLayer(marker);

								markers.events.push(marker);
							}
						);
					}

					setTimeout(function(){updateFocus();},1000);
				}

				var updateFocus = function()
				{
					var points = [];

					if( scope.focus == 'all' || scope.focus == 'attraction' )
					{
						angular.forEach
						(
							markers.attractions,
							function(marker)
							{
								points.push(marker.getLatLng());
							}
						);
					}

					if( scope.focus == 'all' || scope.focus == 'event' )
					{
						angular.forEach
						(
							markers.events,
							function(marker)
							{
								points.push(marker.getLatLng());
							}
						);
					}

					if( scope.focus == 'all' || scope.focus == 'resort' )
					{
						angular.forEach
						(
							markers.resorts,
							function(marker)
							{
								points.push(marker.getLatLng());
							}
						);
					}

					if( scope.fitToMarkers && points.length )
						map.fitBounds(new L.LatLngBounds(points),{padding:[13,13],reset:true});
				}

				scope.$watchCollection
				(
					'attractions',
					function(newVal,oldVal)
					{
						if(newVal!=oldVal)
						{
							refresh();
						}
					}
				);

				scope.$watchCollection
				(
					'events',
					function(newVal,oldVal)
					{
						if(newVal!=oldVal)
						{
							refresh();
						}
					}
				);

				scope.$watchCollection
				(
					'resorts',
					function(newVal,oldVal)
					{
						if(newVal!=oldVal)
						{
							refresh();
						}
					}
				);

				refresh();
			}
		}
	}
);
