var app = angular.module('mapViewer', ['nemLogging','ui-leaflet', 'ngMaterial'])
.controller('MapController', ['$scope', 'leafletData', '$http', '$mdDialog', '$compile',
    function($scope, leafletData, $http, $mdDialog, $compile) {
        $scope.notPanned = true;

        leafletData.getMap().then(function(map) {
            console.info(map);
            $scope.map = map;
        });

        var tiles = {
            url: "http://a.tile.stamen.com/toner/{z}/{x}/{y}.png",
            options: {
                attribution: '<a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top"\ href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a\ target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
            }
        };

        angular.extend($scope, {
            center: {
                lat: 51.505,
                lng: -0.09,
                zoom: 15
            },
            tiles: tiles
        });

        $scope.openGraph = function(stationId, ev) {

          $http.get('https://kswe2017.daplie.me/api/features/'+stationId+'/observations').then(function(response) {
            /*
            * controller used in the dialog
            */
            var DialogController = ['$scope', '$mdDialog', 'station', 'observations', function DialogController($scope, $mdDialog, station, observations) {
              $scope.station = station;

              $scope.data = {};
              observations.forEach(function (o) {
                for (var pheno in o) {
                  if (o.hasOwnProperty(pheno)) {
                    if (pheno !== 'timestamp' && pheno !== 'feature') {
                      if (!$scope.data[pheno]) {
                        //first time seeing this phenomenon
                        $scope.data[pheno] = {
                          name: pheno,
                          x: [],
                          y: []
                        };
                      }
                      $scope.data[pheno].x.push(o.timestamp*1000);
                      $scope.data[pheno].y.push(o[pheno]);
                    }
                  }
                }

              });


              $scope.hide = function() {
                $mdDialog.hide();
              };

              $scope.cancel = function() {
                $mdDialog.cancel();
              };

              $scope.confirm = function() {
                $mdDialog.hide(true);
              };
            }];

            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'templates/diagram.html',
              parent: angular.element(document.body),
              clickOutsideToClose:true,
              locals: {
                station: {
                  id: stationId
                },
                observations: response.data
              }
            })
            .then(function(confirmed) {
              if (confirmed) {
                console.info('confirmed');
              }
            }, function() {
              console.info('cancelled');
            });
          });
          ev.preventDefault();
        };

        $http.get('https://kswe2017.daplie.me/api/features').then(function(response) {
          console.info(response);
          response.data.features.forEach(function(feature) {

            if ($scope.map) {
              var onEachFeature = function(feature, layer) {

                  if (feature.properties && feature.properties.identifier) {
                        var html = '<a href="#" ng-click="openGraph(\''+feature.properties.identifier+'\', $event)">'+feature.properties.identifier+'</a>',
                    linkFunction = $compile(angular.element(html)),
                    newScope = $scope.$new();

                    layer.bindPopup();
                    layer.bindPopup(linkFunction(newScope)[0]);
                  }

              };

              L.geoJson(feature, {
                  onEachFeature: onEachFeature
              }).addTo($scope.map);

              if ($scope.notPanned) {
                $scope.map.panTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
                $scope.notPanned = false;
              }
            }
          });
        }, function(err) {
          console.warn(err);
        });
    }
]);
