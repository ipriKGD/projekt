angular.module('newtrade', ['ngResource'])

    .controller('AddListingCtrl', ['$scope', 'socialTradeService', '$location', 'firebaseRef', 'syncData',
     function($scope, socialTradeService, $location, firebaseRef, syncData) {

        // TODO: slika - nalaganje!
        $scope.category="art";
        $scope.image="";
    
         $scope.newListing = function() {
             $scope.t = syncData('trades');
             $scope.t.$on("loaded", function() {
               var keys = $scope.t.$getIndex();
               var id = keys.length;
               var d = new Date();
               var diso = ISODateString(d);
               var md = 1;
               if($scope.mode) md=2;
               if($scope.image.length == 0) $scope.image ="img/blank.jpg";
               if($scope.title.length == 0 || $scope.price.length == 0 || $scope.description.length == 0){
                    $scope.err = "Please, enter all necessary data."
               } else {
               firebaseRef('trades/'+id).set({active: 1, article: 
                 {category: [$scope.category], description: $scope.description, id: id, image: [$scope.image], price: $scope.price, title: $scope.title},
                created: diso, expires: diso, id: id, mode: md, user_id: $scope.user.id});
                $location.path('trades'); }

            });
             
        };
    }]);
function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'}