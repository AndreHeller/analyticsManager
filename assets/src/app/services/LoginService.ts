///<reference path='../../reference.ts' />
module application.services {
	/**
	 * This class represents  service, which is responsible for user authentification.
     * 
     * It contact google api and authoriuzes Google Accounts, retrieve basic user info and
     * manage user tokens.
     * 
     * !! This service should not be used directly, but trough AuthService.
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 02/2016
	 */
	export class LoginService {
	//== CLASS ATTRIBUTES ==========================================================
			
		//Angular DI 
		public static $inject = ['$rootScope', '$log','$window','$location'];
		
	//== INSTANCE ATTRIBUTES =======================================================
    
        public client_id: string = '265759548418-ibp90bhfkiham5hij8ka7nf8bvvqd6j0.apps.googleusercontent.com';
        
        public scopes: string[] = [
            'profile',
            'https://www.googleapis.com/auth/plus.me'
        ];
        
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 	
		
		constructor(  
            private $rootScope: any,
            private $log: ng.ILogService,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService
		) {
			
		} 
		
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
        
        /**
         * Log In user. Authorize app with Google API, save token. 
         * Then download Google+ library and retrieve user info, which save.
         * 
         * @param immediate set the way how login will. False open consent window. 
         * True goes on background.
         * False is default.
         */
        public login(immediate?: boolean): Promises.Promise {
            return this.checkAuth(immediate)
            .then(() => {return this.loadUser();})
            .then((user) => {this.saveUser(user);});  
        }
        
        
        /**
         * Log out user, delete all credentials and redirect to Login page.
         */
        public logout(){
            this.clearToken();
            this.clearUser();

            
            this.$location.path(Routes.LOGIN);
        }
        
        
        /**
         * If user has saved token but its expired, this will refresh it.
         * Initialize auth api with saved Token and retrive user info from google+ library. 
         * Then save it.
         */
        public refreshUserInfo(): Promises.Promise{
            var d = new Promises.Deferred();
            
            if(gapi.auth){
                gapi.auth.init(
                    () => {
                        gapi.auth.setToken(this.getToken());
                    }
                );
                
                this.loadUser()
                .then((user) => {this.saveUser(user);}) 
                .then(
                    () => {
                        d.fulfill();
                    },
                    () => {                    
                        this.logout();
                        d.reject();
                    }
                );    
            }
            else {
                this.$log.error('LoginService: Too quick! client.js isn\'t loaded yet.');
                this.$log.error('LoginService: Rejecting user data refresh.');
                d.reject();    
            }
            
            return d.promise();
        }
        
        
        /**
         * Return actual user state.
         * 
         * -1 - expired or invalid token
         * 0 - unlogged user
         * 1 - logged user
         */
        public getUserState(): number{
            if(this.isTokenExpired()){
                return -1; //Expired Token
            }
            else if(!this.isTokenExpired() && typeof this.isTokenExpired() != 'undefined'){
                return 1; //Logged user
            }
            else {
                return 0 //No token or Unlogged user
            }
        }
        
        
        /**
         * Return User object
         */
        public getUserInfo(): entities.User{
            return this.$rootScope.user;
        }
        
        
        /**
         * Initialize default user values. Still set as logged out.
         */
        public initUser(): void { 
            this.saveUser('default');
        }
         
        		
    //== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
        
        /**
         * Create basic API call for token refreshing and authorizing application.
         * 
         * @param immediate set the way how login will. False open consent window. 
         * True goes on background.
         */
        private checkAuth(immediate?: boolean): Promises.Promise {
            
            //Set default immediate as false.
            if(!immediate) immediate = false;
            else immediate = true;
            
            this.$log.debug('LoginService: Starting authorize with immediate as ' + immediate + '.');
            
            var d = new Promises.Deferred,
                authData = {
                    client_id: this.client_id,
                    scope: this.scopes,
                    immediate: immediate
                };
                
            if(gapi.auth){
                gapi.auth.authorize(authData, (response: GoogleApiOAuth2TokenObject) => {
                    if(response.error) {
                        this.$log.error('LoginService: Rejecting authorize.'); 
                        this.$log.debug('LoginService: ' + response.error);
                        
                        if(response.error === 'immediate_failed'){
                            d.reject(Strings.ERROR_IMMEDIATE_FAILED);   
                        }
                        else {
                            d.reject(Strings.ERROR_NOT_AUTHORIZED + response.error);    
                        }
                    }
                    else {
                        this.$log.debug('LoginService: Fullfilling authorize.');
                        this.saveToken(response);
                        d.fulfill();
                    }
                });
            }
            else {
                this.$log.error('LoginService: Too quick! client.js isn\'t loaded yet.');
                this.$log.error('LoginService: Rejecting authorize.');
                d.reject(Strings.ERROR_TECH_PLEASE_REPEAT);                    
            }
                
            this.$log.debug('LoginService: Returning authorize promise.');    
            return d.promise();
        }
        
        
        /**
         * Download basic user info. Return with promise.
         */
        private loadUser(): Promises.Promise {
            var d = new Promises.Deferred;
            
            this.$log.debug('LoginService: Starting load User data.');
            
            gapi.client.load('plus', 'v1')
            .then(
                (response) => {
                    //Google API show 404 OK, so even error go trough
                    if(response && response.error){ 
                        this.$log.error('LoginService: Rejecting User data promise.');
                        this.$log.debug(response.error);
                        this.logout();
                        d.reject(Strings.ERROR_PLUS_NOT_FOUND);
                    }
                    else {                    
                        return gapi.client.plus.people.get({
                            'userId': 'me'
                        });
                    }
                },
                (err) => {
                    this.$log.error('LoginService: Rejecting User data promise.');
                    this.$log.debug(err);
                    this.logout();
                    d.reject(Strings.ERROR_PLUS_NOT_FOUND);
                }
            )
            .then(
                (response) => {
                    this.$log.debug('LoginService: Fullfilling User data promise.');
                    d.fulfill(response)
                },
                (err) => {
                    this.$log.error('LoginService: Rejecting User data promise.');
                    this.$log.debug(err);
                    this.logout();
                    d.reject(Strings.ERROR_USER_DATA);
                }
            );
            
            this.$log.debug('LoginService: Returning User data promise.');
            return d.promise();
        }
        
        
        /**
         * Save User info into rootscope
         */
        private saveUser(user): void {
            
            var savedUser: entities.User;
            
            if(user === 'default'){
                savedUser = {
                    'logged': false,
                    'name': 'Default',
                    'lastName': 'User',
                    'image': '',
                    'googleId': '0000',
                    'time': new Date()
                }
            }
            else {
                savedUser = {
                    'logged': true,
                    'name': user.result.name.givenName,
                    'lastName': user.result.name.familyName,
                    'image': user.result.image.url,
                    'googleId': user.result.id,
                    'time': new Date()
                }    
            }
            
            this.$rootScope.user = savedUser;
        }
        
        
        /**
         * Delete all user info and set default instead of it.
         */
        private clearUser(): void {
            this.initUser();
        }
        
        
        /**
         * Save user token and its expire time into localStorage
         */
        private saveToken(token: GoogleApiOAuth2TokenObject): void {
            var date: Date = new Date(),
                expire: number = parseInt(token.expires_in);
            
            date.setSeconds(expire);
            
            this.$window.localStorage.setItem('gT', token.access_token);
            this.$window.localStorage.setItem('gTeat', date.getTime() + '');
            this.$window.localStorage.setItem('gTein', token.expires_in + '');
		}
		
        
        /**
         * Returns user token object
         */
        private getToken(): GoogleApiOAuth2TokenObject {
			var token: GoogleApiOAuth2TokenObject = null;
            
            if(this.$window.localStorage.getItem('gT')){
                token = {
                    access_token: this.$window.localStorage.getItem('gT'),
                    expires_in: this.$window.localStorage.getItem('gTein'),
                    state: ''
                };
            } 
                
            return token;	
		}
        
        
        /**
         * Clear user data in localStorrage
         */
		private clearToken():void {
			this.$window.localStorage.removeItem('gT');
			this.$window.localStorage.removeItem('gTeat');
            this.$window.localStorage.removeItem('gTein');	
		}
        
        
        /**
         * Count expire time of users token and compare it with actual time.
         * 
         * Return boolean. true = expired
         */
        private isTokenExpired(): boolean{
            if(this.$window.localStorage.getItem('gT')){
				var now: Date = new Date(),
					expire: Date = new Date(parseInt(localStorage.getItem('gTeat')));
					
				if(now < expire){
					return false;	
				}
				else {
					return true	
				}
			}
			else {
				return undefined;
			}
        }
   	}
}