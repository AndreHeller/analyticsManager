///<reference path="../../../../reference.ts" />
module analytics.directives {
	/**
	 * Class NavigationCtrl represents controller for navigataion panel 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 07/2015
	 */
	export class AccountsListCtrl 
	{
	//== CLASS ATTRIBUTES ==========================================================
	
		public static $inject = ['$scope','$log','GAService'];
	
	//== INSTANCE ATTRIBUTES =======================================================	
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 
		
		constructor(
			private $scope: any,  
			private $log: ng.ILogService,
			private GAService: services.GAService
		){
			this.$scope.vm = this;
			debugger;
			this.$scope.accounts= this.GAService.getAllAccounts().toArray();
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================		
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================		
	}
}