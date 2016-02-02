angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("app/templates/home.html","<h1>Angular Template Project</h1>");}]);
var application = application || {};
(function (application) {
    var Routes = (function () {
        function Routes() {
        }
        Routes.HOME = '/';
        return Routes;
    })();
    application.Routes = Routes;
})(application || (application = {}));

///<reference path="../../reference.ts" />
var application = application || {};
(function (application) {
    /**
     * Class HomeCtrl represents default controller for default application View.
     *
     *
     * @author  André Heller; anheller6gmail.com
     * @version 1.00 — 01/2016
     */
    var HomeCtrl = (function () {
        //== INSTANCE ATTRIBUTES =======================================================
        //== CLASS GETTERS AND SETTERS =================================================
        //== OTHER NON-PRIVATE CLASS METHODS =========================================== 
        //##############################################################################
        //== CONSTUCTORS AND FACTORY METHODS ===========================================
        function HomeCtrl($scope) {
            this.$scope = $scope;
            this.$scope.vm = this;
        }
        //== CLASS ATTRIBUTES ==========================================================	
        HomeCtrl.$inject = ['$scope'];
        return HomeCtrl;
    })();
    application.HomeCtrl = HomeCtrl;
})(application || (application = {}));

///<reference path="./typings/tsd/tsd.d.ts" />
///<reference path="./app/Routes.ts" />
///<reference path="./app/controllers/HomeCtrl.ts" /> 

///<reference path = "./reference.ts" />
var application = application || {};
(function (application) {
    var app = angular.module('Application', ['ngRoute', 'templates']);
    /*
     * App configuration.
     *
     * Route settings.
     */
    app.config(function ($routeProvider, $logProvider) {
        //Turn on debug output
        $logProvider.debugEnabled(true);
        $routeProvider
            .when(application.Routes.HOME, {
            controller: application.HomeCtrl,
            templateUrl: 'app/templates/home.html'
        })
            .otherwise({ redirectTo: '/' });
    });
})(application || (application = {}));
