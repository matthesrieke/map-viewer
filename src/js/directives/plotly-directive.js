angular.module('mapViewer')
.factory('d3', [function() {
  return d3;
}])
.factory('plotly', [function() {
  return Plotly;
}])
.directive('lineChart', ['d3', 'plotly', function(d3, plotly) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      station: "="
    },
    template: '<div class="plotly-linechart" ng-attr-id="plot-{{station.id}}"></div>',
    link: function(scope, element) {
      var targetDiv = element.find('div');

      var colors = ['rgb(220, 50, 100)', 'rgb(50, 220, 100)', 'rgb(100, 220, 50)'];

      var layout = {
        title: 'Zeitreihe für Messstation '+scope.station.id,
        xaxis: {
          type: 'date',
          title: 'Datum'
        }
      };

      var data = [];
      var c = 0;
      for (var pheno in scope.data) {
        if (scope.data.hasOwnProperty(pheno)) {
          scope.data[pheno].type = 'scatter';
          scope.data[pheno].marker = {color: colors[c]};

          if (c === 0) {
            layout.yaxis = {
              title: pheno,
              titlefont: {color: colors[c]}
            };
          }
          else if (c > 0) {
            scope.data[pheno].yaxis = 'y'+(c+1);
            layout['yaxis'+(c+1)] = {
              title: pheno,
              titlefont: {color: colors[c]},
              overlaying: 'y',
              side: 'right'
            };
          }
          data.push(scope.data[pheno]);
          c++;
        }
      }

      element.ready(function() {
        plotly.newPlot('plot-'+scope.station.id, data, layout);
      });

    }
  };
}]);
