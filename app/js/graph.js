angular.module('graph', ['ngResource'])


.controller('graphController', function($scope) {
  var ref = new Firebase("https://socialtrade.firebaseio.com/trades/");
  //var data= new Array();
  var data = [[]];
  var counter= 0;
  ref.once('value', function(snapshot) {
     snapshot.forEach(function(trades) {
       var trade= trades.val();
       //data[counter]= new Array();
       data[0][counter]  = [];
       data[0][counter][0]= trade['created'].substring(5, 10);
       data[0][counter][1]= ++counter;
     });
    $scope.graphdata= data;
  });
})
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
				scope.$watch('graphdata', function(v){
 				 if(!chart) {
 				 	 $("chart").show();
 				 	 $("chart").hide();
					 chart= $.plot(elem, v, options);
					 elem.show();
				} else  {
					chart.setData(v);
					chart.setupGrid();
					chart.draw();
				}
			});
		 }
	  };
	 });
