var app=angular
    .module("collabApp", ["ui.router","ui.bootstrap"])
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $state.transitionTo('home');
    }]);
    

app.config(function ($stateProvider, $urlRouterProvider) {
     $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'homeCtrl'
            })
            .state('loan', {
                url: '/loan',
                templateUrl: '/templates/loan.html',
                controller: 'loanCtrl'
            })
             .state('admin', {
                url: '/admin',
                templateUrl: '/templates/admin.html',
                controller: 'adminCtrl',
                resolve:{
                    promiseObj:  function($http){
                        return $http({method: 'GET', url: '/phone/capabilityToken'});
                    }
                }
            });
});

app.controller("homeCtrl",function($scope){
    $scope.title="KAZIO";
});

app.controller("loanCtrl",function($scope){
    $scope.title="KAZIO";
});

app.controller("adminCtrl",function($scope,$http,promiseObj){
    
    var addOfficerBadge=function(officer){
        alert(officer);
    };
    
    $scope.capabilityToken=promiseObj.data;
    
     $scope.test=function(val){
         $("#" + val.id).css("display","block");
     };

    $scope.phoneCall=function(officer,mode){
      var data=(mode==="phone")?officer.phone:officer.browser;
      $http({
          method: 'GET', 
          url: '/test/phone/call',
          params:{number: data}
      })
      .success(function(){
        console.log("connected");
      });  
      
    };
    
    Twilio.Device.connect(function (conn) {
        $http({method: 'GET', url: '/test/phone/call'})
        .success(function(){
            console.log("connected");
        });
    });
    
    $scope.loanOfficers=[
            {   
                "name":"Mccain, Zach",
                "phone":"+12107849834",
                "browser":"client:Zach",
                "id":"Zach",
                "image":"images/zach.JPG",
            },
            {   
                "name":"Nair, Anoop",
                "phone":"+12054086747",
                "browser":"client:jenny",
                "id":"Anoop",
                "image":"images/anoop.JPG"
            },
            {   
                "name":"Haggert, Kyle",
                "phone":"+12055720152",
                "browser":"client:Kyle",
                "id":"Kyle",
                "image":"images/kyle.JPG"
            }
        ];
});


app.directive('kazTwilio',[function(){
    if(!Twilio){return;}
    return{
        restrict: 'EA',
        link:function(scope, element, attrs) {
            console.log(scope.officer);
            //element.append("<span>hi</span>");
        }
    };
}]);
