///<reference path="../../reference.ts" />
module application.controllers {
	/**
	 * Class LoginCtrl represents login controller for Google Authentification.
     * 
     * This class manage page on which is user automatically redirect if turn on app 
     * and it's logged out or has an expired token.
	 * 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 01/2016
	 */
	export class LoginCtrl  
	{
	//== CLASS ATTRIBUTES ==========================================================	
		
		public static $inject = ['$scope','$location','AuthService']; 
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS ===========================================
		
		constructor(
			private $scope: any,
            private $location: ng.ILocationService,
            private AuthService: services.AuthService
		){
			this.$scope.vm = this;
            
            // If user is already logged in, redirect to homepage
            if(this.AuthService.getUserState() == 1){
                this.$location.path(Routes.HOME);
            }
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
    
        /**
         * Log In user and redirect to homepage
         */
        private login() {
            this.AuthService.authorizeUser();
        }
	}
}