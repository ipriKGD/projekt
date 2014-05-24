'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

  //notri ^ ali posebej
  .directive('chart', function(){
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            var chart = null,
                options  = { 
                    series: {
                        lines: {
                            show: true,
                        },
                        color: "0099FF",
                    },
                    xaxis: {
                        mode: "categories",
                        tickLength: 0,
                    }
                };
            
            var data = scope[attrs.ngModel]; 
            
            scope.$watch('data', function(v){
                if(!chart) {
                    chart= $.plot(elem, v, options);
                    elem.show();
                } else {
                    chart.setData(v);
                    chart.setupGrid();
                    chart.draw();
                }
            });
        }
    };
});
