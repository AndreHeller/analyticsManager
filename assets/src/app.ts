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
	})
    .run(['$rootScope','$location','$log','LoginService','UIService', function(
            $rootScope: any, 
            $location: ng.ILocationService, 
            $log:ng.ILogService, 
            LoginService: services.LoginService,
            UIService: services.UIService) {
		
        //Set default initial data
		setInitialData($rootScope);
        
        //Register listener to watch route changes
		$rootScope.$on('$routeChangeStart', (event, next, current) => {
			
            if(next.$$route){
                //Set current section
                $rootScope.currentSection = next.$$route.originalPath;
                
                //Check if use is logged in and if not redirect to login page
                checkUserLoginState(LoginService,UIService,$log,$location,$rootScope);
                
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
    app.service('LoginService', services.LoginService)
       .service('UIService', services.UIService)
       .service('LoaderService', services.LoaderService)
       .service('AlertService', services.AlertService);
    
    app.directive('loader', directives.Loader)
       .directive('alert', directives.Alert);
    
    
    /**
     * Set basic initial data for application
     */
    var setInitialData = function($rootScope: any): void {
        // Initiate system variables
		$rootScope.user = {'logged': false}; 
		
		// Sets the enviromanet (debug, production)
		$rootScope.enviroment = 'debug';
        
        $rootScope.google = {};
        $rootScope.google.client_id = '265759548418-ibp90bhfkiham5hij8ka7nf8bvvqd6j0.apps.googleusercontent.com';
        $rootScope.google.scopes = [
            'profile',
            'https://www.googleapis.com/auth/plus.me'
        ];
    }
    
    /**
     * Check User login state. 
     * If is logged out or has invalid or expired token, redirect to LOGIN page.
     */
    var checkUserLoginState = function(LoginService: services.LoginService,
                                       UIService: services.UIService,
                                       $log: ng.ILogService,
                                       $location: ng.ILocationService,
                                       $rootScope: any){
        
        if(LoginService.getUserState() < 1){
                
            $log.debug('APP: User not logged.');
            
            if(LoginService.getUserState() == -1){
                
                $log.debug('APP: Found expired or invalid token.');
                
                LoginService.refreshToken()
                .then(
                    () => {
                        $log.debug('APP: Token refreshed.');
                    },
                    (err) => {
                        $log.error('APP: Token could not refresh.');
                        $log.debug(err);
                        
                        $location.path( Routes.LOGIN );
                        $rootScope.$apply();
                    }
                );
            }
            else {
                $location.path( Routes.LOGIN );
            } 
        }
        
    }
}