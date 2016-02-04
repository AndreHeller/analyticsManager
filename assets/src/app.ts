///<reference path="./reference.ts" />

module application {
    
    var app = angular.module('Application', ['ngRoute', 'templates']);
    
    /**
	 * App configuration. 
	 * 
	 * Route settings.
	 */
	app.config(($routeProvider, $logProvider: ng.ILogProvider) => {
		
        //Turn on debug output
		$logProvider.debugEnabled(true);
		
        setRoutes($routeProvider);
		
	})
    .run(['$rootScope','$log','AuthService', function($rootScope: any, $log:ng.ILogService, AuthService: services.AuthService){
		
        //Set default initial data
		setInitialData($rootScope, AuthService);
        
        //Register listener to watch route changes
		$rootScope.$on('$routeChangeStart', (event, next, current) => {
			
            if(next.$$route){
                //Set current section
                $rootScope.currentSection = next.$$route.originalPath;
                
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
       .service('AlertService', services.AlertService);
    
    app.directive('loader', directives.Loader)
       .directive('alert', directives.Alert);
    
    
    
    
    /**
     * Set All routes settings
     */
    var setRoutes = function($routeProvider): void{
        $routeProvider
			.when(Routes.LOGIN, { 
				controller: controllers.LoginCtrl,
				templateUrl: 'app/templates/login.html'
			})
            .when(Routes.HOME, { 
				controller: controllers.HomeCtrl,
				templateUrl: 'app/templates/home.html'
			}) 
			.otherwise({redirectTo: '/'});
    }
    
    
    
    
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
    }
}