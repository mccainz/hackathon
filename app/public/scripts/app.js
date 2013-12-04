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
            });
});

app.controller("homeCtrl",function($scope){
    $scope.title="KAZIO";

});