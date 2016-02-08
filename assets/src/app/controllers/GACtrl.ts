///<reference path="../../reference.ts" />
module application.controllers {
	/**
	 * Class HomeCtrl represents default controller for default application View.
	 * 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 01/2016
	 */
	export class GACtrl 
	{
	//== CLASS ATTRIBUTES ==========================================================	
		
		public static $inject = ['$scope'];
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS ===========================================
		
		constructor(
			private $scope: any
		){
			this.$scope.vm = this;	
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
    }
}