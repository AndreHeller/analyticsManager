///<reference path="./../../reference.ts" />

module analytics {
    
    var app = angular.module('GoogleAnalytics', ['templates']);
    
    /**
	 * App configuration. 
	 * 
	 * Route settings.
	 */
	app.config(($logProvider: ng.ILogProvider) => {
		
        //Turn on debug output
		$logProvider.debugEnabled(true);
		
	})
    .run(['$log',function($log: ng.ILogService){
        $log.debug('GA: Module loaded ');
    }]);
     
    
    
    /**
     * Directive & services & controllers
     */
    app.service('GAService', services.GAService);
    
    app.directive('accountsList', directives.AccountsList);
   
}