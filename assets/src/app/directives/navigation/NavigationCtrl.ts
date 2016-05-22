///<reference path="../../../reference.ts" />
module application.directives {
	/**
	 * Class NavigationCtrl represents controller for navigataion panel 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export class NavigationCtrl 
	{
	//== CLASS ATTRIBUTES ==========================================================
	
		public static $inject = ['$scope','$location','$rootScope','AuthService'];
	
	//== INSTANCE ATTRIBUTES =======================================================	
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 
		
		constructor(
			private $scope: any,  
			private $location: ng.ILocationService, 
            private $rootScope: any,
			private AuthService: services.AuthService
		){
			this.$scope.vm = this;
			this.$scope.menus = this.$rootScope.routes.createMenuObject();
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================		
		
		/**
		 * Decides if menu should be visible or not. 
		 * This method is called from a view during navs iteration.
		 */
		public showMenu(groups): boolean {
			
			for(var i:number = 0; i < groups.length; i++){
                switch (groups[i]) {
                    
                    case 'always':
                        if(this.AuthService.getUserState() === 0){
                            return false;
                        }
                        return true;
                    
                    case 'none':
                        return false;
                    
                    case 'anonymous':
                        if(this.AuthService.getUserState() === 0){
                            return true;
                        }
                        return false;
                    
                    //Only for logged users
                    case 'loginOnly':
                        if(this.AuthService.getUserState() === 1){
                            return true;
                        }
                        return false;
                        
                    default:
                        throw new Error('NavigationCtrl: Unknown type of user rights:' + groups);		
                }
            }
		}
		
		
		/**
		 * Retrieve information if provided link belongs to current section.
		 * This method is called from a view as a pointer where should be placed class "active".
		 */
		public showActiveClass(menu): boolean {
            if(menu.subsections){
                var subsections = menu.subsections.toArray();
                for(var i: number = 0; i < subsections.length; i++){
                    if(this.$rootScope.currentSectionPath.match(subsections[i].path)){
                        return true;
                    }
                }
                
                return false;
            }
            else {
                if(this.$rootScope.currentSectionPath.match(menu.path)){
                    if(menu.path == "/" && this.$rootScope.currentSectionPath != "/"){
                        return false;
                    }
                    return true;
                }
                else return false;
            }
		}
		
        
        /**
		 * Retrieve information if provided link belongs to current section.
		 * This method is called from a view as a pointer where should be placed class "active".
		 */
		public showDropdownClass(menu): boolean {
			if(menu.subsections){
                return true;
            }
            return false
		}
		
		
		public isUserLogged(): boolean {
            if(this.AuthService.getUserState() < 1){
                return false;
            }
            return true;
        }
        
        
        public getUserName(): string {
            var user = this.AuthService.getUserInfo(); 
            return user.name + " " + user.lastName;      
        }
        
        public getRoutePath(route: string){
            return this.$rootScope.routes.getRoutePath(route);
        }
        
        
		/**
		 * Logout User and clear app data
		 */
		public logout(){
		  this.AuthService.logout(true);
		}
		
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================		
	}
}