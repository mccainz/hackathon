var app=angular
    .module("collabApp", ["ui.router"])
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
                controller: 'loanCtrl'
            });
});

app.controller("homeCtrl",function($scope){
    $scope.title="KAZIO";
});

app.controller("loanCtrl",function($scope){
    $scope.title="KAZIO";
});

app.controller("adminCtrl",function($scope){
    $scope.test=function(){
        alert("hello World");
    };
});

