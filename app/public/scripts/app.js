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

app.controller("loanCtrl",function($scope,$http){
    $scope.title="KAZIO";
    $scope.submitLoan=function(){
        console.log("submitting loan");
        $http({
          method: 'GET', 
          url: '/loan/start'
        })
        .success(function(){
            console.log("ads");
        })
        .error(function(err){
            console.log(err);
        });
    };
});

app.controller("adminCtrl",function($scope,$http,promiseObj){
    
    var addOfficerBadge=function(officer){
        alert(officer);
    };
    $scope.states=['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon', 'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah', 'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
    $scope.capabilityToken=promiseObj.data;
    
    $scope.test=function(val){
         $("#" + val.id).css("display","block");
    };

    $scope.approveLoan=function(){
        console.log("approving loan");
        $http({
          method: 'GET', 
          url: '/loan/approve',
          params:{dest: "+12054820430"}
        })
        .success(function(){
        console.log("connected");
      });  
    };
    
    $scope.phoneCallX=function(officer,mode){
      var data=(mode==="phone")?officer.phone:officer.browser;
      $http({
          method: 'GET', 
          url: '/phone/call',
          params:{number: data}
      })
      .success(function(){
        console.log("connected");
      });  
      
    };
    
    Twilio.Device.connect(function (conn) {
        $http({method: 'GET', url: '/phone/call'})
        .success(function(){
            console.log("connected");
        });
    });
    
    $scope.loanOfficers=[
            {   
                "name":"Mccain, Zach",
                "phone":"+12054820430",
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
