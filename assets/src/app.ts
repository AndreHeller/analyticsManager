///<reference path="./reference.ts" />

module application {
    
        var app = angular.module('Application', ['ngRoute', 'templates','GoogleAnalytics']),
            routes = new Routes();
        
        /**
        * App configuration. 
        * 
        * Route settings.
        */
        app.config(($routeProvider, $logProvider: ng.ILogProvider) => {
            
            //Turn on debug output
            $logProvider.debugEnabled(true);
            
            routes.setRoutes($routeProvider);
            
        })
        .run(['$rootScope','$log','$location','AuthService','UIService', function($rootScope: any, $log:ng.ILogService, $location: ng.ILocationService, AuthService: services.AuthService, UIService: services.UIService){
            
            //Set default initial data
            setInitialData($rootScope, AuthService);
            
            //Register listener to watch route changes
            $rootScope.$on('$routeChangeStart', (event, next, current) => {
                
                if(next.$$route){
                    
                    //Set current section
                    $rootScope.currentSectionPath = $location.url();
                    
                    //Authorize user on background or redirect to login page
                    AuthService.authorizeUserAutomatically();
                    
                    $log.debug(
                        '=======================================\n' +
                        'APP: REDIRECTING: ' + next.templateUrl + '\n' +
                        '======================================='
                    );
                }
                else {
                    //TODO 404
                    $log.debug('APP: 404');
                    UIService.showAlert(Strings.ERROR_404);
                }         
            });
            
        }]);
        
        
        
        /**
        * Directive & services & controllers
        */
        app.service('AuthService', services.AuthService)
        .service('LoginService', services.LoginService)
        .service('UIService', services.UIService)
        .service('LoaderService', services.LoaderService)
        .service('AlertService', services.AlertService)
        .service('UUIDService', services.UUIDService);
        
        app.directive('loader', directives.Loader)
        .directive('alert', directives.Alert)
        .directive('navigation', directives.Navigation);
        
        
        /**
        * Set basic initial data for application
        */
        var setInitialData = function($rootScope: any, AuthService: services.AuthService): void {
            // Initiate system variables
            AuthService.initUser();
            
            // Initiate system variables
            $rootScope.sessionStarted = false; 
            
            // Sets the enviromanet (debug, production)
            $rootScope.enviroment = 'debug';
            
            // Set default dection
            $rootScope.currentSectionPath = routes.getDefaultSectionPath();
            
            // Set reference to Routes class instace
            $rootScope.routes = routes;
        }
    
}

var runApp = function(){
    angular.bootstrap(document,['Application']);
}