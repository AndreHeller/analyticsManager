///<reference path='../../reference.ts' />
module application.services {
	/**
	 * This class represents main service, which is responsible for user authentification.
     * 
     * It contact google api and authoriuzes Google Accounts, retrieve basic user info and manage user tokens.
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export class LoginService {
	//== CLASS ATTRIBUTES ==========================================================
			
		//Angular DI 
		public static $inject = ['$rootScope', '$log','$window'];
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 	
		
		constructor(  
            private $rootScope: any,
            private $log: ng.ILogService,
            private $window: ng.IWindowService
		) {
			
		} 
		
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
        
        /**
         * Log In user.
         * 
         * immediate set popup login if false or background login if true.
         * False is default.
         */
        public login(immediate?: boolean): Promises.Promise {
            return this.checkAuth(immediate)
            .then(() => {return this.loadUser();})
            .then((user) => {this.saveUser(user);});  
        }
        
        
        /**
         * Log out user
         */
        public logout(){
            this.clearToken();
            this.$rootScope.user = {'logged': false};
            
        }
        
        
        /**
         * If user has saved token but its expired, refresh it.
         */
        public refreshToken(): Promises.Promise{
            return this.checkAuth(true)
            .then(
                () => {/*do nothing here*/},
                () => {this.logout();}
            );
        }
        
        
        /**
         * Return actual user login state.
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
        		
    //== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
        
        /**
         * Create basic API call for token refreshing and authorizing application.
         */
        private checkAuth(auto?: boolean): Promises.Promise {
            
            if(!auto) auto = false;
            else auto = true;
            
            this.$log.debug('LoginService: Starting authorize with immediate as ' + auto + '.');
            
            var d = new Promises.Deferred,
                authData = {
                    client_id: this.$rootScope.google.client_id,
                    scope: this.$rootScope.google.scopes,
                    immediate: auto
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
                this.$log.error('LoginService: Too quick! client.js isn\'t loaded yet.\nSetting timeout.');
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
            this.$rootScope.user = {
                'logged': true,
                'name': user.result.name.givenName,
                'lastName': user.result.name.familyName,
                'image': user.result.image.url,
                'googleId': user.result.id,
                'time': new Date()
            };
        }
         
        
        /**
         * Save user token and its expire time into localStorage
         */
        private saveToken(token: GoogleApiOAuth2TokenObject): void {
            
            var date: Date = new Date(),
                expire: number = parseInt(token.expires_in);
            
            date.setSeconds(expire);
            
            this.$window.localStorage.setItem('gT',token.access_token);
            this.$window.localStorage.setItem('gTe', date.getTime() + '');
		}
		
        /**
         * Clear user data in localStorrage
         */
		private clearToken():void {
			this.$window.localStorage.removeItem('gT');
			this.$window.localStorage.removeItem('gTe');	
		}
        
        
        /**
         * Count expire time of users token and compare it with actual time.
         * 
         * Return boolean. true = expired
         */
        private isTokenExpired(): boolean{
            if(this.$window.localStorage.getItem('gT')){
				var now: Date = new Date(),
					expire: Date = new Date(parseInt(localStorage.getItem('gTe')));
					
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