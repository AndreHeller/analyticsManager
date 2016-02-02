///<reference path='../../reference.ts' />
module application.services {
	/**
	 * Class UIService represents service which controls user interface. 
	 * 
	 * It uses some other services and manage them as a complex plus add some 
	 * higher functionality.
	 * 
	 * This service is one of main and should be used as connection point from 
	 * app controllers. 
	 *
	 * @author  André Heller; anheller6gmail.com
	 * @version 3.00 — 07/2015
	 */
	export class UIService {
	//== CLASS ATTRIBUTES ==========================================================
			
		//Angular DI 
		public static $inject = ['$log', '$timeout', /*'alertService',*/ 'LoaderService'];
		
	//== INSTANCE ATTRIBUTES =======================================================		
		
		
		private loadingState: boolean = false;
		
		private loadingTimeoutPromise: ng.IPromise<any>;
		
	//== CLASS GETTERS AND SETTERS =================================================
	//== OTHER NON-PRIVATE CLASS METHODS =========================================== 
	
	//##############################################################################
	//== CONSTUCTORS AND FACTORY METHODS =========================================== 	
		
		constructor(  
			private $log: ng.ILogService,
			private $timeout: ng.ITimeoutService,
			//private alertSvc: services.AlertService,
			private loaderSvc: services.LoaderService
		) {
			
		} 
		
		
	//== INSTANCE GETTERS AND SETTERS ==============================================
	//== OTHER NON-PRIVATE INSTANCE METHODS ========================================		
		
		/** 
		 * Hide the loader. 
		 */
		public hideLoader(): void {
			this.showLoader(false);
		}
		
		
		/**
		 * Hide/Show User interface. If true, loader is visible (default)
		 */
		public showLoader(loading?: boolean): void {
			
			loading = typeof loading === 'undefined' ? true : loading;
			
			this.$log.debug('UIManager: Setting loading mode to ' + loading);		
			
			//Hide UI
			if (loading) {
				this.loadingTimeoutPromise = this.$timeout(
					() => {
						this.hideLoader();
						//this.showAlert(gamanager.Strings.ERROR_REQUEST_TIMEOUT);
					},
					30000 //Timeout
				);
				
				this.loaderSvc.showLoader();
			} else {
				//Re-Open UI
				this.$timeout.cancel(this.loadingTimeoutPromise);
				this.loadingTimeoutPromise = null;
				
				this.loaderSvc.hideLoader();
			}
		}
		
		
		/**
		 * Show Alert message based on type (success,info,warning,error). 
		 * You can use AlertService static variables insted of that.
		 * In default shows error alert.
		 * 
		 * The other optional parameter is close timeout in milliseconds. 
		 * Without them the alert never hide itself.
		 */
		/*public showAlert(msg: string, type?: string, timeout?: number): void {
			type = type || 'danger';
			
			this.$log.debug('AlertManager: Handling ' + type);
			
			var alert: Alert = this.alertSvc.addAlert(type, msg);

			if (timeout) {
				this.$timeout(
					() => {
						this.alertSvc.closeAlert(alert);
					},
					timeout
				);
			}
		}*/
		
	//== PRIVATE AND AUXILIARY CLASS METHODS =======================================
	//== PRIVATE AND AUXILIARY INSTANCE METHODS ====================================	
	}
}