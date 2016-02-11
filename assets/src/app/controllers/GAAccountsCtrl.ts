///<reference path="../../reference.ts" />
module application.controllers {
	/**
	 * Class HomeCtrl represents default controller for default application View.
	 * 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 1.00 — 01/2016
	 */
	export class GAAccountsCtrl 
	{
	//== CLASS ATTRIBUTES ==========================================================	
		
		public static $inject = ['$scope','$log','UIService','GAService'];
		
	//== INSTANCE ATTRIBUTES =======================================================
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS ===========================================
		
		constructor(
			private $scope: any,
			private $log: ng.ILogService, 
			private UIService: services.UIService,
			private GAService: analytics.services.GAService
		){
			this.$scope.vm = this;
			if(!this.GAService.isDataDownloaded()){
				
				this.$log.debug('GAAccountsCtrl: Basic data still NA. Start downloading process.');
				
				this.UIService.showLoader();
				this.GAService.downloadAnalyticsData()
				.then(
					() => {
						this.$log.debug('GAAccountsCtrl: Basic data were downloaded.');
						this.UIService.hideLoader();
					},
					() => {
						this.$log.error('GAAccountsCtrl: Basic data weren\'t downloaded.');
						this.UIService.showAlert(Strings.ERROR_BASICDATA_NOT_LOAD);
						this.UIService.hideLoader();
					}
				)
			}
		}
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================
    }
}