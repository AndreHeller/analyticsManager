///<reference path="../../reference.ts" />
module application.controllers {
	/**
	 * Class HomeCtrl represents default controller for default application View.
	 * 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 01/2016
	 */
	export class HitBuilderCtrl 
	{
	//== CLASS ATTRIBUTES ==========================================================	
		
		public static $inject = ['$scope','$log','$document'];
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS ===========================================
		
		constructor(
			private $scope: any,
			private $log: ng.ILogService,
			private $document: ng.IDocumentService
		){
			this.$scope.vm = this;
			this.$scope.params = {v: 1};
			this.$scope.optParams = [];
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
	
	
		private addParamRow(){
			this.$scope.optParams.push({});
		}
		
		private removeParamRow(index: number){
			this.$scope.optParams.splice(index,1);
		}
    }
}