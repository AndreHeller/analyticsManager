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
		
		public static $inject = ['$scope','$rootScope','$location','$log','LoginService','UIService']; 
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS ===========================================
		
		constructor(
			private $scope: any,
            private $rootScope: any,
            private $location: ng.ILocationService,
            private $log: ng.ILogService,
            private LoginService: services.LoginService,
            private UIService: services.UIService
		){
			this.$scope.vm = this;
            
            // If user is already logged in, redirect to homepage
            if(this.LoginService.getUserState() == 1){
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
            this.UIService.showLoader();
            this.LoginService.login()
            .then(
                () => {
                    this.$location.path(Routes.HOME);
                    this.$scope.$apply();
                    this.UIService.showAlert(
                        StringF.format(
							Strings.SUCCESS_USER_LOGGED_IN, 
							this.$rootScope.user.name
                        ),
                        services.AlertService.OK
                    );
                    this.UIService.hideLoader();
                },
                (error) => {
                    //TODO
                    this.UIService.showAlert(error);
                    this.UIService.hideLoader();
                }
             );
        }
	}
}