///<reference path='../../reference.ts' />
module application.services {
    /**
	 * This class represents main service, which is responsible for user actions.
     * 
     * It can authorize or logout user, return its login state od return its info.
     * Also shows alerts and can show loaders in specific cases.
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 02/2016
	 */
	export class AuthService {
	//== CLASS ATTRIBUTES ==========================================================
			
		//Angular DI 
		public static $inject = ['$rootScope','$location','$log','UIService','LoginService'];
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 	
		
		constructor(  
            private $rootScope: any,
            private $location: ng.ILocationService,
            private $log: ng.ILogService,
            private UIService: services.UIService,
            private LoginService: services.LoginService
		) {
			
		} 
		
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
        
        /**
         * Authorize user. Shows loader.
         * 
         * This method hardcoded every login step:
         * * Register application
         * * Download plus library
         * * Retrieve User Info
         * * Redirect to givven page or Homepage
         * 
         * This method should be called by users action. 
         * For example after he click on login button.
         * 
         * For automatic login (in App start, etc.) use authorizeUserAutomatically() method.
         * 
         * @param redirect Optional. redirect is URL where should be user redirect after sucsess login. 
         *                 Based on Routes class.
         */
        public authorizeUser(redirect?: string): void {
            redirect = redirect || Routes.getRoutePath('home');
            
            this.UIService.showLoader();
            this.LoginService.login()
            .then(
                () => {
                    this.$location.path(redirect);
                    this.UIService.showAlert(
                        StringF.format(
							Strings.SUCCESS_USER_LOGGED_IN, 
							this.getUserInfo().name
                        ),
                        services.AlertService.OK,
                        30000
                    );
                    this.$rootScope.$apply();
                    this.UIService.hideLoader();
                },
                (error) => {
                    this.UIService.showAlert(error);
                    this.UIService.hideLoader();
                }
             );
        }
        
        
        /**
         * Find out users state. 
         * 
         * # If isn' logged in, redirect to Login page.
         * # If has invalid or expires token, log him in on background. 
         *   In case of error delete all credentials and redirect to Login page.
         * # If user is already Logged in, then refresh his info once per session only.
         */
        public authorizeUserAutomatically(): void {
            switch(this.getUserState()){
                // Expired or invalid token
                case -1 : 
                    
                    this.$log.debug('AuthService: Found expired or invalid token.');
                    
                    this.LoginService.login(true)
                    .then(
                        () => {
                            this.$log.debug('AuthService: Token refreshed.');
                            this.UIService.showAlert(StringF.format(
                                application.Strings.SUCCESS_USER_LOGGED_IN_IMMEDIATE, 
                                this.getUserInfo().name
                            ),
                            services.AlertService.OK,
                            30000);
                            this.$rootScope.$apply();
                        },
                        (err) => {
                            this.$log.error('AuthService: Token could not refresh.');
                            this.$log.debug(err);
                            
                            this.logout();
                            
                            this.$location.path( Routes.getRoutePath('login') );
                            this.$rootScope.$apply();
                        }
                    );
                    break;
                    
                //Logged out user    
                case 0 :
                    
                    this.$log.debug('AuthService: User not logged.');
                    
                    this.$location.path( Routes.getRoutePath('login') );
                    break;
                    
                //Logged in user
                case 1 :
                    this.$log.debug('AuthService: User logged');
                    if(!this.$rootScope.user.logged && !this.$rootScope.sessionStarted){
                        this.LoginService.refreshUserInfo()
                        .then(
                            () => {
                                this.$log.debug('AuthService: User info refreshed.');
                                this.$rootScope.$apply();
                            },
                            (err) => {
                                this.$log.error('AuthService: User info not refresh.');
                                this.$log.debug(err);
                                
                                this.UIService.showAlert(Strings.ERROR_USER_DATA)
                                
                                this.$location.path( Routes.getRoutePath('login') );
                                this.$rootScope.$apply();
                            }
                        );
                        
                        // Set this apllication as stated. Due to login watches on every route change.
                        this.$rootScope.sessionStarted = true;   
                    }
                    break;
                    
                default:
                
                    this.$log.error('Uknown User State.');
            }
        };
        
        
        /**
         * Log out user, delete all credentials and redirect to Login page.
         * 
         * @param alert Indicates if should be shown alert with success message. Default is false.
         */
        public logout(alert?:boolean): void {
            this.LoginService.logout();
            this.$log.debug('AuthService: User logged out.');
            
            if(alert){
                this.UIService.showAlert(Strings.SUCCESS_USER_LOGGED_OUT,services.AlertService.OK, 30000);
            }
        }
        
        
        
        
        /**
         * Return actual user login state.
         * 
         * -1 - expired or invalid token
         * 0 - unlogged user
         * 1 - logged user
         */
        public getUserState(): number {
            return this.LoginService.getUserState();
        }
        
        
        /**
         * Return User object
         */
        public getUserInfo(): entities.User{
            return this.LoginService.getUserInfo();
        }
        
        
        /**
         * Created default User. Still Logged out.
         */
        public initUser(): void {
            this.LoginService.initUser();
        }
        		
    //== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
   	}
}